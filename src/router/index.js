import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login'


const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
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

  if (to.path === '/login'){
    return next()
  }else if (localStorage.getItem("token")){
    // 如果有token就放行
    // 正常这里最好发请求去后端校验一下后才放行  这里没有写接口
    next();
  }else{
    next('/login')
  }




})

export default router
