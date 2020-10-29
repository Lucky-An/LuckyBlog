import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为  公共接口
*/
// 公共接口 删除图片
export function deleteImage(data) {
  return request({
    url: '/api/v1/common/admin/delete_event_logo/',
    method: 'post',
    data
  })
}

// 公共接口 部署环境状态
export function getScene(params) {
  return request({
    url: '/api/v1/att_def/admin/deploy/tasks/',
    method: 'get',
    params
  })
}

// 公共接口 获取实例模板
export function getFlavors(params) {
  return request({
    url: '/api/v1/att_def/admin/deploy/tasks/',
    method: 'get',
    params
  })
}

