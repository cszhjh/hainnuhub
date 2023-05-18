import { createApp } from "vue";

import "element-plus/dist/index.css";
import "normalize.css";
import "./assets/css/index.scss";
import "./assets/icon/iconfont.css";

import App from "./App";
import router from "./router";
import store, { setupStore } from "./store";
import registerDirectives from "./directives";
import { dispatchEventStorage } from "@/utils/utils";

const app = createApp(App);

app.use(registerDirectives);
app.use(router);
app.use(store);
app.use(dispatchEventStorage);
setupStore();

app.mount("#app");
