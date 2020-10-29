import request from '@/utils/request'

export function getLogin() {
  return request({
    url: '/api/v1/common/web/auth/login',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/api/v1/common/web/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/v1/common/web/personal/user',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/v1/common/web/auth/logout',
    method: 'get'
  })
}
