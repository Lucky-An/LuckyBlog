import request from '@/utils/request'

// 获取攻防赛列表
/* *
* 接口说明：
* 以下请求为  系统配置相关接口
*/

// 获取系统配置
export function fetchConfigInfo(params) {
  return request({
    method: 'get',
    url: '/api/v1/common/admin/setting/config/',
    params
  })
}

// 删除系统配置中的图片
export function deleteImage(data) {
  return request({
    method: 'post',
    url: '/api/v1/common/admin/delete_config_logo/',
    data
  })
}

// 保存系统配置
export function submitConfig(data) {
  return request({
    method: 'post',
    url: '/api/v1/common/admin/setting/config/',
    data
  })
}

// 系统管理-日志统计-操作员日志
export function log_message(params) {
  return request({
    method: 'get',
    url: '/api/v1/common/admin/log_message/',
    params
  })
}

// 系统管理-日志统计-获取所有操作员
export function getAllRole() {
  return request({
    method: 'get',
    url: '/api/v1/common/admin/role/'
  })
}

// 系统管理-日志统计-删除操作员日志
export function deleteLog(data) {
  return request({
    method: 'delete',
    url: '/api/v1/common/admin/log_message/',
    data
  })
}

// 系统管理-观摩比赛-比赛列表
export function getAllMatch(params) {
  return request({
    method: 'get',
    url: '/api/v1/common/admin/contest/',
    params
  })
}

// 系统管理-观摩比赛-保存选中的比赛
export function submitMatch(data) {
  return request({
    method: 'post',
    url: '/api/v1/common/admin/contest/',
    data
  })
}

// 实例模板管理
// 列表页
export function flavorsList(data) {
  return request({
    url: '/api/v1/common/admin/flavors',
    method: 'get',
    params: data
  })
}

// 新增
export function createFlavors(data) {
  return request({
    url: '/api/v1/common/admin/flavors',
    method: 'post',
    data
  })
}
// 编辑
export function editFlavors(id, data) {
  return request({
    url: '/api/v1/common/admin/flavors/' + id,
    method: 'patch',
    data
  })
}
// 编辑回显
export function getFlavors(uuid) {
  return request({
    url: '/api/v1/common/admin/flavors/' + uuid,
    method: 'get'
  })
}
// 删除
export function deleteFlavors(data) {
  return request({
    url: '/api/v1/common/admin/flavors',
    method: 'delete',
    data
  })
}
