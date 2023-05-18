import Request from "./request";
import { BASE_URL, TIME_OUT } from "./request/config";
import store from "@/store";

const $http = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      const token = store.getters["user/getToken"];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    requestInterceptorCatch: (err) => {
      return Promise.reject(err);
    },
    responseInterceptor: (res) => {
      return res;
    },
    responseInterceptorCatch: (err) => {
      return Promise.reject(err);
    }
  }
});

export default $http;
