<template>
  <div class="comment-image">
    <div
      class="comment-image-list"
      v-for="(src, index) in srcList"
      :style="{ maxWidth: '600px', maxHeight: '600px', ...getStyle }"
      :key="src"
    >
      <el-image
        :src="src"
        :zoom-rate="1.2"
        :preview-src-list="srcList"
        :initial-index="0"
        fit="scale-down"
        loading="lazy"
        hide-on-click-modal
      />
      <slot :index="index"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  srcList: {
    type: Array,
    default: () => []
  },
  size: {
    type: Number
  }
});

const getStyle = computed(() => {
  return props.size
    ? { width: props.size + "px", height: props.size + "px" }
    : {};
});
</script>

<style lang="scss" scoped>
.comment-image {
  display: flex;
  flex-wrap: wrap;
  .comment-image-list {
    position: relative;
    margin: 15px 15px 0 0;
    background: #eee;
    ::v-deep(.el-image) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
