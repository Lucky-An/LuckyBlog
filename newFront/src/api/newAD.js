// 新攻防赛 接口清单
import request from '@/utils/request'

// 新攻防赛api前缀
const api_front = '/api/v1/jad/web'

// 获取排行榜数据
export function rankingData(data) {
  return request({
    url: api_front + '/scoreboard/',
    method: 'get',
    params: data
  })
}

// 获取攻击榜数据
export function attackData(data) {
  return request({
    url: api_front + '/pwnningwall/',
    method: 'get',
    params: data
  })
}

// 趋势图数据
export function graphData(data) {
  return request({
    url: api_front + '/scoregraph/',
    method: 'get',
    params: data
  })
}

// 赛题页面，被攻击列表数据
export function attackedData(data) {
  return request({
    url: api_front + '/pwn_data/',
    method: 'get',
    params: data
  })
}

// 赛题页面，比赛信息数据
export function competitionData(data) {
  return request({
    url: api_front + '/submit_data/',
    method: 'get',
    params: data
  })
}

// 赛题页面，下载题目信息url
const get_download = api_front + '/api/download_message/'
export {
  get_download
}

// 获取题目path提交规则接口
export function patch_rule(data) {
  return request({
    url: api_front + '/patch_rule/',
    method: 'get',
    params: data
  })
}

// 赛题页面，比赛信息数据
export function navData(data) {
  return request({
    url: api_front + '/nav_data/',
    method: 'get',
    params: data
  })
}

// 赛题页面，题目数据
export function challenge_data(data) {
  return request({
    url: api_front + '/challenge_data/',
    method: 'get',
    params: data
  })
}

// 赛题页面，提交flag
export function submit_flag(id, data) {
  return request({
    url: api_front + '/submit_flag/?' + id,
    method: 'post',
    data
  })
}

// 赛题页面，展示PATH包(查看提交补丁包)
export function getPathData(data) {
  return request({
    url: api_front + '/patch_status/',
    method: 'get',
    params: data // event_id,challenge_id
  })
}

// 赛题页面，提交path包
export function submitApath(id, data) {
  return request({
    url: api_front + '/api/submit_patch/?' + id,
    method: 'post',
    data
  })
}

// 赛题页面，下载单个题目附件
const get_attachment = api_front + '/api/download_challenge/'
export {
  get_attachment
}

// 赛题页面，下载单个流量包
const get_tcp = api_front + '/api/download_tcpdump/'
export {
  get_tcp
}

// 赛题页面(查看流量包)
export function tcpdumpStatus(data) {
  return request({
    url: api_front + '/tcpdump_status/',
    method: 'get',
    params: data // event_id,challenge_id
  })
}

// 公告
export function notices(data) {
  return request({
    url: api_front + '/api/notices/',
    method: 'get',
    params: data
  })
}

// 获取比赛信息接口
export function getNewADMatchInfos(data) {
  return request({
    url: api_front + '/event_data/',
    method: 'get',
    params: data
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
