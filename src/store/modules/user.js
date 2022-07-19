import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth";
import { login, getUserInfo, getUserDetailById } from "@/api/user";

const state = {
  token: getToken(),
  //空对象,便于对getter设置快捷访问
  userInfo: {},
};
const mutations = {
  //token相关设置
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  removeToken(state) {
    state.token = null;
    //清除本地
    removeToken();
  },
  //用户信息相关设置
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo; // ——这样是响应式数据
    //state.userInfo = { ...userInfo } ———— 响应式数据
    //state.userInfo["username"] = userInfo ————不是响应式数据
  },
  removeUserInfo(state) {
    state.userInfo = {};
  },
};
const actions = {
  //把请求的axios封装到vuex
  //登录
  async login(context, data) {
    const result = await login(data);
    //经过响应拦截器，不需要判断
    /*  if (result.data.success) {
      context.commit("setToken", result.data.data);
    } */
    context.commit("setToken", result);
    //记录时间
    setTimeStamp();
  },
  //登出
  logOut(context) {
    context.commit("removeToken");
    context.commit("removeUserInfo");
  },
  //获取用户信息
  async getUserInfo(context) {
    const result = await getUserInfo();
    //获取用户信息【头像】
    const baseInfo = await getUserDetailById(result.userId);
    //把两者的信息都拼接上去，形成完整的用户信息
    context.commit("setUserInfo", { ...result, ...baseInfo });
    //后期做权限需要
    return result;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
