import React, { useEffect, useState } from "react";
import { UserOutlined, PoweroffOutlined, DownOutlined, ClockCircleFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Switch, message } from "antd";
import { clearToken } from "../../store/login/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getShopStatus, updateShopStatus } from "../../api/shop";
import "./index.scss";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <span>Personal Center</span>,
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: <span>Log Out</span>,
    icon: <PoweroffOutlined />,
  },
];

function MyHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shopStatus, setShopStatus] = useState<number>(0);
  const [updating, setUpdating] = useState<boolean>(false);

  const loadShopStatus = async () => {
    try {
      const { data } = await getShopStatus();
      setShopStatus(Number(data) === 1 ? 1 : 0);
    } catch (error: any) {
      message.warning(error?.message || "Failed to get business status.");
    }
  };

  useEffect(() => {
    loadShopStatus();
  }, []);

  const handleChangeShopStatus = async (checked: boolean) => {
    const nextStatus = checked ? 1 : 0;
    try {
      setUpdating(true);
      const { data } = await updateShopStatus(nextStatus);
      setShopStatus(nextStatus);
      message.success(data || "Business status updated.");
    } catch (error: any) {
      message.warning(error?.message || "Failed to update business status.");
    } finally {
      setUpdating(false);
    }
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "1") {
      // jump to personal center
      navigate("/personal");
    } else {
      // Log out
      dispatch(clearToken());
      sessionStorage.removeItem("username");
    }
  };

  return (
    <div className="app-header-bar">
      <div className="header-left-status">
        <span className={shopStatus === 1 ? "status-pill is-open" : "status-pill is-closed"}>
          {shopStatus === 1 ? "Open" : "Closed"}
        </span>
      </div>

      <div className="header-right-area">
        <div className="status-setting">
          <ClockCircleFilled className="setting-icon" />
          <span className="setting-label">Business Status Settings</span>
          <Switch
            checked={shopStatus === 1}
            checkedChildren="Open"
            unCheckedChildren="Closed"
            loading={updating}
            onChange={handleChangeShopStatus}
          />
        </div>

        <Dropdown menu={{ items: items, onClick }}>
          <span className="welcome-dropdown">
            <Space>
              Welcome {sessionStorage.getItem("username")}
              <DownOutlined />
            </Space>
          </span>
        </Dropdown>
      </div>
    </div>
  );
}

export default MyHeader;
