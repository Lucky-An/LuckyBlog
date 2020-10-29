import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为题库管理相关接口
*/

// 获取题目列表
export function fetchTopicList(query) {
  return request({
    url: '/api/v1/rw/admin/tasks/',
    method: 'get',
    params: query
  })
}
// 题目公开
export function topicPublic(data) {
  return request({
    url: '/api/v1/rw/admin/tasks/batch_public/',
    method: 'patch',
    data
  })
}

// 删除题目
export function deleteSub(data) {
  return request({
    url: '/api/v1/rw/admin/tasks/batch_destroy/',
    method: 'delete',
    data
  })
}

//  获取题目类型
export function fetchtype(params) {
  return request({
    url: '/api/v1/jeopardy/admin/categorys/',
    method: 'get',
    params
  })
}

// 创建题目
export function createTopic(data) {
  return request({
    url: '/api/v1/rw/admin/tasks/',
    method: 'post',
    data
  })
}

// 编辑题目
export function editTopic(id, data) {
  return request({
    url: '/api/v1/rw/admin/tasks/' + id,
    method: 'patch',
    data
  })
}

// 题目信息回显
export function showEditInfo(id) {
  return request({
    url: '/api/v1/rw/admin/tasks/' + id,
    method: 'get'

  })
}

// 题目信息回显
export function fetchNode(id) {
  return request({
    url: '/api/v1/rw/admin/tasks/nodes',
    method: 'get'

  })
}

