import request from '@/utils/request'

// 获取竞赛列表
export function getList(params) {
  return request({
    url: '/api/v1/common/web/evts/list',
    method: 'get',
    params
  })
}

// 公共方法,具体功能详见调用处注释。
export function commonRequest(url, method, params, data) {
  return request({
    url,
    method,
    params,
    data
  })
}

// 获取工具分类和平台
export function getToolsSort(hash) {
  return request({
    url: '/api/v1/common/web/tool_tag/',
    method: 'get'
  })
}
// 获取工具列表
export function getTools(params) {
  return request({
    url: '/api/v1/common/web/tools/',
    method: 'get',
    params
  })
}
// 获取工具详情
export function getDetails(id) {
  return request({
    url: '/api/v1/common/web/tools/' + id,
    method: 'get'
  })
}

// 无需登录的排行榜
export function getFinals(id) {
  return request({
    url: '/api/v1/common/web/evts/ranks',
    method: 'get'
  })
}

// 无需登录的观众席
export function getWatch(id) {
  return request({
    url: '/api/v1/common/web/onlook/look_match/look/',
    method: 'get'
  })
}

// 个人中心用户数据
export function personalCenter() {
  return request({
    url: '/api/v1/common/web/personal/center',
    method: 'get'
  })
}

// 个人中心用户数据
export function editPersonal(data) {
  return request({
    url: '/api/v1/common/web/personal/info',
    method: 'post',
    data
  })
}

// 个人中心修改头像
export function changePersonalLogo(data) {
  return request({
    url: '/api/v1/common/web/personal/logo',
    method: 'patch',
    data
  })
}

// 个人中心修改密码
export function changePersonalPass(data) {
  return request({
    url: '/api/v1/common/web/personal/paword',
    method: 'patch',
    data
  })
}

// 解题赛权限校验
export function checkAuth(params) {
  return request({
    url: '/api/v1/jeopardy/web/sfzb',
    method: 'get',
    params
  })
}
