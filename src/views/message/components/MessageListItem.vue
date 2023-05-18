<template>
  <div class="message-item" @click="(e) => jumpToForum(e, forumId)">
    <!-- 系统消息 -->
    <template v-if="messageType === sys.value">
      <div class="message-content">
        <div class="system-content">
          <span v-if="commentId === null" v-html="messageContent"></span>
          <template v-else>
            <div class="title">
              <router-link class="a-link-anim" :to="`/user/${sendUserId}`"
                >@{{ sendUsername }}
              </router-link>
              在帖子
              <router-link class="a-link-anim" :to="`/post/${forumId}`"
                >《 {{ forumTitle }} 》</router-link
              >
              中{{ messageContent }}了我的评论
            </div>
            <div class="reply-content">
              {{ getUsername }} :
              <span v-html="originCommentContent" class="text"></span>
            </div>
          </template>
        </div>
        <div class="create-time" v-format-time="createTime"></div>
      </div>
    </template>
    <template v-else-if="messageType === reply.value">
      <Avatar :userId="sendUserId" />
      <div class="message-content">
        <div class="title">
          <router-link class="a-link-anim" :to="`/user/${sendUserId}`"
            >@{{ sendUsername }}
          </router-link>
          {{ commentId === null ? "对我的帖子" : "在帖子" }}
          <router-link class="a-link-anim" :to="`/post/${forumId}`"
            >《 {{ forumTitle }} 》</router-link
          >
          {{ commentId === null ? "发表了评论" : "中回复了我的评论" }}
        </div>
        <div class="reply-content">
          <template v-if="commentId !== null">
            回复
            <router-link class="a-link-anim" :to="`/user/${receivedUserId}`"
              >@{{ getUsername }}</router-link
            >
            :
          </template>
          <span v-html="messageContent" class="text"></span>
          <div v-if="commentId !== null" class="origin-comment-content">
            {{ getUsername }} :
            <span v-html="originCommentContent" class="text"></span>
          </div>
        </div>
        <div class="create-time" v-format-time="createTime"></div>
      </div>
    </template>
    <template
      v-else-if="messageType === forum.value || messageType === comment.value"
    >
      <Avatar :userId="sendUserId" />
      <div class="message-content">
        <div class="title">
          <router-link class="a-link-anim" :to="`/user/${sendUserId}`"
            >@{{ sendUsername }}
          </router-link>
          <span v-if="messageType === forum.value"> 赞了我的帖子</span>
          <span v-else> 在帖子</span>
          <router-link class="a-link-anim" :to="`/post/${forumId}`"
            >《 {{ forumTitle }} 》</router-link
          >
          {{ messageType === forum.value ? "" : "中赞了我的评论" }}
        </div>
        <div class="reply-content" v-if="messageType === comment.value">
          {{ getUsername }} :
          <span v-html="originCommentContent" class="text"></span>
        </div>
        <div class="create-time" v-format-time="createTime"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import messageTypes from "@/constants/message-types";
import { useRouter } from "vue-router";
import { useGetters } from "@/hooks";

const props = defineProps({
  receivedUserId: {
    type: Number
  },
  forumId: {
    type: Number
  },
  forumTitle: {
    type: String
  },
  commentId: {
    type: Number
  },
  originCommentContent: {
    type: String
  },
  sendUserId: {
    type: Number
  },
  sendUsername: {
    type: String
  },
  messageType: {
    type: Number
  },
  messageContent: {
    type: String
  },
  createTime: {
    type: String
  }
});

const router = useRouter();
const { getUsername } = useGetters("user", ["getUsername"]);
const { sys, reply, forum, comment } = messageTypes;

const jumpToForum = (e, forumId) => {
  if (forumId && e.target.tagName !== "A" && e.target.tagName !== "IMG") {
    router.push(`/post/${forumId}`);
  }
};
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  padding: 20px;
  padding-left: 0;
  &:hover {
    background: #fffbfb;
  }
  cursor: pointer;
  .message-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .system-content {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .create-time {
      color: #999;
      font-size: 12px;
    }
    .reply-content {
      border-left: 2px solid #11a8f4;
      padding-left: 5px;
      margin: 10px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .origin-comment-content {
        font-size: 12px;
        color: #999;
        margin-top: 10px;
        padding-left: 5px;
      }
    }
    .title {
      .a-link-anim {
        font-weight: bold;
        color: #222;
      }
    }
    .text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
