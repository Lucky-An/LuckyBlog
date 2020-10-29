import request from '@/utils/request'

/* *
 * 接口说明：
 * 以下请求为攻防赛题目接口
 */

// 新攻防 题目管理接口----------------------
// 新攻防 获取题目列表
export function fetchDefenseList(params) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store_list/',
    method: 'get',
    params
  })
}

// 新攻防 删除题目
export function DefenseRemoveTopic(data) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store/',
    method: 'delete',
    data
  })
}

// 新攻防 新建题目
export function DefenseAddTopic(data) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store_list/',
    method: 'post',
    data
  })
}

// 新攻防 编辑题目信息回显
export function DefenseEditInfo(params) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store/',
    method: 'get',
    params
  })
}

// 新攻防 编辑题目保存
export function DefenseEditSubmit(params, data) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store/',
    method: 'patch',
    params,
    data
  })
}

// 新攻防 新增类型
export function DefenseAddType(data) {
  return request({
    url: '/api/v1/common/admin/challenge/categorys/',
    method: 'post',
    data
  })
}

// 新攻防 新增标签
export function DefenseAddLabel(data) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/',
    method: 'post',
    data
  })
}

// 新攻防 删除类型
export function DefenseDeleteType(data) {
  return request({
    url: '/api/v1/common/admin/challenge/categorys/',
    method: 'delete',
    data
  })
}

// 新攻防 删除标签
export function DefenseDeleteLabel(data) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/',
    method: 'delete',
    data
  })
}

// 新攻防 题库下载writeup
export function downloadWp() {
  return '/api/v1/jad/admin/setting/challenge_store_writeup_download/'
}

export function enableTest(id) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store/test_env/' + id,
    method: 'post'
  })
}

export function disableTest(id) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store/test_env/' + id,
    method: 'delete'
  })
}

export function checkTest(id) {
  return request({
    url: '/api/v1/jad/admin/setting/challenge_store/test_env/' + id,
    method: 'get'
  })
}
