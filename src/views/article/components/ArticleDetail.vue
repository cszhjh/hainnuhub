<template>
  <div class="article-detail">
    <div class="user-info">
      <Avatar :userId="author?.id" :size="50" />
      <div class="user-info-detail">
        <router-link :to="`/user/${author.id}`" class="username a-link-anim">
          {{ author.username }}
        </router-link>
        <div class="extras">
          <span v-format-time="createTime"></span>
          <span class="iconfont icon-eye-solid">
            {{ readCount || "阅读" }}
          </span>
          <router-link
            v-if="userId == author.id"
            :to="'/editPost/' + forumId"
            class="edit-link"
          >
            <span class="iconfont icon-edit">编辑</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="detail">
      <VMdPreviewHtml
        id="article-content"
        :html="content"
        preview-class="vuepress-markdown-body"
      />
    </div>
    <Image ref="imageRef" :imageList="previewImageList" />
  </div>
</template>

<script setup>
import { ref, nextTick, inject } from "vue";
import { useGetters } from "@/hooks";

import Avatar from "@/components/avatar/Avatar";
import Image from "@/components/image/Image";
import VMdPreviewHtml from "@kangc/v-md-editor/lib/preview-html";
import "@kangc/v-md-editor/lib/style/preview-html.css";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

const props = defineProps({
  author: {
    type: Object,
    default: () => {}
  },
  createTime: {
    type: String,
    default: ""
  },
  readCount: {
    type: Number,
    default: 0
  },
  content: {
    type: String,
    default: ""
  },
  userId: {
    type: Number
  }
});

const forumId = inject("forumId");
const imageRef = ref(null);
const previewImageList = ref([]);

// 图片预览
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
      .querySelector("#article-content")
      ?.querySelectorAll("img");
    const imageList = [];

    imageNodeList?.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageRef.value.show(index);
      });
    });
    previewImageList.value = imageList;
  });
};

defineExpose({
  imagePreview
});
</script>

<style lang="scss" scoped>
.article-detail {
  background: #fff;
  padding: 10px;
  .user-info {
    display: flex;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    .user-info-detail {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
    }
    .username {
      color: #4e5969;
      font-size: 16px;
    }
    .extras {
      color: var(--text);
      .iconfont {
        margin-left: 10px;
        color: #9f9f9f;
        &::before {
          margin-right: 3px;
        }
      }
      .edit-link {
        .iconfont {
          color: var(--link);
          font-size: 14px;
        }
      }
    }
  }
  .detail {
    line-height: 22px;
    padding: 10px;
    a {
      text-decoration: none;
      color: var(--link);
    }
    img {
      max-width: 90%;
      cursor: pointer;
    }
  }
}
</style>
