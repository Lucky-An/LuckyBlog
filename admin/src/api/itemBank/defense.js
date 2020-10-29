import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为攻防赛题目接口
*/

// 攻防赛 获取模板名称
export function templateList() {
  return request({
    url: '/api/v1/common/admin/kvm/get_template/',
    method: 'get'

  })
}

// 攻防赛 题目管理接口----------------------
// 攻防赛 获取题目列表
export function fetchDefenseList(params) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store_list/',
    method: 'get',
    params
  })
}

// 攻防赛 删除题目
export function DefenseRemoveTopic(data) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store/',
    method: 'post',
    data
  })
}

// 攻防赛 新建题目
export function DefenseAddTopic(data) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store_list/',
    method: 'post',
    data
  })
}

// 攻防赛 编辑题目信息回显
export function DefenseEditInfo(params) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store/',
    method: 'get',
    params
  })
}

// 攻防赛 编辑题目保存
export function DefenseEditSubmit(params, data) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store/',
    method: 'patch',
    params,
    data
  })
}

// 测试开启与关闭
export function postTest(data) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store/test_env/' + data,
    method: 'post'
  })
}
// 测试关闭
export function delTest(data) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store/test_env/' + data,
    method: 'delete'
  })
}
//  测试查看
export function getTest(params) {
  return request({
    url: '/api/v1/att_def/admin/setting/challenge_store/test_env/' + params,
    method: 'get'
  })
}
