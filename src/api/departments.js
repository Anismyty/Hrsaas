import request from "@/utils/request";

//新增部门
export function addDepartment(data) {
  return request({
    url: "/company/department",
    method: "post",
    data,
  });
}

//查询企业部门列表
export function inquiryDepartmentList() {
  return request({
    url: "/company/department",
    method: "GET",
  });
}

//根据ID修改部门详情
export function modifyDepartmentById(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: "PUT",
    data,
  });
}

//根据ID删除部门详情
export function deleteDepartmentById(id) {
  return request({
    url: `/company/department/${id}`,
    method: "DELETE",
  });
}

//根据ID查询部门详情
export function inqueryDepartmentById(id) {
  return request({
    url: `/company/department/${id}`,
    method: "GET",
  });
}
