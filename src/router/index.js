import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
//引入模块路由
import approvalsRouter from './modules/approvals'
import attendancesRouter from './modules/attendances'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import salarysRouter from './modules/salarys'
import socialsRouter from './modules/social'
import settingRouter from './modules/setting'

//静态路由【导出，便于在vuex中做权限处理】
export const constantRoutes = [
  //登录页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  //404页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  //首页面板
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  /* 公共上传路由【不需要权限】 */
  {
    path: '/import',
    component: Layout,
    hidden: true, //不显示在左侧为菜单
    children: [
      {
        path: '',
        component: () => import('@/views/import')
      }
    ]
  },
  //匹配不上的地址全部进入404
  { path: '*', redirect: '/404', hidden: true }
]

// 动态路由
export const asyncRoutes = [
  approvalsRouter,
  attendancesRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  salarysRouter,
  socialsRouter,
  settingRouter
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    //临时合并，之后要做权限设置
    routes: [...constantRoutes]
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
