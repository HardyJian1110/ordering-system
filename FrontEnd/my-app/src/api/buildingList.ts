import { post } from "../utils/http/request";

interface searchType {
  page: number;
  pageSize: number;
  name?: string;
  person?: string;
}

export function getBuildingList(data: searchType) {
  return post("/estate/getBuildingList", data);
}

export function batchDeleteBuilding(ids: React.Key[]) {
  return post("/estate/batchDeleteBuilding", ids);
}
