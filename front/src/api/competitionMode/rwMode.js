// realWorld接口清单
import request from '@/utils/request'
// 竞赛公共的接口

let front = '/api/v1/rw/web'

export function rw_matchStatus (hash) { // 赛事详细信息接口
  return request({
    url: front + '/' + hash,
    method: 'get'
  })
}

export function signup_users (data) { // 用户注册比赛接口
  return request({
    url: front + '/signup_users',
    method: 'post',
    data
  })
}

export function signup_teams (data) { // 队伍注册比赛接口
  return request({
    url: front + '/signup_teams',
    method: 'post',
    data
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

export function editProfile (data) { // 临时战队/队员编辑战队昵称
  return request({
    url: front + '/edit/profile',
    method: 'post',
    data
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

export function devops_nav (data) { // 运维赛排行榜题目接口
  return request({
    url: front + '/deploy/statistic_nav',
    method: 'get',
    params: data
  })
}

export function devops_data (data) { // 运维赛排行榜表格接口
  return request({
    url: front + '/deploy/statistic_data',
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

export function uploadWriteupRw (data) { // 上传writeup
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

export function submitApply_api (hash, data) { // 提交挑战申请
  return request({
    url: front + '/' + hash + '/challenges',
    method: 'post',
    data
  })
}
export function lookApply_api (hash) { // 查看排队信息
  return request({
    url: front + '/' + hash + '/challenges',
    method: 'get'
  })
}

export function cancelApply_api (hash) { // 取消挑战
  return request({
    url: front + '/' + hash + '/cancel_challenge',
    method: 'get'
  })
}
export function changeApply_api (hash, data) { // 修改挑战题目
  return request({
    url: front + '/' + hash + '/cancel_challenge',
    method: 'patch',
    data
  })
}
export function getApplyTask_api (hash) { // 申请挑战获取题目
  return request({
    url: front + '/' + hash + '/task_challenges',
    method: 'get'
  })
}
// 赛题页面，环境url前缀
let front2 = '/api/v1/jeopardy/web'
let sence_url = front2 + '/env/'
export {sence_url}


//裁判审核接口
export function examine (hash, data) { // 成绩审核列表
  return request({
    url: front + '/' + hash + '/challenges/verification',
    method: 'get',
    params: data
  })
}

export function to_examine (hash, data) { // 审核操作接口
  return request({
    url: front + '/' + hash + '/challenges/verification',
    method: 'post',
    data
  })
}

export function examine_logs (hash, data) { // 裁判审核记录
  return request({
    url: front + '/' + hash + '/challenges/verification/logs',
    method: 'get',
    params: data
  })
}

export function apply_logs (hash, data) { // 战队申请记录
  return request({
    url: front + '/' + hash + '/challenge_logs',
    method: 'get',
    params: data
  })
}

export function all_ranks (data) { // 战队申请记录
  return request({
    url: front + '/all_ranks',
    method: 'get',
    params: data
  })
}
