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
    path: '/logout',
    name: 'logout',
    component: () => import('../views/auth/access/Logout')
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
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/course/Search')
  },
  {
    path: '/course/group/:id',
    name: 'courseGroup',
    component: () => import('../views/course/CourseGroup')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
