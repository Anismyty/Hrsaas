import axios from "axios";
//创建实例
const service = axios.create();
//请求拦截器【添加token】
service.interceptors.request.use();
//响应拦截器【处理数据异常】【解构数据结构】
service.interceptors.response.use();
//导出实例
export default service; 
