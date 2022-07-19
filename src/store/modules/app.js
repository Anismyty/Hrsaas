import Cookies from 'js-cookie'

const state = {
  //对应页面上的折叠和打开的数据
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  /* 面包屑导航 */
  currentMenu: null,
  tabsList: [
    {
      fullPath: '/dashboard',
      title: '首页',
      icon: 'dashboard'
    }
  ]
}

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  /* 存储Tag */
  selectMenu(state, val) {
    if (val.fullPath === '/dashboard') {
      state.currentMenu = null
    } else {
      state.currentMenu = val
      //如果等于-1说明tabsList不存在那么插入，否则什么都不做
      let result = state.tabsList.findIndex((item) => item.fullPath === val.fullPath)
      result === -1 ? state.tabsList.push({ ...val.meta, fullPath: val.fullPath }) : ''
    }
  },
  /* 关闭标签 */
  closeTab(state, val) {
    let result = state.tabsList.findIndex((item) => item.fullPath === val.fullPath)
    state.tabsList.splice(result, 1)
  },
  /* 还原标签页 */
  orightTab(state) {
    state.currentMenu = null
    state.tabsList = [
      {
        fullPath: '/dashboard',
        title: '首页',
        icon: 'dashboard'
      }
    ]
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  clearTab(context) {
    context.commit('orightTab')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
