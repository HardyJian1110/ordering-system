import { post, get } from "../utils/http/request";

interface LoginData {
  username: string;
  passsword: string;
}

interface AccountData {
  accountName: string;
}

export function login(data: LoginData) {
  return post("/admin/employee/login", data);
}

export function getMenu() {
  return get("/menu");
}

export function getAccountList(data: AccountData) {
  return post("/accountList", data);
}
