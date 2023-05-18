<template>
  <div class="user-side">
    <div class="avatar-panel">
      <div
        class="edit-user-info a-link-anim"
        v-if="isCurrentUser"
        @click="updateUserInfo"
      >
        修改资料
      </div>
      <div class="avatar-inner">
        <Avatar :size="120" :userId="userInfo.id" :clickLink="false" />
      </div>
      <div class="username">
        <span>{{ userInfo.username }}</span>
        <i
          :class="[
            'iconfont',
            userInfo.sex === '女' ? 'icon-woman' : 'icon-man'
          ]"
        ></i>
      </div>
      <div class="description">
        <span class="title">个性签名：</span>
        <span class="text">{{
          userInfo.description ?? "这个人很神秘，什么都没有写"
        }}</span>
      </div>

      <!-- 扩展信息 -->
      <div class="user-extend-panel">
        <div class="info-item">
          <div class="label iconfont icon-like">获赞</div>
          <div class="value">{{ userInfo.likeCount }}</div>
        </div>
        <div class="info-item">
          <div class="label iconfont icon-post">发帖</div>
          <div class="value">{{ userInfo.postCount }}</div>
        </div>
        <div class="info-item">
          <div class="label iconfont icon-register">注册</div>
          <el-tooltip placement="right" effect="light">
            <div class="value" v-format-time.ymd="userInfo.createTime"></div>
            <template #content>
              <div class="value" v-format-time="userInfo.createTime"></div>
            </template>
          </el-tooltip>
        </div>
        <div class="info-item">
          <div class="label iconfont icon-login">上一次登录</div>
          <el-tooltip placement="right" effect="light">
            <div class="value" v-format-time.ymd="userInfo.lastLoginTime"></div>
            <template #content>
              <div class="value" v-format-time="userInfo.lastLoginTime"></div>
            </template>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useGetters } from "@/hooks";
import Avatar from "@/components/avatar/Avatar";

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
    default: () => {}
  }
});

const { getUserId } = useGetters("user", ["getUserId"]);
const isCurrentUser = ref(false);

watch(
  () => [getUserId.value, props.userInfo.id],
  (newValue) => {
    if (newValue[0] && newValue[1] && newValue[0] === newValue[1]) {
      isCurrentUser.value = true;
    } else {
      isCurrentUser.value = false;
    }
  },
  {
    immediate: true,
    deep: true
  }
);

const emit = defineEmits(["updateUserInfo"]);
const updateUserInfo = () => {
  emit("updateUserInfo");
};
</script>

<style lang="scss" scoped>
.user-side {
  width: 300px;
  margin-right: 10px;
  .avatar-panel {
    position: relative;
    background: #fff;
    text-align: center;
    padding: 10px;
    .edit-user-info {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 14px;
    }
    .avatar-inner {
      display: flex;
      justify-content: center;
    }
    .username {
      margin-top: 10px;
      .iconfont {
        margin-left: 5px;
        color: var(--link);
        &.icon-woman {
          color: rgb(235, 125, 169);
        }
      }
    }
    .description {
      display: flex;
      text-align: left;
      font-size: 14px;
      margin-top: 5px;
      color: #929393;
      .title {
        color: #6a6a6a;
      }
      .text {
        flex: 1;
      }
    }
    .user-extend-panel {
      margin-top: 10px;
      background: #fff;
      padding: 10px;
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        &:first-child {
          margin-top: 0;
        }
        .label {
          font-size: 13px;
          display: flex;
          align-items: center;
          &::before {
            font-size: 20px;
            color: #888;
            padding-right: 5px;
          }
        }
        .value {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
