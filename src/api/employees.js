import request from '@/utils/request'

//获取员工简单列表
export function getEmployeesSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

//获取员工全部列表
export function getEmployees(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

//删除员工
export function delEmployees(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

//新增员工
export function addEmployees(data) {
  return request({
    url: `/sys/user`,
    method: 'post',
    data
  })
}

/* 批量导入员工 */
export function addEmployeesBatch(data) {
  return request({
    url: `/sys/user/batch`,
    method: 'post',
    data
  })
}
/* 获取员工基本信息 */
export function getUserBaseInfo(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
/* 保存员工个人信息 */
export function saveUserInfo(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}
/* 获取岗位信息 */
export function getUserJob(id) {
  return request({
    url: `/employees/${id}/jobs`,
    method: 'get'
  })
}
/* 保存员工岗位信息 */
export function saveUserJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/* 给员工分配角色 */
export function assignRole(data) {
  return request({
    url: `/sys/user/assignRoles`,
    method: 'put',
    data
  })
}