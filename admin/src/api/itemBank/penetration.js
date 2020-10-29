import request from '@/utils/request'
/* *
 * 接口说明：
 * 以下请求为渗透赛题目接口
 */
//! 渗透赛获取题目列表
export function httpChallengeStoreList(query) {
  return request({
    url: '/api/v1/inf/admin/setting/challenge_store_list',
    method: 'get',
    params: query
  })
}
//! 渗透赛获取题目标签options值
export function httpChallengeTags(query) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/ ',
    method: 'get'
    // params: query
  })
}
// ! 渗透赛查看列表页的题目flag
export function httpChallengeStoreFlag(query) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store_flag`,
    method: 'get',
    params: query
  })
}
// ! 渗透赛删除题目
export function httpDeleteChallengeStore(data) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store`,
    method: 'post',
    data
  })
}
// ! 获取实例模板列表
export function httpGetFlavorList() {
  return request({
    url: `/api/v1/inf/admin/setting/flavor_list`,
    method: 'get'
  })
}
// ! 创建题目
export function httpPostChallengeStoreList(data) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store_list`,
    method: 'post',
    data
  })
}
//! 获取题目类型
export function httpGetSettingCategorys() {
  return request({
    url: `/api/v1/inf/admin/setting/categorys`,
    method: 'get'
  })
}
//! 获取镜像列表
export function httpGetAdminImages(data) {
  return request({
    url: `/api/v1/common/admin/images`,
    method: 'get',
    params: data
  })
}
// ! 获取题目详细信息
export function httpGetDetialQuestion(data) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store`,
    method: 'get',
    params: data
  })
}
// ! 编辑题目
export function httpPatchDetialQuestion(query, data) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store`,
    method: 'patch',
    params: query,
    data
  })
}

// 开启测试
export function enableTest(id) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store/test_env/${id}`,
    method: 'post'
  })
}

// 关闭测试
export function disableTest(id) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store/test_env/${id}`,
    method: 'delete'
  })
}

// 题库点击测试查看
export function checkTest(id) {
  return request({
    url: `/api/v1/inf/admin/setting/challenge_store/test_env/${id}`,
    method: 'get'
  })
}
