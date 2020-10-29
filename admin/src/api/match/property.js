import request from '@/utils/request'
/* *
 * 接口说明：
 * 以下请求为  解题赛相关接口
 */

// 解题赛 创建竞赛相关接口------------------
// 解题赛 获取实体设备列表
export function fetchJeopardyList(query) {
  return request({
    url: '/api/v1/common/admin/physical/list',
    method: 'get',
    params: query
  })
}

// 获取实体设备网口信息
export function networkList(uuid) {
  return request({
    url: '/api/v1/common/admin/physical/network/' + uuid,
    method: 'get'
  })
}

// 解题赛 删除赛事event
export function deleteJeopardyMatch(query) {
  return request({
    url: '/api/v1/common/admin/physical/list',
    method: 'delete',
    data: query
  })
}

// 解题赛 获取比赛编辑页面详细信息
export function fetchJeopardyInfo(id) {
  return request({
    url: '/api/v1/common/admin/physical/' + id,
    method: 'get'
  })
}
// 获取标签类别
export function physicalTags() {
  return request({
    url: '/api/v1/common/admin/physical/tags',
    method: 'get'
  })
}
// 解题赛 编辑比赛页面保存
export function editMatchJeopardy(id, data) {
  return request({
    url: '/api/v1/common/admin/physical/' + id,
    method: 'patch',
    data
  })
}

export function createNetwork(id, data) {
  return request({
    url: '/api/v1/common/admin/physical/network/' + id,
    method: 'post',
    data
  })
}

// 删除实体设备网口信息
export function deleteNetwork(id, data) {
  return request({
    url: '/api/v1/common/admin/physical/network/' + id,
    method: 'DELETE',
    data
  })
}

// 解题赛 创建比赛

export function createJeopardyMatch(data) {
  return request({
    url: '/api/v1/common/admin/physical/list',
    method: 'post',
    data
  })
}

// 获取串口服务器接口
export function pemList(data) {
  return request({
    url: '/api/v1/common/admin/pem/list',
    method: 'get',
    params: data
  })
}
// 解题赛 创建竞赛->题目相关接口------------------
// 解题赛 创建比赛->关联用户->用户列表
export function fetchJeopardyTeamList(id) {
  return request({
    url: '/api/v1/common/admin/physical/authorization/' + id,
    method: 'get'
  })
}

// 解题赛 创建比赛->关联用户->保存编辑
export function submitJeopardyTeamList(id, data) {
  return request({
    url: '/api/v1/common/admin/physical/authorization/' + id,
    method: 'post',
    data
  })
}

// 虚拟镜像管理
// 获取镜像列表
export function imagesList(params) {
  return request({
    url: '/api/v1/common/admin/images',
    method: 'get',
    params
  })
}

// 获取单个镜像详情
export function imagesInfo(id) {
  return request({
    url: '/api/v1/common/admin/images/display/' + id,
    method: 'get'
  })
}

// 删除镜像
export function deleteImages(data) {
  return request({
    url: '/api/v1/common/admin/images',
    method: 'delete',
    data
  })
}

// 创建镜像
export function createImages(data) {
  return request({
    url: '/api/v1/common/admin/images',
    method: 'post',
    data
  })
}

// 文件注入
export function fileInjection(data) {
  return request({
    url: '/api/v1/common/admin/images/upload',
    method: 'post',
    data
  })
}

// 上传镜像文件
export function uploadImages(data) {
  return request({
    url: '/api/v1/admin/upload',
    method: 'post',
    data
  })
}
// 编辑镜像
export function editImages(uuid, data) {
  return request({
    url: '/api/v1/common/admin/images/' + uuid,
    method: 'patch',
    data
  })
}

// 镜像编辑回显
export function getImagesInfo(uuid) {
  return request({
    url: '/api/v1/common/admin/images/' + uuid,
    method: 'get'
  })
}

// PEM管理
// 列表   上面  pemList
// 查看设备连接情况

export function pemInfo(id) {
  return request({
    url: '/api/v1/common/admin/pem/connect/' + id,
    method: 'get'
  })
}

// 删除PEM
export function deletePem(data) {
  return request({
    url: '/api/v1/common/admin/pem/destroy',
    method: 'delete',
    data
  })
}
// 创建pem
export function createPem(data) {
  return request({
    url: '/api/v1/common/admin/pem/list',
    method: 'post',
    data
  })
}

// 编辑pem
export function editPem(id, data) {
  return request({
    url: '/api/v1/common/admin/pem/' + id,
    method: 'patch',
    data
  })
}

// 编辑获取pem详情
export function editpemInfo(id) {
  return request({
    url: '/api/v1/common/admin/pem/' + id,
    method: 'get'
  })
}

// 流量仿真

// 基础流量管理
// 列表页
export function getFlows(data) {
  return request({
    url: '/api/v1/common/admin/flows',
    method: 'get',
    params: data
  })
}
// 流量类型列表
export function getFlowsType(data) {
  return request({
    url: '/api/v1/common/admin/flows/types',
    method: 'get',
    params: data
  })
}

// 删除
export function deleteFlows(data) {
  return request({
    url: '/api/v1/common/admin/flows/batch_destroy',
    method: 'delete',
    data
  })
}
// 上传流量包
export function uploadFlow(data) {
  return request({
    url: '/api/v1/common/admin/flows/upload',
    method: 'post',
    data
  })
}
// 创建
export function createFlow(data) {
  return request({
    url: '/api/v1/common/admin/flows',
    method: 'post',
    data
  })
}
// 获取详情
export function getOneFlow(flowproject_uuid, uuid) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + flowproject_uuid + '/flows/' + uuid,
    method: 'get'
  })
}
export function getOneFlowWithoutProject(uuid) {
  return request({
    url: '/api/v1/common/admin/flows/' + uuid,
    method: 'get'
  })
}
// 编辑
export function editFlow(flowproject_uuid, uuid, data) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + flowproject_uuid + '/flows/' + uuid,
    method: 'put',
    data
  })
}
export function editFlowWithoutProject(uuid, data) {
  return request({
    url: '/api/v1/common/admin/flows/' + uuid,
    method: 'put',
    data
  })
}
// 流量集合管理
// 列表页
export function flowsProject(data) {
  return request({
    url: '/api/v1/common/admin/flows/project',
    method: 'get',
    params: data
  })
}
// 新增
export function createGather(data) {
  return request({
    url: '/api/v1/common/admin/flows/project',
    method: 'post',
    data
  })
}
// 编辑获取详情
export function getGather(id) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + id,
    method: 'get'
  })
}
// 编辑保存
export function editGather(id, data) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + id,
    method: 'put',
    data
  })
}
// 删除
export function deleteGather(data) {
  return request({
    url: '/api/v1/common/admin/flows/project',
    method: 'delete',
    data
  })
}
// 流量管理列表页
export function flowProjectManage(id, data) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + id + '/flows',
    method: 'get',
    params: data
  })
}
// 流量管理-》》删除流量
export function manageDeleteFlow(id, data) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + id + '/flows',
    method: 'delete',
    data
  })
}
// 导入列表页
export function importProjectManage(id, data) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + id + '/flows/import',
    method: 'get',
    params: data
  })
}
// 保存导入
export function saveImport(id, data) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + id + '/flows/import',
    method: 'post',
    data
  })
}
// 排序

export function sortFlowTable(uuid, data) {
  return request({
    url: '/api/v1/common/admin/flows/project/' + uuid + '/flows',
    method: 'post',
    data
  })
}
// 流量类型管理接口
export function flowTypeList(data) {
  return request({
    url: '/api/v1/common/admin/flows/types',
    method: 'get',
    params: data
  })
}
// 新增
export function createType(data) {
  return request({
    url: '/api/v1/common/admin/flows/types',
    method: 'post',
    data
  })
}
// 编辑回显
export function showType(id) {
  return request({
    url: '/api/v1/common/admin/flows/types/' + id,
    method: 'get'
  })
}
// 编辑保存
export function saveType(id, data) {
  return request({
    url: '/api/v1/common/admin/flows/types/' + id,
    method: 'put',
    data
  })
}
// 删除
export function deleteType(data) {
  return request({
    url: '/api/v1/common/admin/flows/types/batch_destroy',
    method: 'delete',
    data
  })
}

// 获取全部镜像标签
export function getTagList() {
  return request({
    url: '/api/v1/common/admin/images/tags',
    method: 'get'
  })
}

// 保存标签
export function submitTag(data) {
  return request({
    url: '/api/v1/common/admin/images/tags',
    method: 'post',
    data
  })
}

// 修改标签
export function patchTag(tag_id, data) {
  return request({
    url: '/api/v1/common/admin/images/tags/' + tag_id,
    method: 'put',
    data
  })
}

// 删除标签
export function removeTag(id) {
  return request({
    url: '/api/v1/common/admin/images/tags/' + id,
    method: 'delete'
  })
}

export function getPhyDevTags() {
  return request({
    url: '/api/v1/common/admin/physical/tags',
    method: 'get'
  })
}

// 管理员 设备审批模块接口

// 获取审批列表
export function getApprovalList(data) {
  return request({
    url: '/api/v1/common/admin/operation/physical',
    method: 'get',
    params: data
  })
}

// 管理员操作日志
export function getApprovalLog(data) {
  return request({
    url: '/api/v1/common/admin/operation/logs',
    method: 'get',
    params: data
  })
}

// 直接分配
export function distribution(data) {
  return request({
    url: '/api/v1/common/admin/operation/physical/assign',
    method: 'post',
    data
  })
}

// 审批申请
export function approval(data) {
  return request({
    url: '/api/v1/common/admin/operation/audit',
    method: 'post',
    data
  })
}

// 强制回收
export function reclaim(data) {
  return request({
    url: '/api/v1/common/admin/operation/physical/reclaim',
    method: 'post',
    data
  })
}

// 主办方申请
export function apply(data) {
  return request({
    url: '/api/v1/common/admin/operation/apply',
    method: 'post',
    data
  })
}

// 管理员点击申请人数显示申请人列表
export function operationList(data) {
  return request({
    url: '/api/v1/common/admin/operation/audit',
    method: 'get',
    params: data
  })
}

// 直接分配人员列表
export function assignList(data) {
  return request({
    url: '/api/v1/common/admin/operation/physical/assign',
    method: 'get',
    params: data
  })
}

// 镜像格式转换接口

// 上传文件信息
export function uploadInfo(data) {
  return request({
    url: '/api/v1/common/admin/images_format/file_info',
    method: 'post',
    data
  })
}

// 上传分片
export function createFormat(data) {
  return request({
    url: '/api/v1/common/admin/images_format/upload',
    method: 'post',
    data,
    loading: false
  })
}

// 合并分片
export function mergeFormat(id, data) {
  return request({
    url: '/api/v1/common/admin/images_format/file/merge/' + id,
    method: 'post',
    data,
    loading: false
  })
}

// 取消上传
export function cancelFormat(id, data) {
  return request({
    url: '/api/v1/common/admin/images_format/' + id,
    method: 'put'
  })
}

// 编辑回显
export function getFormatInfo(id) {
  return request({
    url: '/api/v1/common/admin/images_format/' + id,
    method: 'get'
  })
}

// 编辑提交
export function editFormat(data, id) {
  return request({
    url: '/api/v1/common/admin/images_format/' + id,
    method: 'patch',
    data
  })
}

// 删除指定镜像转换格式
export function deleteFormat(id) {
  return request({
    url: '/api/v1/common/admin/images_format/' + id,
    method: 'delete'
  })
}

// 列表
export function formatList(data) {
  return request({
    url: '/api/v1/common/admin/images_format',
    method: 'get',
    params: data
  })
}

// 转换
export function transformFormat(data) {
  return request({
    url: '/api/v1/common/admin/images_format/transform',
    method: 'post',
    data
  })
}

// 下载
export function downloadFormat(id) {
  return request({
    url: '/api/v1/common/admin/images_format/download/' + id,
    method: 'get'
  })
}

// 外部网络管理接口
// 列表
export function networksList(data) {
  return request({
    url: '/api/v1/common/admin/networks',
    method: 'get',
    params: data
  })
}

// 创建
export function createExternalNetwork(data) {
  return request({
    url: '/api/v1/common/admin/networks',
    method: 'post',
    data
  })
}

// 批量删除
export function deleteNetworks(data) {
  return request({
    url: '/api/v1/common/admin/networks',
    method: 'delete',
    data
  })
}

// 单个删除
export function deleteExternalNetwork(uuid) {
  return request({
    url: '/api/v1/common/admin/networks/' + uuid,
    method: 'delete'
  })
}

// 获取
export function getNetworks(uuid) {
  return request({
    url: '/api/v1/common/admin/networks/' + uuid,
    method: 'get'
  })
}

// 更新
export function uploadNetwork(uuid, data) {
  return request({
    url: '/api/v1/common/admin/networks/' + uuid,
    method: 'put',
    data
  })
}

// 浮动IP
export function floatList(data) {
  return request({
    url: '/api/v1/common/admin/floating-ips',
    method: 'get',
    params: data
  })
}

// 解绑
export function deleteFloat(uuid) {
  return request({
    url: '/api/v1/common/admin/floating-ips/' + uuid,
    method: 'delete'
  })
}

export function checkInjectionStatus(uuid) {
  return request({
    url: '/api/v1/common/admin/images/upload/status',
    method: 'get',
    params: {
      uuid
    }
  })
}

export function getFileInjection(uuid) {
  return request({
    url: '/api/v1/common/admin/images/' + uuid + '/read_dir',
    method: 'get'
  })
}

export function startHost(id, operation, save) {
  return request({
    url: '/api/v1/common/admin/images/' + id + '/instance',
    method: 'post',
    data: {
      operation,
      save
    }
  })
}

export function getConsoleUrl(id) {
  return request({
    url: '/api/v1/common/admin/images/' + id + '/instance',
    method: 'get'
  })
}

// 采集agent安装结果展示
export function getApp(image_uuid) {
  return request({
    url: '/api/v1/common/admin/images/' + image_uuid + '/agent',
    method: 'get'
  })
}

// 安装应用
export function installApp(uuid) {
  return request({
    url: '/api/v1/common/admin/images/' + uuid + '/agent_install',
    method: 'post'
  })
}

// 应用市场
export function applyList(params) {
  return request({
    url: '/app/center/v1/app',
    method: 'get',
    params
  })
}
// 适配系统
export function applyOs(params) {
  return request({
    url: '/app/center/v1/os',
    method: 'get',
    params
  })
}
// 删除应用
export function applyDelete(query) {
  return request({
    url: '/app/center/v1/app/' + query,
    method: 'delete',
    query
  })
}

// 添加应用
export function applyadd(data) {
  return request({
    url: '/app/center/v1/app',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 查看一个应用中对应的所有资源
export function getAppInfo(id) {
  return request({
    url: '/app/center/v1/app/' + id,
    method: 'get'
  })
}

// 添加应用配置资源
export function createSoftware(data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/app/center/v1/software',
    method: 'post',
    data
  })
}

// 更新应用信息
export function modifyApp(id, data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/app/center/v1/app/' + id,
    method: 'put',
    data
  })
}

// 删除应用中的一个配置资源
export function deleteSoftware(id) {
  return request({
    url: '/app/center/v1/software/' + id,
    method: 'delete'
  })
}

// 更新应用中的配置资源
export function modifySoftware(id, data) {
  return request({
    url: '/app/center/v1/software/' + id,
    method: 'put',
    data
  })
}
