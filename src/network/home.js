import {request} from  "./request"


//首页侧边栏
export function GetAside() {
  return request({
    url: "menus",
    method: "get"
  })
}
