import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input, Pagination, Popconfirm, Select, Space, Table, message } from "antd";
import type { PaginationProps, TableProps } from "antd";
import {
  deleteCategory,
  getCategoryPage,
  type CategoryRowData,
  type CategorySearchType,
  updateCategoryStatus,
} from "../../api/category";
import CategoryForm from "./categoryForm";
import "./index.scss";

const initialFormData: CategorySearchType = {
  name: "",
  type: undefined,
  page: 1,
  pageSize: 10,
};

function CategoryPage() {
  const [formData, setFormData] = useState<CategorySearchType>(initialFormData);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [dataList, setDataList] = useState<CategoryRowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [title, setTitle] = useState<string>("");
  const [currentType, setCurrentType] = useState<number>(1);
  const [currentData, setCurrentData] = useState<Partial<CategoryRowData>>({});

  const loadData = async (query = formData, p = page, ps = pageSize) => {
    try {
      setLoading(true);
      const {
        data: { records, total: totalCount },
      } = await getCategoryPage({ ...query, page: p, pageSize: ps });
      setDataList(records || []);
      setTotal(totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const typeOptions = useMemo(
    () => [
      { value: 1, label: "Dish Category" },
      { value: 2, label: "Setmeal Category" },
    ],
    []
  );

  const hideModal = useCallback(() => {
    setVisible(false);
  }, []);

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
    loadData(initialFormData, 1, 10);
  };

  const openAddModal = (type: number) => {
    setMode("add");
    setCurrentType(type);
    setCurrentData({});
    setTitle(type === 1 ? "Add Dish Category" : "Add Setmeal Category");
    setVisible(true);
  };

  const openEditModal = (record: CategoryRowData) => {
    setMode("edit");
    setCurrentType(record.type);
    setCurrentData(record);
    setTitle("Edit Category");
    setVisible(true);
  };

  const changeStatus = async (record: CategoryRowData) => {
    const nextStatus = record.status === 1 ? 0 : 1;
    const { data } = await updateCategoryStatus(nextStatus, record.id);
    message.success(data || "Updated successfully.");
    loadData();
  };

  const remove = async (id: number) => {
    try {
      const { data } = await deleteCategory(id);
      message.success(data || "Deleted successfully.");
      loadData();
    } catch (error: any) {
      message.destroy();
      message.warning(error?.message || "This category is linked to dishes/setmeals and cannot be deleted.");
    }
  };

  const columns: TableProps<CategoryRowData>["columns"] = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category Type",
      dataIndex: "type",
      key: "type",
      render: (value: number) => (value === 1 ? "Dish Category" : "Setmeal Category"),
    },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: number) =>
        value === 1 ? <Badge color="#52c41a" text="Enabled" /> : <Badge color="#d9d9d9" text="Disabled" />,
    },
    {
      title: "Updated Time",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "Actions",
      key: "operate",
      width: 220,
      render: (_, record) => (
        <Space split={<span className="split-line">|</span>}>
          <Button type="link" className="link-edit" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button
            type="link"
            className={record.status === 1 ? "link-stop" : "link-start"}
            onClick={() => changeStatus(record)}
          >
            {record.status === 1 ? "Disable" : "Enable"}
          </Button>
          <Popconfirm
            title="Delete Confirmation"
            description="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => remove(record.id)}
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
    <div className="category-page">
      <CategoryForm
        visible={visible}
        title={title}
        hideModal={hideModal}
        loadData={loadData}
        mode={mode}
        currentType={currentType}
        currentData={currentData}
      />

      <Card className="search-card">
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="label">Category Name:</span>
            <Input
              placeholder="Please enter category name"
              className="name-input"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <span className="label">Category Type:</span>
            <Select
              allowClear
              placeholder="Please select"
              className="type-select"
              value={formData.type}
              options={typeOptions}
              onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
            />
            <Button type="primary" className="search-btn" onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={reset}>Reset</Button>
          </div>
          <div className="toolbar-right">
            <Button className="add-dish-btn" onClick={() => openAddModal(1)}>
              + Add Dish Category
            </Button>
            <Button type="primary" className="ml add-setmeal-btn" onClick={() => openAddModal(2)}>
              + Add Setmeal Category
            </Button>
          </div>
        </div>
      </Card>

      <Card className="table-card mt">
        <Table columns={columns} dataSource={dataList} rowKey={(record) => record.id} pagination={false} loading={loading} />
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

export default CategoryPage;
