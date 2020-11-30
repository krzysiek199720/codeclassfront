import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/store'

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
    component: () => import('../views/auth/access/Login'),
    beforeEnter: (to, from, next) => {
      if (store.getters.authIsAuthenticated) {
        next({ name: 'Home' })
      }
      next()
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../views/auth/access/Logout')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/auth/user/Signup'),
    beforeEnter: (to, from, next) => {
      if (store.getters.authIsAuthenticated) {
        next({ name: 'Home' })
      }
      next()
    }
  },
  {
    path: '/course/:id',
    name: 'course',
    component: () => import('../views/course/course/Course')
  },
  {
    path: '/course/:id/edit',
    name: 'courseEdit',
    component: () => import('../views/course/course/CourseEdit'),
    beforeEnter: (to, from, next) => {
      next(store.getters.authHasPermissionAny(['save_course', 'delete_course']))
    }
  },
  {
    path: '/course/:id/edit/data',
    name: 'courseEditData',
    component: () => import('../views/course/course/CourseDataEdit'),
    beforeEnter: (to, from, next) => {
      next(store.getters.authHasPermissionAny(['save_course_data']))
    }
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
    component: () => import('../views/course/quiz/QuizEdit'),
    beforeEnter: (to, from, next) => {
      next(store.getters.authHasPermissionAny(['save_quiz', 'delete_quiz']))
    }
  },
  {
    path: '/user',
    name: 'settings',
    component: () => import('../views/auth/user/UserSettings'),
    beforeEnter: (to, from, next) => {
      if (store.getters.authIsAuthenticated) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
  {
    path: '/settings',
    name: 'settingsAdmin',
    component: () => import('../views/auth/user/AdminSettings'),
    beforeEnter: (to, from, next) => { next() } // fixme is admin
  },
  {
    path: '/auth/role/:id',
    name: 'roleEdit',
    component: () => import('../views/auth/role/RoleEdit'),
    beforeEnter: (to, from, next) => {
      next(store.getters.authHasPermission('get_role') && store.getters.authHasPermission('save_role'))
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
