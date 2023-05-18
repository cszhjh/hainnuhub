<template>
  <div class="image-viewer">
    <el-image-viewer
      v-if="previewImageIndex !== null"
      :initial-index="previewImageIndex"
      :url-list="imageList"
      hide-on-click-modal
      @close="closeImageViewer"
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  imageList: {
    type: Array
  }
});

const previewImageIndex = ref(null);

const hiddenScrollBar = () => {
  document.body.style.overflow = "hidden";
};

const revertScrollBar = () => {
  document.body.style.overflow = "overlay";
};

const show = (index) => {
  hiddenScrollBar();
  previewImageIndex.value = index;
};

const closeImageViewer = () => {
  revertScrollBar();
  previewImageIndex.value = null;
};
defineExpose({ show });
</script>

<style lang="scss" scoped>
.image-viewer {
  ::v-deep(.el-image-viewer__mask) {
    opacity: 0.7;
  }
}
</style>
