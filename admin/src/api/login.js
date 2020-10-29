import request from '@/utils/request'

// export function loginByUsername(data) {
export function loginByUsername(data) {
  return request({
    url: '/api/v1/common/admin/adminZ2yjJqx1JcFiP1lncEmModvtKL6jE8Ny/login',
    method: 'post',
    data
  })
}

export function fetchToken() {
  return request({
    url: '/api/v1/common/admin/adminZ2yjJqx1JcFiP1lncEmModvtKL6jE8Ny/login',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/v1/common/admin/adminZ2yjJqx1JcFiP1lncEmModvtKL6jE8Ny/logout',
    method: 'get'
  })
}

// 获取全局信息
export function getConfig() {
  return request({
    url: '/api/v1/common/admin/index/get_data/',
    method: 'get'
  })
}

// 获取许可状态
export function getPermit() {
  return request({
    url: '/api/v1/admin/get_license/',
    method: 'get'
  })
}

// 上传许可
export function uploadPermit(data, params) {
  return request({
    url: '/api/v1/upload/license/',
    method: 'post',
    data,
    params
  })
}

// 上传成功 更新许可
export function updatePermit(data, params) {
  return request({
    url: '/api/v1/admin/update_license/',
    method: 'post',
    data,
    params
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

