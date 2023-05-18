<template>
  <div class="user-control">
    <div class="option-panel">
      <el-button type="primary" @click="newPost">
        发帖<span class="iconfont icon-add"></span>
      </el-button>
      <el-button type="primary" @click="search">
        搜索<span class="iconfont icon-search"></span>
      </el-button>
    </div>

    <!-- 登录后 -->
    <template v-if="getLoginState">
      <div class="user-message">
        <!-- 消息 -->
        <el-dropdown>
          <el-badge
            :value="getMessageCount('total')"
            :hidden="getMessageCount('total') <= 0"
            class="message-badge"
            @click="jumpToMessage(messageTypes.reply.key)"
          >
            <div class="iconfont icon-message"></div>
          </el-badge>

          <template #dropdown>
            <el-dropdown-menu class="message-box">
              <el-dropdown-item
                v-for="item in messageTypes"
                @click="jumpToMessage(item.key)"
                :key="item"
                class="message-box-item"
              >
                <span class="text">{{ item.text }}</span>
                <span class="tag-count">{{ getMessageCount(item.key) }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="user-avatar">
        <!-- 用户头像 -->
        <el-dropdown>
          <Avatar :userId="getUserInfo?.id" />

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="jumpToUserInfo">
                我的主页
              </el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <!-- 未登录 -->
    <el-button-group v-else class="user-sign">
      <el-button type="primary" plain @click="login">登录</el-button>
      <el-button type="primary" plain @click="register">注册</el-button>
    </el-button-group>
    <Search ref="searchRef" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { useGetters } from "@/hooks";
import emitter from "@/utils/eventbus";
import localCache from "@/utils/cache";
import messageTypes from "@/constants/message-types";
import { getMessageCountRequest } from "@/service/user/user";
import { verifyLoginStateRequest } from "@/service/user/user";

import Avatar from "@/components/avatar/Avatar";
import Search from "@/components/search/Search";

const { getLoginState, getUserInfo } = useGetters("user", [
  "getLoginState",
  "getUserInfo"
]);

const router = useRouter();
const store = useStore();

const newPost = async () => {
  const oldLoginState = getLoginState.value;
  const status = await store.dispatch("user/verifyLoginState");
  if (status) {
    router.push("/newPost");
  } else {
    let message = "你还没有登录，请先登录！";
    if (oldLoginState) {
      message = "登录已过期，请重新登录！";
    }
    ElMessage.error(message);
    emitter.emit("loginEvent");
  }
};

const { getMessageCount } = useGetters("user", ["getMessageCount"]);

watch(
  () => getLoginState.value,
  async (newValue) => {
    if (newValue) {
      await store.dispatch("user/messageCountAction");
    }
  },
  {
    immediate: true
  }
);

const getMessageItemCount = (type) => {
  const count = messageCount.value[type];
  return count > 99 ? "99+" : count;
};

const jumpToUserInfo = () => {
  router.push(`/user/${getUserInfo.value.id}`);
};

const jumpToMessage = (type) => {
  router.push(`/user/message/${type}`);
};

const logout = async () => {
  await store.dispatch("user/logoutAction");
  ElMessage.success("退出成功！");
};

const login = () => emitter.emit("loginEvent");
const register = () => emitter.emit("registerEvent");

const searchRef = ref(null);

const route = useRoute();
const search = () => {
  const [, path] = route.path.split("/");
  if (path !== "newPost" && path !== "editPost") {
    searchRef.value.show();
  }
};
</script>

<style lang="scss" scoped>
.user-control {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .option-panel {
    .iconfont {
      margin-left: 5px;
    }
    .el-button:last-child {
      margin-left: 5px;
    }
  }
  span {
    font-weight: bold;
  }
  .user-sign {
    margin-left: 10px;
  }
  .user-message {
    .message-badge {
      cursor: pointer;
      outline: none;
      .icon-message {
        font-size: 20px;
        color: rgb(147, 147, 147);
      }
    }
  }
}

::v-deep(.message-box-item) {
  display: flex;
  justify-content: space-between;
  .text {
    margin-right: 7px;
  }
  .tag-count {
    padding: 0 5px;
    border-radius: 8px;
    background: #fa5a57;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
