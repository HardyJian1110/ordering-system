import { RouteObject } from "react-router-dom";
import { componentMap } from "../router/routerMap";
interface menuType {
  icon: string;
  key: string;
  label: string;
  children?: menuType[];
}

export function generatesRoutes(menu: menuType[]): RouteObject[] {
  return menu.map((item: menuType) => {
    const hasChildren = item.children;
    let routerObj: RouteObject = {
      path: item.key,
      element: hasChildren ? null : <>{componentMap[item.key]}</>,
    };
    if (item.children) {
      routerObj.children = generatesRoutes(item.children);
    }
    return routerObj;
  });
}
