import Vue from 'vue'
import Store from './store'
import App from './App'
import '@/config/axios'

import share from '@/utils/share'
import uniapp from './utils/uni.js'
Vue.prototype.$uni = uniapp
Vue.mixin(share)

global.Store = Store
global.State = Store.state

Vue.config.productionTip = false

const app = new Vue({
  Store,
  ...App
})
app.$mount()
