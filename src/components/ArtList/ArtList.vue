<template>
  <div>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="finished">
      <!-- 上拉加载更多 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <!-- 循环渲染文章的列表 -->
        <art-item v-for="item in artlist" :key="item.art_id.toString()" :article="item" @remove-article="removeArticle">
        </art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArtListAPI } from '@/api/homeAPI'
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'ArtList',
  props: {
    channelId: {
      type: Number, // 数值类型
      required: true // 必填项
    }
  },
  data () {
    return {
      // 文章列表的数组
      artlist: [],
      // 时间戳。初始的默认值为当前的时间戳
      timestamp: Date.now(),
      // loading 表示是否正在进行上拉加载的请求
      //   每当触发 List 组件的上拉加载更多时，List 组件会自动把 loading 设为 true
      //   每当下一页的数据请求回来以后，需要程序员手动的把 loading 设为 false，
      //   否则：再次触发上拉加载更多时，不会发起请求！！
      loading: false,
      // finished 表示所有数据是否加载完毕
      //    false 表示还有下一页的数据
      //    true  表示所有数据都已加载完毕
      finished: false,
      isLoading: false
    }
  },
  created () {
    // 在组件创建的时候，请求文章的列表数据
    this.initArtList()
  },
  methods: {
    // 初始化文章的列表数据
    async initArtList (isRefresh) {
      // 请求 API 接口
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      if (res.message === 'OK') {
        // 为时间戳重新赋值
        this.timestamp = res.data.pre_timestamp
        // 判断是否为下拉刷新
        if (isRefresh) {
          // 下拉刷新
          // 1. “新数据”在前，“旧数据”在后
          this.artlist = [...res.data.results, ...this.artlist]
          // 2. 重置 isLoading 为 false
          this.isLoading = false
        } else {
          // 上拉加载
          // 1. “旧数据”在前，“新数据”在后
          this.artlist = [...this.artlist, ...res.data.results]
          // 2. 重置 loading 为 false
          this.loading = false
        }
        // 3. 判断所有的数据是否已加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      }
    },
    // 加载更多的数据
    onLoad () {
      console.log('触发了上拉加载更多')
      this.initArtList()
    },
    // 下拉刷新
    onRefresh () {
      console.log('触发了下拉刷新')
      this.initArtList(true)
    },
    // 从文章列表中移除指定 id 的文章
    removeArticle (id) {
      // 1. 炸楼操作
      this.artlist = this.artlist.filter(item => item.art_id.toString() !== id)

      // 2. 判断剩余数据的文章数量是否小于 10
      if (this.artlist.length < 10) {
        // 主动请求下一页的数据
        this.initArtList()
      }
    }
  },
  components: {
    ArtItem
  }
}
</script>

<style lang="less" scoped>
</style>