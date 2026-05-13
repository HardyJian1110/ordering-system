import { get, post, put } from "../utils/http/request";

export interface EmployeeSearchType {
  name: string;
  page: number;
  pageSize: number;
}

export interface EmployeeData {
  id?: number;
  username: string;
  name: string;
  phone: string;
  sex: number;
  idNumber: string;
  status?: number;
  role?: "admin" | "manager" | "user";
  password?: string;
}

export interface EmployeeRowData {
  id: number;
  username: string;
  name: string;
  phone: string;
  sex: number;
  idNumber: string;
  status: number;
  updateTime: string;
  role?: "admin" | "manager" | "user";
  password?: string;
}

export function getEmployeePage(data: EmployeeSearchType) {
  return get("/admin/employee/page", data);
}

export function getEmployeeDetail(id: number) {
  return get(`/admin/employee/${id}`);
}

export function addEmployee(data: EmployeeData) {
  return post("/admin/employee", data);
}

export function editEmployee(data: EmployeeData) {
  return put("/admin/employee", data);
}

export function updateEmployeeStatus(status: number, id: number) {
  return post(`/admin/employee/status/${status}?id=${id}`);
}
