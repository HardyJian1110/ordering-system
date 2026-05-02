import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Image, Input, Pagination, Popconfirm, Select, Space, Table, message } from "antd";
import type { PaginationProps, TableProps } from "antd";
import {
  batchDeleteDish,
  getDishCategoryList,
  getDishDetail,
  getDishPage,
  type DishCategoryItem,
  type DishData,
  type DishRowData,
  type DishSearchType,
  updateDishStatus,
} from "../../api/dish";
import DishForm from "./dishForm";
import "./index.scss";

const initialFormData: DishSearchType = {
  name: "",
  categoryId: undefined,
  status: undefined,
  page: 1,
  pageSize: 10,
};

function DishPage() {
  const [formData, setFormData] = useState<DishSearchType>(initialFormData);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [dataList, setDataList] = useState<DishRowData[]>([]);
  const [categoryList, setCategoryList] = useState<DishCategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DishRowData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [title, setTitle] = useState<string>("");
  const [currentData, setCurrentData] = useState<Partial<DishData & DishRowData>>({});

  const loadData = async (query = formData, p = page, ps = pageSize) => {
    try {
      setLoading(true);
      const {
        data: { records, total: totalCount },
      } = await getDishPage({ ...query, page: p, pageSize: ps });
      setDataList(records || []);
      setTotal(totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async () => {
    const { data } = await getDishCategoryList();
    setCategoryList((data || []).filter((item: DishCategoryItem) => item.status === 1));
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  useEffect(() => {
    loadCategoryData();
  }, []);

  const hideModal = useCallback(() => {
    setVisible(false);
  }, []);

  const disabled = useMemo(() => selectedRowKeys.length === 0, [selectedRowKeys]);

  const onPageChange: PaginationProps["onChange"] = (current, size) => {
    setPage(current);
    setPageSize(size);
  };

  const handleSearch = () => {
    setPage(1);
    loadData(formData, 1, pageSize);
  };

  const reset = () => {
    setFormData(initialFormData);
    setPage(1);
    setPageSize(10);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    loadData(initialFormData, 1, 10);
  };

  const openAddModal = () => {
    setMode("add");
    setCurrentData({});
    setTitle("Add Dish");
    setVisible(true);
  };

  const openEditModal = async (id: number) => {
    const { data } = await getDishDetail(id);
    setMode("edit");
    setCurrentData(data || {});
    setTitle("Edit Dish");
    setVisible(true);
  };

  const changeStatus = async (record: DishRowData) => {
    const nextStatus = record.status === 1 ? 0 : 1;
    const { data } = await updateDishStatus(nextStatus, record.id);
    message.success(data || "Updated successfully.");
    loadData();
  };

  const remove = async (record: DishRowData) => {
    if (record.status === 1) {
      message.warning("On-sale dish cannot be deleted.");
      return;
    }

    try {
      const { data } = await batchDeleteDish([record.id]);
      message.success(data || "Deleted successfully.");
      loadData();
    } catch (error: any) {
      message.destroy();
      message.warning(error?.message || "Delete failed.");
    }
  };

  const batchDelete = async () => {
    if (selectedRows.some((item) => item.status === 1)) {
      message.warning("On-sale dish cannot be deleted.");
      return;
    }

    try {
      const { data } = await batchDeleteDish(selectedRowKeys);
      message.success(data || "Deleted successfully.");
      setSelectedRowKeys([]);
      setSelectedRows([]);
      loadData();
    } catch (error: any) {
      message.destroy();
      message.warning(error?.message || "Delete failed.");
    }
  };

  const columns: TableProps<DishRowData>["columns"] = [
    {
      title: "Dish Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value: string) => (
        <Image src={value} alt="dish" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }} placeholder />
      ),
    },
    {
      title: "Dish Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `${value}`,
    },
    {
      title: "Sale Status",
      dataIndex: "status",
      key: "status",
      render: (value: number) =>
        value === 1 ? <Badge color="#52c41a" text="On Sale" /> : <Badge color="#d9d9d9" text="Stopped" />,
    },
    {
      title: "Updated Time",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "Actions",
      key: "operate",
      width: 240,
      render: (_, record) => (
        <Space split={<span className="split-line">|</span>}>
          <Button type="link" className="link-edit" onClick={() => openEditModal(record.id)}>
            Edit
          </Button>
          <Button
            type="link"
            className={record.status === 1 ? "link-stop" : "link-start"}
            onClick={() => changeStatus(record)}
          >
            {record.status === 1 ? "Stop Sale" : "Start Sale"}
          </Button>
          <Popconfirm
            title="Delete Confirmation"
            description="Are you sure you want to delete this dish?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => remove(record)}
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
    <div className="dish-page">
      <DishForm
        visible={visible}
        title={title}
        hideModal={hideModal}
        loadData={loadData}
        mode={mode}
        currentData={currentData}
      />

      <Card className="search-card">
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="label">Dish Name:</span>
            <Input
              placeholder="Please enter dish name"
              className="name-input"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />

            <span className="label">Dish Category:</span>
            <Select
              allowClear
              placeholder="Please select"
              className="category-select"
              value={formData.categoryId}
              options={categoryList.map((item) => ({ value: item.id, label: item.name }))}
              onChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
            />

            <span className="label">Sale Status:</span>
            <Select
              allowClear
              placeholder="Please select"
              className="status-select"
              value={formData.status}
              options={[
                { value: 1, label: "On Sale" },
                { value: 0, label: "Stopped" },
              ]}
              onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
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
            <Button type="primary" className="ml add-dish-btn" onClick={openAddModal}>
              + Add Dish
            </Button>
          </div>
        </div>
      </Card>

      <Card className="table-card mt">
        <Table
          columns={columns}
          dataSource={dataList}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys: React.Key[], rows: DishRowData[]) => {
              setSelectedRowKeys(keys);
              setSelectedRows(rows);
            },
          }}
        />
        <div className="table-pagination">
          <Pagination
            total={total}
            current={page}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(count) => `Total ${count}`}
            onChange={onPageChange}
          />
        </div>
      </Card>
    </div>
  );
}

export default DishPage;
