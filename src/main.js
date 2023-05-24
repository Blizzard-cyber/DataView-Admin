
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';//全局引入View UI组件库样式

import axios from 'axios'

Vue.prototype.$axios = axios  // 挂载在vue实例化对象上


import VueMask from 'v-mask'
Vue.use(VueMask); //掩码输入

import config from '@/config';
Vue.prototype.$config = config



import './assets/css/comment.css'

Vue.use(router);
Vue.use(ViewUI);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
