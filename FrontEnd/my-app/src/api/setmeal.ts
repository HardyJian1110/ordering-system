import { del, get, post, put } from "../utils/http/request";

export interface SetmealSearchType {
  name: string;
  categoryId?: number;
  status?: number;
  page: number;
  pageSize: number;
}

export interface CategoryItem {
  id: number;
  name: string;
  type: number;
  status: number;
}

export interface DishItem {
  id: number;
  name: string;
  price: number;
  status: number;
  categoryId: number;
  image?: string;
}

export interface SetmealDish {
  id?: number;
  setmealId?: number;
  dishId: number;
  name: string;
  price: number;
  copies: number;
}

export interface SetmealData {
  id?: number;
  categoryId: number;
  name: string;
  price: number;
  status: number;
  description?: string;
  image: string;
  setmealDishes: SetmealDish[];
}

export interface SetmealRowData {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  price: number;
  status: number;
  description?: string;
  image: string;
  updateTime: string;
}

export function getSetmealList(data: SetmealSearchType) {
  return get("/admin/setmeal/page", data);
}

export function batchDeleteSetmeal(ids: React.Key[]) {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("ids", id.toString()));
  return del("/admin/setmeal", params);
}

export function addSetmeal(data: SetmealData) {
  return post("/admin/setmeal", data);
}

export function editSetmeal(data: SetmealData) {
  return put("/admin/setmeal", data);
}

export function getSetmealDetail(id: number) {
  return get(`/admin/setmeal/${id}`);
}

export function updateSetmealStatus(status: number, id: number) {
  return post(`/admin/setmeal/status/${status}?id=${id}`);
}

export function getSetmealCategoryList() {
  return get("/admin/category/list", { type: 2 });
}

export function getDishListByCategoryId(categoryId: number) {
  return get("/admin/dish/list", { categoryId });
}

export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return post("/admin/common/upload", formData);
}
