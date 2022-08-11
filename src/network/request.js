import http from  "./http"

// 登录
export function Login(params) {
  return http({
    url: "login",
    method: "post",
    data: {...params}

  })
}
