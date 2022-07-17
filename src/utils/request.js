import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index'
import router from '@/router/index.js'

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

// 请求拦截器
// 注意：在我们的项目中，是基于 instance 实例来发起 ajax 请求的，因此一定要为 instance 实例绑定请求拦截器
instance.interceptors.request.use(
  config => {
    // 1. 获取 token 值
    const tokenStr = store.state.tokenInfo.token
    // 2. 判断 tokenStr 的值是否为空
    if (tokenStr) {
      // 3. 添加身份认证字段
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  error => {
    // 在请求失败的时候，关闭 loading 提示效果
    Toast.clear()

    // 如果有响应的结果，并且响应的状态码是 401，则证明 Token 过期了
    if (error.response && error.response.status === 401) {
      console.log('token 过期啦')
      // TODO1：清空 vuex 和 localStorage 中的数据
      store.commit('cleanState')
      // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
      router.replace('/login?pre=' + router.currentRoute.fullPath)
    }
    return Promise.reject(error)
  }
)
export default instance