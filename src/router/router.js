import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store/store'

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
    component: () => import('../views/course/course/Course')
  },
  {
    path: '/course',
    name: 'courseSave',
    component: () => import('../views/course/course/CourseCreate')
  },
  {
    path: '/course/:id/edit',
    name: 'courseEdit',
    component: () => import('../views/course/course/CourseEdit')
  },
  {
    path: '/course/:id/edit/data',
    name: 'courseEditData',
    component: () => import('../views/course/course/CourseDataEdit')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/course/Search')
  },
  {
    path: '/course/group/:id',
    name: 'courseGroup',
    component: () => import('../views/course/courseGroup/CourseGroup')
  },
  {
    path: '/course/group/:id/edit',
    name: 'courseGroupSave',
    component: () => import('../views/course/courseGroup/CourseGroupSave')
  },
  {
    path: '/course/:id/quiz',
    name: 'quiz',
    component: () => import('../views/course/quiz/Quiz')
  },
  {
    path: '/course/:id/quiz/edit',
    name: 'quizEdit',
    component: () => import('../views/course/quiz/QuizEdit')
  },
  {
    path: '/user',
    name: 'settings',
    component: () => import('../views/auth/user/UserSettings')
  },
  {
    path: '/settings',
    name: 'settingsAdmin',
    component: () => import('../views/auth/user/AdminSettings')
  },
  {
    path: '/auth/role/:id',
    name: 'roleEdit',
    component: () => import('../views/auth/role/RoleEdit')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  store.dispatch('dataLineSet', null)
  store.dispatch('dataCourseDataIdSet', null)
  next()
})

export default router
