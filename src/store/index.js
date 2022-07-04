import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import user from "./modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
  //没有设置根级别的state、mutation等
  //放到子模块
  modules: {
    app,
    settings,
    user,
  },
  //开放了一个根级别的getters
  getters,
});

export default store;
