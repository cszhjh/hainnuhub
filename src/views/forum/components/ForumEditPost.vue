<template>
  <div class="edit-post">
    <el-form
      class="post-panel"
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="80px"
      :scroll-to-error="true"
    >
      <div class="post-editor">
        <el-card
          :body-style="{
            padding: '5px',
            flex: '1',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            'flex-direction': editorType ? '' : 'column'
          }"
        >
          <template #header>
            <div class="post-editor-title">
              <span>正文</span>
              <el-popconfirm
                title="切换编辑器会清空正在编辑的内容！"
                width="230"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="toggleEditor"
              >
                <template #reference>
                  <span class="iconfont icon-change toggle-editor">
                    切换为{{
                      editorType === true ? "富文本编辑器" : " Markdown 编辑器"
                    }}
                  </span>
                </template>
              </el-popconfirm>
            </div>
          </template>

          <HtmlEditor v-if="editorType === false" v-model="formData.content" />
          <MarkdownEditor
            v-else-if="editorType === true"
            v-model="formData.markdownContent"
            @htmlContent="setHtmlContent"
            @insertTabs="insertTabs"
          />
        </el-card>
      </div>
      <div class="post-setting">
        <el-card :body-style="{ padding: '5px', paddingRight: '20px' }">
          <template #header>
            <span>文章设置</span>
          </template>
          <el-form-item label="标题" prop="title">
            <el-input
              clearable
              placeholder="请输入标题（最多 30 个字）"
              :minlength="3"
              :maxlength="30"
              v-model="formData.title"
              @keyup.enter="postHandler"
            />
          </el-form-item>
          <el-form-item label="摘要" prop="summary">
            <el-input
              clearable
              type="textarea"
              :rows="5"
              :maxlength="250"
              resize="none"
              placeholder="请输入摘要（最多 250 个字）"
              v-model="formData.summary"
            />
          </el-form-item>
          <el-form-item label="封面">
            <ImageSelector v-model="formData.cover" imageUrlPrefix="" />
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              placeholder="请选择标签（可自建）"
              multiple
              clearable
              collapse-tags
              collapse-tags-tooltip
              filterable
              allow-create
              default-first-option
              :multiple-limit="3"
              value-key="id"
              v-model="formData.labels"
            >
              <el-option
                v-for="label in getLabels"
                :label="label.name"
                :value="label"
                :key="label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="附件">
            <AttachmentSelector v-model="formData.attachment" />
          </el-form-item>
          <el-form-item>
            <Submit
              style="margin-left: 0"
              :isFill="true"
              :message="forumId ? '更新' : '发表'"
              size="default"
              @click="postHandler"
            />
          </el-form-item>
        </el-card>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useGetters } from "@/hooks/useGetters";
import {
  getForumRequest,
  releaseForumRequest,
  updateForumRequest
} from "@/service/forum/forum";
import {
  uploadPicture,
  uploadAttachmentRequest
} from "@/service/upload/upload";
import localCache from "@/utils/cache";
import { rules } from "../config/edit-post-config";

import Submit from "@/components/submit/Submit";
import MarkdownEditor from "@/components/markdown-editor/MarkdownEditor";
import HtmlEditor from "@/components/html-editor/HtmlEditor";
import ImageSelector from "@/components/cover/ImageSelector";
import AttachmentSelector from "@/components/cover/AttachmentSelector";

const store = useStore();
const route = useRoute();
const router = useRouter();
const formParams = {
  title: "",
  labels: [],
  summary: "",
  content: "",
  markdownContent: "",
  cover: {
    imageUrl: ""
  },
  attachment: null
};
const formData = ref({ ...formParams });
const formRef = ref(null);

const forumId = ref(null);
const { getLabels } = useGetters("label", ["getLabels"]);
const { getUserId } = useGetters("user", ["getUserId"]);

// 编辑器类型
// true：markdown
// false：富文本
const editorType = ref(null);

const getArticleDetail = async () => {
  try {
    if (forumId.value) {
      // 修改文章
      const { data: articleDetail } = await getForumRequest({
        forumId: forumId.value,
        userId: getUserId.value
      });

      if (articleDetail.author.id !== getUserId.value) {
        ElMessageBox.alert("你没有编辑这篇文章的权限！", "错误", {
          "show-close": false,
          callback: (action) => {
            router.back(-1);
          }
        });
        throw Error("你没有编辑这篇文章的权限！");
      }

      // 设置编辑器
      editorType.value = Boolean(articleDetail.editorType);
      articleDetail.cover = {
        imageUrl: articleDetail.cover || ""
      };
      formData.value = articleDetail;
    } else {
      // 发帖
      editorType.value = localCache.getCache("editor-type") || false;
    }
  } catch (error) {
    if (error?.response?.status === 404) {
      router.push("/");
    }
  }
};

// markdown 编辑后将对应的富文本内容保存
const setHtmlContent = (htmlContent) => {
  formData.value.content = htmlContent;
};

// 提交
const postHandler = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    const params = {
      ...formData.value,
      forumId: forumId.value,
      editorType: editorType.value
    };

    const contentText = params.content.replace(/<(?!img).*?>/g, "");
    if (!contentText) {
      ElMessage.error("正文部分还没有内容！");
      return;
    }

    let result;
    try {
      if (!params.forumId) {
        result = await releaseForumRequest(params);
      } else {
        result = await updateForumRequest(params);
      }
      store.commit("label/addLabels", result.data.newLabels);
    } catch (error) {
      console.log(error);
      return;
    }

    if (params.cover instanceof File) {
      try {
        await uploadPicture({
          forumId: result.data.forumId,
          picture: params.cover,
          cover: 1
        });
      } catch (error) {
        console.log(error);
        ElMessage.error("封面上传失败，请稍后重试！");
        return;
      }
    }

    if (params.attachment instanceof File) {
      // 更新时，没有上传附件：proxy | null，上传后为 File
      try {
        uploadAttachmentRequest({
          forumId: result.data.forumId,
          attachment: params.attachment
        });
      } catch (error) {
        ElMessage.error("附件上传失败，请稍后重试！");
        return;
      }
    }

    ElMessage.success(`${params.forumId ? "更新" : "发表"}成功！`);
    router.push(`/post/${result.data.forumId}`);
  });
};

// markdwon编辑器插入制表符
const insertTabs = (position) => {
  const content = formData.value.markdownContent;
  formData.value.markdownContent =
    content.substring(0, position) + "  " + content.substring(position);
};

const toggleEditor = () => {
  editorType.value = !editorType.value;
  formData.value.content = "";
  formData.value.markdownContent = "";
  localCache.setCache("editor-type", editorType.value);
};

watch(
  () => route.path,
  (newValue) => {
    const path = newValue.split("/")[1];
    if (path === "newPost") {
      formData.value = { ...formParams };
      forumId.value = null;
    } else if (path === "editPost") {
      forumId.value = route.params.forumId;
    }
    getArticleDetail();
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.edit-post {
  height: calc(100vh - 60px);
  .post-editor {
    ::v-deep(.el-card) {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .post-editor-title {
      display: flex;
      justify-content: space-between;
      .toggle-editor {
        color: var(--link);
        cursor: pointer;
        font-size: 13px;
      }
    }
  }

  .post-panel {
    display: flex;
    height: 100%;
    .post-editor {
      flex: 1;
      max-width: calc(100vw - 460px);
    }
    .post-setting {
      min-width: 450px;
      margin-left: 10px;
    }
  }
}
</style>
