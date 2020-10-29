import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为用户管理相关接口
*/

// 获取用户列表
export function fetchList(query) {
  return request({
    url: '/api/ad_users/users/',
    method: 'get',
    params: query
  })
}
// 获取国家
export function fetchCountry(query) {
  return request({
    url: '/api/ad_users/countrys/',
    method: 'get'
  })
}

// 获取地区
export function fetchState(query) {
  return request({
    url: '/api/ad_users/state/',
    method: 'get',
    params: query
  })
}

// 获取城市
export function fetchCity(query) {
  return request({
    url: '/api/ad_users/citys/',
    method: 'get',
    params: query
  })
}

// 获取角色
export function fetchClasses(query) {
  return request({
    url: '/api/ad_users/users/classes',
    method: 'get'
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/api/ad_users/users/batch_destroy/',
    method: 'delete',
    data
  })
}

// 加入黑名单
export function blacklist(data) {
  return request({
    url: '/api/ad_users/users/in_blacklist/',
    method: 'patch',
    data
  })
}

// 用户信息回显
export function userInfo(id) {
  return request({
    url: '/api/ad_users/users/' + id,
    method: 'get'
  })
}

// 用户信息编辑
export function editUser(id, data) {
  return request({
    url: '/api/ad_users/users/' + id,
    method: 'patch',
    data
  })
}

// 创建用户
export function addUser(data) {
  return request({
    url: '/api/ad_users/users/',
    method: 'post',
    data
  })
}

/* *
* 接口说明：
* 以下请求为个人数据相关接口
*/

// 获取用户列表
export function fetchUserData(query) {
  return request({
    url: '/api/ad_users/personal_datas/',
    method: 'get',
    params: query
  })
}

// 答题日志
export function fetchLog(query) {
  return request({
    url: '/api/ad_users/solvedlogs/',
    method: 'get',
    params: query
  })
}

// 答题状态
export function fetchStatus(id, query) {
  return request({
    url: '/api/ad_users/answerstatus/' + id,
    method: 'get',
    params: query
  })
}
