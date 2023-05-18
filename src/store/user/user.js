import {
  loginRequest,
  logoutRequest,
  registerRequest,
  resetPasswordRequest,
  sendEmailCodeRequest,
  verifyLoginStateRequest,
  getMessageCountRequest,
  updateMessageStateRequest
} from "@/service/user/user";
import localCache from "@/utils/cache";
import messageTypes from "@/constants/message-types";
import router from "@/router";

const userModule = {
  namespaced: true,
  state() {
    return {
      token: "",
      userInfo: {},
      messageCount: {},
      messageList: [],
      loginState: false
    };
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getToken(state) {
      return state.token;
    },
    getUserId(state) {
      return state.userInfo?.id;
    },
    getUsername(state) {
      return state.userInfo?.username;
    },
    getLoginState(state) {
      return state.loginState;
    },
    getMessageCount(state) {
      return (messageType) => {
        const count = state.messageCount[messageType];
        if (count <= 0) return "";
        return count > 99 ? "99+" : count;
      };
    },
    getMessageList(state) {
      return (messageType, pageNo) => {
        const filterMessageList = state.messageList.find(
          (item) =>
            item.messageType == messageTypes[messageType].value &&
            item.pageNo == pageNo
        );
        if (!filterMessageList) {
          return undefined;
        }

        return {
          dataSource: filterMessageList.messageList,
          dataTotal: filterMessageList.dataTotal,
          pageNo: filterMessageList.pageNo,
          pageTotal: filterMessageList.pageTotal,
          pageSize: filterMessageList.pageSize
        };
      };
    }
  },
  mutations: {
    changeToken(state, token) {
      state.token = token;
    },
    changeUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    changeLoginState(state, payload = {}) {
      const { loginState = false, userInfo = {}, token = "" } = payload;

      state.loginState = loginState;
      state.userInfo = userInfo;
      state.token = token;
    },
    initMessageCount(state, payload) {
      state.messageCount = payload;
    },
    changeMessageCount(state, { messageType, changeTotal }) {
      if (!messageType) return;
      state.messageCount[messageType] -= changeTotal;
      state.messageCount.total -= changeTotal;
    },
    changeMessageList(state, payload) {
      state.messageList.push(payload);
    }
  },
  actions: {
    async loginAction({ commit }, payload) {
      try {
        const result = await loginRequest(payload);
        const { token, userInfo } = result.data ?? {};

        localCache.setCache("token", token);
        localCache.setCache("userInfo", userInfo);

        commit("changeLoginState", { loginState: true, userInfo, token });
        router.go(0);
        return true;
      } catch (error) {
        return false;
      }
    },
    async logoutAction({ commit, state }) {
      try {
        await logoutRequest();
        localCache.removeCache("token");
        localCache.removeCache("userInfo");
        commit("changeLoginState");
        router.go(0);
        return true;
      } catch (error) {
        return false;
      }
    },
    async registerAction({ commit }, payload) {
      try {
        await registerRequest(payload);
        return true;
      } catch (error) {
        return false;
      }
    },
    async resetPasswordAction({ commit }, payload) {
      try {
        await resetPasswordRequest(payload);
        return true;
      } catch (error) {
        return false;
      }
    },
    async sendEmailCodeAction({ commit }, payload) {
      try {
        await sendEmailCodeRequest(payload);
        return true;
      } catch {
        return false;
      }
    },
    async messageCountAction({ commit }, payload) {
      try {
        const result = await getMessageCountRequest();
        commit("initMessageCount", result.data);
        return true;
      } catch (error) {
        return false;
      }
    },
    async updateMessageStateAction(
      { commit, getters },
      { messageType, offset, pageNo }
    ) {
      try {
        if (!getters.getMessageList(messageType, pageNo)) {
          const { data } = await updateMessageStateRequest({
            messageType,
            offset
          });
          commit("changeMessageCount", {
            messageType,
            changeTotal: data.changeTotal
          });
          commit("changeMessageList", data);
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async verifyLoginState({ getters, commit }) {
      try {
        await verifyLoginStateRequest();
        return true;
      } catch (error) {
        // token 无效
        if (getters.getLoginState) {
          commit("changeLoginState");
        }
        return false;
      }
    },
    async loadLocalLogin({ commit }) {
      const token = localCache.getCache("token");
      const userInfo = localCache.getCache("userInfo");
      if (token && userInfo) {
        commit("changeLoginState", {
          loginState: true,
          userInfo,
          token
        });
      }
    }
  }
};

export default userModule;
