<template>
  <div class="nav-bar">
    <div class="nav-bar-content">
      <div class="left">
        <slot name="left"></slot>
      </div>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.nav-bar {
  width: 100vw;
  position: fixed;
  box-shadow: 0 2px 6px #ddd;
  background: #fff;
  z-index: 1000;
  top: 0;
  left: 0;

  .nav-bar-content {
    max-width: var(--body-width);
    min-width: 930px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    .center {
      flex: 1;
    }

    .right {
      width: 300px;
    }
  }
}
</style>
