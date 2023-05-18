<template>
  <div v-if="forumId" id="view-comment" class="comment-panel">
    <div class="comment-body">
      <div class="comment-title">
        <div class="title">
          评论
          <span class="count">{{ commentListInfo.commentCount || 0 }}</span>
        </div>
        <div class="tab">
          <span
            :class="['a-link-anim', orderType === 0 ? 'active' : '']"
            @click="toggleOrderType(0)"
            >最热</span
          >
          <el-divider direction="vertical" />
          <span
            :class="['a-link-anim', orderType === 1 ? 'active' : '']"
            @click="toggleOrderType(1)"
            >最新</span
          >
        </div>
      </div>
      <ArticleCommentForm
        class="comment-form"
        :avatarSize="50"
        :userId="getUserId"
        @releaseCommentFinish="releaseCommentFinish"
      />
      <div class="comment-list">
        <Skeleton
          :count="2"
          v-bind="getCommentListInfo"
          :showPagination="false"
          :infiniteScroll="true"
        >
          <template #default="{ data }">
            <ArticleCommentList
              :commentData="data"
              :authorId="authorId"
              :loginUserId="getUserId"
              @hiddenAllReply="hiddenAllReply"
              @showReply="showReply"
              @replyCommentFinish="replyCommentFinish"
              @reloadCommentData="loadComment"
            />
          </template>
        </Skeleton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useGetters } from "@/hooks";
import { getCommentRequest } from "@/service/comment/comment";

import Skeleton from "@/components/skeleton/Skeleton";
import ArticleCommentForm from "./ArticleCommentForm";
import ArticleCommentList from "./ArticleCommentList";

const props = defineProps({
  authorId: {
    type: Number
  }
});
const forumId = inject("forumId");

const { getUserId } = useGetters("user", ["getUserId"]);
const commentListInfo = ref({});

const currentPageNo = ref(1);

const getCommentListInfo = computed(() => {
  const { commentList, commentCount } = commentListInfo?.value ?? {};
  return {
    dataSource: commentList,
    dataTotal: commentCount
  };
});

// 评论列表
const loadComment = async () => {
  const userId = getUserId.value;
  const result = await getCommentRequest({
    userId,
    forumId: forumId.value,
    type: orderType.value
  });
  commentListInfo.value = result.data;
};

// 隐藏所有回复框
const hiddenAllReply = () => {
  commentListInfo.value.commentList.forEach((item) => {
    item.showReply = false;
  });
};

// 显示单个回复框
const showReply = (commentData, state) => {
  commentData.showReply = state;
};

// 一级评论完成
const emit = defineEmits(["updateCommentCount"]);
const releaseCommentFinish = (commentInfo) => {
  commentInfo.children = [];
  commentListInfo.value.commentList.unshift(commentInfo);
  commentListInfo.value.commentCount++;
  emit("updateCommentCount");
  hiddenAllReply();
};

// 回复评论完成
const replyCommentFinish = (commentInfo, commentId) => {
  try {
    console.log(commentListInfo.value.commentList);
    const firstComment = commentListInfo.value.commentList.find((item) => {
      return item.id === commentId;
    });
    firstComment.children.push(commentInfo);
    commentListInfo.value.commentCount++;
    emit("updateCommentCount");
    hiddenAllReply();
  } catch (error) {
    console.log(error);
  }
};

const orderType = ref(0);
const toggleOrderType = (type) => {
  if (orderType.value !== type) {
    orderType.value = type;
    commentListInfo.value = [];
    loadComment();
  }
};

loadComment();
</script>

<style lang="scss" scoped>
.comment-panel {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  .comment-body {
    .comment-title {
      display: flex;
      align-items: center;
      .title {
        display: flex;
        align-items: flex-end;
        font-size: 24px;
        .count {
          font-size: 14px;
          padding: 0 10px;
          color: var(--text2);
        }
      }
      .tab {
        cursor: pointer;
        margin-left: 25px;
        color: var(--text2);
        .active {
          color: var(--link);
        }
      }
    }
  }
  .comment-form {
    margin: 20px 0;
  }
}
</style>
