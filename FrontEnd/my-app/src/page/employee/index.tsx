import { Badge, Button, Card, Input, Pagination, Space, Table, message } from "antd";
import type { PaginationProps, TableProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  getEmployeeDetail,
  getEmployeePage,
  updateEmployeeStatus,
  type EmployeeData,
  type EmployeeRowData,
  type EmployeeSearchType,
} from "../../api/employee";
import EmployeeForm from "./employeeForm";
import "./index.scss";

const initialFormData: EmployeeSearchType = {
  name: "",
  page: 1,
  pageSize: 10,
};

function EmployeePage() {
  const [formData, setFormData] = useState<EmployeeSearchType>(initialFormData);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [dataList, setDataList] = useState<EmployeeRowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [title, setTitle] = useState<string>("");
  const [currentData, setCurrentData] = useState<Partial<EmployeeData & EmployeeRowData>>({});

  const loadData = async (query = formData, p = page, ps = pageSize) => {
    try {
      setLoading(true);
      const {
        data: { records, total: totalCount },
      } = await getEmployeePage({ ...query, page: p, pageSize: ps });
      setDataList(records || []);
      setTotal(totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

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

  const openAddModal = () => {
    setMode("add");
    setCurrentData({});
    setTitle("Add Employee");
    setVisible(true);
  };

  const openEditModal = async (record: EmployeeRowData) => {
    if (isAdminRow(record)) {
      return;
    }
    const { data } = await getEmployeeDetail(record.id);
    setMode("edit");
    setCurrentData(data || {});
    setTitle("Edit Employee");
    setVisible(true);
  };

  const isAdminRow = (record: EmployeeRowData) => record.username === "admin";

  const changeStatus = async (record: EmployeeRowData) => {
    if (isAdminRow(record)) {
      return;
    }
    const nextStatus = record.status === 1 ? 0 : 1;
    const { data } = await updateEmployeeStatus(nextStatus, record.id);
    message.success(data || "Updated successfully.");
    loadData();
  };

  const columns: TableProps<EmployeeRowData>["columns"] = [
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Account Status",
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
      render: (_, record) => {
        const disabled = isAdminRow(record);
        return (
          <Space split={<span className="split-line">|</span>}>
            <Button
              type="link"
              className={disabled ? "link-disabled" : "link-edit"}
              disabled={disabled}
              onClick={() => openEditModal(record)}
            >
              Edit
            </Button>
            <Button
              type="link"
              className={disabled ? "link-disabled" : record.status === 1 ? "link-stop" : "link-start"}
              disabled={disabled}
              onClick={() => changeStatus(record)}
            >
              {record.status === 1 ? "Disable" : "Enable"}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="employee-page">
      <EmployeeForm
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
            <span className="label">Employee Name:</span>
            <Input
              placeholder="Please enter employee name"
              className="name-input"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Button type="primary" className="search-btn" onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={reset}>Reset</Button>
          </div>

          <div className="toolbar-right">
            <Button type="primary" className="add-employee-btn" onClick={openAddModal}>
              + Add Employee
            </Button>
          </div>
        </div>
      </Card>

      <Card className="table-card mt">
        <Table columns={columns} dataSource={dataList} rowKey={(record) => record.id} loading={loading} pagination={false} />
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

export default EmployeePage;
