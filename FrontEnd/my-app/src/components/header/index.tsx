import React from "react";
import { UserOutlined, PoweroffOutlined, DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { clearToken } from "../../store/login/authSlice";
import { useDispatch, UseDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const items: MenuProps["items"] = [
  {
    key: "1",
    label: <a target="_blank">Personal Center</a>,
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: <a target="_blank">Log Out</a>,
    icon: <PoweroffOutlined />,
  },
];

function MyHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div>
      <Dropdown menu={{ items: items, onClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Welcome {sessionStorage.getItem("username")}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
}

export default MyHeader;
