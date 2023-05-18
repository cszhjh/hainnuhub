<template>
  <div class="article-body content-body">
    <el-page-header class="page-header" @back="back">
      <template #content>
        <div class="title">
          <span class="text-large font-600 mr-3">{{ articleInfo.title }}</span>
          <el-tag
            v-if="articleInfo.status === 0"
            type="warning"
            size="small"
            style="margin-left: 5px"
          >
            待审核
          </el-tag>
        </div>
      </template>
    </el-page-header>
    <Skeleton
      :showSkeleton="showSkeleton"
      :dataSource="articleInfo"
      :showPagination="false"
    >
      <template #default="{ data }">
        <div class="article-container">
          <ArticleDetail
            :author="data.author"
            :readCount="data.readCount"
            :content="data.content"
            :markdownContent="data.markdownContent"
            :createTime="data.createTime"
            :userId="getUserId"
            ref="articleDetailRef"
          />
          <ArticleAttachment :attachment="data.attachment" />
          <ArticleComment
            :authorId="data.author?.id"
            @updateCommentCount="updateCommentCount"
          />
          <ArticleQuick
            :goodCount="data.goodCount"
            :commentCount="data.commentCount"
            :showAttachment="data.attachment ? true : false"
            :haveLike="data.haveLike"
          />
          <ArticleToc ref="articleTocRef" />
        </div>
      </template>
    </Skeleton>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, provide, toRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGetters } from "@/hooks";
import { getForumRequest, incrementReadCount } from "@/service/forum/forum";
import Skeleton from "@/components/skeleton/Skeleton";
import ArticleDetail from "./components/ArticleDetail";
import ArticleAttachment from "./components/ArticleAttachment";
import ArticleComment from "./components/ArticleComment";
import ArticleQuick from "./components/ArticleQuick";
import ArticleToc from "./components/ArticleToc";

const route = useRoute();
const router = useRouter();
const { getUserId } = useGetters("user", ["getUserId"]);
const articleInfo = ref({});
const articleId = ref(null);
const articleDetailRef = ref(null);
const articleTocRef = ref(null);
const showSkeleton = ref(true);

const getArticleDetail = async (forumId, userId) => {
  showSkeleton.value = true;
  try {
    await incrementReadCount({ forumId });
    const { data } = await getForumRequest({ forumId, userId });

    articleInfo.value = data;

    nextTick(() => {
      articleDetailRef.value?.imagePreview();
      articleTocRef.value?.makeToc();
    });
  } catch (error) {
    console.log(error);
  } finally {
    showSkeleton.value = false;
  }
};

const back = () => {
  if (!router.options.history.state.back) {
    router.push("/");
    return;
  }
  router.back();
};

// 用户登录后或登录过期后重新加载数据
watch(
  () => [getUserId, route.path, route.params.forumId],
  (newValue, oldValue) => {
    articleId.value = newValue[2];
    if (oldValue && newValue[1] === oldValue[1]) return;
    if (newValue[1].split("/")[1] === "post") {
      getArticleDetail(articleId.value, newValue[0].value);
    }
  },
  {
    immediate: true,
    deep: true
  }
);

// 更新评论数量
const updateCommentCount = () => {
  articleInfo.value.commentCount++;
};

provide("forumId", articleId);
</script>

<style lang="scss" scoped>
.article-body {
  position: relative;
  .page-header {
    width: calc(var(--body-width) - 300px);
    .title {
      display: flex;
      align-items: center;
    }
  }
  .article-container {
    width: calc(var(--body-width) - 300px);
  }
}
</style>
