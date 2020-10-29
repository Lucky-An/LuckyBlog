import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为数据中心接口
*/

// 数据中心--题目资源统计
export function fetchTaskResou() {
  return request({
    url: '/api/v1/common/admin/index/get_challenge/',
    method: 'get'
  })
}

// 数据中心--获取主节点折线图
export function allNode() {
  return request({
    url: '/api/v1/common/admin/index/get_controller/',
    method: 'get'
  })
}

// 数据中心--获取从节点下拉框
export function getNodeName() {
  return request({
    url: '/api/v1/common/admin/index/get_nodes/',
    method: 'get'
  })
}

// 数据中心--获取从节点折线图
export function getNode(name) {
  return request({
    url: '/api/v1/common/admin/index/get_node/' + name,
    method: 'get'
  })
}

// 数据中心--授权信息
export function fetchAuthorize() {
  return request({
    url: '/api/v1/common/admin/index/get_permit/',
    method: 'get'
  })
}

// 数据中心--用户信息
export function fetchUserInfo() {
  return request({
    url: '/api/v1/common/admin/index/get_role/',
    method: 'get'
  })
}

// 数据中心--镜像统计
export function fetchImage() {
  return request({
    url: '/api/v1/common/admin/index/get_image/',
    method: 'get'
  })
}

// 数据中心--集群管理
export function fetchColony() {
  return request({
    url: '/api/v1/common/admin/index/get_node/',
    method: 'get'
  })
}
