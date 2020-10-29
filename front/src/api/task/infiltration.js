import request from '@/utils/request'


// 获取指南
export function getGuide(params) {
  return request({
    url: '/auth/login',
    method: 'get',
    data
  })
}
