import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";

const DEFAULT_LOADING = true;
const DEFAULT_MESSAGE = true;

class Request {
  constructor(config) {
    this.instance = axios.create(config);
    this.showLoading = config.showLoading ?? DEFAULT_LOADING;
    this.loading = null;
    this.loadingTimeout = null;
    this.needLoadingRequestCount = 0;
    this.showMessage = config.showMessage ?? DEFAULT_MESSAGE;
    this.interceptors = config.interceptors;

    // 实例拦截器（可选）
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    // 全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          this.showFullScreenLoading();
        }
        return config;
      },
      (err) => Promise.reject(err)
    );
    this.instance.interceptors.response.use(
      (res) => {
        this.tryHideFullScreenLoding();

        return res.data;
      },
      (err) => {
        this.tryHideFullScreenLoding();
        const status = err?.response?.status;
        let message =
          err?.response?.data?.message ?? "服务器发生错误，请重试！";
        if (this.showMessage) {
          if (status !== 401) {
            ElMessage({
              type: "error",
              message
            });
          }
        }
        return Promise.reject(err);
      }
    );
  }

  request(config) {
    return new Promise((resolve, reject) => {
      // request 的请求拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      if (config.showLoading === false) {
        this.showLoading = false;
      }
      if (config.showMessage === false) {
        this.showMessage = false;
      }

      // request 的响应拦截器
      this.instance
        .request(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }

          this.showLoading = DEFAULT_LOADING;
          this.showMessage = DEFAULT_MESSAGE;
          resolve(res);
        })
        .catch((err) => {
          if (config.interceptors?.responseInterceptorCatch) {
            err = config.interceptors.responseInterceptorCatch(err);
          }

          this.showLoading = DEFAULT_LOADING;
          this.showMessage = DEFAULT_MESSAGE;
          reject(err);
        });
    });
  }

  get(config) {
    return this.request({ ...config, method: "GET" });
  }

  post(config) {
    return this.request({ ...config, method: "POST" });
  }

  delete(config) {
    return this.request({ ...config, method: "DELETE" });
  }

  patch(config) {
    return this.request({ ...config, method: "PATCH" });
  }

  startLoading() {
    console.log("loading");
    this.loading = ElLoading.service({
      lock: true,
      text: "加载中...",
      background: "rgba(0, 0, 0, 0.5)"
    });
  }

  endLoading() {
    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = null;
    this.loading?.close();
  }

  showFullScreenLoading() {
    if (this.needLoadingRequestCount === 0) {
      this.loadingTimeout = setTimeout(() => {
        this.startLoading();
      }, 800);
    }
    this.needLoadingRequestCount++;
  }

  tryHideFullScreenLoding() {
    if (this.needLoadingRequestCount <= 0) return;
    this.needLoadingRequestCount--;
    if (this.needLoadingRequestCount === 0) {
      this.endLoading();
    }
  }
}

export default Request;
