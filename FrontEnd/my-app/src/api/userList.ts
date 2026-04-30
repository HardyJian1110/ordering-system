import { DataType } from "../page/users/interface";
import { post } from "../utils/http/request";

interface searchType {
  page: number;
  pageSize: number;
  companyName?: string;
  contact?: string;
  tel?: string;
}

export function getUserList(data: searchType) {
  return post("/user/userList", data);
}

// delete user
export function batchDeleteUser(ids: React.Key[]) {
  return post("/user/batchDeleteUser", ids);
}

// edit or add user
export function editUser(data: DataType) {
  return post("/user/editOrAddUser", data);
}
