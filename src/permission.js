/* 
没有需要导出的变量
已经在main.js引入
设置路由守卫
*/

//定义白名单
const whiteList = ['/login', '/404']

import router from '@/router'

//引入了store实例
import store from '@/store'
//引入好看的交互——进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//前置守卫
router.beforeEach(async (to, from, next) => {
  //开启进度条
  NProgress.start()
  if (store.getters.token) {
    //有toke,去登录页直接跳转首页
    if (to.path === '/login') {
      next('/')
    } else {
      //token去其他页面直接放行
      //如果没有获得过用户资料，就先获取信息
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        /* 筛选路由，逗号后面跟着函数要传入的参数*/
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        //添加动态路由到路由表
        router.addRoutes(routes)
        //使用了addRoute后，必须使用
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    //没有token去不需要token的页面，放行
    if (whiteList.indexOf(to.path) > -1) {
      //表示要去的地址在白名单
      next()
    } else {
      //没有token去需要token的页面，先登录
      next('/login')
    }
  }
  //手动切换地址的时候关闭
  //   NProgress.done();
})

//后置守卫
router.afterEach(() => {
  //关闭进度条
  NProgress.done()
})
