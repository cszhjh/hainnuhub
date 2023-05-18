<template>
  <el-form
    class="user-register"
    :model="account"
    :rules="rules"
    ref="formRef"
    scroll-to-error
  >
    <el-form-item prop="email">
      <el-input
        size="large"
        clearable
        placeholder="请输入邮箱地址"
        v-model="account.email"
        @keyup.enter="submit"
      >
        <template #prefix>
          <span class="iconfont icon-account"></span>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="code">
      <div class="send-email-panel">
        <el-input
          size="large"
          clearable
          placeholder="请输入验证码"
          v-model="account.code"
          @keyup.enter="submit"
        >
          <template #prefix>
            <span class="iconfont icon-checkcode"></span>
          </template>
        </el-input>
        <Submit
          :countDown="true"
          message="获取验证码"
          loadingMessage="正在获取"
          ref="emailCodeRef"
          @click="getEmailCode"
        />
      </div>
    </el-form-item>

    <el-form-item prop="username" v-show="opType === 0">
      <el-input
        size="large"
        clearable
        placeholder="请输入昵称"
        v-model="account.username"
        @keyup.enter="submit"
      >
        <template #prefix>
          <span class="iconfont icon-account"></span>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        size="large"
        clearable
        placeholder="请输入密码"
        v-model="account.password"
        show-password
        @keyup.enter="submit"
      >
        <template #prefix>
          <span class="iconfont icon-password"></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="rePassword">
      <el-input
        size="large"
        clearable
        placeholder="请再次输入密码"
        v-model="account.rePassword"
        show-password
        @keyup.enter="submit"
      >
        <template #prefix>
          <span class="iconfont icon-password"></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <a href="javascript:void(0)" class="a-link-anim" @click="login">
        {{ getLinkMessage }}
      </a>
    </el-form-item>
    <el-form-item class="submit">
      <Submit
        :isFill="true"
        :message="submitBtn.message"
        :loadingMessage="submitBtn.loadingMessage"
        ref="submitRef"
        @click="submit"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import {
  ref,
  reactive,
  inject,
  computed,
  toRef,
  toRefs,
  nextTick,
  watch
} from "vue";
import { useStore } from "vuex";
import { rules, validatePassword } from "../config/register-config";
import Submit from "@/components/submit/Submit";

const store = useStore();
const opType = inject("opType");
const formRef = ref(null);
const account = reactive({
  email: "",
  username: "",
  password: "",
  rePassword: "",
  code: ""
});
const emailCodeRef = ref(null);
const submitRef = ref(null);
const submitBtn = reactive({
  message: "",
  loadingMessage: ""
});
const emit = defineEmits(["login"]);

validatePassword(toRefs(account), formRef);

watch(
  opType,
  (newValue) => {
    submitBtn.message = newValue === 0 ? "注册" : "重置";
    submitBtn.loadingMessage = newValue === 0 ? "正在注册" : "正在重置";
  },
  {
    immediate: true
  }
);

const login = () => {
  emit("login");

  nextTick(() => {
    formRef.value.resetFields();
  });
};

const getLinkMessage = computed(() => {
  return opType.value === 0 ? "已有账号" : "去登录";
});

// 获取验证码前必填邮箱地址
const getEmailCode = () => {
  formRef.value.validateField("email", async (isValid) => {
    if (isValid) {
      if (!emailCodeRef.value.timer) {
        // 发送验证码，并显示加载动画
        emailCodeRef.value.start();
        const status = await store.dispatch("user/sendEmailCodeAction", {
          email: account.email,
          type: opType.value
        });
        if (status) {
          // 开始倒数
          emailCodeRef.value.openCountDown();
        } else {
          emailCodeRef.value.finish();
        }
      }
    } else {
      ElMessage({
        type: "error",
        message: "请输入正确的邮箱地址！"
      });
    }
  });
};

// 注册 / 重置密码
const submit = () => {
  formRef.value?.validate(async (isValid) => {
    if (!isValid) return;

    // 开始加载动画
    submitRef.value.start();
    let status = false;
    let message = "";
    const accountInfo = { ...account, type: opType.value };
    if (opType.value === 0) {
      // 注册
      status = await store.dispatch("user/registerAction", accountInfo);
    } else if (opType.value === 1) {
      // 忘记密码
      status = await store.dispatch("user/resetPasswordAction", accountInfo);
    }

    // 网络请求结束，按钮恢复点击
    submitRef.value.finish();

    if (status) {
      // 注册 / 重置成功，跳转到登录窗口
      if (opType.value === 0) {
        message = "注册成功！";
      } else {
        message = "重置密码成功！";
      }
      login();
      ElMessage({ type: "success", message });
    }
  });
};
</script>

<style lang="scss" scoped>
.user-register {
  .send-email-panel {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .submit {
    margin-bottom: 0;
  }
  .a-link-anim::after {
    bottom: 3px;
  }
}
</style>
