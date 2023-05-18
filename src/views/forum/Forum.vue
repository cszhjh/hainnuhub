<template>
  <div class="article content-body">
    <div class="article-panel">
      <el-tabs type="border-card" @tab-change="tabChange">
        <el-tab-pane label="最热" :lazy="true">
          <div class="article-list">
            <Skeleton
              v-bind="getForumList(currentLabelId, currentPageNo, 0)"
              :showSkeleton="showSkeleton"
              @handlePageNoChange="handlePageNoChange"
            >
              <template #default="{ data }">
                <ForumItem :forum="data" />
              </template>
            </Skeleton>
          </div>
        </el-tab-pane>
        <el-tab-pane label="发布时间" :lazy="true">
          <div class="article-list">
            <Skeleton
              v-bind="getForumList(currentLabelId, currentPageNo, 1)"
              :showSkeleton="showSkeleton"
              @handlePageNoChange="handlePageNoChange"
            >
              <template #default="{ data }">
                <ForumItem :forum="data" />
              </template>
            </Skeleton>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useGetters } from "@/hooks";

import ForumItem from "@/components/forum-item/ForumItem";
import Skeleton from "@/components/skeleton/Skeleton";

const store = useStore();
const route = useRoute();
const router = useRouter();
const { getForumList } = useGetters("forum", ["getForumList"]);

const DEFAULT_OFFSET = 0;
const DEFAULT_SIZE = 10;
const currentLabelId = ref(route.params.labelId ?? 0);
const currentPageNo = ref(1);
const currentTabIndex = ref(0);
const showSkeleton = ref(true);

const getForumListData = async (
  offset = DEFAULT_OFFSET,
  size = DEFAULT_SIZE
) => {
  try {
    showSkeleton.value = true;
    await store.dispatch("forum/getForumListAction", {
      labelId: currentLabelId.value,
      pageNo: currentPageNo.value,
      type: currentTabIndex.value,
      offset,
      size
    });
  } catch (error) {
    console.log(error);
  } finally {
    showSkeleton.value = false;
  }
};

const tabChange = (type) => {
  currentTabIndex.value = type;
  currentPageNo.value = 1;
  getForumListData();
};

const handlePageNoChange = (pageNo) => {
  currentPageNo.value = pageNo;
  getForumListData((pageNo - 1) * DEFAULT_SIZE);
};
let count = 0;
watch(
  () => route.path,
  (newValue, oldValue) => {
    const [, newPath, labelId = 0] = newValue.split("/");
    const [, oldPath] = oldValue?.split("/") ?? ["", ""];
    if (
      /* 第一次进和切换 tab */
      newPath === "forum" &&
      (!oldPath || oldPath === "forum")
    ) {
      currentLabelId.value = labelId;
      currentPageNo.value = 1;
    } else if (
      /* back 按钮和从其他页面点击 tab */
      newPath === "forum" &&
      (oldPath || oldPath !== "forum")
    ) {
      if (labelId != currentLabelId.value) {
        currentLabelId.value = labelId;
        currentPageNo.value = 1;
      }
    }
    getForumListData();
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.article {
  .article-panel {
    background: #fff;
  }
}
</style>
