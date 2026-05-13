import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Image, Input, Pagination, Popconfirm, Select, Space, Table, Tag, message } from "antd";
import type { PaginationProps, TableProps } from "antd";
import { useDispatch } from "react-redux";
import {
  batchDeleteSetmeal,
  getSetmealDetail,
  getSetmealList,
  type SetmealRowData,
  type SetmealSearchType,
  updateSetmealStatus,
} from "../../api/setmeal";
import { setSetmealData } from "../../store/setmeal/setmealSlice";
import SetmealForm from "./setmealForm";
import "./index.scss";

const initialFormData: SetmealSearchType = {
  name: "",
  status: undefined,
  page: 1,
  pageSize: 10,
};

function SetmealPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SetmealSearchType>(initialFormData);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataList, setDataList] = useState<SetmealRowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<SetmealRowData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [mode, setMode] = useState<"add" | "edit">("add");

  const loadData = async (query = formData, p = page, ps = pageSize) => {
    try {
      setLoading(true);
      const {
        data: { records: list, total: totalCount },
      } = await getSetmealList({ ...query, page: p, pageSize: ps });
      setDataList(list || []);
      setTotal(totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const disabled = useMemo(() => selectedRowKeys.length === 0, [selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: SetmealRowData[]) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  const handleChangeStatus = (value: number | undefined) => {
    setFormData((prevState) => ({
      ...prevState,
      status: value,
    }));
  };

  const onChange: PaginationProps["onChange"] = (nextPage, nextPageSize) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  };

  const handleSearch = () => {
    setPage(1);
    loadData(formData, 1, pageSize);
  };

  const reset = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setFormData(initialFormData);
    setPage(1);
    setPageSize(10);
    loadData(initialFormData, 1, 10);
  };

  const batchDelete = async () => {
    const hasOnSale = selectedRows.some((item) => item.status === 1);
    if (hasOnSale) {
      message.warning("On-sale setmeal cannot be deleted.");
      return;
    }

    const { data } = await batchDeleteSetmeal(selectedRowKeys);
    message.success(data);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    loadData();
  };

  const deleteOne = async (record: SetmealRowData) => {
    if (record.status === 1) {
      message.warning("On-sale setmeal cannot be deleted.");
      return;
    }

    const { data } = await batchDeleteSetmeal([record.id]);
    message.success(data);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    loadData();
  };

  const add = () => {
    setMode("add");
    setTitle("Add Setmeal");
    setIsModalOpen(true);
    dispatch(setSetmealData({}));
  };

  const edit = async (id: number) => {
    const { data } = await getSetmealDetail(id);
    dispatch(setSetmealData(data || {}));
    setMode("edit");
    setTitle("Edit Setmeal");
    setIsModalOpen(true);
  };

  const changeStatus = async (record: SetmealRowData) => {
    const nextStatus = record.status === 1 ? 0 : 1;
    const { data } = await updateSetmealStatus(nextStatus, record.id);
    message.success(data);
    loadData();
  };

  const hideModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const columns: TableProps<SetmealRowData>["columns"] = [
    {
      title: "Setmeal Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value: string) => (
        <Image src={value} alt="setmeal" style={{ width: 50, height: 50, objectFit: "cover" }} placeholder />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: number) => (value === 1 ? <Tag color="#87d068">On Sale</Tag> : <Tag color="#f50">Stopped</Tag>),
    },
    {
      title: "Updated Time",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "Actions",
      key: "operate",
      width: 280,
      render: (_, record) => (
        <Space split={<span className="split-line">|</span>}>
          <Button type="link" className="link-edit" onClick={() => edit(record.id)}>
            Edit
          </Button>
          <Button type="link" className={record.status === 1 ? "link-stop" : "link-start"} onClick={() => changeStatus(record)}>
            {record.status === 1 ? "Stop Sale" : "Start Sale"}
          </Button>
          <Popconfirm
            title="Delete Confirmation"
            description="Are you sure you want to delete this setmeal?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteOne(record)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="setmeal">
      <MySetmealForm visible={isModalOpen} hideModal={hideModal} title={title} loadData={loadData} mode={mode} />

      <Card className="search-card">
        <div className="toolbar">
          <div className="toolbar-left">
            <Input placeholder="Setmeal name" value={formData.name} onChange={handleChangeName} className="name-input" />
            <Select
              allowClear
              placeholder="All status"
              value={formData.status}
              className="status-select"
              options={[
                { value: 0, label: "Stopped" },
                { value: 1, label: "On Sale" },
              ]}
              onChange={handleChangeStatus}
            />
            <Button type="primary" className="search-btn" onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={reset}>Reset</Button>
          </div>

          <div className="toolbar-right">
            <Button type="text" className="batch-delete-btn" disabled={disabled} onClick={batchDelete}>
              Batch Delete
            </Button>
            <Button type="primary" className="ml add-setmeal-btn" onClick={add}>
              Add Setmeal
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt table-card">
        <Table
          columns={columns}
          dataSource={dataList}
          pagination={false}
          loading={loading}
          rowKey={(record) => record.id}
          rowSelection={rowSelection}
        />
        <div className="table-pagination">
          <Pagination
            total={total}
            current={page}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(count) => `Total ${count}`}
            onChange={onChange}
          />
        </div>
      </Card>
    </div>
  );
}

const MySetmealForm = React.memo(SetmealForm);

export default SetmealPage;
