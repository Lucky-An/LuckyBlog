// 闯关赛（层级赛）接口清单
import request from '@/utils/request'
// 竞赛公共的接口

let front = '/api/v1/layered/web'

export function matchStatus (hash) { // 赛事详细信息接口
  return request({
    url: front + '/' + hash,
    method: 'get'
  })
}

export function notices (data) { // 平台公告消息
  return request({
    url: front + '/notices',
    method: 'get',
    params: data
  })
}

export function task_notices (data) { // 平台题目提示消息
  return request({
    url: front + '/task_notices',
    method: 'get',
    params: data
  })
}

// 竞赛排行榜页接口
export function events (id) { // 获取比赛信息
  return request({
    url: front + '/' + id,
    method: 'get'
  })
}

export function ranks (data) { // 获取排行榜表格数据
  return request({
    url: front + '/ranks',
    method: 'get',
    params: data
  })
}

export function allRanks (data) { // 获取总排行榜表格数据
  return request({
    url: front + '/all_ranks',
    method: 'get',
    params: data
  })
}

export function rank_tasks (data) { // 获取题目类型
  return request({
    url: front + '/rank_tasks',
    method: 'get',
    params: data
  })
}

export function tasks_detail (data) { // 点击排行榜行获取详细答题记录
  return request({
    url: front + '/event_answers',
    method: 'get',
    params: data
  })
}
// 趋势图页面接口
export function trends (agar, data) { // 获取题目类型
  return request({
    url: front + '/trends?' + agar.target + '=' + agar.id,
    method: 'get',
    params: data
  })
}

// 赛题页面接口
export function getMatchInfos (id) { // 获取赛事
  return request({
    url: front + '/' + id,
    method: 'get'
  })
}

export function writeups (data) { // 获取writeup
  return request({
    url: front + '/writeups',
    method: 'get',
    params: data
  })
}

export function submitFlags (data) { // 非复盘提交flag
  return request({
    url: front + '/flags',
    method: 'post',
    data
  })
}

export function submitReplayFlags (data) { // 复盘提交flag
  return request({
    url: front + '/replay_flags',
    method: 'post',
    data
  })
}

export function uploadWriteupLay (data) { // 上传writeup
  return request({
    url: front + '/writeups',
    method: 'post',
    data
  })
}

export function get_challenges (data) { // 获取题目列表非复盘
  return request({
    url: front + '/challenges',
    method: 'get',
    params: data
  })
}
export function get_replay_challenges (data) { // 获取题目列表复盘
  return request({
    url: front + '/replay_tasks',
    method: 'get',
    params: data
  })
}

export function downLoad_file (str) { // 下载附件
  return request({
    url: front + '/attachment/' + str,
    method: 'get'
  })
}

export function addLogs (data) { // 点击题卡日志
  return request({
    url: front + '/access_logs',
    method: 'post',
    data
  })
}

export function nav_datas (data) { // 获取导航条上内容、排名和分数
  return request({
    url: front + '/nav_data/' + data,
    method: 'get'
  })
}

// 赛题页面，环境url前缀
let sence_url = front + '/env/'
export {sence_url}
