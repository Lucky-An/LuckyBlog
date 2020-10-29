import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为工具库管理接口
*/

// 工具库管理--工具库列表
export function fetchToolList(params) {
  return request({
    url: '/api/v1/common/admin/tool/',
    method: 'get',
    params
  })
}

// 工具库管理--公开、隐藏
export function isShowTool(data) {
  return request({
    url: '/api/v1/common/admin/tool_show/',
    method: 'post',
    data
  })
}

// 工具库管理--删除工具
export function remove(data) {
  return request({
    url: '/api/v1/common/admin/tool_delete/',
    method: 'post',
    data
  })
}

// 工具库管理--保存工具
export function add(data) {
  return request({
    url: '/api/v1/common/admin/tool/',
    method: 'post',
    data
  })
}

// 工具库管理--获取工具信息回显
export function getInfo(params) {
  return request({
    url: '/api/v1/common/admin/tool/',
    method: 'get',
    params
  })
}

// 工具库管理--保存编辑
export function edit(params, data) {
  return request({
    url: '/api/v1/common/admin/tool/',
    method: 'patch',
    params,
    data
  })
}

// 工具库管理--获取标签列表
export function getTag() {
  return request({
    url: '/api/v1/common/admin/tool/tag/',
    method: 'get'
  })
}

// 工具库管理--获取标签列表
export function getSystem() {
  return request({
    url: '/api/v1/common/admin/tool_tag/',
    method: 'get'
  })
}

// 工具库管理--新增标签
export function addTag(data) {
  return request({
    url: '/api/v1/common/admin/tool/tag/',
    method: 'post',
    data
  })
}

// 工具库管理--删除标签
export function romoveTag(data) {
  return request({
    url: '/api/v1/common/admin/tool/tag/',
    method: 'delete',
    data
  })
}

