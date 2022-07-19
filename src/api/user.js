import request from '@/utils/request'

//返回的是一个promise对象

//登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

//获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/* 根据用户id获取用户详情 */
export function getUserDetailById(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
    method: 'get'
  })
}
/* 更新用户信息 */
export function UpdateUserDetailById(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
