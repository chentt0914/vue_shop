import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '@/views/Home'
const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
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
      next({path:'/'})
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
