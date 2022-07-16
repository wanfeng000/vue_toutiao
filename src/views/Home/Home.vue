<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <!-- 在每一个用户频道下，渲染出对应的“文章列表组件” -->
        <art-list :channel-id="item.id"></art-list>
      </van-tab>
    </van-tabs>

    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
import { getUserChannelAPI } from '@/api/homeAPI'
import ArtList from '@/components/ArtList/ArtList.vue'
export default {
  name: 'Home',
  data () {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户的频道列表数组
      userChannel: []
    }
  },
  created () {
    this.initUserChannel()
  },
  methods: {
    async initUserChannel () {
      // 1. 调用 API 接口
      const { data: res } = await getUserChannelAPI()
      // 2. 判断请求是否成功
      if (res.message === 'OK') {
        // 3. 为用户的频道列表赋值
        this.userChannel = res.data.channels
      }
    }
  },
  components: {
    ArtList
  }
}
</script>

<style lang="less" scoped>
// 组件外层容器的样式
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
}

// logo 样式
.logo {
  height: 80%;
}

// 为 tabs 容器设置右 padding
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}

// 频道管理小图标的定位
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>