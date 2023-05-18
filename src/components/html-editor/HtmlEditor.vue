<template>
  <div class="html-editor" style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="overflow-y: hidden"
      :model-value="modelValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="change"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { useStore } from "vuex";
import localCache from "@/utils/cache";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});

const store = useStore();
const mode = ref("default");
const editorRef = shallowRef();

const toolbarConfig = {
  excludeKeys: ["group-video"]
};

const editorConfig = {
  placeholder: "请输入正文",
  excludeKeys: ["group-video"],
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 3 * 1024 * 1024,
      server: "/api/upload/picture",
      fieldName: "picture",
      allowedFileTypes: ["image/*"],
      base64LimitSize: 10 * 1024, // 10MB
      headers: {
        Authorization: `Bearer ${localCache.getCache("token")}`
      },
      customInsert(responseData, insertFn) {
        if (responseData.status == 200) {
          insertFn(responseData.data[0], "", "");
        } else {
          ElMessage.error("图片上传失败，请稍后重试！");
        }
      }
    }
  }
};

const emit = defineEmits(["update:modelValue"]);
const change = (editor) => {
  emit("update:modelValue", editor.getHtml());
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor;
};
</script>

<style lang="scss" scoped>
.html-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ddd;
  overflow: hidden;
  &.w-e-full-screen-container {
    z-index: 1001;
  }
}
</style>
