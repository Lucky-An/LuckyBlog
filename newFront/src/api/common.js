import request from '@/utils/request'
// 公共接口文件，里面存放一些公用接口

//  公用的下载文件方法
export function downloadFile(url, params) {
  return request({
    method: 'get',
    url: url,
    params,
    responseType: 'blob'
  })
}
