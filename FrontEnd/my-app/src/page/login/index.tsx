import "./index.scss";
import logo from "../../assets/logo.jpg";
import bg from "../../assets/bg.jpg";
import lgbg from "../../assets/lgbg.jpg";
import { Button, Form, Input, Table } from "antd";
import type { TableProps } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import http from "../../utils/http/http";
import { login } from "../../api/users";
import { setToken } from "../../store/login/authSlice";
import { useDispatch, UseDispatch } from "react-redux";
import { replace, useNavigate } from "react-router-dom";
import { useState } from "react";

interface UsernameAndPassword {
  key: string;
  username: string;
  password: string;
}

const UsernameAndPasswordColumns: TableProps<UsernameAndPassword>["columns"] = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Password",
    dataIndex: "password",
    key: "password",
  },
];
const UsernameAndPasswordData: UsernameAndPassword[] = [
  {
    key: "1",
    username: "admin",
    password: "123456",
  },
  {
    key: "2",
    username: "manager1",
    password: "123456",
  },
  {
    key: "3",
    username: "user1",
    password: "123456",
  },
];

function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogin() {
    form
      .validateFields()
      .then(async (res) => {
        setLoading(true);
        const {
          data: { token, userName },
        } = await login(res);
        setLoading(false);
        dispatch(setToken(token));
        sessionStorage.setItem("username", userName);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  return (
    <div className="login" style={{ backgroundColor: "#696969" }}>
      <div className="lgbg" style={{ backgroundImage: `url(${lgbg})` }}>
        <div className="part">
          <div className="title">
            <div className="logo">
              <img src={logo} width={100} />
            </div>
            <h2>Restaurant Ordering System</h2>
          </div>
          <Form form={form}>
            <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
              <Input placeholder="Please input your username" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
              <Input.Password placeholder="Please input your password" prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{ width: "100%" }} onClick={handleLogin} loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
          {/* username and password */}
          <div className="usernameAndPassword">
            <Table<UsernameAndPassword>
              columns={UsernameAndPasswordColumns}
              dataSource={UsernameAndPasswordData}
              pagination={false}
              bordered={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
