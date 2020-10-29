import request from '@/utils/request'

// 获取赛事接口
export function getTheoryMatchInfos(hash) {
  return request({
    url: '/api/v1/theory/web',
    method: 'get',
    params: {
      evt: hash
    }
  })
}
// 赛题页面，题目数据
export function challenge_data(evt) {
  return request({
    url: '/api/v1/theory/web/category_task',
    method: 'get',
    params: { evt: evt }
  })
}
// 获取比赛信息接口
export function matchStatus(hash) { // 赛事详细信息接口
  return request({
    url: api_front + '/' + hash,
    method: 'get'
  })
}
// 提交单个题目答案接口
export function pushAnswer(evt, data) {
  return request({
    url: '/api/v1/theory/web/answers?evt=' + evt,
    method: 'post',
    data
  })
}
// 提交试卷
export function submitPaper(data) {
  return request({
    url: '/api/v1/theory/web/submitlog',
    method: 'post',
    params: { evt: data.hash },
    data
  })
}
// 未答题目数量
export function task_num(data) {
  return request({
    url: '/api/v1/theory/web/nav_task_num',
    method: 'get',
    params: data
  })
}

