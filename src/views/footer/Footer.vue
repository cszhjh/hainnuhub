<template>
  <div class="footer" v-if="showFooter">
    <div class="footer-content">
      <el-row>
        <el-col :span="8" class="item">
          <div class="logo">
            <div class="logo-letter">
              <span
                v-for="item in logoInfo"
                :style="{ color: item.color }"
                :key="item"
              >
                {{ item.letter }}
              </span>
            </div>
            <div class="info">欢迎访问 Hainnuhub</div>
          </div>
        </el-col>
        <el-col :span="7" class="item">
          <div class="copyright">Copyright 钟家豪</div>
          <div class="email">email：cszhjh@icloud.com</div>
          <div class="tel">tel：18289600355</div>
        </el-col>
        <el-col :span="8" class="item">
          <div class="address">
            <a
              href="https://map.baidu.com/search/%E6%B5%B7%E5%8D%97%E7%9C%81%E6%B5%B7%E5%8F%A3%E5%B8%82%E7%BE%8E%E5%85%B0%E5%8C%BA%E6%A0%A1%E9%99%85%E4%B8%80%E5%8F%B7%E8%B7%AF3%E5%8F%B7/@12302913.39717536,2256574.4699999997,17.07z?querytype=con&wd=%E6%B5%B7%E5%8D%97%E7%9C%81%E6%B5%B7%E5%8F%A3%E5%B8%82%E7%BE%8E%E5%85%B0%E5%8C%BA%E6%A0%A1%E9%99%85%E4%B8%80%E5%8F%B7%E8%B7%AF3%E5%8F%B7&c=125&provider=pc-aladin&pn=0&device_ratio=2&da_src=shareurl"
              target="_black"
              class="a-link"
            >
              地址：海南省海口市美兰区校际一号路3号
            </a>
          </div>
          <div class="postcode">邮编：571127</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import logoInfo from "@/constants/logo-config";

const route = useRoute();
const showFooter = ref(true);

watch(
  () => route.path,
  (newValue) => {
    const path = newValue.split("/")[1];
    if (path === "newPost" || path === "editPost") {
      showFooter.value = false;
    } else {
      showFooter.value = true;
    }
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.footer {
  background: #e9e9e9;
  height: 110px;
  margin-top: 5px;
  padding-top: 10px;
  display: flex;
  color: #4e5969;
  .footer-content {
    width: calc(var(--body-width));
    margin: auto;
    .item {
      text-align: left;
      div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .copyright {
        font-size: 18px;
        margin-bottom: 10px;
      }
      .logo {
        .logo-letter {
          font-size: 30px;
        }
        .info {
          margin-top: 10px;
          color: rgb(93, 93, 93);
        }
      }
      .address {
        a {
          color: #4e5969;
        }
      }
    }
  }
}
</style>
