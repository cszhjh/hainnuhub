<template>
  <div class="article-toc">
    <div class="toc-container">
      <div class="toc-title">目录</div>
      <div class="toc-list">
        <template v-if="tocArray.length === 0">
          <div class="no-toc">未解析到目录</div>
        </template>
        <template v-else>
          <div v-for="toc in tocArray" :key="toc">
            <span
              :class="['toc-item', toc.id == anchorId ? 'active' : '']"
              :style="{ 'padding-left': toc.level * 15 + 'px' }"
              @click="jumpToAnchor(toc.offsetTop)"
              >{{ toc.title }}</span
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from "vue";

const tocArray = ref([]);

const makeToc = () => {
  nextTick(() => {
    const tocTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
    const contentEl = document.querySelector(
      "#article-content .vuepress-markdown-body"
    );
    const children = contentEl.children;
    let count = 1;

    for (let item of children) {
      let tagName = item.tagName;
      if (!tocTags.includes(tagName)) continue;

      const id = "toc" + count++;
      item.setAttribute("id", id);
      tocArray.value.push({
        id,
        title: item.innerText,
        level: Number.parseInt(tagName.substring(1)),
        offsetTop: item.offsetTop + 20
      });
    }
  });
};

const jumpToAnchor = (offsetTop) => {
  window.scrollTo({
    top: offsetTop,
    behavior: "smooth"
  });
};

const getScrollTop = () => {
  let scrollTop =
    document.scrollTop || window.scrollY || document.body.scrollTop;
  return scrollTop;
};

const anchorId = ref("toc1");
const listenerScroll = () => {
  const currentScrollTop = getScrollTop();
  const length = tocArray.value.length;
  tocArray.value.some((item, index) => {
    if (currentScrollTop < tocArray.value[0].offsetTop) {
      anchorId.value = tocArray.value[0].id;
      return true;
    } else if (
      (index < length - 1 &&
        currentScrollTop >= tocArray.value[index].offsetTop &&
        currentScrollTop < tocArray.value[index + 1].offsetTop) ||
      index == length - 1
    ) {
      anchorId.value = item.id;
      return true;
    }
  });
};

onMounted(() => {
  window.addEventListener("scroll", listenerScroll, false);
});

onUnmounted(() => {
  window.removeEventListener("scroll", listenerScroll, false);
});

defineExpose({
  makeToc
});
</script>

<style lang="scss" scoped>
.article-toc {
  position: absolute;
  top: 5px;
  right: 0;
  width: 285px;
  .toc-container {
    position: fixed;
    width: 285px;
    background: #fff;
    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }
    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;
      .no-toc {
        text-align: center;
        color: #5f5d5d;
        line-height: 40px;
        font-size: 13px;
      }
      .toc-item {
        cursor: pointer;
        display: block;
        line-height: 35px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555666;
        border-radius: 3px;
        font-size: 14px;
        border-left: 2px solid #fff;
        &:hover {
          background: #eee;
        }
        &.active {
          border-left: 2px solid #6ca1f7;
          border-radius: 0 3px 3px 0;
        }
      }
    }
  }
}
</style>
