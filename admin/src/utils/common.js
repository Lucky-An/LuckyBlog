import {
  Loading,
  Message
} from 'element-ui'
// export function fnThrottle(method, delay, duration) {
//   var timer = null
//   var begin = new Date().getTime()
//   return function() {
//     var context = this
//     var args = arguments
//     var current = new Date().getTime()
//     clearTimeout(timer)
//     if (current - begin >= duration) {
//       method.apply(context, args)
//       begin = current
//     } else {
//       timer = setTimeout(function() {
//         method.apply(context, args)
//       }, delay)
//     }
//   }
// }

/**
 * @description [throttle 节流函数]
 * @author shanshuizinong
 * @param {Function} fn 延时调用函数
 * @param {Number} delay 延迟多长时间
 * @param {Number} atleast 至少多长时间触发一次
 * @return {Function} 延迟执行的方法
 */

export function fnThrottle(fn, delay, atleast) {
  let timer = null
  let previous = null
  return function() {
    const now = +new Date()
    if (!previous) previous = now
    if (atleast && now - previous > atleast) {
      fn()
      previous = now
      clearTimeout(timer)
    } else {
      clearTimeout(timer)
      timer = setTimeout(function() {
        fn()
        previous = null
      }, delay)
    }
  }
}

export function openNewTab(router, obj) {
  const routeUrl = router.resolve(obj)
  window.open(routeUrl.href, '_blank')
}

export function formatSize(size) {
  let result
  if (size > 0) {
    const gb = size / 1024 / 1024 / 1024
    if (gb >= 1) {
      result = parseInt(gb * 100) / 100 + 'GB'
    } else if (gb * 1024 >= 1) {
      const mb = gb * 1024
      result = parseInt(mb * 100) / 100 + 'MB'
    } else if (gb * 1024 * 1024 >= 1) {
      const kb = gb * 1024 * 1024
      result = parseInt(kb * 100) / 100 + 'KB'
    } else {
      const bite = gb * 1024 * 1024 * 1024
      result = parseInt(bite * 100) / 100 + 'B'
    }
    return result
  } else {
    return 0
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

// export function getTimezone() {
//   const time = new Date()
//   const timezone = String(time).split(' ')
//   const timezoneNum = timezone[timezone.length - 2][5]
//   return timezoneNum
// }

export function startLoading(loading) { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

export function endLoading(loading) { // 使用Element loading-close 方法
  loading.close()
}

export function getHashCode(hashLength) {
  return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join('')
}

export function ip2int(ip) {
  var num = 0
  ip = ip.split('.')
  num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3])
  num = num >>> 0
  return num
}

// 判断网关ip是否在同一网段。
export function checkSameNetMask(value1, value2, netmask) {
  let ip1 = []
  let ip2 = []
  let nm = []
  ip1 = value1.split('.')
  ip2 = value2.split('.')
  nm = netmask.split('.')
  let ip1_2s = ''
  let ip2_2s = ''
  let inm2s = ''
  let index = 0
  for (index = 0; index < 4; index++) {
    let ip_1 = []
    let ip_2 = []
    let n_m = []
    ip_1 = parseInt(ip1[index]).toString(2)
    ip_2 = parseInt(ip2[index]).toString(2)
    n_m = parseInt(nm[index]).toString(2)
    let tindex
    for (tindex = 0; tindex < (8 - ip_1.length); tindex++) {
      ip1_2s += '0'
    }
    ip1_2s += ip_1
    for (tindex = 0; tindex < (8 - ip_2.length); tindex++) {
      ip2_2s += '0'
    }
    ip2_2s += ip_2
    for (tindex = 0; tindex < (8 - n_m.length); tindex++) {
      inm2s += '0'
    }
    inm2s += n_m
  }
  const len = inm2s.length
  let ip_12 = []
  let ip_22 = []
  let n_m_2 = []
  ip_12 = ip1_2s.split('')
  ip_22 = ip2_2s.split('')
  n_m_2 = inm2s.split('')
  for (index = 0; index < len; index++) {
    if (n_m_2[index] === '1') {
      if (ip_12[index] !== ip_22[index]) {
        return false
      }
    }
  }

  return true
}

export function getNewUrl(url) {
  if (!url) return

  // function find(str, cha, num) {
  //   var x = str.indexOf(cha)
  //   for (var i = 0; i < num; i++) {
  //     x = str.indexOf(cha, x + 1)
  //   }
  //   return x
  // }
  // const i = find(url, ':', 1)
  // let newurl = url.slice(i)
  // const myIP = location.protocol + '//' + location.hostname
  // newurl = myIP + newurl
  const newurl = url.replace('127.0.0.1', location.hostname)
  return newurl
}

export function getErrorMsg(error) {
  const errObj = JSON.parse(error.message)
  const msg = errObj.message || errObj.message_zh || errObj.message || errObj.err_msg
  return msg
}

/**
 * @description 查找最后一个参数字符后的字符串
 * @author Hsia
 * @param {String} string 目标字符串
 * @param {String} cha 参数字符
 * @return {String} 最后一个参数字符后的字符串
 */
export function getLastCha(string, cha) {
  var re = new RegExp('[^' + cha + ']+(?!.)', 'g')
  return string.match(re)[0]
}

/**
 * @description 防抖函数
 * @author Hsia
 * @param {fn} 需要做防抖处理的函数
 * @param {Number}} 防抖时间间隔
 * @return {fn} 防抖处理后的函数
 */
export function debounce(fn, wait) {
  var timer = null
  return function() {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, wait)
  }
}

/**
 * @description url query 拼接
 * @param {Object} 包含 url 和 query 属性
 * @returns {String}} 拼接后的 url
 */
export function setUrlQuery({
  url,
  query
}) {
  if (!url) return ''
  if (query) {
    const queryArr = []
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        queryArr.push(`${key}=${query[key]}`)
      }
    }
    if (url.indexOf('?') !== -1) {
      url = `${url}&${queryArr.join('&')}`
    } else {
      url = `${url}?${queryArr.join('&')}`
    }
  }
  return url
}

export default function getPageTitle(systemTitle, pageTitle) {
  const title = '虚拟靶场系统'
  if (pageTitle) {
    return `${pageTitle} - ${systemTitle || title}`
  }
  return `${systemTitle || title}`
}

/**
 * @description 获取 url 中的 query, 并去重相同字段
 * @param {string, obj} url 及 query 对象
 * @returns {obj}} 去重后的 query 对象
 */
export function getUrlQuery(hash, query) {
  const v = hash.split('?')
  const obj = v[1].split('&').reduce((searchParams, curKV) => {
    const [k, v] = curKV.split('=').map(decodeURIComponent)
    searchParams[k] = v

    return searchParams
  }, {})

  return Object.assign(obj, query)
}

export const topoImgPath = '/static/icon/'

/*
 * 生成uuid算法,碰撞率低于1/2^^122
 * @param x 0-9或a-f范围内的一个32位十六进制数
 */
export function generateUUID() {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/**
 * 计算程序执行时间
 * @type {{startTime: {}, timeSpan: number, start: Timer.start, stop: Timer.stop, getTimeSpan: Timer.getTimeSpan}}
 */
export const Timer = {
  startTime: {},
  stoppedStatus: true,
  start: function() {
    if (this.stoppedStatus) {
      this.startTime = new Date()
      this.stoppedStatus = false
    }
  },
  pause: function() {
    var startTime = this.startTime
    if (startTime) {
      return new Date() - startTime
    } else {
      return -1
    }
  },
  stop: function() {
    var startTime = this.startTime
    if (startTime) {
      this.stoppedStatus = true
      return new Date() - startTime
    } else {
      this.stoppedStatus = true
      return -1
    }
  }
}

/**
 * @description 模拟 a 标签下载
 * @param href： string 下载链接
 * @param filename string 下载文件名
 */
export function downloadFile(href, filename) {
  var link = document.createElement('a')
  link.download = filename || new Date().getTime()
  link.style.display = 'none'
  link.href = href
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * @description 综合前两种方法
 * @param {
   Object
 }
 * 包含 url 和 query 属性
 * @param filename string 下载文件名
 */
export function downloadFileWithQuery({ url, query }, filename) {
  downloadFile(setUrlQuery({
    url,
    query
  }), filename)
}

/**
 * @description 下载文件流
 * @param blob blob 对象
 * @param filename string 下载文件名
 */
export function downloadFileStream(res, filename) {
  const fnArr = res.headers['content-disposition'].split('=')
  let fn = fnArr[fnArr.length - 1].replace(/"/g, '').replace(/UTF-8''/g, '')
  fn = decodeURI(fn)
  const url = URL.createObjectURL(res.data)
  downloadFile(url, filename || fn)
  URL.revokeObjectURL(url)
}

export function checkFileAvailable(res, filename) {
  const { data } = res
  const typeArr = data.type.split('/')
  const type = typeArr[typeArr.length - 1]

  if (type === 'json') {
    var reader = new FileReader()
    reader.readAsText(data)
    reader.onload = function() {
      const json = JSON.parse(this.result)
      if (json.success === false) {
        const message = json.message || json.message_zh
        Message({
          type: 'error',
          message
        })
      } else {
        downloadFileStream(res, filename)
      }
    }
  } else {
    downloadFileStream(res, filename)
  }
}
