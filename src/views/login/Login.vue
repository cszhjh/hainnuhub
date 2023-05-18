<template>
  <Dialog
    :="dialogConfig"
    width="400px"
    :showCancel="false"
    @close="close"
    class="user-panel"
  >
    <LoginRegister
      v-show="opType === 0 || opType === 1"
      @login="login"
      @close="close"
    />
    <LoginWindow
      v-show="opType === 2"
      @register="register"
      @resetPassword="resetPassword"
      @close="close"
    />
  </Dialog>
</template>

<script setup>
import { reactive, ref, provide } from "vue";
import { useGetters } from "@/hooks";
import emitter from "@/utils/eventbus";
import Dialog from "@/components/dialog/Dialog";
import LoginWindow from "./components/LoginWindow";
import LoginRegister from "./components/LoginRegister";

const dialogConfig = reactive({
  show: false,
  title: "标题"
});

const opType = ref();

provide("opType", opType);

const { getLoginState } = useGetters("user", ["getLoginState"]);

const close = () => {
  dialogConfig.show = false;
};

const showPanel = (type) => {
  dialogConfig.show = true;
  opType.value = type;

  if (type === 0) {
    dialogConfig.title = "注册";
  } else if (type === 1) {
    dialogConfig.title = "重置密码";
  } else if (type === 2) {
    dialogConfig.title = "登录";
  }
};

emitter.on("registerEvent", () => showPanel(0));
emitter.on("loginEvent", () => showPanel(2));

const register = () => showPanel(0);
const resetPassword = () => showPanel(1);
const login = () => showPanel(2);
</script>

<style lang="scss" scoped></style>
