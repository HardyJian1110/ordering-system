import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import icons from "./iconList";
import logo from "../../assets/logo.jpg";
import "./index.scss";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// interface MenuItem {
//   key: string;
//   label: string;
//   icon?: React.ReactNode;
//   children?: MenuItem[];
// }
type MenuItem = Required<MenuProps>["items"][number];

function NavLeft() {
  const { menuList } = useSelector((state: any) => state.authSlice);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    configMenu();
  }, [menuList]);

  async function configMenu() {
    // const { data } = await getMenu();
    // dispatch(setMenu(data));
    const mappedMenuItems: MenuItem[] = mapMenuItems(menuList);
    setMenuData(mappedMenuItems);
  }

  // convert menulist(e.g. icon) from backend to component format
  function mapMenuItems(items: any): any {
    return items.map((item: any) => ({
      key: item.key,
      label: item.label,
      icon: icons[item.icon],
      children: item.children ? mapMenuItems(item.children) : null,
    }));
  }

  function handleClick({ key }: { key: string }) {
    navigate(key);
  }

  return (
    <div className="navLeft">
      <div className="logo">
        <img src={logo} alt="" width={18} />
        <h1>Smart Apartment</h1>
      </div>
      <Menu
        defaultSelectedKeys={["/dashboard"]}
        mode="inline"
        theme="dark"
        items={menuData}
        onClick={handleClick}
        selectedKeys={[location.pathname]}
      />
    </div>
  );
}

export default NavLeft;
