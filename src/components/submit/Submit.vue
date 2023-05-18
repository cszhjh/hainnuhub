<template>
  <el-button
    :class="['button', isFill ? 'submit' : '']"
    :disabled="disabled"
    type="primary"
    :size="size"
    :loading="loading"
    @click="click"
  >
    <template #loading>
      <div class="custom-loading">
        <svg class="circular" viewBox="-10, -10, 50, 50">
          <path
            class="path"
            d="
              M 30 15
              L 28 17
              M 25.61 25.61
              A 15 15, 0, 0, 1, 15 30
              A 15 15, 0, 1, 1, 27.99 7.5
              L 15 15
            "
            style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
          />
        </svg>
      </div>
    </template>
    <span v-show="!disabled">{{ message }}</span>
    <span v-show="loading">{{ loadingMessage }}</span>
    <span v-show="countDown && disabled && !loading">
      {{ countDownMessage }} {{ counter }}
    </span>
  </el-button>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "large"
  },
  isFill: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  loadingMessage: {
    type: String,
    default: ""
  },
  countDown: {
    type: Boolean,
    default: false
  },
  countDownMessage: {
    type: String,
    default: "重新发送"
  },
  countDownNumber: {
    type: Number,
    default: 60
  }
});

const disabled = ref(false);
const loading = ref(false);
let timer = null;
const counter = ref(props.countDownNumber);
const emit = defineEmits(["click"]);

const click = () => emit("click");

const start = () => {
  disabled.value = true;
  loading.value = true;
};

const finish = (isDisabeld = false) => {
  setTimeout(() => {
    if (!isDisabeld) {
      disabled.value = false;
    }
    loading.value = false;
  }, 1000);
};

const openCountDown = () => {
  finish(true);
  if (timer) return;
  timer = setInterval(() => {
    if (counter.value > 0) {
      counter.value--;
    } else {
      disabled.value = false;
      counter.value = props.countDownNumber;
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
};

defineExpose({
  timer,
  start,
  finish,
  openCountDown
});
</script>

<style lang="scss" scoped>
.button {
  width: 160px;
  margin-left: 5px;
}
.submit {
  width: 100%;
  margin-left: 0;
}
.button {
  .custom-loading .circular {
    margin-right: 6px;
    width: 18px;
    height: 18px;
    animation: loading-rotate 2s linear infinite;
  }
  .custom-loading .circular .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: var(--el-button-text-color);
    stroke-linecap: round;
  }
}
</style>
