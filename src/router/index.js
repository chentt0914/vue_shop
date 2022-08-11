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

router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo')
  if (to.path == '/login'){
    if(!userInfo) next()
    else {
      next({path:'/'})
    }
  }
  else {
    if(userInfo){
      next()
    }else{
      next({path:'/login'})
    }
  }
})



export default router
