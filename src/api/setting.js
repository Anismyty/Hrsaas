import request from "@/utils/request";

//查询角色
export function getAllStaff(params) {
  return request({
    url: "/sys/role",
    params,
  });
}
//添加角色
export function addStaff(data) {
  return request({
    url: `/sys/role`,
    method: "POST",
    data,
  });
}
//删除角色
export function delStaffByID(id) {
  return request({
    url: `/sys/role/${id}`,
    method: "DELETE",
  });
}
//根据id获取角色信息
export function getStaffById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: "GET",
  });
}
//编辑角色
export function editStaffById(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: "PUT",
    data,
  });
}
//根据ID查询企业
export function inqueryCompanyById(id) {
  return request({
    url: `/company/${id}`,
  });
}
