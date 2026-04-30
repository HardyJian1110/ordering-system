import { Card, Row, Col, Table, Input, Button, Tag, Progress, Badge, Pagination, Popconfirm, message } from "antd";
import type { PaginationProps, TableProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getBuildingList, batchDeleteBuilding } from "../../api/buildingList";
import { useDispatch } from "react-redux";

interface DataType {
  id: string;
  name: string;
  person: string;
  tel: string;
  status: string;
  vacancyRate: number;
  propertyFee: string;
}
export interface searchType {
  name: string;
  person: string;
}

function Temement() {
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<searchType>({
    name: "",
    person: "",
  });

  // parameters is required. cuz "reset" function has load(). If parameters are not passed, there will be closure issues(Get the data before setstate).
  const loadData = async (query = formData, p = page, ps = pageSize) => {
    setLoading(true);
    const {
      data: { list, total },
    } = await getBuildingList({ ...query, page: p, pageSize: ps });
    setLoading(false);
    setDataList(list);
    setTotal(total);
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  // can not send request here. cuz setstate method is asynchronous
  const onChange: PaginationProps["onChange"] = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const reset = () => {
    // cuz can not get newest data(closure). So initialize parameters of loadData()
    const initialData = { name: "", person: "" };
    const initialPage = 1;
    const initialPageSize = 10;

    setSelectedRowKeys([]);
    setFormData({ name: "", person: "" });
    setPage(1);
    setPageSize(10);

    loadData(initialData, initialPage, initialPageSize);
  };

  const confirm = async function (id: string) {
    const { data } = await batchDeleteBuilding([id]);
    message.success(data);
    loadData();
  };

  // const edit = (record: DataType) => {
  //   setIsModalOpen(true);
  //   setTitle("编辑企业");
  //   dispatch(setBuildingData(record));
  // };

  const hideModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "No.",
      key: "index",
      render: (value, record, index) => index + 1,
    },
    {
      title: "楼宇名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "负责人",
      dataIndex: "person",
      key: "person",
    },
    {
      title: "负责人电话",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "使用状态",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        if (value == 1) {
          return <Tag color="#f50">建设中</Tag>;
        } else if (value == 2) {
          return <Tag color="#2db7f5">已竣工</Tag>;
        } else {
          return <Tag color="#87d068">使用中</Tag>;
        }
      },
    },
    {
      title: "空置率",
      dataIndex: "vacancyRate",
      key: "vacancyRate",
      render(value) {
        return <Progress percent={value} status="active" />;
      },
    },
    {
      title: "物业费率",
      dataIndex: "propertyFee",
      key: "propertyFee",
      render(value) {
        return <Badge color="green" text={value}></Badge>;
      },
    },
    {
      title: "操作",
      key: "operate",
      render(value, record) {
        return (
          <>
            {/* <Button type="primary" className="mr" size="small" onClick={() => edit(record)}>
              编辑
            </Button> */}
            <Popconfirm
              title="删除确认"
              description="确定要删除吗？"
              okText="是"
              cancelText="否"
              onConfirm={() => confirm(record.id)}
            >
              <Button type="primary" danger className="ml" size="small">
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Card className="search">
        <Row gutter={16}>
          <Col span={4}>
            <p>楼宇名称：</p>
            <Input name="name" value={formData.name} onChange={handleChange}></Input>
          </Col>
          <Col span={4}>
            <p>负责人：</p>
            <Input name="person" value={formData.person} onChange={handleChange}></Input>
          </Col>
          <Col span={4}>
            <Button className="mr" type="primary" onClick={() => loadData()}>
              查询
            </Button>
            <Button className="ml" onClick={reset}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>
      <Card className="mt">
        <Table
          columns={columns}
          dataSource={dataList}
          pagination={false}
          loading={loading}
          rowKey={(record) => record.id}
          rowSelection={rowSelection}
          footer={() => (
            <div className="pagination">
              <Pagination
                className="fr mt"
                total={total}
                current={page}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
                onChange={onChange}
              />
            </div>
          )}
        />
      </Card>
    </div>
  );
}

export default Temement;
