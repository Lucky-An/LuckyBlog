import request from '@/utils/request'
/* *
 * 接口说明：
 * 以下请求为  解题赛相关接口
 */

// 解题赛 创建竞赛相关接口------------------
// 解题赛 获取比赛列表
export function fetchJeopardyList(query) {
  return request({
    url: '/api/v1/jeopardy/admin/events',
    method: 'get',
    params: query
  })
}

// 解题赛 删除赛事event
export function deleteJeopardyMatch(query) {
  return request({
    url: '/api/v1/jeopardy/admin/events/batch_destroy',
    method: 'delete',
    data: query
  })
}

// 解题赛 公开、隐藏赛事
export function publicJeopardyMatch(query) {
  return request({
    url: '/api/v1/jeopardy/admin/events/batch_public',
    method: 'patch',
    data: query
  })
}

// 解题赛 获取比赛编辑页面详细信息
export function fetchJeopardyInfo(id) {
  return request({
    url: '/api/v1/jeopardy/admin/events/' + id,
    method: 'get'
  })
}

// 理论赛 编辑比赛页面 删除图片
export function deleteImage(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/events/' + id,
    method: 'delete',
    data
  })
}

// 解题赛 编辑比赛页面保存
export function editMatchJeopardy(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/events/' + id,
    method: 'patch',
    data
  })
}

// 解题赛 创建比赛
export function createJeopardyMatch(data) {
  return request({
    url: '/api/v1/jeopardy/admin/events',
    method: 'post',
    data
  })
}
// 解题赛 创建竞赛->题目相关接口------------------
// 解题赛 创建比赛->关联用户->用户列表
export function fetchJeopardyTeamList(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/events/' + id + '/users',
    method: 'get'
  })
}

// 解题赛 创建比赛->关联用户->保存编辑
export function submitJeopardyTeamList(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/events/' + id + '/users',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛 竞赛信息----------------------------
// 竞赛运维公共接口
// 解题赛  竞赛运维 获取所有题目，目前用在 题目提示，实力运维
export function getAllTipick(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/tasks',
    method: 'get',
    params
  })
}

// 解题赛  竞赛运维 获取所有题目，目前用在 题目提示，实力运维
export function getAllPlayer(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/users',
    method: 'get',
    params
  })
}

// 竞赛运维接口

// 解题赛 竞赛运维 获取比赛信息
export function matchJeopardyInfo(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/state',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维->获取积分方式
export function matchJeopardyMode(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_mode/' + id,
    method: 'get'
  })
}

// 解题赛 竞赛运维->修改比赛状态
export function updateJeopardyStatus(params, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/state',
    method: 'patch',
    params,
    data
  })
}

// 解题赛 竞赛运维->场景初始化
export function initSence(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/init_scene',
    method: 'patch'
  })
}

// 解题赛 竞赛运维->清楚虚拟数据
export function initFictitious(data) {
  return request({
    url: '/api/v1/jeopardy/admin/init_env/',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维->初始化网络
export function initNet(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/networks',
    method: 'post'
  })
}

// 解题赛 竞赛运维->清楚比赛数据
export function clearData(params, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/data/clear',
    method: 'delete',
    params
  })
}

// 解题赛 创建竞赛->题目相关接口------------------
// 解题赛  创建竞赛 获取导入题目列表
export function fetchJeopardyImport(data) {
  return request({
    url: '/api/v1/jeopardy/admin/import_tasks_details',
    method: 'get',
    params: data
  })
}

// 解题赛 创建竞赛  确认导入题目
export function sureImportJeopardy(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_create',
    method: 'post',
    data
  })
}
// 解题赛 创建竞赛  获取习题集
export function fetchJeopardyTag(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_tags',
    method: 'get'
  })
}

// //解题赛 创建竞赛  获取题目类型
export function fetcheopardyTopicType(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_categorys',
    method: 'get'
  })
}

// 解题赛 创建竞赛  获取比赛题目列表
export function fetchJeopardyTopicList(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks',
    method: 'get',
    params: data
  })
}

// 解题赛 创建竞赛  获取要编辑的题目列表
export function getSetScoreList(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/tasks/scores',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛  保存编辑后的题目分数
export function editTaskScore(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/tasks/scores',
    method: 'patch',
    data
  })
}

// 解题赛 创建竞赛  删除题目
export function deleteJeopardySub(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_destroy',
    method: 'delete',
    data
  })
}

//! 解题赛 创建竞赛  编辑题目回显
export function showJeopardyEditInfo(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/' + id,
    method: 'get'
  })
}

// 解题赛 创建竞赛  创建题目
export function createJeopardyTopic(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks',
    method: 'post',
    data
  })
}

//! 解题赛 创建竞赛  保存编辑题目
export function editJeopardyTopic(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/' + id,
    method: 'patch',
    data
  })
}
// 解题赛 创建竞赛  获取题目类型
export function fetchJeopardyTopicType(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_categorys',
    method: 'get'
  })
}
// 解题赛   创建竞赛 删除WP
export function deleteJeopardyWriteup(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/task_writeup/' + id,
    method: 'delete'
  })
}

// 解题赛   创建竞赛 删除脚本
export function deleteJeopardyScript(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/task_pfs/' + id,
    method: 'delete'
  })
}

// 解题赛  创建竞赛 删除附件
export function deleteJeopardyFile(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/' + id,
    method: 'delete',
    data: {
      index: index
    }
  })
}

// 解题赛 创建竞赛 公开、隐藏题目
export function publicJeopardySub(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_public',
    method: 'patch',
    data
  })
}

// 解题赛 创建竞赛 共享，独享容器 1共享 0独享
export function shareJeopardySence(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/sharing',
    method: 'patch',
    data
  })
}

// 解题赛 创建竞赛 开启容器task_hash
export function openJeopardySence(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/start_share_containers',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛 关闭容器task_hash
export function closeJeopardySence(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/stop_share_containers',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛 轮询查询
export function pollingSence(hash) {
  return request({
    url: '/api/v1/jeopardy/web/env/' + hash,
    method: 'get'
  })
}

// 解题赛 竞赛运维 实例运维----------------------------
export function getMonitorList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/instances',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 竞赛公告----------------------------
// 解题赛  竞赛运维 获取比赛公告列表
export function fetchJeopardyNoiceList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/notices',
    method: 'get',
    params
  })
}

// 解题赛  竞赛运维 获取题目提示列表
export function fetchJeopardyTipList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/task/notices',
    method: 'get',
    params
  })
}

// 解题赛  竞赛运维 新增比赛公告
export function addJeopardyNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/notices',
    method: 'post',
    data: data
  })
}

// 解题赛 竞赛运维  新增题目提示
export function addJeopardyTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/task/notices',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维  编辑比赛公告
export function updateJeopardyNoice(params, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/notices',
    method: 'patch',
    params,
    data
  })
}

// 解题赛  竞赛运维 编辑提示
export function updateJeopardyTIP(params, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/task/notices',
    method: 'patch',
    params,
    data
  })
}

// 解题赛  竞赛运维 删除公告
export function removeJeopardyNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/notices',
    method: 'delete',
    data
  })
}

// 解题赛 竞赛运维  删除提示
export function removeJeopardyTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/task/notices',
    method: 'delete',
    data
  })
}

// 解题赛 竞赛运维  置顶、取消置顶比赛公告
export function topJeopardyNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/notices/top',
    method: 'patch',
    data
  })
}

// 解题赛  竞赛运维 置顶、取消置顶提示
export function topJeopardyTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/task/notices/top',
    method: 'patch',
    data
  })
}

// 编辑攻防赛  网络模块-----------------------------
// 获取网络列表  和详情
export function fetchInternet(id, params) {
  return request({
    method: 'get',
    url: '/api/v1/jeopardy/admin/event/' + id + '/networks',
    params
  })
}

// 获取队伍数量
export function fetchTeamNum(id) {
  return request({
    method: 'get',
    url: '/api/v1/jeopardy/admin/event/' + id + '/groups'
  })
}

// 新增网络信息
export function addInternet(id, data) {
  return request({
    method: 'post',
    url: '/api/v1/jeopardy/admin/event/' + id + '/networks',
    data
  })
}

// 轮询查询网络信息增加状态
export function pollingAdd(id) {
  return request({
    method: 'get',
    url: '/api/v1/jeopardy/admin/event/check_network/' + id
  })
}

// 编辑网络信息回显
export function fetchInternetInfo(id, in_id, data) {
  return request({
    method: 'get',
    url: '/api/v1/jeopardy/admin/event/' + id + '/networks/' + in_id,
    data
  })
}

// 编辑网络信息
export function editInternet(id, in_id, data) {
  return request({
    method: 'patch',
    url: '/api/v1/jeopardy/admin/event/' + id + '/networks/' + in_id,
    data
  })
}

// 删除网络信息
export function delInternet(id, data) {
  return request({
    method: 'delete',
    url: '/api/v1/jeopardy/admin/event/' + id + '/networks',
    data
  })
}

// 解题赛 竞赛运维 选手管理----------------------------
// 解题赛 竞赛运维 获取选手列表
export function getPlayerList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/players',
    method: 'get',
    params
  })
}
// 解题赛 竞赛运维 奖惩分
export function defenseReward_score(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_user_details',
    method: 'get',
    params: query
  })
}

// 解题赛 竞赛运维 解开、禁赛 用户
export function banPaylerMatch(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/player/bans',
    method: 'PATCH',
    data
  })
}

// 解题赛 竞赛运维 解开、禁赛 team
export function banJeopardyTeamMatch(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_teams/' + id,
    method: 'PATCH',
    data
  })
}

// 解题赛 竞赛运维 点击成绩管理获取成绩单
export function getPlayerScore(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/player/score',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 使用户 成绩无效、有效
export function invalidPlayerAnswer(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/player/score',
    method: 'patch',
    data
  })
}

// 解题赛 竞赛运维 队伍管理 获取奖惩分列表
export function fetchReward_scoreLsit(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/player/reward',
    method: 'get',
    params
  })
}
// 解题赛 竞赛运维 队伍管理 获取奖惩分列表
export function submitReward_score(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/player/reward',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维 队伍管理 下载全部wp
export function downloadAllWP(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/export_wp',
    method: 'get',
    data
  })
}

// 解题赛 竞赛运维 队伍管理 下载每个
export function downloadEachWP(id, obj_id) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/down_wp/' + obj_id,
    method: 'get'
  })
}

// 解题赛 竞赛运维 队伍管理 竞赛结果
export function getResultList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/scores',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 队伍管理 竞赛结果 展示结果详情
export function ResultDetail(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/score/player',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 展示管理详情
export function getShow(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/view',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 编辑展示管理
export function editShow(params, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/view',
    method: 'patch',
    params,
    data
  })
}

//   场景初始化
export function initSencejad(params) {
  return request({
    method: 'patch',
    url: '/api/v1/jeopardy/admin/event/init_scene',
    params
  })
}

//  竞赛数据导出
export function exportResult(params) {
  return request({
    method: 'get',
    url: '/api/v1/jeopardy/admin/event/data/export',
    params,
    responseType: 'blob'
  })
}

//  全部 WP 导出
export function exportAllWp(params) {
  return request({
    method: 'get',
    url: '/api/v1/jeopardy/admin/event/wps/export',
    params,
    responseType: 'blob'
  })
}
