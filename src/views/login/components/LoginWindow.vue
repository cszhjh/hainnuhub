<template>
  <el-form
    class="user-login"
    :model="account"
    :rules="rules"
    ref="formRef"
    :scroll-to-error="true"
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
    <el-form-item prop="remember">
      <div class="remember-panel">
        <el-checkbox v-model="remember">记住我</el-checkbox>
      </div>
      <div class="no-account">
        <a
          href="javascript:void(0)"
          class="a-link-anim"
          @click="register('resetPassword')"
        >
          忘记密码
        </a>
        <a
          href="javascript:void(0)"
          class="a-link-anim"
          @click="register('register')"
        >
          没有账号
        </a>
      </div>
    </el-form-item>
    <el-form-item class="submit">
      <Submit
        :isFill="true"
        message="登录"
        loadingMessage="正在登录"
        ref="submitRef"
        @click="submit"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { rules } from "../config/login-config";
import localCache from "@/utils/cache";
import Submit from "@/components/submit/Submit";

const store = useStore();
const router = useRouter();
const account = reactive({
  email: localCache.getCache("email"),
  password: localCache.getCache("password")
});
const remember = ref(localCache.getCache("remember"));
const formRef = ref(null);
const submitRef = ref(null);
const emit = defineEmits(["resetPassword", "register", "close"]);

const register = (eventName) => {
  emit(eventName);

  nextTick(() => {
    formRef.value.resetFields();
  });
};

const submit = () => {
  formRef.value?.validate(async (isValid) => {
    if (!isValid) {
      return;
    }

    // 加载中...
    submitRef.value.start();
    // 1. 是否需要记住密码
    if (remember.value) {
      // 本地缓存
      localCache.setCache("email", account.email);
      localCache.setCache("password", account.password);
      localCache.setCache("remember", true);
    } else {
      // 清除缓存
      localCache.removeCache("email");
      localCache.removeCache("password");
      localCache.setCache("remember", false);
    }

    // 2. 登录验证
    const status = await store.dispatch("user/loginAction", { ...account });
    // 3. 网络请求结束，恢复按钮
    submitRef.value.finish();

    if (status) {
      emit("close");
      ElMessage({ type: "success", message: "登录成功！" });
    }
  });
};
</script>

<style lang="scss" scoped>
.user-login {
  .remember-panel {
    width: 100%;
  }

  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .a-link-anim::after {
      bottom: 3px;
    }
  }

  .submit {
    margin-bottom: 0;
  }
}
</style>
