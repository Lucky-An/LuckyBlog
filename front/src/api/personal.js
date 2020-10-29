//个人中心接口
import request from '@/utils/request'

//传统攻防赛api前缀
let api_front = '/api/v1/att_def/web'

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

//赛题页面，下载题目信息url post
// export function download_task_info(data) {
//   return request({
//     url: api_front+'/api/download_message/',
//     method: 'post',
//     data,
//     responseType: 'blob'
//   })
// }


//赛题页面，下载题目信息url  get
let download_task_info = api_front+'/api/download_message/'
export {download_task_info};


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


//公告
export function notices(data) {
  return request({
    url: api_front+'/api/notices/',
    method: 'get',
    params:data
  })
}

//获取最新的公告
export function new_notices(data) {
  return request({
    url: api_front+'/api/notice_pop/',
    method: 'get',
    params:data
  })
}

//获取比赛信息接口
export function eventData(data) {
  return request({
    url: api_front+'/event_data/',
    method: 'get',
    params:data
  })
}
