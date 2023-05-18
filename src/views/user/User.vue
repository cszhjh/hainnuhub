<template>
  <div class="user-body content-body">
    <el-page-header class="page-header" @back="back">
      <template #content>
        <span class="text-large font-600 mr-3">个人中心</span>
      </template>
    </el-page-header>

    <div class="user-panel">
      <UserSide :userInfo="userInfo" @updateUserInfo="updateUserInfo" />
      <UserForumPanel :userId="userId" />
    </div>
    <UserEditInfo
      ref="userEditInfoRef"
      @resetUserInfoHandler="resetUserInfoHandler"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getUserInfoRequest } from "@/service/user/user";

import UserSide from "./components/UserSide";
import UserForumPanel from "./components/UserForumPanel";
import UserEditInfo from "./components/UserEditInfo";

const router = useRouter();
const route = useRoute();

const userInfo = ref({});
const userId = ref(null);
const getUserInfo = async () => {
  try {
    const result = await getUserInfoRequest({
      userId: userId.value
    });

    userInfo.value = result.data;
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => route.params.userId,
  (newValue) => {
    if (!newValue) return;
    userId.value = Number(newValue);
    getUserInfo();
  },
  {
    immediate: true
  }
);

const userEditInfoRef = ref(null);
const updateUserInfo = () => {
  userEditInfoRef.value.showEditUserInfoDialog(userInfo.value);
};

const resetUserInfoHandler = (data) => {
  userInfo.value = JSON.parse(JSON.stringify(data));
};

const back = () => {
  if (!router.options.history.state.back) {
    router.push("/");
    return;
  }
  router.back();
};
</script>

<style lang="scss" scoped>
.user-body {
  .page-header {
    width: calc(var(--body-width) - 300px);
  }
  .user-panel {
    display: flex;
    padding-top: 5px;
  }
}
</style>
