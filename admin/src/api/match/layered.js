import request from '@/utils/request'
/* *
* 接口说明：
* 以下请求为  解题赛相关接口
*/

// 解题赛 创建竞赛相关接口------------------
// 解题赛 获取比赛列表
export function fetchJeopardyList(query) {
  return request({
    url: '/api/v1/layered/admin/events',
    method: 'get',
    params: query
  })
}

// 解题赛 删除赛事event
export function deleteJeopardyMatch(query) {
  return request({
    url: '/api/v1/layered/admin/events/batch_destroy',
    method: 'delete',
    data: query
  })
}

// 解题赛 公开、隐藏赛事
export function publicJeopardyMatch(query) {
  return request({
    url: '/api/v1/layered/admin/events/batch_public',
    method: 'patch',
    data: query
  })
}

// 解题赛 获取比赛编辑页面详细信息
export function fetchJeopardyInfo(id) {
  return request({
    url: '/api/v1/layered/admin/events/' + id,
    method: 'get'
  })
}

// 解题赛 编辑比赛页面保存
export function editMatchJeopardy(id, data) {
  return request({
    url: '/api/v1/layered/admin/events/' + id,
    method: 'patch',
    data
  })
}

// 解题赛 创建比赛
export function createJeopardyMatch(data) {
  return request({
    url: '/api/v1/layered/admin/events',
    method: 'post',
    data
  })
}
// 解题赛 创建竞赛->题目相关接口------------------
// 解题赛 创建比赛->关联用户->用户列表
export function fetchJeopardyTeamList(id, data) {
  return request({
    url: '/api/v1/layered/admin/events/' + id + '/users',
    method: 'get'
  })
}

// 解题赛 创建比赛->关联用户->保存编辑
export function submitJeopardyTeamList(id, data) {
  return request({
    url: '/api/v1/layered/admin/events/' + id + '/users',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛 竞赛信息----------------------------
// 解题赛 竞赛运维 获取比赛信息
export function matchJeopardyInfo(id) {
  return request({
    url: '/api/v1/layered/admin/event_state/' + id,
    method: 'get'
  })
}
// 解题赛 竞赛运维->获取比赛信息
export function fetchJeopardyMatchStatus(id) {
  return request({
    url: '/api/v1/layered/admin/event_state/' + id,
    method: 'get'
  })
}

// 解题赛 竞赛运维->获取积分方式
export function matchJeopardyMode(id) {
  return request({
    url: '/api/v1/layered/admin/event_mode/' + id,
    method: 'get'
  })
}

// 解题赛 竞赛运维->修改比赛状态
export function updateJeopardyStatus(id, data) {
  return request({
    url: '/api/v1/layered/admin/event_state/' + id,
    method: 'patch',
    data
  })
}

// 解题赛 竞赛运维->场景初始化
export function initSence(id, data) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/init_scene',
    method: 'patch'
  })
}

// 解题赛 创建竞赛->题目相关接口------------------
// 解题赛  创建竞赛 获取导入题目列表
export function fetchJeopardyImport(data) {
  return request({
    url: '/api/v1/layered/admin/import_tasks_details',
    method: 'get',
    params: data
  })
}

// 解题赛 创建竞赛  确认导入题目
export function sureImportJeopardy(data) {
  return request({
    url: '/api/v1/layered/admin/event_tasks/batch_create',
    method: 'post',
    data
  })
}
// 解题赛 创建竞赛  获取习题集
export function fetchJeopardyTag(data) {
  return request({
    url: '/api/v1/layered/admin/task_tags',
    method: 'get'
  })
}

// //解题赛 创建竞赛  获取题目类型
export function fetcheopardyTopicType(data) {
  return request({
    url: '/api/v1/layered/admin/task_categorys',
    method: 'get'
  })
}

// 解题赛 创建竞赛  获取比赛题目列表
export function fetchJeopardyTopicList(data) {
  return request({
    url: '/api/v1/layered/admin/event_tasks',
    method: 'get',
    params: data
  })
}

// 解题赛 创建竞赛  获取要编辑的题目列表
export function getSetScoreList(id, data) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/tasks/scores',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛  保存编辑后的题目分数
export function editTaskScore(id, data) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/tasks/scores',
    method: 'patch',
    data
  })
}

// 解题赛 创建竞赛  删除题目
export function deleteJeopardySub(data) {
  return request({
    url: '/api/v1/layered/admin/event_tasks/batch_destroy',
    method: 'delete',
    data
  })
}

// 解题赛 创建竞赛  编辑题目回显
export function showJeopardyEditInfo(id) {
  return request({
    url: '/api/v1/layered/admin/event_tasks/' + id,
    method: 'get'
  })
}

// 解题赛 创建竞赛  创建题目
export function createJeopardyTopic(data) {
  return request({
    url: '/api/v1/layered/admin/event_tasks',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛  保存编辑题目
export function editJeopardyTopic(id, data) {
  return request({
    url: '/api/v1/layered/admin/event_tasks/' + id,
    method: 'patch',
    data
  })
}
// 解题赛 创建竞赛  获取题目类型
export function fetchJeopardyTopicType(data) {
  return request({
    url: '/api/v1/layered/admin/task_categorys',
    method: 'get'
  })
}
// 解题赛   创建竞赛 删除WP
export function deleteJeopardyWriteup(id, index) {
  return request({
    url: '/api/v1/layered/admin/task_writeup/' + id,
    method: 'delete'
  })
}

// 解题赛   创建竞赛 删除脚本
export function deleteJeopardyScript(id, index) {
  return request({
    url: '/api/v1/layered/admin/task_pfs/' + id,
    method: 'delete'
  })
}

// 解题赛  创建竞赛 删除附件
export function deleteJeopardyFile(id, index) {
  return request({
    url: '/api/v1/layered/admin/event_tasks/' + id,
    method: 'delete',
    data: { index: index }
  })
}
// 解题赛 创建竞赛 公开、隐藏题目
export function publicJeopardySub(data) {
  return request({
    url: '/api/v1/layered/admin/event_tasks/batch_public',
    method: 'patch',
    data
  })
}

// 解题赛 竞赛运维 监控管理----------------------------
// 解题赛  竞赛运维 获取监控题目
export function getMonitorTask(id, params) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/tasks',
    method: 'get',
    params
  })
}
export function getMonitorUser(id, params) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/users',
    method: 'get',
    params
  })
}
export function getMonitorList(id, params) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/monitors',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 竞赛公告----------------------------
// 解题赛  竞赛运维 获取比赛公告列表
export function fetchJeopardyNoiceList(params) {
  return request({
    url: '/api/v1/layered/admin/event_notices',
    method: 'get',
    params
  })
}

// 解题赛  竞赛运维 获取题目提示列表
export function fetchJeopardyTipList(params) {
  return request({
    url: '/api/v1/layered/admin/event_task_notices',
    method: 'get',
    params
  })
}

// 解题赛  竞赛运维 新增比赛公告
export function addJeopardyNoice(data) {
  return request({
    url: '/api/v1/layered/admin/event_notices',
    method: 'post',
    data: data
  })
}

// 解题赛 竞赛运维  新增题目提示
export function addJeopardyTIP(data) {
  return request({
    url: '/api/v1/layered/admin/event_task_notices',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维  编辑比赛公告
export function updateJeopardyNoice(id, data) {
  return request({
    url: '/api/v1/layered/admin/event_notices/' + id,
    method: 'patch',
    data
  })
}

// 解题赛  竞赛运维 编辑提示
export function updateJeopardyTIP(id, data) {
  return request({
    url: '/api/v1/layered/admin/event_task_notices/' + id,
    method: 'patch',
    data
  })
}

// 解题赛  竞赛运维 删除公告
export function removeJeopardyNoice(data) {
  return request({
    url: '/api/v1/layered/admin/event_notices/batch_destroy',
    method: 'delete',
    data
  })
}

// 解题赛 竞赛运维  删除提示
export function removeJeopardyTIP(data) {
  return request({
    url: '/api/v1/layered/admin/event_task_notices/batch_destroy',
    method: 'delete',
    data
  })
}

// 解题赛 竞赛运维  置顶、取消置顶比赛公告
export function topJeopardyNoice(data) {
  return request({
    url: '/api/v1/layered/admin/event_notices/batch_top',
    method: 'patch',
    data
  })
}

// 解题赛  竞赛运维 置顶、取消置顶提示
export function topJeopardyTIP(data) {
  return request({
    url: '/api/v1/layered/admin/event_task_notices/batch_top',
    method: 'patch',
    data
  })
}

// 编辑攻防赛  网络模块-----------------------------
// 获取网络列表  和详情
export function fetchInternet(id, params) {
  return request({
    method: 'get',
    url: '/api/v1/layered/admin/event/' + id + '/networks',
    params
  })
}

// 获取队伍数量
export function fetchTeamNum(id) {
  return request({
    method: 'get',
    url: '/api/v1/layered/admin/event/' + id + '/groups'
  })
}

// 新增网络信息
export function addInternet(id, data) {
  return request({
    method: 'post',
    url: '/api/v1/layered/admin/event/' + id + '/networks',
    data
  })
}

// 编辑网络信息回显
export function fetchInternetInfo(id, in_id, data) {
  return request({
    method: 'get',
    url: '/api/v1/layered/admin/event/' + id + '/networks/' + in_id,
    data
  })
}

// 编辑网络信息
export function editInternet(id, in_id, data) {
  return request({
    method: 'patch',
    url: '/api/v1/layered/admin/event/' + id + '/networks/' + in_id,
    data
  })
}

// 删除网络信息
export function delInternet(id, data) {
  return request({
    method: 'delete',
    url: '/api/v1/layered/admin/event/' + id + '/networks',
    data
  })
}

// 解题赛 竞赛运维 队伍管理----------------------------
// 解题赛 竞赛运维 获取用户列表
export function fetchJeopardyUserList(query) {
  return request({
    url: '/api/v1/layered/admin/event_signup_user_details',
    method: 'get',
    params: query
  })
}
// 解题赛 竞赛运维 奖惩分
export function defenseReward_score(query) {
  return request({
    url: '/api/v1/layered/admin/event_signup_user_details',
    method: 'get',
    params: query
  })
}

// 解题赛 竞赛运维 队伍管理列表
export function fetchJeopardyTeamManger(query) {
  return request({
    url: '/api/v1/layered/admin/event_signup_team_details',
    method: 'get',
    params: query
  })
}

// 解题赛 竞赛运维 解开、禁赛 用户
export function banJeopardyUserMatch(id, data) {
  return request({
    url: '/api/v1/layered/admin/event_signup_users/' + id,
    method: 'PATCH',
    data
  })
}

// 解题赛 竞赛运维 解开、禁赛 team
export function banJeopardyTeamMatch(id, data) {
  return request({
    url: '/api/v1/layered/admin/event_signup_teams/' + id,
    method: 'PATCH',
    data
  })
}

// 解题赛 竞赛运维 点击成绩管理获取成绩单
export function getJeopardyUsersScore(query) {
  return request({
    url: '/api/v1/layered/admin/event_users_scores_details',
    method: 'get',
    params: query
  })
}

// 解题赛 竞赛运维 点击成绩管理获取成绩单
export function getJeopardyTeamScore(query) {
  return request({
    url: '/api/v1/layered/admin/event_teams_scores_details',
    method: 'get',
    params: query
  })
}

// 解题赛 竞赛运维 使用户 成绩无效、有效
export function invalidJeopardyUserAnswer(id, query) {
  return request({
    url: '/api/v1/layered/admin/event_user_answers/' + id,
    method: 'patch',
    data: query
  })
}

// 解题赛 竞赛运维 使团队 成绩无效、有效
export function invalidJeopardyTeamAnswer(id, query) {
  return request({
    url: '/api/v1/layered/admin/event_team_answers/' + id,
    method: 'patch',
    data: query
  })
}

// 解题赛 竞赛运维 队伍管理 获取奖惩分列表
export function fetchReward_scoreLsit(id, params) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/scores/reward',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 队伍管理 获取奖惩分列表
export function submitReward_score(id, data) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/scores/reward',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维 场景链接 获取场景列表
export function getSenceLink(id, params) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/remote_envs',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 场景链接 获取场景用户
export function getSenceUser() {
  return request({
    url: '/api/v1/common/admin/users',
    method: 'get'
  })
}

// 解题赛 竞赛运维 场景链接 获取场景队伍
export function getSenceTeam() {
  return request({
    url: '/api/v1/common/admin/teams',
    method: 'get'
  })
}

// 解题赛 竞赛运维 场景链接 增加
export function addSenceLick(id, data) {
  return request({
    url: '/api/v1/layered/admin/event/' + id + '/remote_envs',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维 场景链接 修改回显
export function editSenceLickDetail(id) {
  return request({
    url: '/api/v1/layered/admin/event/remote_envs/' + id,
    method: 'get'
  })
}

// 解题赛 竞赛运维 场景链接 修改
export function editSenceLick(id, data) {
  return request({
    url: '/api/v1/layered/admin/event/remote_envs/' + id,
    method: 'patch',
    data
  })
}

// 解题赛 竞赛运维 场景链接 删除
export function delSence(data) {
  return request({
    url: '/api/v1/layered/admin/event/remote_envs/batch_destroy',
    method: 'delete',
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

// 解题赛 竞赛运维 队伍管理 下载全部wp
export function downloadEachWP(id, obj_id) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/down_wp/' + obj_id,
    method: 'get'
  })
}

