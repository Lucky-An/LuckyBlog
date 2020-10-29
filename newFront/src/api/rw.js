import request from '@/utils/request'
export function rwMatchInfo(hash) { // 赛事详细信息接口
  return request({
    url: '/api/v1/rw/web/' + hash,
    method: 'get',
    params: {
      evt: hash
    }
  })
}

export function getNotice(data) { // 平台公告消息
  return request({
    url: '/api/v1/rw/web/notices',
    method: 'get',
    params: data
  })
}

// 趋势图页面接口
export function trends(data) { // 获取题目类型
  return request({
    url: '/api/v1/rw/web/trends',
    method: 'get',
    params: data
  })
}

export function rankTasks(data) { // 排行榜表头
  return request({
    url: '/api/v1/rw/web/rank_tasks',
    method: 'get',
    params: data
  })
}

export function ranks(data) { // 获取排行榜表格数据
  return request({
    url: '/api/v1/rw/web/ranks',
    method: 'get',
    params: data
  })
}

export function getChallenges(data) { // 获取题目列表非复盘
  return request({
    url: '/api/v1/rw/web/challenges',
    method: 'get',
    params: data
  })
}
export function getReplaChallenges(data) { // 获取题目列表复盘
  return request({
    url: '/api/v1/rw/web/replay_tasks',
    method: 'get',
    params: data
  })
}

export function downLoad_file(str) { // 下载附件
  return request({
    url: '/api/v1/rw/web/attachment/' + str,
    method: 'get'
  })
}

export function addLogs(data) { // 点击题卡日志
  return request({
    url: '/api/v1/rw/web/access_logs',
    method: 'post',
    data
  })
}
export function getApplyTask_api(hash) { // 申请挑战获取题目
  return request({
    url: '/api/v1/rw/web/' + hash + '/task_challenges',
    method: 'get'
  })
}
export function cancelApply_api(hash) { // 取消挑战
  return request({
    url: '/api/v1/rw/web/' + hash + '/cancel_challenge',
    method: 'get'
  })
}

export function changeApply_api(hash, data) { // 取消挑战
  return request({
    url: `/api/v1/rw/web/${hash}/cancel_challenge`,
    method: 'patch',
    data
  })
}

export function lookApply_api(hash) { // 查看排队信息
  return request({
    url: '/api/v1/rw/web/' + hash + '/challenges',
    method: 'get'
  })
}
export function submitApply_api(hash, data) { // 提交挑战申请
  return request({
    url: '/api/v1/rw/web/' + hash + '/challenges',
    method: 'post',
    data
  })
}

export function tasks_detail(data) { // 点击排行榜行获取详细答题记录
  return request({
    url: '/api/v1/rw/web/event_answers',
    method: 'get',
    params: data
  })
}
