<template>
  <div class="user-forum-panel">
    <el-tabs
      class="user-forum-tabs"
      v-model="activeIndex"
      @tab-change="tabChange"
    >
      <el-tab-pane label="发帖" :name="0"></el-tab-pane>
      <el-tab-pane label="评论" :name="1"></el-tab-pane>
      <el-tab-pane label="点赞" :name="2"></el-tab-pane>
    </el-tabs>
    <div class="forum-list">
      <Skeleton
        :showSkeleton="showSkeleton"
        :dataSource="forumInfo.forumList"
        :dataTotal="forumInfo.dataTotal"
        :pageNo="currentPageNo"
        :pageTotal="forumInfo.pageTotal"
        :count="3"
        :pageSize="forumInfo.pageSize"
        class="user-forum-panel"
        noDataMessage="还没有相应的文章"
        @handlePageNoChange="handlePageNoChange"
      >
        <template #default="{ data }">
          <ForumItem :forum="data" :showEdit="getUserId === data.author.id" />
        </template>
      </Skeleton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useGetters } from "@/hooks";
import { getUserForumInfoRequest } from "@/service/user/user";
import ForumItem from "@/components/forum-item/ForumItem";

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
});

const { getUserId } = useGetters("user", ["getUserId"]);
const activeIndex = ref(0);
const forumInfo = ref({});
const showSkeleton = ref(true);
const currentPageNo = ref(1);

const getForumList = async () => {
  try {
    currentPageNo.value = 1;
    showSkeleton.value = true;
    const result = await getUserForumInfoRequest({
      userId: props.userId,
      currentUserId: getUserId.value,
      type: activeIndex.value
    });
    forumInfo.value = result.data;
  } catch (error) {
    console.log(error);
  } finally {
    showSkeleton.value = false;
  }
};

watch(
  () => props.userId,
  (newValue) => {
    if (!newValue) return;
    getForumList();
  },
  {
    immediate: true
  }
);

const tabChange = (type) => {
  activeIndex.value = type;
  getForumList();
};

const handlePageNoChange = (pageNo) => {
  currentPageNo.value = pageNo;
};
</script>

<style lang="scss" scoped>
.user-forum-panel {
  flex: 1;
  background: #fff;
  padding: 10px;
  .user-forum-tabs {
    padding: 0 20px;
  }
}
</style>
