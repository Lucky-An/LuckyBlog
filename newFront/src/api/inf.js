import request from '@/utils/request'

// 获取竞赛信息  包括指南
export function getInfo(params) {
  return request({
    url: '/api/v1/inf/web/event_data/',
    method: 'get',
    params
  })
}

// 获取竞赛列表
export function getNotice(params) {
  return request({
    url: '/api/v1/inf/web/api/notices',
    method: 'get',
    params
  })
}

// 获取题目信息
export function getTask(params) {
  return request({
    url: '/api/v1/inf/web/scene_data/',
    method: 'get',
    params
  })
}

// 获取题目附件
export function getTaskFile(params) {
  return request({
    url: '/api/v1/inf/web/api/task/file',
    method: 'get',
    params
  })
}

// 获取题目提示
export function getTaskTip(params) {
  return request({
    url: '/api/v1/inf/web/api/task/notices',
    method: 'get',
    params
  })
}

// 提交flag
export function subFlag(data) {
  return request({
    url: '/api/v1/inf/web/submit_flag/',
    method: 'post',
    data
  })
}

// 上传报告
export function subReport(params, data) {
  return request({
    url: '/api/v1/inf/web/upload_report',
    method: 'post',
    params,
    data
  })
}

// 获取排行榜数据
export function getRank(params) {
  return request({
    url: '/api/v1/inf/web/scoreboard_data',
    method: 'get',
    params
  })
}

// 获取排行榜题目栏
export function getRankTask(params) {
  return request({
    url: '/api/v1/inf/web/scoreboard_nav',
    method: 'get',
    params
  })
}

// 获取趋势
export function getTrend(params) {
  return request({
    url: '/api/v1/inf/web/scoregraph',
    method: 'get',
    params
  })
}

// 获取WP列表
export function getWP(params) {
  return request({
    url: '/api/v1/inf/web/wp/',
    method: 'get',
    params
  })
}

// 上传Wp
export function uploadWp(data) {
  return request({
    url: '/api/v1/inf/web/wp/',
    method: 'post',
    data
  })
}

// 删除Wp
export function removeWp(data) {
  return request({
    url: '/api/v1/inf/web/wp/',
    method: 'delete',
    data
  })
}
