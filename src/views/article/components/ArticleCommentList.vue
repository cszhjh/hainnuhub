<template>
  <div class="comment-item">
    <Avatar :userId="commentData.user.id" :size="40" />
    <div class="comment-info">
      <div class="user-info">
        <span
          class="username a-link-anim"
          @click="jumpToUserInfo(commentData.user.id)"
        >
          {{ commentData.user.username }}
        </span>
        <el-tag
          v-if="authorId === commentData.user.id"
          type="success"
          size="small"
        >
          作者
        </el-tag>
      </div>

      <div class="comment-content">
        <div>
          <el-tag
            class="tag-sticky-top"
            v-if="commentData.topType === 1"
            type="danger"
          >
            置顶
          </el-tag>
          <span v-html="commentData.content"></span>
        </div>
        <ArticleCommentImage
          v-if="commentData.images"
          :srcList="commentData.images"
        />
      </div>

      <div class="option-panel">
        <div class="time">
          <span v-format-time="commentData.createTime"></span>
        </div>
        <div
          :class="[
            'iconfont icon-good',
            commentData.haveLike ? 'have-like' : ''
          ]"
          @click="doLikeHandler(commentData)"
        >
          {{ commentData.goodCount || "点赞" }}
        </div>
        <div
          class="iconfont icon-comment"
          @click="replyPanelClick(commentData)"
        >
          回复
        </div>
        <el-dropdown v-if="authorId === loginUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="top-comment" @click="stickyTop">
                {{ commentData.topType === 0 ? "置顶" : "取消置顶" }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div v-if="commentData.children" class="comment-sub-list">
        <div
          v-for="sub in commentData.children"
          class="comment-sub-item"
          :key="sub"
        >
          <Avatar :userId="sub.user.id" :size="30" />
          <div class="comment-sub-info">
            <div class="user-info">
              <span
                class="username a-link-anim"
                @click="jumpToUserInfo(sub.user.id)"
              >
                {{ sub.user.username }}
              </span>
              <el-tag
                v-if="authorId === sub.user.id"
                type="success"
                size="small"
                class="author-tag"
              >
                作者
              </el-tag>
              <template v-if="sub.commentId !== commentData.id">
                <span class="reply-name">回复</span>
                <span @click="jumpToUserInfo(sub.replyUserId)" class="a-link"
                  >@{{ sub.replyUsername }} :
                </span>
              </template>
              <span class="sub-content" v-html="sub.content"></span>
            </div>
            <div class="option-panel">
              <div class="time">
                <span v-format-time="sub.createTime"></span>
              </div>
              <div
                :class="['iconfont icon-good', sub.haveLike ? 'have-like' : '']"
                @click="doLikeHandler(sub)"
              >
                {{ sub.goodCount || "点赞" }}
              </div>
              <div
                class="iconfont icon-comment"
                @click="replyPanelClick(sub, 1)"
              >
                回复
              </div>
            </div>
          </div>
        </div>
      </div>

      <ArticleCommentForm
        v-if="commentData.showReply"
        class="reply-comment-form"
        :userId="loginUserId"
        :placeholder="getReplyUsername"
        :commentId="commentData.id"
        :replyCommentId="currentReplyCommentId"
        :isReply="true"
        @replyCommentFinish="replyCommentFinish"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { doLikeRequest } from "@/service/comment/comment";
import { getTimestamp, throttle } from "@/utils/utils";
import { updateTopType } from "@/service/comment/comment";

import Avatar from "@/components/avatar/Avatar";
import ArticleCommentForm from "./ArticleCommentForm";
import ArticleCommentImage from "./ArticleCommentImage";

const props = defineProps({
  commentData: {
    type: Object,
    default: () => {}
  },
  authorId: {
    type: Number
  },
  loginUserId: {
    type: Number
  }
});

const forumId = inject("forumId");
const router = useRouter();
const emit = defineEmits([
  "hiddenAllReply",
  "showReply",
  "replyCommentFinish",
  "reloadCommentData"
]);
const replyUserId = ref(null);
const currentReplyUsername = ref();
const currentReplyCommentId = ref();

const getReplyUsername = computed(() => {
  return `回复 @${currentReplyUsername.value} : `;
});

// 显示评论输入框
const replyPanelClick = (currentCommentData, type) => {
  let haveCloseReply = currentCommentData.showReply ?? false;
  currentReplyUsername.value = currentCommentData.user.username;
  currentReplyCommentId.value = currentCommentData.id;
  emit("hiddenAllReply");
  if (type) {
    emit("showReply", props.commentData, true);
  } else {
    emit("showReply", props.commentData, !haveCloseReply);
  }
};

// 回复评论完成
const replyCommentFinish = (commentInfo, commentId) => {
  emit("replyCommentFinish", commentInfo, commentId);
};

const doLikeHandler = throttle(async (currentCommentData) => {
  try {
    const result = await doLikeRequest({
      forumId: forumId.value,
      commentId: currentCommentData.id
    });

    // 先展示假数据，实际数据库已更新，不需要再次请求数据，以免页面重新加载
    // currentHaveLike.value = true;
    currentCommentData.goodCount = result.data.goodCount;
    currentCommentData.haveLike = result.data.haveLike;
    // }
  } catch (error) {
    //
  }
}, 2000);

const jumpToUserInfo = (userId) => {
  router.push(`/user/${userId}`);
};

const stickyTop = async () => {
  try {
    const { id: commentId, topType: type, forumId } = props.commentData;
    await updateTopType({
      forumId,
      commentId,
      type: !type
    });
    ElMessage.success(type ? "取消置顶成功！" : "置顶成功！");
    emit("reloadCommentData");
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding-top: 15px;
  .comment-info {
    flex: 1;
    margin-left: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
    .user-info {
      .username {
        font-size: 14px;
        color: var(--text);
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .comment-content {
      margin-top: 10px;
      font-size: 16px;
      line-height: 22px;
      .tag-sticky-top {
        margin-right: 5px;
        font-size: 12px;
        height: 18px;
        background: #fff;
        padding: 0 5px;
      }
    }
    .option-panel {
      display: flex;
      margin-top: 5px;
      font-size: 13px;
      color: var(--text);
      align-items: center;
      .time {
        margin-right: 20px;
      }
      .iconfont {
        margin-right: 15px;
        font-size: 14px;
        color: var(--icon);
        outline: none;
        cursor: pointer;
        &::before {
          margin-right: 3px;
        }
      }
      .have-like {
        color: var(--link);
      }
    }
    .comment-sub-list {
      margin-top: 10px;
      .comment-sub-item {
        display: flex;
        margin: 20px 0;
        font-size: 14px;
        .comment-sub-info {
          margin-left: 5px;
          .user-info {
            .author-tag {
              margin-right: 10px;
            }
            .reply-name {
              margin: 0 5px;
            }
            .sub-content {
              font-size: 16px;
            }
          }
        }
      }
    }
    .reply-comment-form {
      margin-top: 15px;
    }
  }
}
</style>
