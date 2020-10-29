import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为运维赛题目接口
*/

// 运维赛 获取模板名称
export function templateList() {
  return request({
    url: '/api/v1/common/admin/kvm/get_template/',
    method: 'get'

  })
}

// 运维赛 题目管理接口----------------------
// 运维赛 获取题目列表
export function fetchDefenseList(params) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_store_list/',
    method: 'get',
    params
  })
}

// 运维赛 删除题目
export function DefenseRemoveTopic(data) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_store/',
    method: 'post',
    data
  })
}
// 运维赛 测试开启
export function openTest(id) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_test/' + id,
    method: 'post'
  })
}
// 运维赛 测试关闭
export function closeTest(id) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_test/' + id,
    method: 'delete'
  })
}
// 运维赛 测试查看
export function getTest(id) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_test/' + id,
    method: 'get'
  })
}

// 运维赛 新建题目
export function DefenseAddTopic(data) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_store_list/',
    method: 'post',
    data
  })
}

// 运维赛 编辑题目信息回显
export function DefenseEditInfo(params) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_store/',
    method: 'get',
    params
  })
}

// 运维赛 编辑题目保存
export function DefenseEditSubmit(params, data) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_store/',
    method: 'patch',
    params,
    data
  })
}

// 运维赛 新增类型
export function DefenseAddType(data) {
  return request({
    url: '/api/v1/common/admin/challenge/categorys/',
    method: 'post',
    data
  })
}

// 运维赛 新增标签
export function DefenseAddLabel(data) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/',
    method: 'post',
    data
  })
}

// 运维赛 删除类型
export function DefenseDeleteType(data) {
  return request({
    url: '/api/v1/common/admin/challenge/categorys/',
    method: 'delete',
    data
  })
}

// 运维赛 删除标签
export function DefenseDeleteLabel(data) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/',
    method: 'delete',
    data
  })
}
