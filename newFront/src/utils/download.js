import { Notification } from 'element-ui'
import i18n from '@/lang'

/**
 * @description url query 拼接
 * @param {Object} 包含 url 和 query 属性
 * @returns {String}} 拼接后的 url
 */
export function setUrlQuery({ url, query }) {
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
        Notification.error({
          customClass: 'error_notify',
          title: i18n.tc('public.error'),
          message: i18n.tc('api_message.' + message)
        })
      } else {
        downloadFileStream(res, filename)
      }
    }
  } else {
    downloadFileStream(res, filename)
  }
}
