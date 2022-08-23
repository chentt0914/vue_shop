import {request} from  "./request"


export function getRightsList(params) {
  return request({
    url: `rights/list`,
    method: "get"

  })
}
