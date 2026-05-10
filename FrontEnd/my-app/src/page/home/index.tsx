import { Breadcrumb, Layout, theme } from "antd";
import { useEffect, useState } from "react";
import NavLeft from "../../components/navLeft";
import MyBreadCrumb from "../../components/breadCrumb";
import MyHeader from "../../components/header";
import { Outlet } from "react-router-dom";
import { startOrderReminderSocket, stopOrderReminderSocket } from "../../utils/ws/orderReminderSocket";

const { Header, Content, Footer, Sider } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const username = sessionStorage.getItem("username") || "";
    if (username) {
      startOrderReminderSocket(username);
    }
    return () => {
      stopOrderReminderSocket();
    };
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <div className="home">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <NavLeft />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <MyHeader />
          </Header>
          <Content style={{ margin: "0 16px", height: "90vh", overflowY: "auto", overflowX: "hidden" }}>
            <MyBreadCrumb />
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Apartment Management ©{new Date().getFullYear()} Created by Hardy Jian
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default Home;
