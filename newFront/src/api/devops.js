import request from '@/utils/request'

// 获取竞赛信息  包括指南
export function getDevopsInfo(data) {
  return request({
    url: '/api/v1/ops/web/event_data/',
    method: 'get',
    params: {
      event_id: data
    }
  })
}
export function notices(data) { // 平台公告消息
  return request({
    url: '/api/v1/ops/web/api/notices/',
    method: 'get',
    params: data
  })
}

export function task_notices(data) { // 平台题目提示消息
  return request({
    url: '/api/v1/ops/web/task_notices',
    method: 'get',
    params: data
  })
}

export function editProfile(data) { // 临时战队/队员编辑战队昵称
  return request({
    url: '/api/v1/ops/web/edit/profile',
    method: 'post',
    data
  })
}

// 竞赛排行榜页接口
// export function events(id) {//获取比赛信息
//   return request({
//     url:front + '/'+id,
//     method: 'get',
//   })
// }
// 获取比赛信息接口
export function events(data) {
  return request({
    url: '/api/v1/ops/web/event_data/',
    method: 'get',
    params: data
  })
}

export function ranks(data) { // 获取排行榜表格数据
  return request({
    url: '/api/v1/ops/web/scoreboard_data/',
    method: 'get',
    params: data
  })
}

export function rank_tasks(data) { // 获取题目类型
  return request({
    url: '/api/v1/ops/web/scoreboard_nav/',
    method: 'get',
    params: data
  })
}

export function tasks_detail(data) { // 点击排行榜行获取详细答题记录
  return request({
    url: '/api/v1/ops/web/event_answers',
    method: 'get',
    params: data
  })
}
// 趋势图页面接口
export function trends(data) { // 获取题目类型
  return request({
    url: '/api/v1/ops/web/scoregraph/',
    method: 'get',
    params: data
  })
}

// 赛题页面接口
export function getMatchInfos(id) { // 获取赛事
  return request({
    url: '/api/v1/ops/web/' + id,
    method: 'get'
  })
}

export function writeups(data) { // 获取writeup
  return request({
    url: '/api/v1/ops/web/writeups',
    method: 'get',
    params: data
  })
}

export function uploadWriteups(data, params) { // 上传writeup
  return request({
    url: '/api/v1/ops/web/writeups',
    method: 'post',
    data,
    params
  })
}

export function submitFlags(data) { // 非复盘提交flag
  return request({
    url: '/api/v1/ops/web/flags',
    method: 'post',
    data
  })
}

export function get_challenges(data) { // 获取题目列表
  return request({
    url: '/api/v1/ops/web/challenge_data/',
    method: 'get',
    params: data
  })
}

export function get_score(data) { // 获取得分日志
  return request({
    url: '/api/v1/ops/web/get_score/',
    method: 'get',
    params: data
  })
}

export function downLoad_file(str) { // 下载附件
  return request({
    url: '/api/v1/ops/web/attachment/' + str,
    method: 'get'
  })
}

export function addLogs(data) { // 点击题卡日志
  return request({
    url: '/api/v1/ops/web/access_logs',
    method: 'post',
    data
  })
}

export function nav_datas(data) { // 获取导航条上内容、排名和分数
  return request({
    url: '/api/v1/ops/web/nav_data/',
    method: 'get',
    params: data
  })
}

export function getItemInfo(event_id) { // 获取导航条上内容、排名和分数
  return request({
    url: '/api/v1/ops/web/challenge_data/?event_id=' + event_id,
    method: 'get'
  })
}

export function getProgressInfo(event_id, id) { // 获取进度
  return request({
    url: '/api/v1/ops/web/get_challenge_process/?event_id=' + event_id + '&challenge_id=' + id,
    method: 'get'
  })
}

// 环境重置
export function resetEnv(task_id, params) {
  return request({
    url: `/api/v1/ops/web/env_reset/${task_id}`,
    method: 'post',
    params
  })
}
