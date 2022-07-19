/* 
  建立了对子模块的快捷访问
*/

const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  /* 设置面包屑 */
  currentMenu: (state) => state.app.currentMenu,
  /* 设置Tag */
  tabsList: (state) => state.app.tabsList,
  //token快捷访问
  token: (state) => state.user.token,
  //用户资料快捷访问
  name: (state) => state.user.userInfo.username,
  userId: (state) => state.user.userInfo.userId,
  staffPhoto: (state) => state.user.userInfo.staffPhoto,
  //公司ID快捷访问
  companyId: (state) => state.user.userInfo.companyId,
  //路由快速访问
  routes: (state) => state.permission.routes
}
export default getters
