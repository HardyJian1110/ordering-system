import { del, get, post, put } from "../utils/http/request";

export interface CategorySearchType {
  name: string;
  type?: number;
  page: number;
  pageSize: number;
}

export interface CategoryData {
  id?: number;
  name: string;
  sort: number;
  type: number;
}

export interface CategoryRowData {
  id: number;
  name: string;
  sort: number;
  type: number;
  status: number;
  updateTime: string;
}

export function getCategoryPage(data: CategorySearchType) {
  return get("/admin/category/page", data);
}

export function addCategory(data: CategoryData) {
  return post("/admin/category", data);
}

export function editCategory(data: CategoryData) {
  return put("/admin/category", data);
}

export function deleteCategory(id: number) {
  return del("/admin/category", { id });
}

export function updateCategoryStatus(status: number, id: number) {
  return post(`/admin/category/status/${status}?id=${id}`);
}
