import request from '@/utils/request'

/* *
 * 接口说明：
 * 以下请求为  系统运维
 */

// VPN列表
export function vpnOrMacLIst(params) {
  return request({
    url: '/api/v1/common/admin/system/events',
    method: 'get',
    params
  })
}

// VPN详情
export function vpnDetail(id, params) {
  return request({
    url: '/api/v1/common/admin/system/' + id + '/vpn',
    method: 'get',
    params
  })
}

// 强制下线
export function offline(id, data) {
  return request({
    url: '/api/v1/common/admin/system/' + id + '/vpn',
    method: 'post',
    data
  })
}

// mac详情
export function macDetail(id, params) {
  return request({
    url: '/api/v1/common/admin/system/' + id + '/mac',
    method: 'get',
    params
  })
}

// mac详情
export function removeMac(id, data) {
  return request({
    url: '/api/v1/common/admin/system/' + id + '/mac',
    method: 'delete',
    data
  })
}

// 实例管理 获取进行中的比赛
export function getTasking() {
  return request({
    url: '/api/v1/common/admin/system/events_on',
    method: 'get'
  })
}

// 实例管理 获取实例管理列表 获取详情
export function getExample(params) {
  return request({
    url: '/api/v1/common/admin/system/instances',
    method: 'get',
    params
  })
}

// 实例管理 实例控制
export function controlExample(data) {
  return request({
    url: '/api/v1/common/admin/system/instances',
    method: 'post',
    data
  })
}

// 集群管理 获取集群管理列表
export function getColony(params) {
  return request({
    url: '/api/v1/common/admin/system/clusters',
    method: 'get',
    params
  })
}

// 集群管理 集群管理控制
export function controlColony(data) {
  return request({
    url: '/api/v1/common/admin/system/clusters',
    method: 'post',
    data
  })
}

// 网络管理 获取网络列表
export function internetList(params) {
  return request({
    url: '/api/v1/common/admin/kvm/get_network/',
    method: 'get',
    params
  })
}

// 实例管理 删除全部容器
export function removeInetner() {
  return request({
    url: '/api/v1/common/admin/kvm/delete_all_network/',
    method: 'post'

  })
}
