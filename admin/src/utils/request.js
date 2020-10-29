import axios from 'axios'
import {
  Message,
  Loading
} from 'element-ui'
import store from '@/store'
// import {
//   getToken,
//   removeToken
// } from '@/utils/auth'
import Cookies from 'js-cookie'

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
let meth = '' // 初始化
let isLoading = true // 是否展示loading 值为false时不展示

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    config.headers['X-CSRF-Token'] = Cookies.get('X-CSRF-Token')
    meth = config.method
    isLoading = config.loading
    if (methodAry.includes(meth) && isLoading !== false) {
      startLoading()
    }
    return config
  },
  error => {
    // Do something with request error
    if (methodAry.includes(meth) && error.loading !== false) {
      endLoading()
    }
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (methodAry.includes(meth) && isLoading !== false) {
      endLoading()
    }
    const res = response.data
    if ((res.success + '') != 'undefined') {
      if (!res.success && (res.message_zh || res.message)) {
        Message.error(res.message_zh || res.message)
        return response
      } else {
        return response
      }
    } else {
      return response
    }
  },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //     const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('er:', error)
    if (methodAry.includes(meth) && isLoading !== false) {
      endLoading()
    }
    if (!error.response) {
      Message({
        message: 'Network Error',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      if (error.response.status == 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        })
      }
      const {
        data
      } = error.response
      if (data.message_zh || data.message) {
        Message({
          message: data.message_zh || data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
