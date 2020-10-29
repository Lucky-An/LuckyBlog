import axios from 'axios'
import elementui from 'element-ui'
import {Message, Loading, Notification} from 'element-ui'
import store from '@/store'
import {getToken,removeToken} from '@/utils/auth'
import Cookies from 'js-cookie'
import router from '../router'
import i18n from '../main.js'
// import i18n from 'vue-i18n'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

  let loading;
  function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
      lock: true,
      text: '加载中……',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }

  function endLoading() {    //使用Element loading-close 方法
    loading.close()
  }
  const methodAry=['post','patch']//只有是post或patch才触发加载
  let meth='';//初始化

service.interceptors.request.use(function (config) {
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
service.interceptors.response.use(
    response => {
      if (response.config.loading) {
        endLoading()
      }
      let no_message = ['/api/tasks/answers']
      if (no_message.includes(response.config.url)) {
        return response
      }

      const res = response.data
      if ((res.success + '') != 'undefined') {
        if (!res.success) {
          let m_title=''
          let m_content='';
          if(i18n.locale=='CN'){
            m_title = '错误'
            m_content = i18n.messages.CN.api_message[res.message]

          }else{
            m_title = 'Error'
            m_content = i18n.messages.EN.api_message[res.message]
          }
          Notification.error({
            customClass: 'error_notify',
            title: m_title,
            message: m_content,
          })
          // Message.error(ad_vue.$t('api_message.' + res.message))
          return response
        }
      }

      return response

    },
    error => {
      if (error.response.config.loading) {
        endLoading()
      }

      if (error.response.status == 401) {//如果请求接口code==401,此状态为未登录，跳到登录页
        router.push({
          path: '/login'
        })
        return
      }else if(error.response.status == 504 || error.response.status == 500){//如果服务器错误
        let m_title=''
        let m_content='';
        if(i18n.locale=='CN'){
          m_title = '错误'
          m_content = i18n.messages.CN.api_message.serverError
        }else{
          m_title = 'Error'
          m_content = i18n.messages.EN.api_message.serverError
        }
        Notification.error({
          customClass: 'error_notify',
          title: m_title,
          message: m_content,
        })
      }else{
        let m_title=''
        let m_content='';
        if(i18n.locale=='CN'){
          m_title = '错误'
          m_content = i18n.messages.CN.api_message[error.response.data.message]
        }else{
          m_title = 'Error'
          m_content = i18n.messages.EN.api_message[error.response.data.message]
        }
        Notification.error({
          customClass: 'error_notify',
          title: m_title,
          message: m_content,
        })
      }

      // Message.error(ad_vue.$t('api_message.' + error.response.data.message))
      return Promise.reject(error)
    }
  )
  // axios.get('/api/v1/common/web/auth/login')//为了获取csrf
  //   .then(() => {
  //     axios.interceptors.request.use(
  //       config => {
  //         setCsrf(config)
  //         return config
  //       }
  //     )
  //   })
  //获取cookie
  function getCookie (name) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2])
    } else {
      return null
    }
  }
  const setCsrf = (config) => {
    let toke_key = 'X-CSRF-Token'
    let token = getCookie('X-CSRF-Token')
    if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers[toke_key] = `${token}`
    }
  }



export default service
// request interceptor
// service.interceptors.request.use(
//   config => {
//     // Do something before request is sent
//     config.headers['X-CSRF-Token'] = Cookies.get('X-CSRF-Token');
//
//     meth=config.method
//     if(methodAry.includes(meth)) {
//       startLoading()
//
//     }
//     return config
//   },
//   error => {
//     // Do something with request error
//     if(methodAry.includes(meth)) {
//       endLoading()
//     }
//     console.log(error) // for debug
//     Promise.reject(error)
//   }
// )

// response interceptor
// service.interceptors.response.use(
//   response => {
//     if(methodAry.includes(meth)) {
//       endLoading()
//     }
//     const res = response.data;
//     if ((res.success + '')!='undefined') {
//       if (!res.success) {
//         Message.error(res.message_zh)
//       } else {
//         return response
//       }
//     }else{
//       return response
//     }
//
//   },
//   /**
//    * 下面的注释为通过在response里，自定义code来标示请求状态
//    * 当code返回如下情况则说明权限有问题，登出并返回到登录页
//    * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
//    * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
//    */
//     // response => {
//     //     const res = response.data
//     //   if (res.code !== 20000) {
//     //     Message({
//     //       message: res.message,
//     //       type: 'error',
//     //       duration: 5 * 1000
//     //     })
//     //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//     //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//     //       // 请自行在引入 MessageBox
//     //       // import { Message, MessageBox } from 'element-ui'
//     //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//     //         confirmButtonText: '重新登录',
//     //         cancelButtonText: '取消',
//     //         type: 'warning'
//     //       }).then(() => {
//     //         store.dispatch('FedLogOut').then(() => {
//     //           location.reload() // 为了重新实例化vue-router对象 避免bug
//     //         })
//     //       })
//     //     }
//     //     return Promise.reject('error')
//     //   } else {
//     //     return response.data
//     //   }
//     // },
//   error => {
//     if(error.response.status==401){
//       store.dispatch('FedLogOut').then(() => {
//         location.reload()// In order to re-instantiate the vue-router object to avoid bugs
//       })
//     }
//     if(methodAry.includes(meth)) {
//       endLoading()
//     }
//     Message({
//       message: error.response.data.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
//

