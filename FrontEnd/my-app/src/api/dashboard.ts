import { get } from "../utils/http/request";

export interface BusinessData {
  turnover: number;
  validOrderCount: number;
  orderCompletionRate: number;
  unitPrice: number;
}

export interface OrderOverviewData {
  waitingOrders: number;
  deliveredOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  allOrders: number;
}

export interface DishOverviewData {
  sold: number;
  discontinued: number;
}

export interface SetmealOverviewData {
  sold: number;
  discontinued: number;
}

export function getBusinessData() {
  return get("/admin/workspace/businessData");
}

export function getOrderOverview() {
  return get("/admin/workspace/overviewOrders");
}

export function getDishOverview() {
  return get("/admin/workspace/overviewDishes");
}

export function getSetmealOverview() {
  return get("/admin/workspace/overviewSetmeals");
}
