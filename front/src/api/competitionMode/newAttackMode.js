//传统攻防赛 接口清单
import request from '@/utils/request'

//传统攻防赛api前缀
let api_front = '/api/v1/jad/web'

//获取排行榜数据
export function rankingData(data) {
  return request({
    url: api_front+'/scoreboard/',
    method: 'get',
    params:data
  })
}


//获取攻击榜数据
export function attackData(data) {
  return request({
    url: api_front+'/pwnningwall/',
    method: 'get',
    params:data
  })
}

//趋势图数据
export function graphData(agar,data) {
  return request({
    url: api_front+'/scoregraph/?'+agar.target+'='+agar.id,
    method: 'get',
    params:data
  })
}

//赛题页面，被攻击列表数据
export function attackedData(data) {
  return request({
    url: api_front+'/pwn_data/',
    method: 'get',
    params:data
  })
}

//赛题页面，比赛信息数据
export function competitionData(data) {
  return request({
    url: api_front+'/submit_data/',
    method: 'get',
    params:data
  })
}

//赛题页面，下载题目信息url
let get_download = api_front+'/api/download_message/'
export {get_download};

//获取题目path提交规则接口
export function patch_rule(data) {
  return request({
    url: api_front+'/patch_rule/',
    method: 'get',
    params:data
  })
}


//赛题页面，比赛信息数据
export function navData(data) {
  return request({
    url: api_front+'/nav_data/',
    method: 'get',
    params:data
  })
}

//赛题页面，题目数据
export function challenge_data(data) {
  return request({
    url: api_front+'/challenge_data/',
    method: 'get',
    params:data
  })
}

//赛题页面，提交flag
export function submit_flag(id,data) {
  return request({
    url: api_front+'/api/submit_flag/?'+id,
    method: 'post',
    data
  })
}

//赛题页面，展示PATH包(查看提交补丁包)
export function getPathData(data) {
  return request({
    url: api_front+'/patch_status/',
    method: 'get',
    params:data//event_id,challenge_id
  })
}

//赛题页面，提交path包
export function submitApath(id,data) {
  return request({
    url: api_front+'/api/submit_patch/?'+id,
    method: 'post',
    data
  })
}

//赛题页面，下载单个题目附件
let get_attachment = api_front+'/api/download_challenge/'
export {get_attachment};

//赛题页面，下载单个流量包
let get_tcp = api_front+'/api/download_tcpdump/'
export {get_tcp};

//赛题页面(查看流量包)
export function tcpdumpStatus(data) {
  return request({
    url: api_front+'/tcpdump_status/',
    method: 'get',
    params:data//event_id,challenge_id
  })
}

//公告
export function notices(data) {
  return request({
    url: api_front+'/api/notices/',
    method: 'get',
    params:data
  })
}

//获取比赛信息接口
export function eventData_newAttack(data) {
  return request({
    url: api_front+'/event_data/',
    method: 'get',
    params:data
  })
}

