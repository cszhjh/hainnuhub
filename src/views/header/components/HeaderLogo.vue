<template>
  <router-link to="/" class="logo a-link">
    <span v-for="item in logoInfo" :style="{ color: item.color }" :key="item">
      {{ item.letter }}
    </span>
  </router-link>
</template>

<script setup>
import logoInfo from "@/constants/logo-config";
</script>

<style lang="scss" scoped>
.logo {
  display: block;
  margin-right: 5px;
  text-decoration: none;
  span {
    font-size: 35px;
  }
}
</style>
