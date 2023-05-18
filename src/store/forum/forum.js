import { getForumListRequest } from "@/service/forum/forum";

const forumModuel = {
  namespaced: true,
  state() {
    return {
      forumList: []
    };
  },
  getters: {
    getForumList(state) {
      return (currentId, pageNo, type) => {
        const filterForumList = state.forumList.find(
          (item) =>
            item.labelId == currentId &&
            item.pageNo == pageNo &&
            item.type == type
        );
        if (!filterForumList) {
          return undefined;
        }
        return {
          dataSource: filterForumList.forumList,
          dataTotal: filterForumList.dataTotal,
          pageNo: filterForumList.pageNo,
          pageTotal: filterForumList.pageTotal
        };
      };
    }
  },
  mutations: {
    changeForumListData(state, payload) {
      state.forumList.push(payload);
    }
  },
  actions: {
    async getForumListAction({ getters, commit }, payload) {
      const { offset, size, labelId, pageNo, type } = payload;
      let result = {};
      if (!getters.getForumList(labelId, pageNo, type)) {
        result = await getForumListRequest({ offset, size, labelId, type });
      }

      const { status, data } = result;

      if (status === 200) {
        commit("changeForumListData", data);
      }
      return result;
    }
  }
};

export default forumModuel;
