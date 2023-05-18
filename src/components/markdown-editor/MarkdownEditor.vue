<template>
  <VMdEditor
    placeholder="请输入正文"
    :model-value="modelValue"
    :disabled-menus="[]"
    :disabled-level="[1, 2, 3, 4, 5, 6]"
    @upload-image="uploadImageHandler"
    @change="change"
  />
</template>

<script setup>
import { onMounted } from "vue";
import { uploadPicture } from "@/service/upload/upload";

import "@kangc/v-md-editor/lib/style/base-editor.css";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import VMdEditor from "@kangc/v-md-editor";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import Prism from "prismjs";

VMdEditor.use(vuepressTheme, {
  Prism,
  codeHighlightExtensionMap: {
    vue: "html"
  }
});

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "htmlContent", "insertTabs"]);

onMounted(() => {
  const textareaEl = document.querySelector(".v-md-textarea-editor > textarea");
  textareaEl.addEventListener("keydown", (event) => {
    if (event.key == "Tab") {
      const position = event.target.selectionStart;
      emit("insertTabs", position);
      setTimeout(() => {
        textareaEl.setSelectionRange(position + 2, position + 2);
      }, 0);
    }
  });
});

const change = (markdownContent, htmlContent) => {
  // emit 双向绑定
  emit("update:modelValue", markdownContent);

  emit("htmlContent", htmlContent);
};

const uploadImageHandler = async (event, insertImage, files) => {
  try {
    const { data } = await uploadPicture({ picture: files });
    for (let url of data) {
      insertImage({
        url,
        desc: "图片"
      });
    }
  } catch (error) {
    ElMessage.error("图片上传失败，请稍后重试！");
  }
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.v-md-editor {
  .v-md-editor__right-area {
    .v-md-editor__main {
      .scrollbar {
        .scrollbar__wrap {
          textarea {
            min-height: calc(100vh - 60px - 55px - 10px - 41px + 31px);
          }
        }
      }
    }
  }
}
</style>
