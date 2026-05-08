import { get, put } from "../utils/http/request";

export interface OrderSearchParams {
  page: number;
  pageSize: number;
  number?: string;
  tableNumber?: number;
  status?: number;
  beginTime?: string;
  endTime?: string;
}

export interface OrderRowData {
  id: number;
  number: string;
  status: number;
  userId?: number;
  username?: string;
  userName?: string;
  phone?: string;
  address?: string;
  orderTime?: string;
  checkoutTime?: string;
  amount: number;
  remark?: string;
  diningMode?: number;
  tableNumber?: number;
  orderDishes?: string;
}

export interface OrderDetailItem {
  id: number;
  name: string;
  orderId: number;
  dishId?: number;
  setmealId?: number;
  dishFlavor?: string;
  number: number;
  amount: number;
  image?: string;
}

export interface OrderDetailData extends OrderRowData {
  orderDetailList: OrderDetailItem[];
}

export interface OrderStatisticsData {
  toBeConfirmed: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface UpdateOrderStatusPayload {
  id: number;
  status: number;
}

export function getOrderPage(data: OrderSearchParams) {
  return get("/admin/order/conditionSearch", data);
}

export function getOrderStatistics() {
  return get("/admin/order/statistics");
}

export function getOrderDetail(id: number) {
  return get(`/admin/order/details/${id}`);
}

export function updateOrderStatus(data: UpdateOrderStatusPayload) {
  return put("/admin/order/status", data);
}
