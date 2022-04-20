// 当前这个模块:API进行统一管理
import request from "./request";

// 登录
export const reqLogin = (data) => {
    return request({ url: `/login`, data, method: "post" })
}

// 获取所有的菜单
export const reqGetMenuList = () => {
    return request({ url: `/menus`, method: "get" })
}


// 获取用户列表
export const reqUserList = (params) => {
    return request({ url: `/users`, params, method: "get" })
}

// 获取用户状态
export const reqChangeState = (id, status) => {
    return request({ url: `/users/${id}/state/${status}`, method: "put" })
}
// 添加用户
export const reqAddUser = (data) => {
    return request({ url: `/users`, data, method: "post" })
}
// 获取用户详细信息
export const reqUserDetail = (id) => {
    return request({ url: `/users/${id}`, method: "get" })
}
// 修改用户信息
export const reqEditUserInfo = (id,data) => {
    return request({ url: `/users/${id}`,data, method: "put" })
}

// 删除用户信息
export const reqDeleteUserInfo = (id) => {
    return request({ url: `/users/${id}`, method: "delete" })
}

