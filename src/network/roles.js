import {request} from  "./request"

// 获取角色列表
export function getRolesList(params) {
  return request({
    url: "roles",
    method: "get"
  })
}

//删除角色指定权限
export function removeRoleRight(params) {
  return request({
    url: `roles/${params.roleId}/rights/${params.rightId}`,
    method: "delete",
  })
}

// 添加新角色
export function addRoles(params) {
  return request({
    url: "roles",
    method: "post",
    data:params
  })
}


//根据ID查询角色
export function findRole(params) {
  return request({
    url: `roles/${params.id}`,
    method: "get",
  })
}

// 编辑提交角色
export function editRole(params) {
  return request({
    url: `roles/${params.id}`,
    method: "put",
    data: {...params}
  })
}

// 获取权限树
export function getRightsTree() {
  return request({
    url: `rights/tree`,
    method: "get"

  })
}


//角色授权
export function addRights(params) {
  return request({
    url: `roles/${params.roleId}/rights`,
    method: "post",
    data:{...params}
  })
}
