import {request} from  "./request"

// 登录
export function Login(params) {
  return request({
    url: "login",
    method: "post",
    data: {...params}

  })
}


