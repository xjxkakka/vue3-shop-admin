// 当前这个模块:API进行统一管理
import request from "./request";

// 登录
export const reqLogin = (data) => {
    return request({url: `/login`,data, method: "post"})
}
