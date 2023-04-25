
import Vue from 'vue'
import VueRouter from 'vue-router'
// import routes from './routers'

Vue.use(VueRouter)
const router = new VueRouter({
  // base:"/saber/",
  routes:[
    {
      path:'/login',
      component: () => import('@/views/login/login.vue'),
      meta:{
        title: '登录'
      }
    },
    {
      path:'/',
      component: () => import('@/views/main.vue'),
      children:[
        {
          path:'',
          component: () => import('@/views/home.vue'),
          meta:{
            title: '首页',
            order:'0-1',
            level:1
          }
        },
        {
          path:'modelList',
          component: () => import('@/views/modell/modelList.vue'),
          meta:{
            title: '模型列表',
            order:'1-1'
          }
        },
        {
          path:'modelAdd',
          component: () => import('@/views/modell/modelAdd.vue'),
          meta:{
            title: '模型添加',
            order:'1-2'
          }
        },
        {
          path:'deviceList',
          component: () => import('@/views/device/deviceList.vue'),
          meta:{
            title: '设备列表',
            order:'2-1'
          }
        },
        {
          path:'deviceAdd',
          component: () => import('@/views/device/deviceAdd.vue'),
          meta:{
            title: '设备添加',
            order:'2-2'
          }
        }
      ]
    },
    {
      path:'/data',
      component: () => import('@/views/data.vue'),
      meta:{
        title: '大屏数据'
      }
    },
  ],
  mode: 'history'
})


export default router

import ViewUI from 'view-design';
import util from '@/util';
import config from '@/config'
Vue.use(ViewUI);
ViewUI.LoadingBar.config({
  color: '#5cb85c',
  failedColor: '#f0ad4e',
  height: 5
})

//路由前置首卫
router.beforeEach((to, from, next) => {
  if(to.path !== "/login") {
    if(!util.storage.get(config.KEY.CACHE_LOGIN_USER_NAME) && !util.storage.get(config.KEY.CACHE_LOGIN_PASS_PWD)) {
      return next("/login")
    }
  }
  ViewUI.LoadingBar.start();
  if(to.meta && to.meta.title) document.title = to.meta.title
  next()
})

//路由后置首卫
router.afterEach(route => {
  ViewUI.LoadingBar.finish();
})