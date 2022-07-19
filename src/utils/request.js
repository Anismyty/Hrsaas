import axios from "axios";

//跳转路由
import router from "@/router";

//提示错误的组件
import { Message } from "element-ui";
import store from "@/store";

//读取本地存储
import { getTimeStamp } from "@/utils/auth";

//定义有效的时间【超过这个时间token就是过期的】
const TimeOut = 3600;

//创建实例
const service = axios.create({
  //这是基础地址【根据执行命令选择不同的API】
  //开发环境下 npm run dev => .env.development => api => 触发跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  //超时时间
  timeout: 5000,
});

//请求拦截器【添加token】【验证token是否过期】
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      //有token的情况下才验证是否过期
      //这个是主动操作
      if (IsCheckTimeout()) {
        //先删token
        store.dispatch("user/logOut");
        //跳转登录页
        router.push("/login");
        return Promise.reject(new Error("Token超时"));
      }
      config.headers["Authorization"] = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//响应拦截器【处理数据异常】【解构数据结构】
service.interceptors.response.use(
  //成功的数据
  (response) => {
    const { success, message, data } = response.data;
    if (success) {
      return data;
    } else {
      //人为上业务错了，进入catch
      Message.error(message);
      return Promise.reject(new Error(message));
    }
  },
  (err) => {
    //token过期，返回消息进入error【被动返回】【后端消息】
    if (err.response && err.response.data && err.response.data.code === 10002) {
      //先删token
      store.dispatch("user/logOut");
      //跳转登录页
      router.push("/login");
    } else {
      //提示错误信息
      Message.error(err.message);
    }
    //返回执行错误，进入catch
    return Promise.reject(err);
  }
);

//定义方法验证是否超时
function IsCheckTimeout() {
  let currentTime = Date.now();
  let pastTime = getTimeStamp();
  return (currentTime - pastTime) / 1000 > TimeOut;
}

//导出实例
export default service;
