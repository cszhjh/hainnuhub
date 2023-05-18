import { ElMessage } from "element-plus";
import store from "@/store";
import emitter from "@/utils/eventbus";

export const interceptors = {
  requestInterceptor(config) {
    return config;
  },
  responseInterceptorCatch(err) {
    if (err.response?.status === 401) {
      store.commit("user/changeLoginState");
      ElMessage.error(err.response.data.message);
      emitter.emit("loginEvent");
    }
    return err;
  }
};
