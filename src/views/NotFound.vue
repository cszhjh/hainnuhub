<template>
  <div class="not-found">
    <div class="info">404</div>
    <el-empty />
    <div>
      <router-link to="/" class="a-link-anim">返回首页</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.not-found {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 300px;
  .info {
    font-size: 100px;
    color: rgb(26, 149, 231);
  }
  .a-link-anim {
    font-size: 20px;
  }
}
</style>
