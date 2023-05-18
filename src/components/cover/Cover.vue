<template>
  <div
    v-if="cover"
    class="cover"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <el-image
      :style="{ width: size + 'px', height: size + 'px' }"
      fit="scale-down"
      loading="lazy"
      :src="cover"
    ></el-image>
  </div>
</template>

<script setup>
const props = defineProps({
  cover: {
    type: String
  },
  size: {
    type: Number,
    default: 60
  }
});
</script>

<style lang="scss" scoped>
.cover {
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
}
</style>
