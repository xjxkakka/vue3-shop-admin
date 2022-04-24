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

// 权限
// 获取权限列表
export const reqGetRightsList = () => {
    return request({ url: `/rights/list`, method: "get" })
}
// 获取权限列表
export const reqGetRightsTree = () => {
    return request({ url: `/rights/tree`, method: "get" })
}

// 获取角色列表
export const reqGetRolesList = () => {
    return request({ url: `/roles`, method: "get" })
}

// 添加角色
export const reqAddRoles = (data) => {
    return request({ url: `/roles`,data, method: "post" })
}

// 获取角色详情
export const reqRolesInfo = (id) => {
    return request({ url: `/roles/${id}`, method: "get" })
}

// 获取编辑角色详情
export const reqEditRolesInfo = (id,data) => {
    return request({ url: `/roles/${id}`,data, method: "put" })
}

// 获取删除角色
export const reqDeleteRolesInfo = (id) => {
    return request({ url: `/roles/${id}`, method: "delete" })
}

// 获取删除角色权限
export const reqDeleteRolesRights = (roleId,rightId) => {
    return request({ url: `/roles/${roleId}/rights/${rightId}`, method: "delete" })
}

// 获取角色授权
export const reqRolesAuthorization  = (roleId,data) => {
    return request({ url: `roles/${roleId}/rights`,data:{rids:data} ,method: "post" })
}

// 获取角色列表
export const reqUserInfo  = () => {
    return request({ url: `roles`,method: "get" })
}
// 更新角色
export const reqChangeRoles  = (id,rid) => {
    return request({ url: `users/${id}/role`,data:{rid},method: "put" })
}


// 商品分类数据
// 获取商品分类数据
export const reqGetCategoryList  = (params) => {
    return request({ url: `categories`,params,method: "get" })
}


// 获取父级分类的数据列表
export const reqGetParentCateList  = () => {
    return request({ url: `categories?type=2`,method: "get" })
}

// 添加分类的数据列表
export const reqAddCateList  = (data) => {
    return request({ url: `categories`,data,method: "post" })
}

// 添加删除的数据列表
export const reqDeleteCateList  = (id) => {
    return request({ url: `categories/${id}`,method: "delete" })
}
// 根据 id 查询分类
export const reqGetCateInfo  = (id) => {
    return request({ url: `categories/${id}`,method: "get" })
}
// 编辑提交分类
export const reqEditCateInfo  = (id,data) => {
    return request({ url: `categories/${id}`,data,method: "put" })
}

