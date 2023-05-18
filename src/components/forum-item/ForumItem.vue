<template>
  <div class="forum-item">
    <div class="forum-item-inner">
      <div class="forum-body">
        <div class="user-info">
          <Avatar :userId="forum.author.id" :size="30" />
          <router-link
            :to="'/user/' + forum.author.id"
            class="info-link a-link-anim"
          >
            {{ forum.author.username }}
          </router-link>
          <el-divider direction="vertical" />
          <div class="post-time" v-format-time="forum.createTime"></div>
          <template v-if="forum.labelCount > 0">
            <div
              v-for="label in forum.labels"
              @click="jumpToForum(label.id)"
              :key="label"
            >
              <el-divider direction="vertical" />
              <span class="a-link-anim label">{{ label.name }}</span>
            </div>
          </template>
        </div>
        <router-link :to="`/post/${forum.id}`" class="title">
          <el-tag
            v-if="forum.status == 0"
            type="warning"
            size="small"
            style="margin-right: 5px"
          >
            待审核
          </el-tag>
          <span v-if="htmlTitle" v-html="forum.title" search-title></span>
          <span v-else>{{ forum.title }}</span>
        </router-link>
        <div class="forum-summary" v-if="htmlTitle">
          <span v-if="htmlTitle" v-html="forum.summary"></span>
          <span v-else>{{ forum.summary }}</span>
        </div>
        <div class="forum-info">
          <span class="iconfont icon-eye-solid">
            {{ forum.readCount || "阅读" }}
          </span>
          <span class="iconfont icon-good">
            {{ forum.goodCount || "点赞" }}
          </span>
          <span class="iconfont icon-comment">
            {{ forum.commentCount || "评论" }}
          </span>
          <span
            v-if="showEdit"
            class="iconfont icon-edit"
            @click="editArticle(forum.id)"
            >编辑</span
          >
        </div>
      </div>
      <Cover v-if="showCover" :cover="forum.cover" :size="100" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import emitter from "@/utils/eventbus";

import Avatar from "@/components/avatar/Avatar";
import Cover from "@/components/cover/Cover";

const props = defineProps({
  forum: {
    type: Object
  },
  showEdit: {
    type: Boolean,
    default: false
  },
  showCover: {
    type: Boolean,
    default: true
  },
  htmlTitle: {
    type: Boolean,
    default: false
  }
});
const router = useRouter();

const jumpToForum = (labelId) => {
  router.push(`/forum/${labelId}`);
};

const editArticle = (articleId) => {
  router.push(`/editPost/${articleId}`);
};
</script>

<style lang="scss" scoped>
.forum-item {
  padding: 5px 10px 0 10px;
  .forum-item-inner {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    display: flex;
    .forum-body {
      flex: 1;
      .user-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #4e5969;
        .info-link {
          margin-left: 5px;
        }
      }
      .title {
        display: inline-block;
        width: 100%;
        color: #4a4a4a;
        font-weight: bold;
        font-size: 16px;
        margin: 10px 0;
      }
      .forum-summary {
        font-size: 14px;
        color: #6f767d;
      }
      .forum-info {
        display: flex;
        margin-top: 10px;
        align-items: center;
        font-size: 13px;
        .iconfont {
          color: #86909c;
          margin-right: 25px;
          font-size: 14px;
          &::before {
            padding-right: 3px;
          }
        }
        .icon-edit {
          cursor: pointer;
          color: var(--link);
        }
      }
    }
  }
}
.forum-item:hover {
  background: #fffbfb;
}
</style>
