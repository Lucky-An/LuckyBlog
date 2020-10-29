import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为  公共接口
*/
// 公共接口 获取题目标签
export function fetchTags(params) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/',
    method: 'get',
    params
  })
}
// 公共接口 获取实例模板
export function flavors() {
  return request({
    url: '/api/v1/common/admin/flavors',
    method: 'get',
    params: {
      per_page: 9999
    }
  })
}
// 公共接口 获取镜像类型
export function images() {
  return request({
    url: '/api/v1/common/admin/images',
    method: 'get'
  })
}
// 公共接口 获取题目类型
export function fetchType(params) {
  return request({
    url: '/api/v1/common/admin/challenge/categorys/',
    method: 'get',
    params
  })
}

// 公共接口 获取模板名称
export function templateName() {
  return request({
    url: '/api/v1/common/admin/kvm/get_template/',
    method: 'get'

  })
}

// 公共接口 新增标签
export function AddLabel(data) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/',
    method: 'post',
    data
  })
}

// 公共接口 新增类型
export function AddType(data) {
  return request({
    url: '/api/v1/common/admin/challenge/categorys/',
    method: 'post',
    data
  })
}

// 公共接口 删除类型
export function DeleteType(data) {
  return request({
    url: '/api/v1/common/admin/challenge/categorys/',
    method: 'delete',
    data
  })
}

// 公共接口 删除标签
export function DeleteLabel(data) {
  return request({
    url: '/api/v1/common/admin/challenge/tags/',
    method: 'delete',
    data
  })
}

// 公共接口 删除标签
export function getFlavorList(params) {
  return request({
    url: '/api/v1/common/admin/flavors',
    method: 'get',
    params
  })
}
