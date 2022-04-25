import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login'


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import ('../views/Home.vue'),
        redirect: '/home/users',
        children: [
            // 用户管理
            { path: 'users',name:'users', component: () => import('../views/user/Users.vue') },
            // 权限管理
            { path: 'rights',name:'rights', component: () => import('../views/power/Rights.vue') },
            { path: 'roles',name:'roles', component: () => import('../views/power/Roles.vue') },
            // 商品管理
            { path: 'goods',name:'goods', component: () => import('../components/Welcome.vue') },
            { path: 'params',name:'params', component: () => import('../views/goods/Params.vue') },
            { path: 'categories',name:'categories', component: () => import('../views/goods/Categories.vue') },
            // 订单管理
            { path: 'orders',name:'orders', component: () => import('../components/Welcome.vue') },
            // 数据统计
            { path: 'reports',name:'reports', component: () => import('../components/Welcome.vue') },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    /*   to 将要访问的路径
       from 代表从哪个路径跳转而来
       next 是一个函数，表示要放行
       next()  放行   next('/login')  强制跳转*/

    if (to.path === '/login') {
        return next()
    } else if (localStorage.getItem("token")) {
        // 如果有token就放行
        // 正常这里最好发请求去后端校验一下后才放行  这里没有写接口
        next();
    } else {
        next('/login')
    }


})

export default router
