/* 
本地存储 
1.存token
2.存时间【记录token是否过期】
*/

import Cookies from "js-cookie";

//保证唯一
const TokenKey = "hrsaas-ihrm-token";
const TimeKey = "hrsaas-timestamp-key";

//token
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

//token时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey);
}
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now());
}

export function removeTimeStamp() {
  Cookies.remove(TimeKey);
}
