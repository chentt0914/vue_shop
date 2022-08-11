import axios from "axios";
export const URL = "http://47.108.251.106:8881/api/private/v1/";

const service = axios.create({
  baseURL: URL,
  timeout: 5000 * 60 * 1, //分钟
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});
// 请求拦截
// service.interceptors.request.use(
//   config => {
//     if (!config.headers["Authorization"]) {
//       //带token
//       if (localStorage.token) {
//         config.headers["Authorization"] = localStorage.token;
//       }
//     }
//     return config;
//   },
//   error => {
//     iView.Message.error("请求超时！");
//     return Promise.reject(error);
//   }
// );

// 响应拦截
// service.interceptors.response.use(
//   response => {
//     let token = response.data["token"];
//     if (token && token != "") {
//       localStorage.token = token;
//     }
//     if (response.status && response.status != 200) {
//       iView.Message.error(response.statusText || "业务异常！");
//     }

//     if (response.data.status == 101) {
//       iView.Message.warning("权限不足！！！");
//     }
//     return response.data;
//   },
//   err => {
//     console.log(err);
//     iView.Message.error("请求失败！");
//     return Promise.reject(err);
//   }
// );

export default service;

