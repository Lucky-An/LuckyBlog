import request from '@/utils/request'
/* *
 * 接口说明：
 * 以下请求为  渗透赛相关接口
 */
//! 渗透赛 队伍场景数据列表
export function httpGetSceneMonitor(query) {
  return request({
    url: '/api/v1/inf/admin/operation/scene_monitor',
    method: 'get',
    params: query
  })
}
//! 渗透赛 重新部署
export function httpPostSceneMonitor(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/scene_monitor',
    method: 'post',
    params: query,
    data: data
  })
}
//! 渗透赛 虚拟机管理列表
export function httpGetInstanceMonitor(query) {
  return request({
    url: '/api/v1/inf/admin/operation/instance_monitor',
    method: 'get',
    params: query
  })
}
//! 渗透赛 虚拟设备管理列表
export function httpGetVirtualMonitor(query) {
  return request({
    url: '/api/v1/inf/admin/operation/virtual_monitor',
    method: 'get',
    params: query
  })
}
//! 渗透赛    实体设备管理列表
export function httpGetEntityMonitor(query) {
  return request({
    url: '/api/v1/inf/admin/operation/entity_monitor',
    method: 'get',
    params: query
  })
}
// !渗透赛     虚拟机管理查看flag
export function httpGetCatFlag(query) {
  return request({
    url: '/api/v1/inf/admin/operation/cat_flag',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    虚拟机 实例控制
export function httpPostInstanceMonitor(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/instance_monitor',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    虚拟机 push flag
export function httpPostPushSingleFlag(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/push_single_flag',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    虚拟设备 实例控制
export function httpPostVirtualMonitor(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/virtual_monitor',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    公告管理   公告列表
export function httpGetNoticeList(query) {
  return request({
    url: '/api/v1/inf/admin/operation/notice_list',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    公告管理   创建公告
export function httpPostNoticeList(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/notice_list',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    公告管理   删除公告
export function httpPostNoticeDelete(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/notice_delete',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    公告管理   公告置顶与取消置顶
export function httpPostNoticeTop(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/notice_top',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    公告管理   公告回显
export function httpGetNoticeDetail(query) {
  return request({
    url: '/api/v1/inf/admin/operation/notice_detail',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    公告管理   公告编辑
export function httpPostNoticeDetail(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/notice_detail',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    公告管理   题目提示列表
export function httpGetNoticeTasks(query) {
  return request({
    url: '/api/v1/inf/admin/operation/notice_tasks',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    展示管理   管理信息
export function httpGetOperationData(query) {
  return request({
    url: '/api/v1/inf/admin/operation/operation_data/',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    展示管理   显示排名
export function httpPostShowRank(query) {
  return request({
    url: '/api/v1/inf/admin/operation/show_rank/',
    method: 'post',
    params: query
  })
}
// ! 渗透赛    展示管理   开放wp
export function httpPostWriteUp(query) {
  return request({
    url: '/api/v1/inf/admin/operation/write_up/',
    method: 'post',
    params: query
  })
}

//  ! 渗透赛    展示管理   场景初始化
export function initSence(params) {
  return request({
    method: 'post',
    url: '/api/v1/inf/admin/operation/init_scene/',
    params
  })
}

// ! 渗透赛    选手管理   列表
export function httpGetOperationTeamData(query) {
  return request({
    url: '/api/v1/inf/admin/operation/operation_team_data/',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    选手管理   奖罚分数
export function httpPostRewardScore(data) {
  return request({
    url: '/api/v1/inf/admin/operation/reward_score/',
    method: 'post',
    data
  })
}
// ! 渗透赛    选手管理   解禁赛操作
export function httpPostTeamStatus(data) {
  return request({
    url: '/api/v1/inf/admin/operation/team_status/',
    method: 'post',
    data
  })
}
// ! 渗透赛    报告审核   报告列表
export function httpGetReportCheck(query) {
  return request({
    url: '/api/v1/inf/admin/operation/report_check',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    报告审核   裁判审核报告
export function httpPostRefereeOperation(query, data) {
  return request({
    url: '/api/v1/inf/admin/operation/referee_operation',
    method: 'post',
    params: query,
    data
  })
}
// ! 渗透赛    报告审核   报告查看
export function httpPostReportCheck(query) {
  return request({
    url: '/api/v1/inf/admin/operation/report_check',
    method: 'post',
    params: query
  })
}
// ! 渗透赛    比赛结果   比赛结果列表
export function httpGetEventStatistic(query) {
  return request({
    url: '/api/v1/inf/admin/operation/event_statistic/',
    method: 'get',
    params: query
  })
}
// ! 渗透赛    比赛结果   结果详情
export function httpGetDetialEventStatistic(query, data) {
  return request({
    url: `/api/v1/inf/admin/operation/event_statistic/${data}`,
    method: 'get',
    params: query
  })
}

// 渗透赛 创建竞赛相关接口------------------
// 渗透赛 获取实体设备列表
export function fetchPenetrationList(query) {
  return request({
    url: '/api/v1/inf/admin/setting/event_list/',
    method: 'get',
    params: query
  })
}

// 渗透赛 删除赛事event
export function deletePenetrationMatch(query) {
  return request({
    url: '/api/v1/inf/admin/setting/event_delete/',
    method: 'post',
    data: query
  })
}

// 渗透赛 获取比赛编辑页面详细信息
export function fetchPenetrationInfo(id) {
  return request({
    url: '/api/v1/inf/admin/setting/event_list/' + id + '/',
    method: 'get'
  })
}

// 渗透赛 VPN 开关控制
export function changeVpn(params, data) {
  return request({
    url: '/api/v1/inf/admin/operation/vpn',
    method: 'post',
    params,
    data
  })
}

// 渗透赛 公开、隐藏赛事
export function publicPenetrationMatch(data) {
  return request({
    url: '/api/v1/inf/admin/setting/event_public/',
    method: 'post',
    data
  })
}

// 渗透赛 编辑赛事信息
export function editMatchPenetration(id, data) {
  return request({
    url: '/api/v1/inf/admin/setting/event_list/' + id + '/',
    method: 'patch',
    data
  })
}

// 渗透赛 删除服务器已上传图片
export function deleteImage(id, data) {
  return request({
    url: '/api/v1/inf/admin/setting/event_list/' + id + '/',
    method: 'patch',
    data
  })
}

// 渗透赛 创建赛事
export function createPenetrationMatch(data) {
  return request({
    url: '/api/v1/inf/admin/setting/event_list/',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 渗透赛 查看已经选中的战队或者用户
export function fetchPenetrationTeamList(params) {
  return request({
    url: '/api/v1/inf/admin/setting/team_select/',
    method: 'get',
    params
  })
}

// 渗透赛 创建竞赛相关接口------------------
// 渗透赛 获取实体设备列表
export function getTask(params) {
  return request({
    url: '/api/v1/inf/admin/setting/challenge_store_list',
    method: 'get',
    params
  })
}

// 渗透赛 获取拓扑
export function getTopo(params, data) {
  return request({
    url: '/api/v1/inf/admin/setting/topo/',
    method: 'get',
    params,
    data
  })
}

// 渗透赛 保存拓扑
export function editTopo(params, data) {
  return request({
    url: '/api/v1/inf/admin/setting/topo/',
    method: 'post',
    params,
    data
  })
}

// 渗透赛 拖拽实体设备时查询队伍已开启的设备数量
export function getTeamEntity(params, data) {
  return request({
    url: '/api/v1/inf/admin/setting/check_entity_number/',
    method: 'post',
    params,
    data
  })
}

// 渗透赛 删除服务器已上传图片
export function submitPenetrationTeamList(params, data) {
  return request({
    url: '/api/v1/inf/admin/setting/team_list/',
    method: 'post',
    params,
    data
  })
}

// 渗透赛 题目分值动态计分展示
export function getScoreList(params) {
  return request({
    url: '/api/v1/inf/admin/setting/score/',
    method: 'get',
    params
  })
}

// 渗透赛 获取题目下flag信息和分值
export function getChallengeEventFlags(params) {
  return request({
    url: '/api/v1/inf/admin/setting/challenge_event_flags',
    method: 'get',
    params
  })
}

// 渗透赛 修改flag积分
export function submitScore(data) {
  return request({
    url: '/api/v1/inf/admin/setting/challenge_event_flags',
    method: 'patch',
    data
  })
}

// 攻防赛 比赛结果详情
export function defenseResultDetail(params) {
  return request({
    method: 'get',
    url: '/api/v1/att_def/admin/operation/event_statistic_one/',
    params
  })
}

// 解题赛  竞赛运维 新增比赛公告
export function addPenetrationNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices',
    method: 'post',
    data: data
  })
}

// 新增网络信息
export function addInternet(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/setting/network_list/',
    params,
    data
  })
}

// 解题赛 竞赛运维  新增题目提示
export function addPenetrationTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维 解开、禁赛 team
export function banPenetrationTeamMatch(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_teams/' + id,
    method: 'PATCH',
    data
  })
}

// 解题赛 竞赛运维 解开、禁赛 用户
export function banPenetrationUserMatch(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_users/' + id,
    method: 'PATCH',
    data
  })
}

// 解题赛 竞赛运维->清楚比赛数据
export function clearData(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/clear_data',
    method: 'delete'
  })
}

// 解题赛 创建竞赛 关闭容器task_hash
export function closePenetrationSence(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/stop_share_containers',
    method: 'post',
    data
  })
}

// 解题赛 创建竞赛  创建题目
export function createPenetrationTopic(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks',
    method: 'post',
    data
  })
}

// 解题赛  删除附件
export function deletePenetrationFile(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/tasks/' + id,
    method: 'delete',
    data: {
      index: index
    }
  })
}

// 解题赛   删除脚本
export function deletePenetrationScript(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/tasks/pfs/' + id,
    method: 'delete'
  })
}

// 解题赛 删除题目
export function deletePenetrationSub(data) {
  return request({
    url: '/api/v1/jeopardy/admin/tasks/batch_destroy/',
    method: 'delete',
    data
  })
}

// 解题赛   删除WP
export function deletePenetrationWriteup(id, index) {
  return request({
    url: '/api/v1/jeopardy/admin/tasks/writeup/' + id,
    method: 'delete'
  })
}

// 解题赛  竞赛运维 编辑提示
export function updatePenetrationTIP(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices/' + id,
    method: 'patch',
    data
  })
}

// 解题赛 竞赛运维  编辑比赛公告
export function updatePenetrationNoice(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices/' + id,
    method: 'patch',
    data
  })
}

// 解题赛  竞赛运维 置顶、取消置顶提示
export function topPenetrationTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices/batch_top',
    method: 'patch',
    data
  })
}

// 解题赛 竞赛运维  置顶、取消置顶比赛公告
export function topPenetrationNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices/batch_top',
    method: 'patch',
    data
  })
}

// 解题赛 创建竞赛  确认导入题目
export function sureImportPenetration(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_create',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维 队伍管理 获取奖惩分列表
export function submitReward_score(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/scores/reward',
    method: 'post',
    data
  })
}

// 解题赛 题目信息回显
export function showPenetrationEditInfo(id) {
  return request({
    url: '/api/v1/jeopardy/admin/tasks/' + id,
    method: 'get'

  })
}

// 解题赛 共享容器
export function sharePenetrationSence(data) {
  return request({
    url: '/api/v1/jeopardy/admin/container/sharing/',
    method: 'patch',
    data
  })
}

// 解题赛 竞赛运维  删除提示
export function removePenetrationTIP(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices/batch_destroy',
    method: 'delete',
    data
  })
}

// 解题赛  竞赛运维 删除公告
export function removePenetrationNoice(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices/batch_destroy',
    method: 'delete',
    data
  })
}

// 解题赛 创建竞赛 公开、隐藏题目
export function publicPenetrationSub(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/batch_public',
    method: 'patch',
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

// 轮询查询网络信息增加状态
export function pollingAdd(id) {
  return request({
    method: 'get',
    url: '/api/v1/jeopardy/admin/event/check_network/' + id
  })
}

// 解题赛 创建竞赛 开启容器task_hash
export function openPenetrationSence(data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/start_share_containers',
    method: 'post',
    data
  })
}

// 解题赛 竞赛运维->获取积分方式
export function matchPenetrationMode(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_mode/' + id,
    method: 'get'
  })
}

// 解题赛 竞赛运维 获取比赛信息
export function matchPenetrationInfo(id) {
  return request({
    url: '/api/v1/jeopardy/admin/event_state/' + id,
    method: 'get'
  })
}

// 解题赛 竞赛运维 使用户 成绩无效、有效
export function invalidPenetrationUserAnswer(id, query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_user_answers/' + id,
    method: 'patch',
    data: query
  })
}

// 解题赛 竞赛运维 队伍管理 竞赛结果
export function getResultList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event_result',
    method: 'get',
    params
  })
}

export function getMonitorUser(id, params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/users',
    method: 'get',
    params
  })
}

// 解题赛  竞赛运维 获取监控题目
export function getMonitorTask(id, params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/tasks',
    method: 'get',
    params
  })
}

export function getMonitorList(id, params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/monitors',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 点击成绩管理获取成绩单
export function getPenetrationUsersScore(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_users_scores_details',
    method: 'get',
    params: query
  })
}

// 解题赛 竞赛运维 点击成绩管理获取成绩单
export function getPenetrationTeamScore(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_teams_scores_details',
    method: 'get',
    params: query
  })
}

// 解题赛 创建竞赛  获取题目类型
export function fetcheopardyTopicType(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_categorys',
    method: 'get'
  })
}

// 获取队伍数量
export function fetchTeamNum(params) {
  return request({
    method: 'get',
    url: '/api/v1/att_def/admin/setting/team_count/',
    params
  })
}

// 解题赛 竞赛运维 队伍管理 获取奖惩分列表
export function fetchReward_scoreLsit(id, params) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/scores/reward',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 获取用户列表
export function fetchPenetrationUserList(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_user_details',
    method: 'get',
    params: query
  })
}

// 解题赛 创建竞赛  获取题目类型
export function fetchPenetrationTopicType(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_categorys',
    method: 'get'
  })
}

// 解题赛 获取题目列表
export function fetchPenetrationTopicList(query) {
  return request({
    url: '/api/v1/jeopardy/admin/tasks/',
    method: 'get',
    params: query
  })
}

// 解题赛  竞赛运维 获取题目提示列表
export function fetchPenetrationTipList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event_task_notices',
    method: 'get',
    params
  })
}

// 解题赛 竞赛运维 队伍管理列表
export function fetchPenetrationTeamManger(query) {
  return request({
    url: '/api/v1/jeopardy/admin/event_signup_team_details',
    method: 'get',
    params: query
  })
}

// 解题赛 创建竞赛  获取习题集
export function fetchPenetrationTag(data) {
  return request({
    url: '/api/v1/jeopardy/admin/task_tags',
    method: 'get'
  })
}

// 解题赛  竞赛运维 获取比赛公告列表
export function fetchPenetrationNoiceList(params) {
  return request({
    url: '/api/v1/jeopardy/admin/event_notices',
    method: 'get',
    params
  })
}

// 解题赛  创建竞赛 获取导入题目列表
export function fetchPenetrationImport(data) {
  return request({
    url: '/api/v1/jeopardy/admin/import_tasks_details',
    method: 'get',
    params: data
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

// 解题赛 创建竞赛  保存编辑题目
export function editPenetrationTopic(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event_tasks/' + id,
    method: 'patch',
    data
  })
}

// 编辑网络信息
export function editInternet(params, data) {
  return request({
    method: 'patch',
    url: '/api/v1/att_def/admin/setting/network_list/',
    params,
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

// 解题赛 竞赛运维 队伍管理 下载全部wp
export function downloadAllWP(id, data) {
  return request({
    url: '/api/v1/jeopardy/admin/event/' + id + '/export_wp',
    method: 'get',
    data
  })
}

// 解题赛 竞赛运维 队伍管理 竞赛结果 展示结果详情
export function ResultDetail(obj_id, params) {
  return request({
    url: '/api/v1/jeopardy/admin/event_result_detail/' + obj_id,
    method: 'get',
    params
  })
}

// 渗透赛 获取场景信息
export function fetchSceneInfo(event_id) {
  return request({
    url: '/api/v1/inf/admin/setting/event_scene_info/' + event_id + '/',
    method: 'get'
  })
}

// 渗透赛 编辑场景信息
export function editSceneInfo(event_id, data) {
  return request({
    url: '/api/v1/inf/admin/setting/event_scene_info/' + event_id + '/',
    method: 'patch',
    data
  })
}

// 渗透赛 场景部署
export function sceneDeploy(params) {
  return request({
    url: '/api/v1/inf/admin/deploy/init_env/',
    method: 'post',
    params
  })
}

// 渗透赛 场景回收
export function sceneDestroy(data) {
  return request({
    url: '/api/v1/inf/admin/deploy/destroy_env/',
    method: 'post',
    data
  })
}

// 渗透赛 比赛控制
export function eventControl(params, data) {
  return request({
    url: '/api/v1/inf/admin/operation/event_control/',
    method: 'post',
    params,
    data
  })
}

// 渗透赛 竞赛状态 网络规则控制 重新下发
export function intRuleControl(params) {
  return request({
    url: '/api/v1/inf/admin/operation/router_rule_issue/',
    method: 'post',
    params
  })
}

// 渗透赛 竞赛状态 flag推送 立即执行
export function flagControl(params) {
  return request({
    url: '/api/v1/inf/admin/operation/push_all_flags',
    method: 'post',
    params
  })
}

// 渗透赛 获取部署进度
export function deployProgress(params) {
  return request({
    url: '/api/v1/inf/admin/deploy/progress/',
    method: 'get',
    params
  })
}

// 渗透赛 下发实体设备
export function deployPhysical(params) {
  return request({
    url: '/api/v1/inf/admin/deploy/init_entity/',
    method: 'post',
    params
  })
}

// 渗透赛 回收实体设备
export function destroyPhysical(params) {
  return request({
    url: '/api/v1/inf/admin/deploy/destroy_entity/',
    method: 'post',
    params
  })
}
