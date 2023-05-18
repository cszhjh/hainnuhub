<template>
  <Dialog v-bind="dialogConfig" @close="close">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="昵称" prop="username">
        <div class="username" v-if="!showEditUsername">
          <span>{{ formData.username }}</span>
          <el-icon :size="14" class="username-icon" @click="toggleEditUsername">
            <Edit />
          </el-icon>
        </div>
        <template v-else>
          <el-input
            clearable
            type="input"
            resize="none"
            min-length="3"
            max-length="16"
            input-style="max-width: 200px"
            v-model="formData.username"
            ref="editUsernameRef"
          />
        </template>
      </el-form-item>
      <el-form-item label="邮箱">
        {{ formData.email }}
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <ImageSelector
          :imageUrlPrefix="imageUrlPrefix"
          v-model="formData.avatar"
        />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="formData.sex">
          <el-radio :label="'男'">男</el-radio>
          <el-radio :label="'女'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="个性签名" prop="description">
        <el-input
          clearable
          placeholder="介绍一下自己吧"
          type="textarea"
          :rows="2"
          :maxlength="50"
          resize="none"
          v-model="formData.description"
        />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { reactive, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { rules, validateUsername } from "../config/user-config";
import { uploadAvatar } from "@/service/upload/upload";
import { updateUserInfoRequest } from "@/service/user/user";

import Dialog from "@/components/dialog/Dialog";
import ImageSelector from "@/components/cover/ImageSelector";
import { Edit } from "@element-plus/icons-vue";

const dialogConfig = reactive({
  show: false,
  title: "修改信息",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: () => {
        updateUserInfoHandler();
      }
    }
  ]
});
const router = useRouter();
const imageUrlPrefix = "/api/users";
const formData = ref({
  username: "",
  avatar: {
    imageUrl: ""
  },
  sex: "男",
  description: ""
});
const formRef = ref(null);
const showEditUsername = ref(false);
let oldUsername = ref("");

const emit = defineEmits(["resetUserInfoHandler"]);
const updateUserInfoHandler = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await updateUserInfoRequest(formData.value);

      if (formData.value.avatar instanceof File) {
        await uploadAvatar({ avatar: formData.value.avatar });
        router.go(0);
      } else {
        emit("resetUserInfoHandler", formData.value);
      }
      ElMessage.success("修改成功！");
      close();
    } catch (error) {
      console.log(error);
    }
  });
};

const showEditUserInfoDialog = (userInfo) => {
  dialogConfig.show = true;
  nextTick(() => {
    formRef.value.resetFields();
    const info = JSON.parse(JSON.stringify(userInfo));
    info.avatar = {
      imageUrl: `/${info.id}/avatar`
    };
    formData.value = info;
    oldUsername.value = info.username;
  });
};

const close = () => {
  dialogConfig.show = false;
};

const editUsernameRef = ref(null);
const toggleEditUsername = () => {
  showEditUsername.value = true;
  nextTick(() => {
    editUsernameRef.value.focus();
  });
};

validateUsername(formData, oldUsername, showEditUsername);

defineExpose({
  showEditUserInfoDialog
});
</script>

<style lang="scss" scoped>
.username {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin-right: 5px;
  }
  .username-icon {
    cursor: pointer;
  }
}

::v-deep(.cust-dialog) {
  min-width: 500px;
}
</style>
