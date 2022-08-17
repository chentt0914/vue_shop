import {request} from  "./request"



//用户列表
export function GetUsers(params) {
  return request({
    url: "users",
    method: "get",
    params: {...params}
  })
}

//修改用户状态
export function ChangeuserState(params) {
  return request({
    url: `users/${params.uId}/state/${params.type}`,
    method: "put",
    params: {...params}
  })
}

// 添加用户
export function Adduser(params) {
  return request({
    url: "users",
    method: "post",
    data: {...params}
  })
}

// 根据ID查询用户信息
export function Finduser(params) {
  return request({
    url:`users/${params.id}`,
    method: "get",
    params: {...params}
  })
}

// 编辑用户提交
export function Edituser(params) {
  return request({
    url:`users/${params.id}`,
    method: "put",
    params: {...params}
  })
}

//删除用户信息
export function removeUser(params) {
  return request({
    url:`users/${params.id}`,
    method: "delete",
    params: {...params}
  })
}
