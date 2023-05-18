<template>
  <div>
    <Header />
    <Login />
    <div class="content">
      <router-view #="{ Component }">
        <component
          v-if="!$route.meta.keepAlive"
          :is="Component"
          :key="$route.name"
        />
        <keep-alive>
          <component
            v-if="$route.meta.keepAlive"
            :is="Component"
            :key="$route.name"
          />
        </keep-alive>
      </router-view>
    </div>
    <Footer />
    <el-backtop :right="100" :bottom="100"></el-backtop>
  </div>
</template>

<script setup>
import Header from "./header/Header";
import Login from "./login/Login";
import Footer from "./footer/Footer";
</script>

<style lang="scss" scoped>
.content {
  padding-top: 60px;
  min-height: calc(100vh - 115px);
}
</style>
