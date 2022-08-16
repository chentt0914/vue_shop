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
    url: "users/:uId/state/:type",
    method: "put",
    params: {...params}
  })
}
