import { Badge, Button, Card, DatePicker, Drawer, Empty, Input, Space, Table, Tabs, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  getOrderDetail,
  getOrderPage,
  getOrderStatistics,
  updateOrderStatus,
  type OrderDetailData,
  type OrderRowData,
  type OrderSearchParams,
  type OrderStatisticsData,
} from "../../api/order";
import "./index.scss";

const { RangePicker } = DatePicker;

const STATUS_ALL = 0;
const STATUS_TO_BE_CONFIRMED = 1;
const STATUS_CONFIRMED = 2;
const STATUS_COMPLETED = 3;
const STATUS_CANCELLED = 4;

const initialSearch: OrderSearchParams = {
  page: 1,
  pageSize: 10,
  number: "",
  tableNumber: undefined,
};

function OrderPage() {
  const [activeStatus, setActiveStatus] = useState<number>(STATUS_ALL);
  const [searchForm, setSearchForm] = useState<OrderSearchParams>(initialSearch);
  const [dataList, setDataList] = useState<OrderRowData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<OrderStatisticsData>({
    toBeConfirmed: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<OrderDetailData | null>(null);

  const loadStatistics = async () => {
    const { data } = await getOrderStatistics();
    setStats({
      toBeConfirmed: Number(data?.toBeConfirmed || 0),
      confirmed: Number(data?.confirmed || 0),
      completed: Number(data?.completed || 0),
      cancelled: Number(data?.cancelled || 0),
    });
  };

  const buildQuery = (overrides?: Partial<OrderSearchParams>) => {
    const merged = { ...searchForm, ...overrides };
    return {
      page: merged.page,
      pageSize: merged.pageSize,
      number: merged.number?.trim() || undefined,
      tableNumber: merged.tableNumber,
      status: activeStatus === STATUS_ALL ? undefined : activeStatus,
      beginTime: merged.beginTime,
      endTime: merged.endTime,
    };
  };

  const loadOrders = async (overrides?: Partial<OrderSearchParams>) => {
    try {
      setLoading(true);
      const query = buildQuery(overrides);
      const { data } = await getOrderPage(query as OrderSearchParams);
      setDataList(data?.records || []);
      setTotal(Number(data?.total || 0));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    loadOrders({ page: 1 });
    setSearchForm((prev) => ({ ...prev, page: 1 }));
  }, [activeStatus]);

  const statusTextMap: Record<number, string> = {
    [STATUS_TO_BE_CONFIRMED]: "To Be Confirmed",
    [STATUS_CONFIRMED]: "Confirmed",
    [STATUS_COMPLETED]: "Completed",
    [STATUS_CANCELLED]: "Cancelled",
  };

  const statusColorMap: Record<number, string> = {
    [STATUS_TO_BE_CONFIRMED]: "gold",
    [STATUS_CONFIRMED]: "blue",
    [STATUS_COMPLETED]: "green",
    [STATUS_CANCELLED]: "red",
  };

  const tabs = useMemo(
    () => [
      { key: String(STATUS_ALL), label: "All Orders" },
      {
        key: String(STATUS_TO_BE_CONFIRMED),
        label: (
          <span>
            To Be Confirmed <Badge count={stats.toBeConfirmed} overflowCount={99} />
          </span>
        ),
      },
      {
        key: String(STATUS_CONFIRMED),
        label: (
          <span>
            Confirmed <Badge count={stats.confirmed} overflowCount={99} />
          </span>
        ),
      },
      {
        key: String(STATUS_COMPLETED),
        label: (
          <span>
            Completed <Badge count={stats.completed} overflowCount={99} />
          </span>
        ),
      },
      {
        key: String(STATUS_CANCELLED),
        label: (
          <span>
            Cancelled <Badge count={stats.cancelled} overflowCount={99} />
          </span>
        ),
      },
    ],
    [stats]
  );

  const handleSearch = async () => {
    const next = { ...searchForm, page: 1 };
    setSearchForm(next);
    await loadOrders({ page: 1 });
  };

  const handleReset = async () => {
    const next = { ...initialSearch, page: 1, pageSize: 10 };
    setSearchForm(next);
    await loadOrders(next);
  };

  const handlePageChange = async (page: number, pageSize: number) => {
    const next = { ...searchForm, page, pageSize };
    setSearchForm(next);
    await loadOrders(next);
  };

  const openDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const { data } = await getOrderDetail(id);
      setDetailData(data || null);
      setDetailOpen(true);
    } finally {
      setDetailLoading(false);
    }
  };

  const changeStatus = async (id: number, status: number, successText: string) => {
    await updateOrderStatus({ id, status });
    message.success(successText);
    await Promise.all([loadOrders(), loadStatistics()]);
    if (detailData?.id === id) {
      const { data } = await getOrderDetail(id);
      setDetailData(data || null);
    }
  };

  const columns: ColumnsType<OrderRowData> = [
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
      width: 210,
      render: (value: string) => value || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (value: number) => <Tag color={statusColorMap[value] || "default"}>{statusTextMap[value] || "Unknown"}</Tag>,
    },
    {
      title: "employeename",
      dataIndex: "username",
      key: "username",
      width: 150,
      render: (value: string) => value || "-",
    },
    {
      title: "Table Number",
      dataIndex: "tableNumber",
      key: "tableNumber",
      width: 160,
      render: (value: number) => value || "-",
    },
    {
      title: "Dining Mode",
      dataIndex: "diningMode",
      key: "diningMode",
      width: 160,
      render: (value: number) => (value === 1 ? "Dine-in" : value === 2 ? "Takeout" : "-"),
    },
    {
      title: "Order Time",
      dataIndex: "orderTime",
      key: "orderTime",
      width: 180,
      render: (value: string) => value || "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (value: number) => `€${Number(value || 0).toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      fixed: "right",
      render: (_, record) => (
        <Space split={<span className="split-line">|</span>}>
          {record.status === STATUS_TO_BE_CONFIRMED && (
            <Button type="link" className="link-start" onClick={() => changeStatus(record.id, STATUS_CONFIRMED, "Order confirmed.")}>
              Confirm
            </Button>
          )}
          {record.status === STATUS_CONFIRMED && (
            <Button type="link" className="link-edit" onClick={() => changeStatus(record.id, STATUS_COMPLETED, "Order completed.")}>
              Complete
            </Button>
          )}
          {(record.status === STATUS_TO_BE_CONFIRMED || record.status === STATUS_CONFIRMED) && (
            <Button type="link" danger onClick={() => changeStatus(record.id, STATUS_CANCELLED, "Order cancelled.")}>
              Cancel
            </Button>
          )}
          <Button type="link" onClick={() => openDetail(record.id)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="order-page">
      <Tabs
        className="order-tabs"
        activeKey={String(activeStatus)}
        items={tabs}
        onChange={(key) => setActiveStatus(Number(key))}
      />

      <Card className="order-search-card">
        <div className="order-search-row">
          <div className="search-item">
            <span className="search-label">Order No.:</span>
            <Input
              placeholder="Please enter order number"
              value={searchForm.number}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, number: e.target.value }))}
            />
          </div>

          <div className="search-item">
            <span className="search-label">Table No.:</span>
            <Input
              placeholder="Please enter table number"
              value={searchForm.tableNumber}
              onChange={(e) => {
                const raw = e.target.value.trim();
                const next = raw === "" ? undefined : Number(raw);
                setSearchForm((prev) => ({ ...prev, tableNumber: Number.isNaN(next) ? undefined : next }));
              }}
            />
          </div>

          <div className="search-item search-item-time">
            <span className="search-label">Order Time:</span>
            <RangePicker
              showTime
              value={
                searchForm.beginTime && searchForm.endTime
                  ? [dayjs(searchForm.beginTime), dayjs(searchForm.endTime)]
                  : null
              }
              onChange={(value) => {
                if (!value) {
                  setSearchForm((prev) => ({ ...prev, beginTime: undefined, endTime: undefined }));
                  return;
                }
                setSearchForm((prev) => ({
                  ...prev,
                  beginTime: value[0]?.format("YYYY-MM-DD HH:mm:ss"),
                  endTime: value[1]?.format("YYYY-MM-DD HH:mm:ss"),
                }));
              }}
            />
          </div>

          <div className="search-actions">
            <Button type="primary" className="order-btn-dark" onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>

        <Table
          className="order-table"
          rowKey="id"
          columns={columns}
          dataSource={dataList}
          loading={loading}
          scroll={{ x: 1500 }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No orders" />,
          }}
          pagination={{
            total,
            current: searchForm.page,
            pageSize: searchForm.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (count) => `Total ${count}`,
            onChange: handlePageChange,
          }}
        />
      </Card>

      <Drawer
        title={detailData ? `Order Detail - ${detailData.number}` : "Order Detail"}
        width={560}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        destroyOnClose
      >
        {detailLoading ? (
          <div className="order-detail-loading">Loading...</div>
        ) : !detailData ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No detail data" />
        ) : (
          <div className="order-detail-panel">
            <div className="detail-line">
              <span className="detail-key">Status</span>
              <span className="detail-value">{statusTextMap[detailData.status] || "Unknown"}</span>
            </div>
            <div className="detail-line">
              <span className="detail-key">Order Time</span>
              <span className="detail-value">{detailData.orderTime || "-"}</span>
            </div>
            <div className="detail-line">
              <span className="detail-key">Phone</span>
              <span className="detail-value">{detailData.phone || "-"}</span>
            </div>
            <div className="detail-line">
              <span className="detail-key">Address</span>
              <span className="detail-value">{detailData.address || "-"}</span>
            </div>
            <div className="detail-line">
              <span className="detail-key">Dining Mode</span>
              <span className="detail-value">{detailData.diningMode === 1 ? "Dine-in" : "Takeout"}</span>
            </div>
            {detailData.diningMode === 1 && (
              <div className="detail-line">
                <span className="detail-key">Table Number</span>
                <span className="detail-value">{detailData.tableNumber || "-"}</span>
              </div>
            )}
            <div className="detail-line">
              <span className="detail-key">Remark</span>
              <span className="detail-value">{detailData.remark || "-"}</span>
            </div>

            <div className="detail-subtitle">Items</div>
            <div className="detail-items">
              {(detailData.orderDetailList || []).map((item) => (
                <div className="detail-item" key={item.id}>
                  <img className="item-image" src={item.image} alt={item.name} />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-extra">
                      {item.dishFlavor ? `Flavor: ${item.dishFlavor}` : "No flavor"} | x{item.number}
                    </div>
                  </div>
                  <div className="item-amount">€{Number(item.amount || 0).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="detail-total">Total: €{Number(detailData.amount || 0).toFixed(2)}</div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default OrderPage;
