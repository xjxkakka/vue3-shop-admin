// 当前这个模块:API进行统一管理
import request from "./request";

// 商品列表数据
export const reqGetOrderList = (params) => {
    return request({ url: `/orders`, params, method: "get" })
}