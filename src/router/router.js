import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/access/Login')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/auth/user/Signup')
  },
  {
    path: '/course/:id',
    name: 'course',
    component: () => import('../views/course/Course')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
