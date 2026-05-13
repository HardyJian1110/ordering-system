import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
interface MenuItem {
  key: string;
  label: string;
  children?: MenuItem[];
}
interface Breadcrumb {
  path: string;
  label: string;
}
function findBreadcrumbPath(path: string, menuItems: MenuItem[]): Breadcrumb[] {
  const pathSegments: Breadcrumb[] = [];
  function findPath(currentPath: string, items: MenuItem[]): Breadcrumb[] {
    for (let item of items) {
      console.log(222, item.key, currentPath);
      if (currentPath.startsWith(item.key)) {
        console.log(9, item.key);
        pathSegments.push({ path: item.key, label: item.label });
        if (item.children) {
          findPath(currentPath, item.children);
        }
        break;
      }
    }
    console.log(787, pathSegments);
    return pathSegments;
  }
  return findPath(path, menuItems);
}
function MyBreadCrumb() {
  const location = useLocation();
  const { menuList } = useSelector((state: any) => state.authSlice);
  const breadList = findBreadcrumbPath(location.pathname, menuList).map((item) => ({ title: item.label }));
  return <Breadcrumb style={{ margin: "15px 0" }} items={breadList} />;
}
export default MyBreadCrumb;
