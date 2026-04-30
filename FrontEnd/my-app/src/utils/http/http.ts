import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";
import { store } from "../../store";

const http: AxiosInstance = axios.create({
  baseURL: "",
  timeout: 5000,
});

// request interceptor
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token } = store.getState().authSlice;
  if (token) {
    config.headers["token"] = `${token}`;
  }
  return config;
});

// response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("response: ", response);
    const res = response.data;
    if (res.code != 1) {
      message.error(res.code + ": " + res.msg);
      return Promise.reject(new Error(res.msg));
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();

      message.error("Your session has expired, please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default http;
