import { del, get, post, put } from "../utils/http/request";

export interface DishSearchType {
  name: string;
  categoryId?: number;
  status?: number;
  page: number;
  pageSize: number;
}

export interface DishFlavor {
  id?: number;
  dishId?: number;
  name: string;
  value: string;
}

export interface DishData {
  id?: number;
  name: string;
  categoryId: number;
  price: number;
  image: string;
  description?: string;
  status?: number;
  flavors?: DishFlavor[];
}

export interface DishRowData {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  price: number;
  image: string;
  description?: string;
  status: number;
  updateTime: string;
}

export interface DishCategoryItem {
  id: number;
  name: string;
  status: number;
  type: number;
}

export function getDishPage(data: DishSearchType) {
  return get("/admin/dish/page", data);
}

export function addDish(data: DishData) {
  return post("/admin/dish", data);
}

export function editDish(data: DishData) {
  return put("/admin/dish", data);
}

export function getDishDetail(id: number) {
  return get(`/admin/dish/${id}`);
}

export function updateDishStatus(status: number, id: number) {
  return post(`/admin/dish/status/${status}?id=${id}`);
}

export function batchDeleteDish(ids: React.Key[]) {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("ids", String(id)));
  return del("/admin/dish", params);
}

export function getDishCategoryList() {
  return get("/admin/category/list", { type: 1 });
}

export function uploadDishImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return post("/admin/common/upload", formData);
}
