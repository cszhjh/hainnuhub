<template>
  <div class="skeleton" :style="{ background: showSkeleton ? '#fff' : '' }">
    <el-skeleton
      :loading="showSkeleton"
      class="skeleton-body"
      :count="count"
      :throttle="500"
      animated
    >
      <template #template>
        <div class="skeleton-container-list" v-if="dataSourceIsArray">
          <div class="skeleton-user-info">
            <el-skeleton-item class="skeleton-avatar" variant="circle" />
            <el-skeleton-item class="skeleton-article-info" variant="p" />
          </div>
          <el-skeleton-item
            class="skeleton-title"
            variant="h1"
            style="width: 400px; display: block; margin-bottom: 10px"
          />
          <el-skeleton-item
            class="skeleton-title"
            variant="p"
            style="width: 850px"
          />
          <el-skeleton-item
            class="skeleton-title"
            variant="p"
            style="width: 700px"
          />
          <el-skeleton-item
            class="skeleton-title"
            variant="p"
            style="width: 900px"
          />
          <el-skeleton-item
            class="skeleton-title"
            variant="p"
            style="width: 600px"
          />
        </div>
        <div class="skeleton-container-image" v-else-if="!dataSourceIsArray">
          <el-skeleton-item class="skeleton-title" variant="h1" />
          <el-skeleton :rows="3" />
          <div class="skeleton-image">
            <el-skeleton-item
              v-for="index of 3"
              :key="index"
              variant="image"
              style="width: 400px; height: 267px"
            />
          </div>
          <div style="padding: 14px 0">
            <el-skeleton-item variant="h3" style="width: 50%" />
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
                margin-top: 16px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="p" style="margin-right: 16px" />
              <el-skeleton-item variant="p" style="width: 30%" />
            </div>
          </div>
          <el-skeleton :rows="5" />
        </div>
      </template>
      <template v-if="!showSkeleton" #default>
        <div v-if="!dataSourceLoaded">
          <el-empty :image-size="200" :description="noDataMessage" />
        </div>

        <template v-else-if="dataSourceIsArray">
          <template v-if="infiniteScroll">
            <div v-for="(data, index) in getDataSource" :key="data">
              <template v-if="index < loadCount">
                <slot :data="data"></slot>
              </template>
            </div>
          </template>
          <template v-else>
            <div v-for="(data, index) in dataSource" :key="data">
              <template v-if="isShowDataItem(index)">
                <slot :data="data"></slot>
              </template>
            </div>
          </template>
        </template>

        <template v-else-if="!dataSourceIsArray">
          <slot :data="dataSource"></slot>
        </template>

        <div class="pagination" v-if="showPagination && dataSourceLoaded">
          <el-pagination
            style="text-align: center"
            layout="prev, pager, next"
            :total="dataTotal"
            :current-page="pageNo"
            :page-size="pageSize"
            background
            @current-change="handlePageNoChange"
          />
        </div>
        <div
          v-else-if="
            infiniteScroll &&
            loadCount >= dataSource.length &&
            dataSource.length > 10
          "
          class="reply-end"
        >
          别滚了，到底了🤣
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick } from "vue";

const props = defineProps({
  dataSource: {
    type: [Array, Object],
    default: () => []
  },
  dataTotal: {
    type: Number,
    default: 0
  },
  pageTotal: {
    type: Number,
    default: 0
  },
  pageNo: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  showSkeleton: {
    type: Boolean,
    default: false
  },
  noDataMessage: {
    type: String,
    default: "No Data"
  },
  count: {
    type: Number,
    default: 5
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  infiniteScroll: {
    type: Boolean,
    default: false
  }
});

let dataSourceIsArray = ref(true);

const loadCount = ref(3);
const getDataSource = computed(() => {
  return props.dataSource.slice(0, loadCount.value + 1);
});

const loadData = () => {
  if (!props.infiniteScroll || loadCount.value >= props.dataSource.length)
    return;
  loadCount.value += 5;
};

const viewLoaded = ref(false);
onMounted(() => {
  document.addEventListener("scroll", () => {
    if (
      window.scrollY + window.innerHeight >=
      document.body.offsetHeight - 10
    ) {
      if (viewLoaded.value === false) {
        viewLoaded.value = true;
        loadData();
        nextTick(() => {
          viewLoaded.value = false;
        });
      }
    }
  });
});

const dataSourceLoaded = computed(() => {
  if (Array.isArray(props.dataSource)) {
    return props.dataSource.length > 0;
  }
  return Object.keys(props.dataSource).length > 0;
});

watch(
  // showSkeleton 刚进入组件时为 true
  // 当数据请求结束后由父组件改为 false
  // dataSource 是异步请求的数据，数据变化很慢
  // skeleton 500ms 后显示骨架屏
  // 所以使用插槽 #default 最好加上 v-if (数据可能是空的，但需要展示相应效果，取消骨架屏)
  // 当数据请求结束后再展示真实数据，数据请求结束的标识就是 showSkeleton 的变化
  () => props.showSkeleton,
  () => {
    dataSourceIsArray.value = Array.isArray(props.dataSource);
  },
  {
    immediate: true
  }
);

const isShowDataItem = (index) => {
  if (props.dataSource.length <= props.pageSize) return true;
  return (
    index >= props.pageSize * (props.pageNo - 1) &&
    index < props.pageSize * props.pageNo
  );
};

const emit = defineEmits(["handlePageNoChange"]);
const handlePageNoChange = (pageNo) => {
  emit("handlePageNoChange", pageNo);
};
</script>

<style lang="scss" scoped>
.skeleton {
  padding-top: 5px;
  position: relative;
  .skeleton-body {
    .skeleton-container-list {
      padding: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;

      .skeleton-user-info {
        display: flex;
        align-items: center;
        margin: 10px 0;
        .skeleton-avatar {
          width: 30px;
          height: 30px;
        }
        .skeleton-article-info {
          margin-left: 5px;
          width: 200px;
        }
      }
    }
  }
  .skeleton-container-image {
    padding: 10px;
    box-sizing: border-box;
    .skeleton-title {
      margin: 10px 0;
      width: 500px;
    }
    .skeleton-image {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
    }
  }
  .pagination {
    padding: 5px;
    padding-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .reply-end {
    margin-top: 20px;
    font-size: 13px;
    color: #9499a0;
    text-align: center;
  }
}
</style>
