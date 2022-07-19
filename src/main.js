import Vue from 'vue'

/* 让所有浏览器的标签样式保持一致 */
import 'normalize.css/normalize.css'

/* element UI引入 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

/* 全局样式 */
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'
//引入指令
import * as directives from '@/directives'
//引入全局注册的组件
import Components from '@/components'
//引入过滤器
import * as filters from '@/filters/index'

import '@/icons' // icon
//路由守卫——权限设置
import '@/permission'

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

//批量注册指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key])
})

//注册全局组件
Vue.use(Components)

//注册全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
