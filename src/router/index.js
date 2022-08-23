import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
   {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 挂载路由导航守卫
// to将要访问的路径
// from从哪里跳转来
// next是一个函数 next（）放行    next（'/'）强制跳转
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path == '/login'){
    if(!token) next()
    else {
      next({path:'/home'})
    }
  }
  else {
    if(token){
      next()
    }else{
      next({path:'/login'})
    }
  }
})



export default router
