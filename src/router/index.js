import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/Login.vue'
import Main from '@/views/Main/Main.vue'
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
import Search from '@/views/Search/Search.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
import UserEdit from '@/views/UserEdit/UserEdit.vue'
import Chat from '@/views/Chat/Chat.vue'
import store from '@/store/index.js'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/', component: Main, children: [
      // path 为"空字符串"的子路由规则，叫做"默认子路由"
      { path: '', component: Home, name: 'home', meta: { isRecord: true, top: 0 } },
      { path: '/user', component: User, name: 'user' }
    ]
  },
  { path: '/search', component: Search, name: 'search' },
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true, meta: { isRecord: true, top: 0 } },
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true, meta: { isRecord: true, top: 0 } },
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  { path: '/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ['/user', '/user/edit']

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  // 访问的是有权限的页面，需要判断用户是否登录
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 1. 从 store 中获取 token 的值
    //    注意：store.state.tokenInfo 要么是 {} 空对象，要么是包含 {token, refresh_token} 的对象
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      // 1.1 token 有值，已登录过（操作：直接放行）
      next()
    } else {
      // 1.2 token 不存在，没有登录（操作：强制跳转到登录页）
      // before：没有登录，强制跳转到登录页
      next('/login')

      // now：没有登录，强制跳转到登录页，并携带路由的 "query 查询参数"
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问的是没有权限的页面
    next()
  }
})

// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}

// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})

export default router
