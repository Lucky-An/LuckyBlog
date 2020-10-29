import request from '@/utils/request'
/* *
 * 接口说明：
 * 以下请求为  全部比赛VPN相关接口
 */

// 竞赛状态vpn开关
export function controlJoin(event_id) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/vpn/join',
    method: 'post'
  })
}

// vpn部署
export function vnpDeploy(event_id) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/vpn_server/deploy',
    method: 'post'
  })
}

// 证书部署申请
export function vpnCaDeploy(event_id) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/vpn_ca/deploy',
    method: 'post'
  })
}

// VPN回收
export function removeDeploy(event_id) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/vpn_server/deploy',
    method: 'delete'
  })
}

// 获取所有server
export function getServer(event_id) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/server/list',
    method: 'get'
  })
}

// 获取所有vpn用户列表
export function getVpnUser(event_id, params) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/user/list',
    method: 'get',
    params
  })
}

// 获取vpn服务器列表
export function getVpnServers(event_id, params) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/vpn_server/deploy',
    method: 'get',
    params
  })
}

// 重置单个vpn服务器
export function resetVpnServer(event_id, vpnId) {
  return request({
    url: '/api/v1/common/admin/vpn/' + event_id + '/vpn_reset/' + vpnId + '/deploy',
    method: 'post'
  })
}
