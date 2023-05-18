<template>
  <div @click="hiddenDialog">
    <Dialog
      :="dialogConfig"
      width="500px"
      :showCancel="false"
      @close="close"
      class="search-panel"
    >
      <el-input placeholder="请输入关键字" v-model="keywords" @input="search">
        <template #prefix>
          <i class="iconfont icon-search"></i>
        </template>
      </el-input>
      <el-scrollbar v-if="forumInfo.forumList" height="400px">
        <Skeleton
          :dataSource="forumInfo.forumList"
          :dataTotal="forumInfo.dataTotal"
          :showPagination="false"
          noDataMessage="没找到 🙁，换换其他关键词吧"
        >
          <template #default="{ data }">
            <ForumItem
              :forum="data"
              :showCover="false"
              :htmlTitle="true"
              class="forum-item"
              @click="(e) => jumpToArticleHandler(e, data.id)"
            />
          </template>
        </Skeleton>
      </el-scrollbar>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { searchRequest } from "@/service/forum/forum";
import { debounce } from "@/utils/utils";

import Dialog from "@/components/dialog/Dialog";
import ForumItem from "@/components/forum-item/ForumItem";

const dialogConfig = reactive({
  show: false,
  title: "搜索"
});

const keywords = ref("");
const forumInfo = ref({});

const show = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    keywords.value = "";
  });
};

defineExpose({ show });

const search = debounce(async (e) => {
  try {
    const newKeywords = keywords.value.trim();
    if (!newKeywords) {
      forumInfo.value = {};
      return;
    }
    let params = newKeywords.replace(/\s+/g, "|");
    const result = await searchRequest({ keywords: params });
    const forumList = result.data.forumList;

    forumList.forEach((item) => {
      var reg = new RegExp(`(${params})`, "gi");
      var replace = "<span style='color:#FD463E;font-weight:bold'>$1</span>";
      item.title = item.title.replace(reg, replace);
      item.summary = item.summary.replace(reg, replace);
    });

    if (JSON.stringify(forumInfo.value) == JSON.stringify(result.data)) {
      return;
    }

    forumInfo.value = result.data;
  } catch (error) {
    console.log(error);
  }
}, 600);

const close = () => {
  dialogConfig.show = false;
  forumInfo.value = {};
};

const hiddenDialog = (e) => {
  if (e.target.attributes.role) {
    close();
  }
};

const router = useRouter();
const jumpToArticleHandler = (e, forumId) => {
  const attr = e.target.attributes;
  const tagName = e.target.tagName;
  if (
    tagName !== "A" &&
    tagName !== "IMG" &&
    !attr["search-title"] &&
    attr.class?.value.indexOf("label") === -1
  ) {
    router.push("/post/" + forumId);
  }
  close();
};

const route = useRoute();
watch(
  () => route.path,
  (newValue, oldValue) => {
    if (dialogConfig.show && oldValue) {
      close();
    }
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.search-panel {
  .iconfont {
    cursor: pointer;
  }
  .forum-item {
    cursor: pointer;
  }
}
</style>
