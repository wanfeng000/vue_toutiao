import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './index.less'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.locale(zh)


Vue.config.productionTip = false
// dt 参数是文章的发表时间
Vue.filter('dateFormat', dt => {
  // 调用 dayjs() 得到的是当前的时间
  // .to() 方法的返回值，是计算出来的“相对时间”
  return dayjs().to(dt)
})

Vue.use(Vant)
Vue.use(Lazyload)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
