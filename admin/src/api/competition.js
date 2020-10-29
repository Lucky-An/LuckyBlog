import request from '@/utils/request'

// 删除赛事event
export function removeMatch(query) {
  return request({
    url: '/api/v1/jeopardy/admin/events/batch_destroy',
    method: 'delete',
    data: query
  })
}

// 公开、隐藏赛事
export function publicMatch(query) {
  return request({
    url: '/api/v1/jeopardy/admin/events/batch_public',
    method: 'patch',
    data: query
  })
}

// 获取比赛编辑页面详细信息
export function fetchMatchInfo(id) {
  return request({
    url: '/api/v1/jeopardy/admin/events/' + id,
    method: 'get'
  })
}

// 编辑比赛页面保存
export function editMatch(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/events/' + id,
    method: 'patch',
    data
  })
}

// 创建比赛
export function createMatch(data) {
  return request({
    url: '/api/v1/jeopardy/admin/events',
    method: 'post',
    data
  })
}

/* *
* 接口说明：
* 比赛状态相关接口
*/

// 获取比赛信息
export function matchInfo(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_state/' + id,
    method: 'get'
  })
}

// 获取积分方式
export function matchMode(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_mode/' + id,
    method: 'get'
  })
}

// 修改比赛状态
export function updateStatus(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_state/' + id,
    method: 'patch',
    data
  })
}

// 获取题目类型
export function fetchTopicType(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_categorys',
    method: 'get'
  })
}

// 获取习题集
export function fetchTag(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_tags',
    method: 'get'
  })
}

// 获取导入题目列表
export function fetchImportList(data) {
  return request({
    url: '/api/v1/jeopardy/admin//import_tasks_details',
    method: 'get',
    params: data
  })
}

// 确认导入题目
export function sureImport(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_create',
    method: 'post',
    data
  })
}

// 获取比赛题目列表
export function fetchTopicList(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks',
    method: 'get',
    params: data
  })
}

// 保存题目分数
export function saveScore(data, id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/score/' + id,
    method: 'patch',
    data
  })
}

// 公开、隐藏题目
export function publicSub(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_public',
    method: 'patch',
    data
  })
}

// 删除题目
export function deleteSub(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_destroy',
    method: 'delete',
    data
  })
}

// 创建题目
export function createTopic(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks',
    method: 'post',
    data
  })
}

// 编辑题目回显
export function showEditInfo(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/' + id,
    method: 'get'
  })
}

// 保存编辑题目
export function editTopic(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/' + id,
    method: 'patch',
    data
  })
}

// 删除附件
export function deleteFile(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/' + id,
    method: 'delete',
    data: { index: index }
  })
}

// 删除WP
export function deleteWriteup(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/task_writeup/' + id,
    method: 'delete'
  })
}

// 删除脚本
export function deleteScript(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/task_pfs/' + id,
    method: 'delete'
  })
}

/* *
* 接口说明：
* 公告相关接口
*/

// 获取比赛公告列表
export function fetchNoiceList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices',
    method: 'get',
    params
  })
}

// 获取题目提示列表
export function fetchTipList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices',
    method: 'get',
    params
  })
}

// 新增比赛公告
export function addNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices',
    method: 'post',
    data: data
  })
}

// 新增题目提示
export function addTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices',
    method: 'post',
    data
  })
}

// 编辑比赛公告
export function updateNoice(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices/' + id,
    method: 'patch',
    data
  })
}

// 编辑提示
export function updateTIP(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices/' + id,
    method: 'patch',
    data
  })
}

// 删除公告
export function removeNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices/batch_destroy',
    method: 'delete',
    data
  })
}

// 删除提示
export function removeTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices/batch_destroy',
    method: 'delete',
    data
  })
}

// 置顶、取消置顶比赛公告
export function topNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices/batch_top',
    method: 'patch',
    data
  })
}

// 置顶、取消置顶提示
export function topTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices/batch_top',
    method: 'patch',
    data
  })
}

/* *
* 接口说明：
* 用户管理相关接口
*/

// 获取用户列表
export function fetchUserList(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_user_details',
    method: 'get',
    params: query
  })
}

// 队伍管理列表
export function fetchTeamList(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_team_details',
    method: 'get',
    params: query
  })
}

// 解开、禁赛 用户
export function banUserMatch(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_users/' + id,
    method: 'PATCH',
    data
  })
}

// 解开、禁赛 team
export function banTeamMatch(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_teams/' + id,
    method: 'PATCH',
    data
  })
}

// 点击成绩管理获取成绩单
export function getUsersScore(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_users_scores_details',
    method: 'get',
    params: query
  })
}

// 点击成绩管理获取成绩单
export function getTeamScore(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_teams_scores_details',
    method: 'get',
    params: query
  })
}

// 使用户 成绩无效、有效
export function invalidUserAnswer(id, query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_user_answers/' + id,
    method: 'patch',
    data: query
  })
}

// 使团队 成绩无效、有效
export function invalidTeamAnswer(id, query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_team_answers/' + id,
    method: 'patch',
    data: query
  })
}

/* *
* 接口说明：
* 授权管理相关接口
*/

// 批量生成邀请码
export function generateInvite(data) {
  return request({
    url: '/api/v1/jeopardy/admin/user_invite_codes',
    method: 'post',
    data
  })
}

// 修改用户名
export function submituser(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/user_invite_code/' + id,
    method: 'patch',
    data
  })
}

// 修改队伍名
export function submitTeam(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/team_invite_code/' + id,
    method: 'patch',
    data
  })
}

// 删除授权用户
export function romoveUser(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/user_invite_code/' + id,
    method: 'delete'
  })
}

// 删除授权队伍
export function romoveTeam(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/team_invite_code/' + id,
    method: 'delete'
  })
}

// 授权用户列表
export function inviteUserList(query) {
  return request({
    url: '/api/v1/jeopardy/admin/user_invite_codes',
    method: 'get',
    params: query
  })
}

// 授权队伍列表
export function inviteTeamList(query) {
  return request({
    url: '/api/v1/jeopardy/admin/team_invite_codes',
    method: 'get',
    params: query
  })
}

