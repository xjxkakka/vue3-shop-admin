import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login'
import { reqLogin } from '../api'

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
    component: () => import('../components/Home.vue')
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
  // 访问的login正常放行
  if (to.path == '/login') next();

  // 如果访问其他的先查看下有没token 没token强制跳转到登录页面
  const tokenStr = localStorage.getItem("token");
  if (!tokenStr){
    return next('/login')
  }else{
    // 拿到token 像后端发送请求查看token是否正确，假的强制跳转登录页面 这里没后端校验
    next();
  }

})

export default router
