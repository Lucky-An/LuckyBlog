import request from '@/utils/request'
// 平台公告消息
export function getNotice(data, evt) {
  return request({
    url: '/api/v1/jeopardy/web/notices?evt=' + evt,
    method: 'get',
    params: data
  })
}

// 获取比赛信息接口
export function getAttackMatchInfos(data) {
  return request({
    url: '/api/v1/att_def/web/event_data/?evt=' + data.evt + '&event_id=' + data.event_id,
    method: 'get'
    // params:data
  })
}

// 公告
export function notices(data) {
  return request({
    url: '/api/v1/att_def/web/api/notices/',
    method: 'get',
    params: data
  })
}

// 获取排行榜数据
export function rankingData(data) {
  return request({
    url: '/api/v1/att_def/web/scoreboard/',
    method: 'get',
    params: data
  })
}

// 获取攻击榜数据
export function attackData(data) {
  return request({
    url: '/api/v1/att_def/web/pwnningwall/',
    method: 'get',
    params: data
  })
}
// 趋势图数据
export function graphData(data) {
  return request({
    url: '/api/v1/att_def/web/scoregraph/',
    method: 'get',
    params: data
  })
}

const download_task_info = '/api/v1/att_def/web/api/download_message/'
export { download_task_info }

// 赛题页面，比赛信息数据
export function navData(data) {
  return request({
    url: '/api/v1/att_def/web/nav_data/',
    method: 'get',
    params: data
  })
}

// 赛题页面，题目数据
export function challenge_data(data) {
  return request({
    url: '/api/v1/att_def/web/challenge_data/',
    method: 'get',
    params: data
  })
}

// 赛题页面，提交flag
export function submit_flag(id, data) {
  return request({
    url: '/api/v1/att_def/web/api/submit_flag/?' + id,
    method: 'post',
    data
  })
}
// 赛题页面，被攻击列表数据
export function attackedData(data) {
  return request({
    url: '/api/v1/att_def/web/pwn_data/',
    method: 'get',
    params: data
  })
}

// 赛题页面，比赛信息数据
export function competitionData(data) {
  return request({
    url: '/api/v1/att_def/web/submit_data/',
    method: 'get',
    params: data
  })
}
// 赛题页面，比赛信息数据
export function getChallengeIp(data) {
  return request({
    url: '/api/v1/att_def/web/api/challenge_ip',
    method: 'get',
    params: data
  })
}
// 赛题页面，比赛信息数据
export function getEventTeam(data) {
  return request({
    url: '/api/v1/att_def/web/get_event_team',
    method: 'get',
    params: data
  })
}
