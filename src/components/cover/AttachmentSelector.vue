<template>
  <div class="attachment-selector">
    <template v-if="modelValue">
      <div class="filename" :title="modelValue.name">
        {{ formatFilename(modelValue.name) }}
      </div>
      <div class="iconfont icon-del" @click="removeFile"></div>
    </template>
    <el-upload
      v-else
      name="file"
      :show-file-list="false"
      :multiple="false"
      :limit="1"
      :http-request="uploadFile"
    >
      <el-button type="primary">选择文件</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { formatFilename } from "@/utils/utils";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
});

const DEFAULT_IMAGE_PREFIX = "/upload/picture";
const emit = defineEmits(["update:modelValue"]);

const uploadFile = async (uploadRequestOptions) => {
  const file = uploadRequestOptions.file; // File
  emit("update:modelValue", file);
};

const removeFile = () => {
  emit("update:modelValue", null);
};
</script>

<style lang="scss" scoped>
.attachment-selector {
  width: 100%;
  display: flex;
  .filename {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--link);
  }
  .icon-del {
    width: 20px;
    color: var(--icon);
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
