import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import store from './store/store'
import router from './router/router'

import moment from 'moment'

library.add(faBell, faBellSlash, faReply)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  } else {
    return 'Not published'
  }
})

Vue.filter('formatDateOrEmpty', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  } else {
    return ''
  }
})

export const eventBus = new Vue()

const main = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default main
