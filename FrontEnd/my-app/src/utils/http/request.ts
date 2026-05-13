import http from "./http";

interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

export function get(url: string, params?: any): Promise<ApiResponse> {
  return http.get(url, { params: params });
}

export function post(url: string, data?: any): Promise<ApiResponse> {
  return http.post(url, data);
}

export function put(url: string, data?: any): Promise<ApiResponse> {
  return http.put(url, data);
}

export function del(url: string, params?: any): Promise<ApiResponse> {
  return http.delete(url, { params: params });
}
