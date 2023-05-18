<template>
  <!-- 附件 -->
  <div v-if="attachment" id="view-attachment" class="attachment-panel">
    <div class="title">附件</div>
    <div class="attachment-info">
      <span class="iconfont icon-zip"></span>
      <div class="filename">{{ formatFilename(attachment.name) }}</div>
      <div class="size">{{ formatSize(attachment.size) }}</div>
      <div class="download-count">已下载 {{ currentDownloadCount }} 次</div>
      <div class="download-button">
        <a ref="downloadRef" :download="attachment.name">
          <el-button
            type="primary"
            size="small"
            :width="60"
            :height="20"
            :loading="downloadLoading"
            @click="downloadAttachment"
          >
            <template v-if="!downloadLoading">下载</template>
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
          </el-button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useState } from "@/hooks";
import eventbus from "@/utils/eventbus";
import { formatSize, formatFilename } from "@/utils/utils";
import { incrementDownloadCount } from "@/service/forum/forum";

const props = defineProps({
  attachment: {
    type: Object,
    default: () => {}
  }
});

const downloadRef = ref(null);
const { loginState } = useState("user", ["loginState"]);
const currentDownloadCount = ref(props.attachment?.downloadCount || 0);

const downloadLoading = ref(false);
const downloadAttachment = async () => {
  const forumId = props.attachment.forumId;
  try {
    downloadLoading.value = true;
    await incrementDownloadCount({ forumId });
    setTimeout(() => {
      downloadRef.value.href = `/api/forum/attachment/download/${forumId}`;
      downloadRef.value.download = formatFilename(props.attachment.name);
      downloadRef.value.click();
      downloadRef.value.removeAttribute("href");
      currentDownloadCount.value++;
      downloadLoading.value = false;
    }, 2000);
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="scss" scoped>
.attachment-panel {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  .title {
    font-size: 18px;
  }
  .attachment-info {
    display: flex;
    align-items: center;
    margin-top: 10px;
    color: #9f9f9f;
    * {
      margin-right: 10px;
    }
    .icon-zip {
      font-size: 20px;
      color: #6ca1f7;
    }
    .filename {
      color: #6ca1f7;
    }
  }
}

.el-button .custom-loading {
  margin: 0;
}
.el-button .custom-loading .circular {
  margin-right: 6px;
  width: 18px;
  height: 18px;
  animation: loading-rotate 2s linear infinite;
}
.el-button .custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-button-text-color);
  stroke-linecap: round;
}
</style>
