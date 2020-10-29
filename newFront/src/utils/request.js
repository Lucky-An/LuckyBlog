import axios from 'axios'
import {
  Message,
  Loading,
  Notification
} from 'element-ui'
import router from '@/router'
import Cookies from 'js-cookie'
import i18n from '@/lang'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 50000 // request timeout
})

let loading

function startLoading() { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() { // 使用Element loading-close 方法
  loading.close()
}

const methodAry = ['post', 'patch'] // 只有是post或patch才触发加载
// let meth = ''// 初始化
let isLoading = true // 是否展示loading 值为false时不展示
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    config.headers['X-CSRF-Token'] = Cookies.get('X-CSRF-Token')
    // meth = config.method
    isLoading = config.loading

    if (methodAry.includes(config.method) && isLoading !== false) {
      startLoading()
    }
    return config
  },
  error => {
    // console.log(error.config);
    // Do something with request error
    // if (methodAry.includes(meth) && error.loading !== false) {
    //   endLoading()
    // }
    if (loading) {
      endLoading()
    }
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (methodAry.includes(response.config.method) && isLoading !== false) {
      endLoading()
    }

    const no_message = ['/api/tasks/answers']

    if (no_message.includes(response.config.url)) {
      return response
    }

    const res = response.data
    if ((res.success + '') != 'undefined') {
      if (!res.success) {
        Notification.error({
          customClass: 'error_notify',
          title: i18n.tc('public.error'),
          message: i18n.tc('api_message.' + res.message)
        })
        // Message.error(ad_vue.$t('api_message.' + res.message))
        return response
      }
    }

    return response
  },
  error => {
    console.log(error)
    if (error.response.status == 401) {
      router.push('/login')
    }
    // if (methodAry.includes(meth) && isLoading !== false) {
    //   endLoading()
    // }
    if (error.response.status == 424) {
      router.push('/match/taskList')
    }
    if (loading) {
      endLoading()
    }
    if (error.response.data.message_zh || error.response.data.message) {
      Notification.error({
        customClass: 'error_notify',
        title: i18n.tc('public.error'),
        message: i18n.tc('api_message.' + (error.response.data.message_zh || error.response.data.message))
      })
    }

    return Promise.reject(error)
  }
)

export default service
