import { del, get, post } from "../utils/http/request";

export interface CategoryItem {
  id: number;
  name: string;
  type: 1 | 2;
  status: number;
  sort: number;
}

export interface DishFlavor {
  id?: number;
  dishId?: number;
  name: string;
  value: string;
}

export interface DishItem {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  image: string;
  description?: string;
  price: number;
  status?: number;
  flavors?: DishFlavor[];
}

export interface SetmealItem {
  id: number;
  categoryId: number;
  name: string;
  image: string;
  description?: string;
  price: number;
  status?: number;
}

export interface ShoppingCartItem {
  id: number;
  userId?: number;
  dishId?: number;
  setmealId?: number;
  name: string;
  image: string;
  amount: number;
  number: number;
  dishFlavor?: string;
  createTime?: string;
}

export interface ShoppingCartPayload {
  dishId?: number;
  setmealId?: number;
  dishFlavor?: string;
}

export interface SubmitOrderPayload {
  diningMode: 1 | 2;
  tableNumber?: number;
  remark?: string;
  amount: number;
}

export interface SubmitOrderResult {
  id: number;
  orderNumber: string;
  orderAmount: number;
  orderTime: string;
}

export function getCategoryList(type: 1 | 2) {
  return get("/user/category/list", { type });
}

export function getSetmealList(categoryId?: number) {
  if (typeof categoryId === "number") {
    return get("/user/setmeal/list", { categoryId });
  }
  return get("/user/setmeal/list");
}

export function getDishList(categoryId: number) {
  return get("/user/dish/list", { categoryId });
}

export function getShoppingCartList() {
  return get("/user/shoppingCart/list");
}

export function addShoppingCart(payload: ShoppingCartPayload) {
  return post("/user/shoppingCart/add", payload);
}

export function subShoppingCart(payload: ShoppingCartPayload) {
  return post("/user/shoppingCart/sub", payload);
}

export function cleanShoppingCart() {
  return del("/user/shoppingCart/clean");
}

export function submitOrder(payload: SubmitOrderPayload) {
  return post("/user/order/submit", payload);
}
