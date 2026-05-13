import React, { useEffect, useState, Suspense } from "react";
import logo from "./logo.svg";
import { routes } from "./router";
import { RouterProvider } from "react-router-dom";
import { generatesRoutes } from "./utils/generatesRoutes";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter } from "react-router-dom";
import { getMenu } from "./api/users";
import { UseDispatch, UseSelector } from "react-redux";
import { setMenu } from "./store/login/authSlice";
import { Spin } from "antd";
function App() {
  const [routerss, setRouter] = useState<any>(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.authSlice);
  // useEffect(() => {
  //   async function loadData() {
  //     const { data } = await getMenu();
  //     if (data.length) {
  //       dispatch(setMenu(data));
  //       const routers = generatesRoutes(data); //动态创建的路由表
  //       const myRoutes = [...routes];
  //       myRoutes[0].children = routers;
  //       myRoutes[0].children[0].index = true;
  //       const router = createBrowserRouter(myRoutes);
  //       setRouter(router);
  //     } else {
  //       const router = createBrowserRouter(routes);
  //       setRouter(router);
  //       return;
  //     }
  //   }
  //   loadData();
  // }, [token]);
  useEffect(() => {
    async function loadData() {
      // 1. 💡 如果没登录，直接加载基础路由（包含登录页），不请求接口。
      if (!token) {
        const router = createBrowserRouter(routes);
        setRouter(router);
        return;
      }

      // 2. 只有有 token 才会执行到这里
      try {
        const { data } = await getMenu();
        if (data && data.length) {
          dispatch(setMenu(data));
          const routers = generatesRoutes(data);
          const myRoutes = [...routes];
          myRoutes[0].children = routers;
          if (myRoutes[0].children[0]) {
            myRoutes[0].children[0].index = true;
          }
          setRouter(createBrowserRouter(myRoutes));
        } else {
          setRouter(createBrowserRouter(routes));
        }
      } catch (error) {
        // 如果请求菜单失败（比如 token 过期），也保底显示基础路由
        setRouter(createBrowserRouter(routes));
      }
    }

    loadData();
  }, [token]);
  if (routerss) {
    return (
      <div className="App">
        <Suspense fallback={<Spin></Spin>}>
          <RouterProvider router={routerss} />;
        </Suspense>
      </div>
    );
  } else {
    return <Spin>Loading...</Spin>;
  }
}

export default App;
