import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为战队相关
*/

// 获取战队列表
export function fetchTeamList(query) {
  return request({
    url: '/api/ad_team/teams/',
    method: 'get',
    params: query
  })
}

// 获取比赛记录
export function fetchRecord(query) {
  return request({
    url: '/api/ad_team/event/record/',
    method: 'get',
    params: query
  })
}

// 获取加入成员
export function fetchJoin(query) {
  return request({
    url: '/api/ad_team/join/',
    method: 'get',
    params: query
  })
}

// 获取驱逐成员
export function fetchExpel(query) {
  return request({
    url: '/api/ad_team/expulsion/',
    method: 'get',
    params: query
  })
}

// 战队信息回显
export function teamInfo(query) {
  return request({
    url: '/api/ad_team/teams/' + query,
    method: 'get'
  })
}

// 编辑战队
export function editTeam(id, data) {
  return request({
    url: '/api/ad_team/teams/' + id,
    method: 'patch',
    data
  })
}
