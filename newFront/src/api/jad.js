import request from '@/utils/request'
// 平台公告消息
export function getNotice(data, evt) {
  return request({
    url: '/api/v1/jeopardy/web/notices?evt=' + evt,
    method: 'get',
    params: data
  })
}

// 赛题页面接口
export function getMatchInfos(hash) { // 获取赛事
  return request({
    url: '/api/v1/jeopardy/web/' + hash,
    method: 'get',
    params: {
      evt: hash
    }
  })
}
export function getChallenges(data) { // 获取题目列表非复盘
  return request({
    url: '/api/v1/jeopardy/web/challenges',
    method: 'get',
    params: data
  })
}
export function getReplaChallenges(data) { // 获取题目列表复盘
  return request({
    url: '/api/v1/jeopardy/web/replay_tasks',
    method: 'get',
    params: data
  })
}

export function writeups(data) { // 获取writeup
  return request({
    url: '/api/v1/jeopardy/web/writeups',
    method: 'get',
    params: data
  })
}
// 赛题页面，获取本队伍已开启的环境列表
export function teamEnv(data) {
  return request({
    url: '/api/v1/jeopardy/web/env/team/' + data,
    method: 'get',
    params: {
      evt: data
    }
  })
}

export function addLogs(data, hash) { // 点击题卡日志
  return request({
    url: '/api/v1/jeopardy/web/access_logs?evt=' + hash,
    method: 'post',
    data
  })
}
export function submitFlags(data, evt) { // 非复盘提交flag
  return request({
    url: '/api/v1/jeopardy/web/flags?evt=' + evt,
    method: 'post',
    data
  })
}
export function submitReplayFlags(data) { // 复盘提交flag
  return request({
    url: '/api/v1/jeopardy/web/replay_flags',
    method: 'post',
    data
  })
}
export function delay(data) {
  return request({
    url: '/api/v1/jeopardy/web/env/delay/',
    method: 'post',
    data

  })
}
// 查询场景
export function serchcj(data, evt) {
  return request({
    url: '/api/v1/jeopardy/web/env/' + data,
    method: 'get',
    params: {
      evt: evt
    }

  })
}
// 创建场景
export function createcj(data, evt) {
  return request({
    url: '/api/v1/jeopardy/web/env/' + data.task_hash,
    method: 'post',
    data,
    params: {
      evt: evt
    }
  })
}
// 删除场景
export function delcj(data, evt) {
  return request({
    url: '/api/v1/jeopardy/web/env/' + data + '?evt=' + evt,
    method: 'delete',
    data
  })
}
// 场景状态
export function stutascj(data, evt) {
  return request({
    url: '/api/v1/jeopardy/web/env/' + data,
    method: 'get',
    params: {
      evt: evt
    }

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

// 获取排行榜表头
export function rankTasks(data) {
  return request({
    url: '/api/v1/jeopardy/web/rank_tasks',
    method: 'get',
    params: data
  })
}
// 获取排行榜表格数据
export function ranks(data) {
  return request({
    url: '/api/v1/jeopardy/web/ranks',
    method: 'get',
    params: data
  })
}
// 获取总排行榜表格数据
export function allRanks(data) {
  return request({
    url: '/api/v1/jeopardy/web/all_ranks',
    method: 'get',
    params: data
  })
}

export function tasks_detail(data) { // 点击排行榜行获取详细答题记录
  return request({
    url: '/api/v1/jeopardy/web/event_answers',
    method: 'get',
    params: data
  })
}

// 趋势图页面接口
export function trends(data) {
  return request({
    url: '/api/v1/jeopardy/web/trends',
    method: 'get',
    params: data
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

// 获取WP列表
export function getWP(params) {
  return request({
    url: '/api/v1/common/web/evts/write_up',
    method: 'get',
    params
  })
}

// 上传Wp
export function uploadWp(data, evt) {
  return request({
    url: '/api/v1/common/web/evts/write_up?evt=' + evt,
    method: 'post',
    data
  })
}

// 删除Wp
export function removeWp(data, evt) {
  return request({
    url: '/api/v1/common/web/evts/write_up?evt=' + evt,
    method: 'delete',
    data
  })
}
