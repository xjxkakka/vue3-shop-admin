// 当前这个模块:API进行统一管理
import request from "./request";

// 商品列表数据
export const reqGoodsList = (params) => {
    return request({ url: `/goods`, params, method: "get" })
}

// 商品列表数据
export const reqDeleteGoodsInfo = (id) => {
    return request({ url: `/goods/${id}`, method: "delete" })
}

// 添加商品数据
export const reqAddGoodsInfo = (data) => {
    return request({ url: `/goods`,data, method: "post" })
}
export const reqPutGoodsInfo = (id,data) => {
    return request({ url: `/goods/${id}`,data, method: "put" })
}