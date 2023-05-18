import { createStore } from "vuex";
import user from "./user/user";
import label from "./label/label";
import forum from "./forum/forum";

const store = createStore({
  state: () => {
    return {};
  },
  modules: {
    user,
    label,
    forum
  }
});

export function setupStore() {
  store.dispatch("user/loadLocalLogin");
}

export default store;
