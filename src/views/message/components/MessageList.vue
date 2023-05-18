<template>
  <div class="message-list">
    <Skeleton
      v-bind="getMessageList(messageType, currentPageNo)"
      :count="3"
      :pageSize="DEFAULT_PAGE_SIZE"
      noDataMessage="暂无消息"
      @handlePageNoChange="handlePageNoChange"
    >
      <template #default="{ data }">
        <MessageListItem v-bind="data" />
      </template>
    </Skeleton>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useGetters } from "@/hooks";

import Avatar from "@/components/avatar/Avatar";
import MessageListItem from "./MessageListItem.vue";

const props = defineProps({
  messageType: {
    type: String
  }
});

const store = useStore();
const { getMessageList } = useGetters("user", ["getMessageList"]);
const showSkeleton = ref(true);
const currentPageNo = ref(1);
const DEFAULT_PAGE_SIZE = 5;

const updateMessageState = async (messageType, pageNo) => {
  showSkeleton.value = true;

  await store.dispatch("user/updateMessageStateAction", {
    messageType,
    offset: (pageNo - 1) * DEFAULT_PAGE_SIZE,
    size: DEFAULT_PAGE_SIZE,
    pageNo
  });

  showSkeleton.value = false;
};

watch(
  () => props.messageType,
  (newValue) => {
    updateMessageState(newValue, currentPageNo.value);
  },
  {
    immediate: true
  }
);

const handlePageNoChange = (pageNo) => {
  currentPageNo.value = pageNo;
  updateMessageState(props.messageType, pageNo);
};
</script>

<style lang="scss" scoped>
.message-list {
  padding: 5px 30px 0 30px;
}
</style>
