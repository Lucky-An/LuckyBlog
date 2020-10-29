import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为理论赛题目接口
*/

// 理论赛 题目管理接口----------------------
// 理论赛 获取题目方向
export function getCategorys(query) {
  return request({
    url: '/api/v1/theory/admin/tasks/categorys/',
    method: 'get',
    params: query
  })
}

// 理论赛 增加题目方向
export function addCategorys(data) {
  return request({
    url: '/api/v1/theory/admin/tasks/categorys/',
    method: 'post',
    data
  })
}

// 理论赛 删除题目方向
export function deleteCategorys(data) {
  return request({
    url: '/api/v1/theory/admin/tasks/categorys/',
    method: 'delete',
    data
  })
}

// 理论赛 获取题目标签
export function getTags(query) {
  return request({
    url: '/api/v1/theory/admin/tasks/tags/',
    method: 'get',
    params: query
  })
}

// 理论赛 增加题目标签
export function addTags(data) {
  return request({
    url: '/api/v1/theory/admin/tasks/tags/',
    method: 'post',
    data
  })
}

// 理论赛 删除题目标签
export function deleteTags(data) {
  return request({
    url: '/api/v1/theory/admin/tasks/tags/',
    method: 'delete',
    data
  })
}

// 理论赛 获取题目列表
export function fetchTopicList(query) {
  return request({
    url: '/api/v1/theory/admin/tasks/',
    method: 'get',
    params: query
  })
}

// 理论赛 删除题目
export function deleteSub(data) {
  return request({
    url: '/api/v1/theory/admin/tasks/',
    method: 'delete',
    data
  })
}

// 理论赛 创建题目
export function createTopic(data) {
  return request({
    url: '/api/v1/theory/admin/tasks/',
    method: 'post',
    data
  })
}

// 理论赛 编辑题目
export function editTopic(id, data) {
  return request({
    url: '/api/v1/theory/admin/tasks/' + id + '/',
    method: 'patch',
    data
  })
}

// 理论赛 删除题目附件
export function deleteZip(id, data) {
  return request({
    url: '/api/v1/theory/admin/tasks/' + id + '/',
    method: 'delete'
  })
}

// 理论赛 题目信息回显
export function showEditInfo(id) {
  return request({
    url: '/api/v1/theory/admin/tasks/' + id + '/',
    method: 'get'

  })
}

