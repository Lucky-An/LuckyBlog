import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './lang'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import marked from 'marked'
import echarts from 'echarts' // 引入echarts
import '@/permission' // permission control
// import VueAwesomeSwiper from "vue-awesome-swiper";
// import "swiper/dist/css/swiper.css";
// Vue.use(VueAwesomeSwiper);

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use({ i18n: (key, value) => i18n.t(key, value) })
Vue.prototype.$marked = marked
Vue.prototype.$echarts = echarts // 引入组件
Vue.config.productionTip = false
Vue.prototype.$EventBus = new Vue()

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
