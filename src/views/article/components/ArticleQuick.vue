<template>
  <div class="quick-panel">
    <el-badge :value="currentGoodCount" type="info" :hidden="!currentGoodCount">
      <div class="quick-item" @click="doLikeHandler">
        <span
          :class="['iconfont icon-good', currentHaveLike ? 'have-like' : '']"
        ></span>
      </div>
    </el-badge>
    <el-badge :value="commentCount" type="info" :hidden="!commentCount">
      <div class="quick-item" @click="jumpPosition('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>
    <div
      v-if="showAttachment"
      class="quick-item"
      @click="jumpPosition('view-attachment')"
    >
      <span class="iconfont icon-attachment"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import { useStore } from "vuex";
import { useState } from "@/hooks";
import { doLikeRequest } from "@/service/forum/forum";
import { throttle } from "@/utils/utils";
import emitter from "@/utils/eventbus";

const props = defineProps({
  goodCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  showAttachment: {
    type: Boolean,
    default: true
  },
  haveLike: {
    type: Boolean,
    default: false
  }
});
const forumId = inject("forumId");

const store = useStore();
const { loginState } = useState("user", ["loginState"]);
const currentHaveLike = ref(props.haveLike);
const currentGoodCount = ref(props.goodCount);

const doLikeHandler = throttle(async () => {
  try {
    await doLikeRequest({ forumId: forumId.value });

    // 先展示假数据，实际数据库已更新，不需要再次请求数据，以免页面重新加载
    currentHaveLike.value = true;
    currentGoodCount.value++;
    // }
  } catch (error) {
    //
  }
}, 2000);

const jumpPosition = (domId) => {
  const dom = document.querySelector("#" + domId);
  window.scrollTo({
    top: dom.offsetTop + 20,
    behavior: "smooth"
  });
};
</script>

<style lang="scss" scoped>
.quick-panel {
  position: fixed;
  top: 200px;
  left: calc((100vw - var(--body-width)) / 2 - 110px);
  width: 50px;
  text-align: center;

  ::v-deep(.el-badge__content.is-fixed) {
    top: 5px;
    right: 15px;
  }

  .quick-item {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 30px;
    cursor: pointer;
    .iconfont {
      font-size: 22px;
      color: var(--text);
    }
    .have-like {
      color: red;
    }
  }
  .quick-item:last-child {
    margin-bottom: 0;
  }
}
</style>
