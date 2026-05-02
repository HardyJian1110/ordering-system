import { get, put } from "../utils/http/request";

export function getShopStatus() {
  return get("/admin/shop/status");
}

export function updateShopStatus(status: number) {
  return put(`/admin/shop/${status}`);
}
