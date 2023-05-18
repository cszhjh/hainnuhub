<template>
  <Navbar>
    <template #left>
      <HeaderLogo />
    </template>
    <template #center>
      <HeaderMenu />
    </template>
    <template #right>
      <HeaderUserControl />
    </template>
  </Navbar>
</template>

<script setup>
import Navbar from "@/components/navbar/Navbar";
import HeaderLogo from "./components/HeaderLogo";
import HeaderMenu from "./components/HeaderMenu";
import HeaderUserControl from "./components/HeaderUserControl";
</script>

<style lang="scss" scoped></style>
