<template>
  <div class="cover-upload">
    <el-upload
      name="file"
      accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP,.webp,.WEBP"
      :show-file-list="false"
      :multiple="false"
      :http-request="uploadImage"
    >
      <div class="cover-upload-button">
        <template v-if="localFile">
          <img :src="localFile" alt="" />
        </template>
        <template v-else-if="modelValue.imageUrl">
          <img :src="getImageUrl" alt="" />
        </template>
        <template v-else>
          <i class="iconfont icon-add"></i>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {}
  },
  imageUrlPrefix: {
    type: String
  }
});

const DEFAULT_IMAGE_PREFIX = "/upload/picture";
const emit = defineEmits(["update:modelValue"]);

const getImageUrl = computed(() => {
  const imageUrlPrefix = props.imageUrlPrefix;
  const prefix =
    imageUrlPrefix === undefined ? DEFAULT_IMAGE_PREFIX : imageUrlPrefix;
  return prefix + props.modelValue.imageUrl;
});

const localFile = ref(null);
const uploadImage = async (uploadRequestOptions) => {
  const file = uploadRequestOptions.file; // File
  const image = new FileReader();
  image.readAsDataURL(file);
  image.onload = ({ target }) => {
    localFile.value = target.result;
  };
  emit("update:modelValue", file);
};
</script>

<style lang="scss" scoped>
.cover-upload {
  width: 150px;
  height: 150px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDkzNzZFN0RDODhFMTFFOEExOUJFNkQ0MTNFM0Q2OTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDkzNzZFN0VDODhFMTFFOEExOUJFNkQ0MTNFM0Q2OTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEOTM3NkU3QkM4OEUxMUU4QTE5QkU2RDQxM0UzRDY5NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEOTM3NkU3Q0M4OEUxMUU4QTE5QkU2RDQxM0UzRDY5NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PktroGEAAAAoSURBVHjaYvz06RMDDPDy8sLZTAw4AOkSjP///4dzPn/+TAs7AAIMAG56COJosoI3AAAAAElFTkSuQmCC");
  .cover-upload-button {
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .iconfont {
      font-size: 50px;
      color: #ddd;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
