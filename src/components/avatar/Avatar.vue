<template>
  <div
    class="avatar"
    :style="{ width: size + 'px', height: size + 'px' }"
    @click="gotoUserInfo"
  >
    <el-image
      :style="{
        width: size + 'px',
        height: size + 'px',
        borderRadius: size / 2 + 'px',
        outline: 'none',
        cursor: clickLink ? 'pointer' : 'default'
      }"
      class="avatar-image"
      :src="getAvatarUrl"
      fit="cover"
      loading="lazy"
    >
      <template #error>
        <el-image
          v-if="getLoginState || !showNoLogin"
          :style="{
            width: size + 'px',
            height: size + 'px',
            borderRadius: size / 2 + 'px',
            outline: 'none',
            cursor: clickLink ? 'pointer' : 'default'
          }"
          :src="DEFAULT_AVATAR"
          alt=""
        />
        <div v-else class="no-login">未登录</div>
      </template>
    </el-image>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useGetters } from "@/hooks";
import { BASE_URL } from "@/service/request/config";
import DEFAULT_AVATAR from "@/assets/image/defaultAvatar.webp";

const props = defineProps({
  userId: {
    type: Number
  },
  size: {
    type: Number,
    default: 50
  },
  clickLink: {
    type: Boolean,
    default: true
  },
  showNoLogin: {
    type: Boolean,
    default: false
  }
});
const router = useRouter();
const { getLoginState } = useGetters("user", ["getLoginState"]);

const getAvatarUrl = computed(() => {
  if (!props.userId) return;
  return BASE_URL + "/users/" + props.userId + "/avatar";
});

const gotoUserInfo = () => {
  if (props.clickLink) {
    router.push("/user/" + props.userId);
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  height: 100%;
  outline: none;
  .avatar-image {
    ::v-deep(.el-image__wrapper) {
      display: flex;
      align-items: center;
      background: #f0f0f0;
      .no-login {
        width: 100%;
        text-align: center;
        font-size: 13px;
        color: #bdbdbd;
      }
    }
  }
}
</style>
