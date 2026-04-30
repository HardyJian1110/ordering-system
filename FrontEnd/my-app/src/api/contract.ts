import { post, get } from "../utils/http/request";

interface SearchData {
  contractNo: string;
  person: string;
  tel: string;
  page: number;
  pageSize: number;
}

interface SearchData2 {
  page: number;
  pageSize: number;
  no?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export function getContractList(data: SearchData) {
  return post("/contract/getContractList", data);
}

export function getContractDetail(contractNo: string) {
  return get(`/contract/detail/${contractNo}`);
}

export function getBillList(data: SearchData2) {
  return post("/contract/getBillList", data);
}

export function batchDeleteBill(ids: React.Key[]) {
  return post("/contract/batchDeleteBill", ids);
}
