<template>
  <div class="header-menu">
    <el-menu :default-active="activePath" class="menu-panel" mode="horizontal">
      <el-menu-item class="menu-item" index="0" @click="labelClickHandler(0)">
        首页
      </el-menu-item>
      <el-menu-item
        class="menu-item"
        v-for="label in getSliceLabels(0, 4)"
        :index="label.id + ''"
        :key="label"
        @click="labelClickHandler(label.id)"
      >
        {{ label.name }}
      </el-menu-item>
      <el-sub-menu class="menu-sub-panel" index="/other" :teleported="false">
        <template #title>
          <span class="menu-sub-title">其他</span>
        </template>
        <el-menu-item
          class="menu-sub-item"
          v-for="label in getSliceLabels(4)"
          :index="label.id + ''"
          :key="label"
          @click="labelClickHandler(label.id)"
        >
          {{ label.name }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, toRef, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useGetters } from "@/hooks";

const store = useStore();
const route = useRoute();
const router = useRouter();
const { getSliceLabels } = useGetters("label", ["getSliceLabels"]);
const activePath = ref("0");

store.dispatch("label/getLabelAction");

const labelClickHandler = (labelId) => {
  router.push(`/forum/${labelId}`);
};

watch(
  () => route.path,
  (newValue) => {
    const [, path, labelId] = newValue.split("/");
    if (path === "forum") {
      activePath.value = labelId;
    }
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.header-menu {
  margin-left: 15px;
  .menu-panel {
    border-bottom: none;
    .menu-item {
      font-size: 18px;
    }
  }
  .menu-sub-panel {
    .menu-sub-title {
      font-size: 18px;
    }
    .menu-sub-item {
      font-size: 15px;
    }
  }
}
</style>
