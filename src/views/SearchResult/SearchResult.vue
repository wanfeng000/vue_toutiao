<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />

    <!-- 上拉加载更多 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多数据了" @load="onLoad" :immediate-check="false">
      <!-- 文章的 Item 项 -->
      <art-item v-for="item in searchList" :key="item.art_id.toString()" :article="item" :closable="false"></art-item>
    </van-list>
  </div>
</template>

<script>
import { getSearchResultAPI } from '@/api/searchAPI.js'
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'SearchResult',
  props: ['kw'],
  data () {
    return {
      // 页码值
      page: 1,
      // 搜索的结果
      searchList: [],
      // 是否正在进行上拉加载的数据请求
      loading: false,
      // 所有数据是否已经加载完毕
      finished: false
    }
  },
  created () {
    this.initSearchList()
  },
  methods: {
    // 获取搜索的结果
    async initSearchList () {
      // 调用 API 接口
      const { data: res } = await getSearchResultAPI(this.kw, this.page)
      if (res.message === 'OK') {
        // 1. 拼接数据：“旧数据”在前，“新数据”在后
        this.searchList = [...this.searchList, ...res.data.results]
        // 2. 将 loading 设置为 false
        this.loading = false
        // 3. 判断数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
        // 4. 让页码值 +1
        this.page += 1
      }
    },
    // 触发了上拉加载更多
    onLoad () {
      this.initSearchList()
    }
  },
  beforeRouteLeave (to, from, next) {
    from.meta.top = window.scrollY
    setTimeout(() => {
      next()
    }, 0)
  },
  watch: {
    kw () {
      // 1. 重置关键数据
      this.page = 1
      this.artList = []
      this.loading = false
      this.finished = false

      // 2. 请求数据
      this.initSearchList()
    }
  },
  components: {
    // 注册组件
    ArtItem
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>