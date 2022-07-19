/*
 **控制权限路由
 */
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  /* 表示当前用户所拥有的全部路由的数组 */
  //一开始肯定拥有静态路由
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, newRoutes) {
    /* 在静态路由上加 */
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  /* 筛选权限路由 */
  //asyncRoutes：所有的动态路由
  filterRoutes(context, menus) {
    const newRoutes = []
    menus.forEach((e) => {
      newRoutes.push(...asyncRoutes.filter((item) => item.name === e))
    })
    /* 将动态路由提供给mutation */
    // 给左侧菜单用
    context.commit('setRoutes', newRoutes)
    // 给路由addRoutes函数使用
    return newRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
