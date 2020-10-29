import request from '@/utils/request'
/* *
* 接口说明：
* 提交审核 提交管理 比赛结果相关接口
*/

// 提交审核 提交审核列表
export function subAuditList(hash, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/challenges/verification',
    params
  })
}

// 挑战分配 轮询是否有新的提交
export function getApplyMessage(hash, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/challenges/prompt',
    params
  })
}

// 提交审核 确认提交审核
export function submitAudit(hash, data) {
  return request({
    method: 'post',
    url: '/api/v1/rw/admin/evts/' + hash + '/challenges/verification',
    data
  })
}

// 提交审核 修改审核列表是否下载过的状态
export function changeDownStatus(hash, id) {
  return request({
    method: 'patch',
    url: '/api/v1/rw/admin/evts/' + hash + '/submit_validation/' + id
  })
}

// 提交管理 获取提交管理列表
export function subManageList(hash, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/challenge_logs',
    params
  })
}

// 提交管理 获取提交管理列表
export function auditRecord(hash, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/challenges/verification/logs',
    params
  })
}

// 提交管理 获取查看详情
export function subManageDetail(hash, id, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/submit_manage/' + id,
    params
  })
}

// 比赛结果 比赛结果列表
export function getMatchResult(hash, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/scores/teams',
    params
  })
}

// 比赛结果 获取队伍列表
export function getTeamList(hash, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/challenges/verification/teams',
    params
  })
}

// 比赛结果 提交奖惩分
export function rewardScore(hash, data) {
  return request({
    method: 'post',
    url: '/api/v1/rw/admin/evts/' + hash + '/scores/reward',
    data
  })
}

// 比赛结果 获取分数详情的题目表头
export function getDetailSub(hash, params) {
  return request({
    method: 'get',
    url: '/api/web/evts/' + hash + '/scoreboard/tasks',
    params
  })
}

// 比赛结果 获取分数详情
export function getScoreDetail(hash, params) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/answers',
    params
  })
}

// 比赛结果 获取奖惩详情
export function rewardDetail(hash, id) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/challenges/verification/teams/' + id
  })
}

/* *
* 接口说明：
* 挑战分配接口
*/

// 挑战分配 请求题目列表
export function challengeSub(hash) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/allocation/wxtasks'
  })
}

// 挑战分配 请求队伍
export function challengeTeam(hash) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/allocation/teams'
  })
}

// 挑战分配 请求挑战信息
export function challengeInfo(hash) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/allocation/challenge_info'
  })
}

// 挑战分配 保存挑战配置
export function challengesubmit(hash, data) {
  return request({
    method: 'post',
    url: '/api/v1/rw/admin/evts/' + hash + '/allocation/confirm_round',
    data
  })
}

// 挑战分配 挑战记录
export function challengeLog(hash) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/allocation/challenge_infos'
  })
}

// 挑战分配 罚时列表
export function penaltyTime(hash) {
  return request({
    method: 'get',
    url: '/api/v1/rw/admin/evts/' + hash + '/allocation/time_punishment'
  })
}

// 挑战分配 增加罚时时间
export function submitTime(hash, data) {
  return request({
    method: 'post',
    url: '/api/v1/rw/admin/evts/' + hash + '/allocation/time_punishment',
    data
  })
}

/* *
* 接口说明：
* 以下请求为赛事相关接口
*/

// 开启容器
export function openSence(hash) {
  return request({
    method: 'post',
    url: '/api/env/' + hash,
    data: { task_hash: hash }
  })
}

// 删除容器
export function deleteSence(hash) {
  return request({
    url: '/api/env/' + hash,
    method: 'delete'
  })
}

// 轮询容器
export function getSenceStatus(hash) {
  return request({
    method: 'get',
    url: '/api/env/' + hash
  })
}

// 获取比赛列表
export function fetchList(query) {
  return request({
    url: '/api/v1/rw/admin/evts',
    method: 'get',
    params: query
  })
}

// 删除赛事event
export function removeMatch(query) {
  return request({
    url: '/api/v1/rw/admin/evts/batch_destroy',
    method: 'delete',
    data: query
  })
}

// 公开、隐藏赛事
export function publicMatch(query) {
  return request({
    url: '/api/v1/rw/admin/evts/batch_public',
    method: 'patch',
    data: query
  })
}

// 获取比赛编辑页面详细信息
export function fetchMatchInfo(hash) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash,
    method: 'get'
  })
}

// 理论赛 编辑比赛页面 删除图片
export function deleteImage(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash,
    method: 'delete',
    data
  })
}

// 编辑比赛页面保存
export function editMatch(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash,
    method: 'patch',
    data
  })
}

// 创建比赛
export function createMatch(data) {
  return request({
    url: '/api/v1/rw/admin/evts',
    method: 'post',
    data
  })
}

// 是否可以创建比赛
export function canCreate(data) {
  return request({
    url: '/api/v1/rw/admin/evts/create',
    method: 'get'
  })
}

/* *
* 接口说明：
* 给比赛添加用户相关接口
*/

// 获取新建比赛战队列表
export function getMatchTeam(hash) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/teams',
    method: 'get'
  })
}

// 提交比赛选取的战队
export function submitMatchTeam(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/teams',
    method: 'post',
    data
  })
}

/* *
* 接口说明：
* 比赛状态相关接口
*/

// 获取比赛状态
export function matchStatus(hash) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/state',
    method: 'get'
  })
}

// 修改比赛状态
export function updateStatus(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/state',
    method: 'patch',
    data
  })
}

// 清除比赛数据
export function clearData(hash) {
  return request({
    url: '/api/v1/rw/admin/evts/clear_event/' + hash,
    method: 'post'
  })
}

// 解题赛 竞赛运维->场景初始化
export function initSence(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/event/' + hash + '/init_scene',
    method: 'patch'
  })
}

// 获取导入题目列表
export function fetchImportList(data, hash) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/tasks/imports',
    method: 'get',
    params: data
  })
}

// 确认导入题目
export function sureImport(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/tasks',
    method: 'post',
    data
  })
}

// 获取比赛题目列表
export function fetchTopicList(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/tasks',
    method: 'get',
    params: data
  })
}

// 公开、隐藏题目
export function publicSub(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/tasks/batch_public',
    method: 'patch',
    data
  })
}

// 删除题目
export function deleteSub(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/tasks/batch_destroy',
    method: 'delete',
    data
  })
}

// 编辑题目回显
export function showEditInfo(hash, task_id) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/tasks/' + task_id,
    method: 'get'
  })
}

// 保存编辑题目
export function editTopic(hash, task_id, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/tasks/' + task_id,
    method: 'patch',
    data
  })
}

/* *
* 接口说明：
* 公告相关接口
*/

// 获取比赛公告列表
export function fetchNoiceList(hash, params) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/notices',
    method: 'get',
    params
  })
}

// 新增比赛公告
export function addNoice(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/notices',
    method: 'post',
    data: data
  })
}

// 编辑比赛公告
export function updateNoice(hash, id, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/notices/' + id,
    method: 'patch',
    data
  })
}

// 删除公告
export function removeNoice(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/notices/batch_destroy',
    method: 'delete',
    data
  })
}

// 置顶、取消置顶比赛公告
export function topNoice(hash, data) {
  return request({
    url: '/api/v1/rw/admin/evts/' + hash + '/notices/batch_top',
    method: 'patch',
    data
  })
}

