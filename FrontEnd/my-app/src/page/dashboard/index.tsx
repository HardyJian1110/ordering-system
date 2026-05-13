import {
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileDoneOutlined,
  InboxOutlined,
  PercentageOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Card, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBusinessData,
  getDishOverview,
  getOrderOverview,
  getSetmealOverview,
  type BusinessData,
  type DishOverviewData,
  type OrderOverviewData,
  type SetmealOverviewData,
} from "../../api/dashboard";
import "./index.scss";

const initialBusinessData: BusinessData = {
  turnover: 0,
  validOrderCount: 0,
  orderCompletionRate: 0,
  unitPrice: 0,
};

const initialOrderOverview: OrderOverviewData = {
  waitingOrders: 0,
  deliveredOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  allOrders: 0,
};

const initialDishOverview: DishOverviewData = {
  sold: 0,
  discontinued: 0,
};

const initialSetmealOverview: SetmealOverviewData = {
  sold: 0,
  discontinued: 0,
};

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);
  const [orderOverview, setOrderOverview] = useState<OrderOverviewData>(initialOrderOverview);
  const [dishOverview, setDishOverview] = useState<DishOverviewData>(initialDishOverview);
  const [setmealOverview, setSetmealOverview] = useState<SetmealOverviewData>(initialSetmealOverview);

  const today = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }, []);

  const toNumber = (value: unknown) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const formatMoney = (value: number) => `€${toNumber(value).toFixed(2)}`;

  const formatRate = (value: number) => `${(toNumber(value) * 100).toFixed(2)}%`;

  const loadData = async () => {
    try {
      setLoading(true);
      const [businessRes, orderRes, dishRes, setmealRes] = await Promise.all([
        getBusinessData(),
        getOrderOverview(),
        getDishOverview(),
        getSetmealOverview(),
      ]);

      setBusinessData({
        turnover: toNumber(businessRes.data?.turnover),
        validOrderCount: toNumber(businessRes.data?.validOrderCount),
        orderCompletionRate: toNumber(businessRes.data?.orderCompletionRate),
        unitPrice: toNumber(businessRes.data?.unitPrice),
      });

      setOrderOverview({
        waitingOrders: toNumber(orderRes.data?.waitingOrders),
        deliveredOrders: toNumber(orderRes.data?.deliveredOrders),
        completedOrders: toNumber(orderRes.data?.completedOrders),
        cancelledOrders: toNumber(orderRes.data?.cancelledOrders),
        allOrders: toNumber(orderRes.data?.allOrders),
      });

      setDishOverview({
        sold: toNumber(dishRes.data?.sold),
        discontinued: toNumber(dishRes.data?.discontinued),
      });

      setSetmealOverview({
        sold: toNumber(setmealRes.data?.sold),
        discontinued: toNumber(setmealRes.data?.discontinued),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-workspace">
      <Card className="workspace-section">
        <div className="section-head">
          <div className="section-title-wrap">
            <h2 className="section-title">Today Data</h2>
            <span className="section-date">{today}</span>
          </div>
        </div>

        <div className="metrics-grid metrics-grid-4">
          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <WalletOutlined className="metric-icon" />
              <div className="metric-label">Turnover</div>
            </div>
            <div className="metric-value">{formatMoney(businessData.turnover)}</div>
          </div>

          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <BarChartOutlined className="metric-icon" />
              <div className="metric-label">Valid Orders</div>
            </div>
            <div className="metric-value">{businessData.validOrderCount}</div>
          </div>

          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <PercentageOutlined className="metric-icon" />
              <div className="metric-label">Order Completion Rate</div>
            </div>
            <div className="metric-value">{formatRate(businessData.orderCompletionRate)}</div>
          </div>

          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <DollarOutlined className="metric-icon" />
              <div className="metric-label">Average Order Value</div>
            </div>
            <div className="metric-value">{formatMoney(businessData.unitPrice)}</div>
          </div>
        </div>
      </Card>

      <Card className="workspace-section">
        <div className="section-head">
          <div className="section-title-wrap">
            <h2 className="section-title">Order Management</h2>
            <span className="section-date">{today}</span>
          </div>
          <button className="section-link" onClick={() => navigate("/order")}>Order Details</button>
        </div>

        <div className="metrics-grid metrics-grid-5">
          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <InboxOutlined className="metric-icon" />
              <div className="metric-label">To Be Confirmed</div>
            </div>
            <div className="metric-value small">{orderOverview.waitingOrders}</div>
          </div>

          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <ShoppingCartOutlined className="metric-icon" />
              <div className="metric-label">Confirmed</div>
            </div>
            <div className="metric-value small">{orderOverview.deliveredOrders}</div>
          </div>

          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <FileDoneOutlined className="metric-icon" />
              <div className="metric-label">Completed</div>
            </div>
            <div className="metric-value small">{orderOverview.completedOrders}</div>
          </div>

          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <CloseCircleOutlined className="metric-icon" />
              <div className="metric-label">Cancelled</div>
            </div>
            <div className="metric-value small">{orderOverview.cancelledOrders}</div>
          </div>

          <div className="metric-card with-icon horizontal">
            <div className="metric-left">
              <CheckCircleOutlined className="metric-icon" />
              <div className="metric-label">All Orders</div>
            </div>
            <div className="metric-value small">{orderOverview.allOrders}</div>
          </div>
        </div>
      </Card>

      <div className="overview-row">
        <Card className="workspace-section half">
          <div className="section-head">
            <h2 className="section-title">Dish Overview</h2>
            <button className="section-link" onClick={() => navigate("/dish")}>Dish Management</button>
          </div>

          <div className="metrics-grid metrics-grid-3">
            <div className="metric-card with-icon horizontal">
              <div className="metric-left">
                <TagsOutlined className="metric-icon" />
                <div className="metric-label">Sold</div>
              </div>
              <div className="metric-value small">{dishOverview.sold}</div>
            </div>

            <div className="metric-card with-icon horizontal">
              <div className="metric-left">
                <TagsOutlined className="metric-icon" />
                <div className="metric-label">Discontinued</div>
              </div>
              <div className="metric-value small">{dishOverview.discontinued}</div>
            </div>

            <button className="add-card" onClick={() => navigate("/dish")}>
              <PlusCircleOutlined className="add-icon" />
              <span>Add Dish</span>
            </button>
          </div>
        </Card>

        <Card className="workspace-section half">
          <div className="section-head">
            <h2 className="section-title">Setmeal Overview</h2>
            <button className="section-link" onClick={() => navigate("/setmeal")}>Setmeal Management</button>
          </div>

          <div className="metrics-grid metrics-grid-3">
            <div className="metric-card with-icon horizontal">
              <div className="metric-left">
                <TagsOutlined className="metric-icon" />
                <div className="metric-label">Sold</div>
              </div>
              <div className="metric-value small">{setmealOverview.sold}</div>
            </div>

            <div className="metric-card with-icon horizontal">
              <div className="metric-left">
                <TagsOutlined className="metric-icon" />
                <div className="metric-label">Discontinued</div>
              </div>
              <div className="metric-value small">{setmealOverview.discontinued}</div>
            </div>

            <button className="add-card" onClick={() => navigate("/setmeal")}>
              <PlusCircleOutlined className="add-icon" />
              <span>Add Setmeal</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
