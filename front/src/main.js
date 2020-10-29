// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.index.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import axios from 'axios'
import router from './router'
import elementui from 'element-ui'
import eleLocale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './common/css/common.css'
import './common/css/markdownBody.css'
import './common/css/reset.css'
import './common/stylus/mixin.styl'
import VueWechatTitle from 'vue-wechat-title'
import VueI18n from 'vue-i18n'
import echarts from 'echarts'
import marked from 'marked'
import $ from 'jquery'
import '../static/js/jquery-ui.min'
import moment from 'moment'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css' //样式文件
import './common/fonts/iconfont.css'//阿里图标文件
import mavonEditor from 'mavon-editor'//markdown编辑器
import './common/css/tui_editor.css'
import 'mavon-editor/dist/css/index.css'
import {Message, Loading, Notification} from 'element-ui'
import {prefix_url} from '@/api/urlPrefix'
import {setStorage} from '@/utils/storage'
import {setCsrf} from '@/common/js/common'
//统一设置请求头,等正式调试接口的时候在配置
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.transformRequest = [function (data) {
//   let ret = ''
//   for (let it in data) {
//     ret+=encodeURIComponent(it) +'='+ encodeURIComponent(data[it])+'&'
//   }
//   return ret
// }]

Vue.prototype.$marked = marked
Vue.prototype.$echarts = echarts
Vue.use(VueI18n)
Vue.use(VueWechatTitle)
Vue.use(elementui)
Vue.use(Vuex)
Vue.use(mavonEditor)
Vue.config.productionTip = false
Vue.prototype.$http = axios

//自定义markdown语法高亮指令
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})
//定义全局过滤器时间戳转天时分秒
Vue.filter('dateformat', function (mss) {
  //参数为毫秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24))
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = (mss % (1000 * 60)) / 1000

  let d, h, m, s
  if (!localStorage.lang || localStorage.lang == 'CN') {
    d = '天'
    h = '时'
    m = '分'
    s = '秒'
  } else {
    d = 'Day'
    h = 'H'
    m = 'M'
    s = 'S'
  }
  let show_day = '', show_hours = '', show_minutes = ''
  if (days !== 0) {
    show_day = days + d
  }
  if (hours == 0) {
    if (days == 0) {
      show_hours = ''
    } else {
      show_hours = 0 + h
    }
  } else {
    show_hours = hours + h
  }
  if (minutes == 0) {
    if (days == 0 && hours == 0) {
      show_minutes = ''
    } else {
      show_minutes = 0 + m
    }
  } else {
    show_minutes = minutes + m
  }
  let show_seconds = seconds + s
  return show_day + show_hours + show_minutes + show_seconds

})
Vue.filter('dateformat2', function (dataStr) {
  localStorage.lang == 'CN' || !localStorage.lang ? moment.locale('zh-cn') : moment.locale('en')
  return moment(dataStr, 'YYYY-MM-DD HH:mm:ss').fromNow() // 7 年前
})
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。

  inserted: function (el) {
    // 聚焦元素
    $(el).find('input').focus()
  },
  //也可以用update,update就是当页面有操作的时候就触发，比如点击按钮，输入框输入都算。
  //有一个要注意的就是，就是你页面有几个input,比如一个input绑定了v-focus,一个没有绑定。你在没绑定v-focus的input输入时，绑定了v-focus的input就是自动获取焦点，这是个bug.
  //update: function (el) {
  //el.focus()
  //}
})
moment.locale('zh-cn')

// //获取cookie
// function getCookie (name) {
//   var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
//   if (arr = document.cookie.match(reg)) {
//     return unescape(arr[2])
//   } else {
//     return null
//   }
// }

let loading

function startLoading () {    //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: 'loading……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading () {    //使用Element loading-close 方法
  if (loading) loading.close()

}

//接口拦截，接口请求前添加csrftoken，便于后台认识
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.loading) {
    startLoading()
  }
  setCsrf(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  endLoading()
  return Promise.reject(error)
})
// axios.get(prefix_url + 'auth/login')//为了获取csrf
// .then((res) => {
//   setStorage('system_config',res.data);
//   axios.interceptors.request.use(
//     config => {
//       setCsrf(config)
//       return config
//     }
//   )
// })

// axios.interceptors.response.use(
//   response => {
//     let res = response.data;
//     if (!res.success) {
//       if(localStorage.lang=='CN'||!localStorage.lang){
//         Message.error(res.message_zh)
//       }else{
//         Message.error(res.message_en)
//       }
//     } else {
//       return response
//     }
//   },
// )

// const setCsrf = (config) => {
//   let toke_key = 'X-CSRF-Token'
//   let token = getCookie('X-CSRF-Token')
//   if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//     config.headers[toke_key] = `${token}`
//   }
// }
// Vue.http.headers.common['token'] = 'YXBpOnBhc3N3b3Jk';
require('./mock/mock.js')

// localstorage 存储
// + 用户登录信息
// + 比赛id
// + 语言
// + 三血提示消息
//
// **vuex 存储**
// + 内部接口请求来的数据

/*---------使用语言包-----------*/

const i18n = new VueI18n({
  locale: localStorage.lang || 'CN',    // 语言标识
  messages: {
    'CN': require('./assets/lang/cn'),   // 中文语言包
    'EN': require('./assets/lang/en')    // 英文语言包
  },
})

eleLocale.i18n((key, value) => i18n.t(key, value))
/*---------设置marked方法-----------*/
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

/* eslint-disable no-new */
const ad_vue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: {App},
  template: '<App/>',
})
let no_message = ['/api/tasks/answers']
axios.interceptors.response.use(
  response => {

    if (response.config.loading) {
      endLoading()
    }

    if (no_message.includes(response.config.url)) {
      return response
    }

    const res = response.data
    if ((res.success + '') != 'undefined') {
      if (!res.success) {
        Notification.error({
          customClass: 'error_notify',
          title: ad_vue.$t('public.error'),
          message: ad_vue.$t('api_message.' + res.message),
        })
        // Message.error(ad_vue.$t('api_message.' + res.message))
        return response
      }
    }

    return response

  },
  error => {
    console.log(error)
    if (error.response.config.loading) {
      endLoading()
    }

    if (error.response.status == 401) {//如果请求接口code==401,此状态为未登录，跳到登录页
      // router.push({
      //   path: '/login'
      // })
      return
    }else if(error.response.status == 504 || error.response.status == 500){//如果服务器错误
      Notification.error({
        customClass: 'error_notify',
        title: ad_vue.$t('public.error'),
        message: ad_vue.$t('api_message.serverError'),
      })
    }else{
      Notification.error({
        customClass: 'error_notify',
        title: ad_vue.$t('public.error'),
        message: ad_vue.$t('api_message.' + error.response.data.message),
      })
    }

    // Message.error(ad_vue.$t('api_message.' + error.response.data.message))
    return Promise.reject(error)
  }
)
export default i18n
