import request from '@/utils/request'
// 获取镜像列表
export function fetchList(params) {
  return request({
    url: '/api/v1/common/admin/image_upload',
    method: 'get',
    params
  })
}

// 确认上传镜像
export function submitImage(data) {
  return request({
    url: '/api/v1/common/admin/opera_template/',
    method: 'post',
    data
  })
}

// 镜像信息回显
export function getInfo(id) {
  return request({
    url: '/api/v1/common/admin/image/' + id,
    method: 'get'
  })
}

// 镜像信息回显
export function editImage(id, data) {
  return request({
    url: '/api/v1/common/admin/image/' + id,
    method: 'patch',
    data
  })
}

// 删除镜像
export function remove(data) {
  return request({
    url: '/api/v1/common/admin/image/batch_destroy',
    method: 'delete',
    data
  })
}

// 开启镜像
export function openImage(id) {
  return request({
    url: '/api/v1/common/admin/start_container/' + id,
    method: 'post'
  })
}
// 关闭镜像
export function closeImage(id) {
  return request({
    url: '/api/v1/common/admin/stop_container/' + id,
    method: 'post'
  })
}

// 分片上传
export function uploadImage(data) {
  return request({
    url: '/api/v1/common/admin/file/upload',
    method: 'post',
    data,
    loading: false
  })
}

// 分片合并
export function mergeImage(params) {
  return request({
    url: '/api/v1/common/admin/file/merge',
    method: 'get',
    params
  })
}

// 新增保存镜像
export function addImage(data) {
  return request({
    url: '/api/v1/common/admin/image_upload',
    method: 'post',
    data
  })
}

// 新增保存镜像 轮询查询镜像结果
export function pollingSubmit(id) {
  return request({
    url: '/api/v1/common/admin/image_status/' + id,
    method: 'get'
  })
}

// 增加网络
export function addInternet(data) {
  return request({
    url: '/api/v1/common/admin/image/network',
    method: 'post',
    data
  })
}

// 查询网络
export function getInternet() {
  return request({
    url: '/api/v1/common/admin/image/network',
    method: 'get'
  })
}

// 删除网络
export function deleteInternet() {
  return request({
    url: '/api/v1/common/admin/image/network',
    method: 'delete'
  })
}

// 获取配置文件列表
export function getConfig(params) {
  return request({
    url: '/api/v1/common/admin/compose_file',
    method: 'get',
    params
  })
}

// 新增配置文件
export function addConfig(data) {
  return request({
    url: '/api/v1/common/admin/compose_file',
    method: 'post',
    data
  })
}

// 删除配置文件
export function removeConfig(data) {
  return request({
    url: '/api/v1/common/admin/compose_file',
    method: 'delete',
    data
  })
}

// 配置文件回显
export function configInfo(id) {
  return request({
    url: '/api/v1/common/admin/compose_file/' + id,
    method: 'get'
  })
}

// 编辑配置文件
export function editConfig(id, data) {
  return request({
    url: '/api/v1/common/admin/compose_file/' + id,
    method: 'patch',
    data
  })
}

/*
* 实体设备相关接口
* */

// 获取实体组列表组
export function getEntityGroup(params) {
  return request({
    url: '/api/v1/common/admin/entity/group',
    method: 'get',
    params
  })
}

// 删除实体组
export function removeEntityGroup(data) {
  return request({
    url: '/api/v1/common/admin/entity/group',
    method: 'delete',
    data
  })
}

// 新增实体组
export function addEntityGroup(data) {
  return request({
    url: '/api/v1/common/admin/entity/group',
    method: 'post',
    data
  })
}

// 实体组信息回显
export function entityGroupInfo(uuid) {
  return request({
    url: '/api/v1/common/admin/entity/group/' + uuid,
    method: 'get'
  })
}

// 编辑实体组
export function editEntityGroup(uuid, data) {
  return request({
    url: '/api/v1/common/admin/entity/group/' + uuid,
    method: 'patch',
    data
  })
}

// 获取实体设备列表
export function getEntityInfo(params) {
  return request({
    url: '/api/v1/common/admin/entity',
    method: 'get',
    params
  })
}

// 新增实体设备
export function addEntity(data) {
  return request({
    url: '/api/v1/common/admin/entity',
    method: 'post',
    data
  })
}

// 编辑实体设备
export function editEntity(id, data) {
  return request({
    url: '/api/v1/common/admin/entity/' + id,
    method: 'patch',
    data
  })
}

// 删除实体设备
export function removeEntity(data) {
  return request({
    url: '/api/v1/common/admin/entity',
    method: 'delete',
    data
  })
}
