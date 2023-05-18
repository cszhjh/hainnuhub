import { getLablesRequest, createLabelRequest } from "@/service/labels/labels";

const labelModule = {
  namespaced: true,
  state() {
    return {
      labels: []
    };
  },
  getters: {
    getLabels(state) {
      return state.labels;
    },
    getSliceLabels(state) {
      return (start, end) => state.labels.slice(start, end);
    }
  },
  mutations: {
    changeLabels(state, labels) {
      state.labels = labels;
    },
    addLabels(state, labels) {
      for (let label of labels) {
        const isExists = state.labels.find((item) => item.id === label.id);
        if (!isExists) {
          state.labels.push(label);
        }
      }
    }
  },
  actions: {
    async getLabelAction({ commit }, payload = {}) {
      const result = await getLablesRequest(payload);
      const { status, data } = result;

      if (status === 200) {
        commit("changeLabels", data);
      }
      return result;
    }
  }
};

export default labelModule;
