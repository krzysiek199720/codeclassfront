import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/router'
import store from './store/store'

import moment from 'moment'

Vue.config.productionTip = false

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  } else {
    return 'Not published'
  }
})

const main = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default main
