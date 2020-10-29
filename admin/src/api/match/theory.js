import request from '@/utils/request'
/* *
* 接口说明：
* 以下请求为  理论赛相关接口
*/

// 理论赛 创建竞赛相关接口------------------
// 理论赛 获取比赛列表
export function fetchList(query) {
  return request({
    url: '/api/v1/theory/admin/evts/',
    method: 'get',
    params: query
  })
}

// 理论赛 删除赛事event
export function deleteMatch(query) {
  return request({
    url: '/api/v1/theory/admin/evts/',
    method: 'delete',
    data: query
  })
}

// 理论赛 公开、隐藏赛事
export function publicMatch(query) {
  return request({
    url: '/api/v1/theory/admin/evts/',
    method: 'patch',
    data: query
  })
}

// 理论赛 获取教员
export function getUser() {
  return request({
    url: '/api/v1/theory/admin/evts/teachers/',
    method: 'get'
  })
}

// 理论赛 获取比赛编辑页面详细信息
export function fetchJeopardyInfo(hash) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/',
    method: 'get'
  })
}

// 理论赛 编辑比赛页面 删除图片
export function deleteImage(hash, data) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/',
    method: 'delete',
    data
  })
}

// 理论赛 编辑比赛页面保存
export function editMatchJeopardy(hash, data) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/',
    method: 'patch',
    data
  })
}

// 理论赛 创建比赛
export function createMatch(data) {
  return request({
    url: '/api/v1/theory/admin/evts/',
    method: 'post',
    data
  })
}
// 理论赛 创建竞赛->题目相关接口------------------
// 理论赛 创建比赛->题目管理->题目列表
export function fetchTopicList(hash, params) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/',
    method: 'get',
    params
  })
}

// 理论赛 创建比赛->题目管理->删除题目
export function deleteSub(hash, data) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/',
    method: 'delete',
    data
  })
}

// 理论赛 创建比赛->题目管理->试卷预览
export function viewPaper(hash, params) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/preview/',
    method: 'get'
  })
}

// 理论赛 创建比赛->题目管理->是否可以进入导入题目
export function canImport(hash) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/import/status/',
    method: 'get'
  })
}

// 理论赛 创建比赛->题目管理->获取导入题目列表
export function fetchImportList(hash, params) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/import/',
    method: 'get',
    params
  })
}

// 理论赛 创建比赛->题目管理->获取导入题目列表
export function fetchImported(hash) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/imported/',
    method: 'get'
  })
}

// 理论赛 创建比赛->题目管理->确定随机生成
export function fetchPreviewList(hash, params, data) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/import/preview/',
    method: 'post',
    params,
    data
  })
}

// 理论赛 创建比赛->题目管理->保存试卷
export function submitPaper(hash, data) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/tasks/import/',
    method: 'post',
    data
  })
}

// 理论赛 创建比赛->关联用户->用户列表
export function fetchUserList(hash, data) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/users/',
    method: 'get'
  })
}

// 理论赛 创建比赛->关联用户->保存编辑
export function submitUserList(hash, data) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/users/',
    method: 'patch',
    data
  })
}

// 理论赛 成绩管理->成绩管理列表
export function scoreList(hash, params) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/scores/',
    method: 'get',
    params
  })
}

// 理论赛 成绩管理->检查
export function inspect(hash, id, params) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/scores/users/' + id + '/check/',
    method: 'get'
  })
}

// 理论赛 成绩管理->强制交卷
export function forceSubmit(hash) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/scores/users/submission/',
    method: 'post'
  })
}

// 理论赛 成绩管理->分发试卷
export function generation(hash) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/scores/users/generation/',
    method: 'post'
  })
}

// 理论赛 成绩管理->批量导出试卷
export function exportAll(hash, params) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/scores/users/export/pdf/',
    method: 'get',
    params
  })
}

// 理论赛 成绩管理->轮询查询下载
export function pollingDownPdf(hash) {
  return request({
    url: '/api/v1/theory/admin/evts/' + hash + '/scores/users/pdf/download/',
    method: 'get'
  })
}
