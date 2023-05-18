<template>
  <div class="message-body content-body">
    <div class="message-panel">
      <el-page-header class="page-header" @back="back">
        <template #content>
          <span class="text-large font-600 mr-3">消息中心</span>
        </template>
      </el-page-header>
      <div class="message-panel">
        <el-tabs
          class="message-tabs"
          v-model="activeTabName"
          @tab-change="tabChange"
        >
          <el-tab-pane
            v-for="item in messageTypes"
            :key="item"
            :name="item.key"
          >
            <template #label>
              <div class="tab-item">
                <el-badge
                  class="message-badge"
                  :value="messageCount[item.key]"
                  :hidden="messageCount[item.key] <= 0"
                  :max="99"
                >
                  <span class="text">{{ item.text }}</span>
                </el-badge>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>

        <MessageList :messageType="activeTabName" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useState } from "@/hooks";
import messageTypes from "@/constants/message-types";

import MessageList from "./components/MessageList";

const router = useRouter();
const route = useRoute();

const activeTabName = ref(route.params.type);
const { messageCount } = useState("user", ["messageCount"]);

const tabChange = (type) => {
  activeTabName.value = type;
  router.push(`/user/message/${type}`);
};

const back = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
.message-body {
  .message-panel {
    .page-header {
      width: calc(var(--body-width) - 300px);
    }
    .message-panel {
      background: #fff;
      margin-top: 5px;
      padding: 10px;
      .message-tabs {
        padding: 0 20px;
      }
    }
  }
}

::v-deep(.message-panel) {
  // padding: 5px 26px;
  .message-badge {
    cursor: pointer;
    outline: none;
    .text {
      margin-right: 10px;
    }
  }
}
</style>
