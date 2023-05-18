<template>
  <div class="comment-form">
    <div
      class="comment-form-panel"
      :class="{ 'comment-form-focus': commentFocus }"
    >
      <div class="user-avatar" :style="{ width: avatarSize + 'px' }">
        <Avatar
          :size="avatarSize"
          :userId="userId"
          :clickLink="false"
          :showNoLogin="true"
        />
      </div>
      <div class="comment-form-input">
        <el-form :model="formData" ref="formRef">
          <el-form-item prop="content">
            <el-input
              class="comment-textarea"
              :input-style="commentFocus ? 'line-height: 1.5;' : ''"
              type="textarea"
              :maxlength="150"
              :placeholder="placeholder"
              v-model="formData.content"
              resize="none"
              @blur="inputBlur"
              @focus="inputFocus"
              ref="inputRef"
            />
          </el-form-item>
        </el-form>
      </div>
      <Submit
        message="发表"
        class="send"
        ref="submitRef"
        @click="sendComment"
      />
    </div>
    <div class="widget" :style="{ marginLeft: avatarSize + 15 + 'px' }">
      <div class="widget-icon">
        <div class="emoji-button" @mousedown="emojiButtonClick">
          <i class="icon-emoji">
            <img :src="emoji" alt="" />
          </i>
          <EmojiPicker v-show="showEmojiPicker" @emojiClick="emojiClick" />
        </div>
        <div class="insert-image" v-if="!isReply" @click="selectImage">
          <el-upload
            name="file"
            :show-file-list="false"
            :http-request="selectImage"
            :multiple="true"
            accept=".png,.Png,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP,.webp,.WEBP"
          >
            <i class="iconfont icon-image"></i>
          </el-upload>
        </div>
      </div>
      <div class="pre-image-list" v-if="!isReply && commentImageList.length">
        <ArticleCommentImage :srcList="commentImageList" :size="80">
          <template #default="{ index }">
            <i
              class="iconfont icon-remove"
              @click="removeCommentImage(index)"
            />
          </template>
        </ArticleCommentImage>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, computed, inject } from "vue";
import {
  releaseCommentRequest,
  replyCommentRequest
} from "@/service/comment/comment";
import { uploadPicture } from "@/service/upload/upload";

import Avatar from "@/components/avatar/Avatar";
import Submit from "@/components/submit/Submit";
import ArticleCommentImage from "./ArticleCommentImage";
import EmojiPicker from "@/components/emoji-picker/EmojiPicker";
import emoji from "@/assets/image/emoji.svg";

const props = defineProps({
  avatarSize: {
    type: Number,
    default: 40
  },
  userId: {
    type: Number
  },
  placeholder: {
    type: String,
    default: "请文明发言，做一名优秀的攻城狮..."
  },
  commentId: {
    type: Number
  },
  replyCommentId: {
    type: Number
  },
  isReply: {
    type: Boolean,
    default: false
  }
});

const forumId = inject("forumId");
const formData = reactive({
  content: "",
  images: []
});
const formRef = ref(null);
const inputRef = ref(null);
const submitRef = ref(null);
const commentFocus = ref(false);
const showWidget = ref(false);
const showEmojiPicker = ref(false);

// 发表评论
const emit = defineEmits(["releaseCommentFinish", "replyCommentFinish"]);
const sendComment = async () => {
  try {
    submitRef.value.start();

    let result;
    if (!props.isReply) {
      // 一级评论
      result = await releaseCommentRequest({
        forumId: forumId.value,
        content: formData.content
      });
      // 上传文件
      if (formData.images.length) {
        const pictureRes = await uploadPicture({
          forumId: forumId.value,
          commentId: result.data.id,
          picture: formData.images
        });
        result.data.images = pictureRes.data;
      }
      // 展示假数据
      emit("releaseCommentFinish", result.data);
    } else {
      // 回复
      result = await replyCommentRequest({
        forumId: forumId.value,
        commentId: props.replyCommentId,
        content: formData.content
      });
      emit("replyCommentFinish", result.data, props.commentId);
    }

    ElMessage({
      type: "success",
      message: "评论成功！"
    });
  } catch (err) {
    console.log(err);
  } finally {
    formRef.value.resetFields();
    submitRef.value?.finish();
    removeCommentImage(0, formData.images.length);
    inputBlur();
  }
};

// 选择图片
const commentImageList = ref([]);
const selectImage = (e) => {
  if (e instanceof PointerEvent) {
    if (e.target.tagName === "DIV") {
      const uploadEl = document.querySelector(".insert-image input[type=file]");
      uploadEl.click();
    }
    return;
  }
  const file = e.file; // File
  const image = new FileReader();
  image.readAsDataURL(file);
  image.onload = ({ target }) => {
    // base64
    const imageData = target.result;

    if (formData.images.length >= 9) {
      ElMessage.error("你上传的图片太多啦，服务器顶不住啦！～");
      return;
    }
    commentImageList.value.push(imageData);
    formData.images.push(file);
  };
};

// 删除图片
const removeCommentImage = (index, length = 1) => {
  commentImageList.value.splice(index, length);
  formData.images.splice(index, length);
};

const emojiButtonClick = (e) => {
  showEmojiPicker.value = true;
  inputRef.value.focus();
  e.preventDefault();
  e.stopPropagation();
};

// emoji
const emojiClick = (emoji) => {
  const textareaEl = document.querySelector(
    ".comment-textarea .el-textarea__inner"
  );
  const startPos = textareaEl.selectionStart;

  if (startPos >= 0) {
    const content = formData.content;
    formData.content =
      content.slice(0, startPos) + emoji + content.slice(startPos);
    nextTick(() => {
      textareaEl.setSelectionRange(
        startPos + emoji.length,
        startPos + emoji.length
      );
    });
  }
};

const inputFocus = () => {
  showWidget.value = true;
  commentFocus.value = true;
};

const inputBlur = () => {
  showEmojiPicker.value = false;
  if (!formData.content) {
    showWidget.value = false;
    commentFocus.value = false;
  }
};
</script>

<style lang="scss" scoped>
.comment-form {
  position: relative;
  .comment-form-panel {
    display: flex;
    transition: 0.2s;
    height: 50px;
    .user-avatar {
      height: 50px;
      display: flex;
      align-items: center;
    }
    .comment-form-input {
      flex: 1;
      margin: 0 15px;
      height: 100%;
      * {
        height: 100%;
      }
      ::v-deep(.el-textarea__inner) {
        line-height: 38px;
        border: 1px solid #f1f2f3;
        background: #f1f2f3;
        outline: none;
        box-shadow: none;
        height: 100%;
        color: #000;
        &:hover,
        &:focus {
          border-color: #c9ccd0;
          background: #fff;
        }
      }
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .send {
      width: 75px;
      height: 100%;
      transition: none;
    }
  }
  .widget {
    display: flex;
    flex-direction: column;
    margin-left: 65px;
    .widget-icon {
      display: flex;
      align-items: center;
      height: 26px;
      margin-top: 5px;
      margin-bottom: 12px;
      .emoji-button {
        .icon-emoji {
          width: 16px;
          height: 16px;
          display: flex;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .insert-image,
      .emoji-button {
        position: relative;
        width: 32px;
        height: 100%;
        margin-right: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #f1f2f3;
        border-radius: 4px;
        cursor: pointer;
      }
    }
    .pre-image-list {
      width: 100%;
      display: flex;
      .iconfont {
        position: absolute;
        top: -10px;
        right: -10px;
        color: rgb(121, 121, 121);
        cursor: pointer;
      }
    }
  }
  .comment-form-focus {
    height: 75px;
  }
}
</style>
