import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为攻防赛题目接口
*/

// 解题赛 题目管理接口----------------------
// 解题赛 获取题目列表
export function fetchJeopardyTopicList(query) {
  return request({
    url: '/api/v1/layered/admin/tasks/',
    method: 'get',
    params: query
  })
}

// 解题赛 删除题目
export function deleteJeopardySub(data) {
  return request({
    url: '/api/v1/layered/admin/tasks/batch_destroy/',
    method: 'delete',
    data
  })
}
// 解题赛 共享容器
export function shareJeopardySence(data) {
  return request({
    url: '/api/v1/layered/admin/container/sharing/',
    method: 'patch',
    data
  })
}
// 解题赛获取flag
export function fetchJeopardyFlag(params) {
  return request({
    url: '/api/v1/layered/admin/task/flags/',
    method: 'get',
    params
  })
}

// 解题赛 获取题目类型
export function fetchtype(params) {
  return request({
    url: '/api/v1/layered/admin/categorys/',
    method: 'get',
    params
  })
}

// 解题赛 创建题目
export function createTopic(data) {
  return request({
    url: '/api/v1/layered/admin/tasks/',
    method: 'post',
    data
  })
}

// 解题赛   删除WP
export function deleteJeopardyWriteup(id, index) {
  return request({
    url: '/api/v1/layered/admin/tasks/writeup/' + id,
    method: 'delete'
  })
}

// 解题赛   删除脚本
export function deleteJeopardyScript(id, index) {
  return request({
    url: '/api/v1/layered/admin/tasks/pfs/' + id,
    method: 'delete'
  })
}

// 解题赛  删除附件
export function deleteJeopardyFile(id, index) {
  return request({
    url: '/api/v1/layered/admin/tasks/' + id,
    method: 'delete',
    data: { index: index }
  })
}

// 解题赛 编辑题目
export function editTopic(id, data) {
  return request({
    url: '/api/v1/layered/admin/tasks/' + id,
    method: 'patch',
    data
  })
}

// 解题赛 题目信息回显
export function showJeopardyEditInfo(id) {
  return request({
    url: '/api/v1/layered/admin/tasks/' + id,
    method: 'get'

  })
}

// 解题赛题目公开
export function topicPublic(data) {
  return request({
    url: '/api/v1/layered/admin/tasks/batch_public/',
    method: 'patch',
    data
  })
}
// 解题赛 WP关闭开放上传
export function wpPublic(data) {
  return request({
    url: '/api/v1/layered/admin/tasks/batch_writeup/',
    method: 'patch',
    data
  })
}

// 解题赛获取wp列表
export function fetchWpList(params) {
  return request({
    url: '/api/v1/layered/admin/writeups/',
    method: 'get',
    params
  })
}

// 解题赛 删除wp
export function removeWp(data) {
  return request({
    url: '/api/v1/layered/admin/writeups/batch_destroy/',
    method: 'delete',
    data
  })
}

// 解题赛 获取购买wp列表
export function buyWp(params) {
  return request({
    url: '/api/v1/layered/admin/writeups/purchasing/',
    method: 'get',
    params
  })
}

// 解题赛 答对人数列表
export function fetchCorrect(params) {
  return request({
    url: '/api/v1/layered/admin/solvedlogs/',
    method: 'get',
    params
  })
}

// 解题赛 建议列表
export function fetchProposal(params) {
  return request({
    url: '/api/v1/layered/admin/complains/',
    method: 'get',
    params
  })
}

// 解题赛 建议列表
export function submitExamine(data) {
  return request({
    url: '/api/v1/layered/admin/complains/',
    method: 'post',
    data
  })
}

// 解题赛 获取题目标签
export function fetchTag(params) {
  return request({
    url: '/api/v1/layered/admin/tags/',
    method: 'get',
    params
  })
}

// 解题赛 展示讨论
export function showTalking(params) {
  return request({
    url: '/api/v1/layered/admin/task/discussion/',
    method: 'get',
    params
  })
}
