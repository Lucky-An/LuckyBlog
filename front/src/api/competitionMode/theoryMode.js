//传统攻防赛 接口清单
import request from '@/utils/request'

//传统攻防赛api前缀
let api_front = '/api/v1/theory/web'


//导航
export function nav_datas(data) {
  return request({
    url: api_front + '/nav_data/' + data,
    method: 'get',
  })
}

//赛题页面，题目数据
export function challenge_data(hash) {
  return request({
    url: api_front + '/category_task',
    method: 'get',
    params: { evt: hash }
  })
}

//未答题目数量
export function task_num(data) {
  return request({
    url: api_front + '/nav_task_num',
    method: 'get',
    params: data
  })
}

//获取比赛信息接口
export function matchStatus(hash) { // 赛事详细信息接口
  return request({
    url: api_front,
    method: 'get',
    params: {
      evt: hash
    }
  })
}

//提交单个题目答案接口
export function pushAnswer(hash, data) {
  return request({
    url: api_front + '/answers?hash=' + hash,
    method: 'post',
    data
  })
}

//提交试卷
export function submitPaper(data) {
  return request({
    url: api_front + '/submitlog',
    method: 'post',
    data
  })
}

//赛题页面，下载题目信息url
let get_download = api_front + '/api/download_message/'
export { get_download };
