<template>
  <div :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'">
    <!-- 评论列表 -->
    <van-list class="cmt-list" v-model="loading" :finished="finished" finished-text="没有更多评论了" :immediate-check="false"
      @load="onLoad">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="item in cmtlist" :key="item.com_id.toString()">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar">
            <span class="uname">{{ item.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon name="like" size="16" color="red" v-if="item.is_liking" @click="delLike(item)" />
            <van-icon name="like-o" size="16" color="gray" v-else @click="addLike(item)" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">{{ item.content }}</div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
      </div>
    </van-list>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
      <van-icon name="arrow-left" size="18" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
      <div class="icon-box">
        <van-badge :content="cmtCount" :max="99">
          <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
        </van-badge>
        <van-icon name="star-o" size="20" />
        <van-icon name="share-o" size="20" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="友善评论、理性发言、阳光心灵" @blur="hideBox2" ref="iptCmt" v-model.trim="cmt"></textarea>
      <van-button type="default" :disabled="cmt.length === 0" @click="pubCmt">发布</van-button>
    </div>
  </div>
</template>

<script>
import { getCmtListAPI, addLikeCmtAPI, delLikeCmtAPI, pubCommentAPI } from '@/api/articleAPI.js'
import { animate } from 'popmotion'
export default {
  name: 'ArtCmt',
  props: {
    // 文章的 Id（小驼峰命名法）
    artId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 文章的评论列表数据
      cmtlist: [],
      // 偏移量
      offset: null,
      // 是否正在请求上拉加载的数据
      loading: false,
      // 所有数据是否加载完毕了
      finished: false,
      // 是否展示评论区域1（如果值为 true 则展示评论区域1；如果值为 false 则展示评论区域2）
      isShowBox1: true,
      // 当前文章的总评论数
      cmtCount: 0,
      // 用户填写的评论内容
      cmt: ''
    }
  },
  created () {
    this.initCmtList()
  },
  methods: {
    // 初始化评论列表的数据
    async initCmtList () {
      // 调用 API 接口
      const { data: res } = await getCmtListAPI(this.artId, this.offset)
      if (res.message === 'OK') {
        // 为总评论数赋值
        this.cmtCount = res.data.total_count
        // 为列表数据赋值
        this.cmtlist = [...this.cmtlist, ...res.data.results]

        // 为偏移量赋值
        this.offset = res.data.last_id
        // 将 loading 重置为 false
        this.loading = false
        // 判断所有数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    // 上拉加载
    onLoad () {
      this.initCmtList()
    },
    // 评论点赞
    async addLike (cmt) {
      // 1. 调用 API 接口
      const { data: res } = await addLikeCmtAPI(cmt.com_id.toString())

      if (res.message === 'OK') {
        // 2. 在客户端，将点赞的状态设置为 true
        cmt.is_liking = true
      }
    },
    // 评论取消点赞
    async delLike (cmt) {
      // 1. 调用 API 接口（注意：由于取消点赞的 API 没有响应体，不需要进行解构赋值）
      const res = await delLikeCmtAPI(cmt.com_id.toString())

      if (res.status === 204) {
        // 2. 在客户端，将点赞的状态设置为 false
        cmt.is_liking = false
      }
    },
    // 展示第二个评论区域
    showBox2 () {
      // 隐藏评论区域1，展示评论区域2
      this.isShowBox1 = false

      // 1. 将回调函数延迟到下次 DOM 更新完毕之后执行
      this.$nextTick(() => {
        // 2. 通过 ref 获取到 textarea 的引用
        this.$refs.iptCmt.focus()
      })
    },
    // 隐藏第二个评论区域
    hideBox2 () {
      // 当文本框失去焦点时，延迟 100ms 再隐藏第二个评论区域
      // 目的：让发布评论的按钮能正常响应用户的点击事件
      setTimeout(() => {
        // 隐藏第二个评论区域
        this.isShowBox1 = true
        // 清空用户输入的评论内容
        this.cmt = ''
      }, 100)
    },
    // 点击了发布评论的按钮
    async pubCmt () {
      // 调用 API 接口
      const { data: res } = await pubCommentAPI(this.artId, this.cmt)
      if (res.message === 'OK') {
        this.cmtCount += 1
        // 动态给响应回来的数据添加 is_liking 属性
        res.data.new_obj.is_liking = false
        this.cmtlist.unshift(res.data.new_obj)
        this.$toast.success('发表评论成功')
      }
    },
    // 滚动到评论的列表区域
    scrollToCmtList () {
      // 1. 当前滚动条的位置
      const now = window.scrollY
      // 2. 目标位置（文章信息区域的高度）
      const dist = document.querySelector('.article-container').offsetHeight

      // 3. 实现滚动动画
      animate({
        from: now, // 当前的位置
        to: dist,  // 目标位置
        onUpdate: latest => window.scrollTo(0, latest)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;

  .cmt-item {
    padding: 15px 0;

    +.cmt-item {
      border-top: 1px solid #f8f8f8;
    }

    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .cmt-header-left {
        display: flex;
        align-items: center;

        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }

        .uname {
          font-size: 12px;
        }
      }
    }

    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }

    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}

.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;

  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }

  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;

  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }

  .van-button {
    height: 100%;
    border: none;
  }
}
</style>