import request from '@/utils/request'

// 获取运维赛列表
/* *
 * 接口说明：
 * 以下请求为  运维赛defense相关接口
 */
// 获取运维赛列表
export function fetchDefenseList(params) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/setting/event_list/',
    params
  })
}

// 删除赛事
export function deleteDefenseMatch(query) {
  return request({
    url: '/api/v1/ops/admin/setting/event_delete/',
    method: 'post',
    data: query
  })
}

// 公开、隐藏赛事
export function publicDefenseMatch(query) {
  return request({
    url: '/api/v1/ops/admin/setting/event_public/',
    method: 'post',
    data: query
  })
}

// 创建运维赛信息
export function createDenfenseMatch(data) {
  return request({
    url: '/api/v1/ops/admin/setting/event_list/',
    method: 'post',
    data
  })
}

// 创建运维赛-用户-用户列表
export function fetchDefenseTeamList(params) {
  return request({
    url: '/api/v1/ops/admin/setting/team_select/',
    method: 'get',
    params
  })
}

// 创建运维赛-用户-保存新增的用户
export function submitDefenseTeamList(params, data) {
  return request({
    url: '  /api/v1/ops/admin/setting/team_select/',
    method: 'post',
    params,
    data
  })
}

// 创建运维赛-题目-获取题目列表
export function fetchDefenseTopicList(params) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_list/',
    method: 'get',
    params
  })
}

// 创建运维赛-题目-获取导入题目列表
export function fetchDefenseImport(params) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_store_select/',
    method: 'get',
    params
  })
}

// 创建运维赛-题目-确认导入题目
export function sureImportDefense(params, data) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge_list/',
    method: 'post',
    params,
    data
  })
}

// 创建运维赛-题目-删除题目
export function deleteSubDefense(params, data) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge/',
    method: 'post',
    params,
    data
  })
}

// 创建运维赛-题目-编辑题目信息回显
export function defenseMatchTopicInfo(params, data) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge/',
    method: 'get',
    params
  })
}
// 创建运维赛-题目-编辑题目信息保存
export function defenseMatchTopicSunmit(params, data) {
  return request({
    url: '/api/v1/ops/admin/setting/challenge/',
    method: 'patch',
    params,
    data
  })
}

// 获取运维赛信息回显
export function fetchDefenseInfo(id) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/setting/event_list/' + id + '/'
  })
}

// 编辑比赛保存
export function editMatchDefense(id, data) {
  return request({
    method: 'patch',
    url: '/api/v1/ops/admin/setting/event_list/' + id + '/',
    data
  })
}

// 编辑运维赛  网络模块-----------------------------
// 获取网络列表  和详情
export function fetchInternet(params) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/setting/network_list/',
    params
  })
}

// 获取队伍数量
export function fetchTeamNum(params) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/setting/team_count/',
    params
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

// 编辑网络信息
export function editInternet(params, data) {
  return request({
    method: 'patch',
    url: '/api/v1/ops/admin/setting/network_list/',
    params,
    data
  })
}

// 删除网络信息
export function delInternet(params) {
  return request({
    method: 'delete',
    url: '/api/v1/ops/admin/setting/network_list/',
    params
  })
}

// 运维赛 竞赛运维 公告模块-----------------------------
// 运维赛公告列表
export function fetchDefenseNotice(params) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/notice_list/',
    params
  })
}

// 运维赛删除公告
export function removeDefenseNotice(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/notice_delete/',
    params,
    data
  })
}

// 运维赛置顶公告
export function topDefenseNotice(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/notice_top/',
    params,
    data
  })
}

// 运维赛新增公告
export function addDefenseNotice(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/notice_list/',
    params,
    data
  })
}

// 运维赛新增公告
export function editDevOpsNotice(params, data) {
  return request({
    method: 'patch',
    url: '/api/v1/ops/admin/operation/notice_list/',
    params,
    data
  })
}

// 运维赛 竞赛运维 竞赛状态模块----------------------
// 运维赛 获取状态信息
export function fetchDefenseMatchStatus(params, ) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/operation_data/',
    params
  })
}

// 运维赛 是否展示排行榜
export function defenseIsShowRank(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/show_rank/',
    params,
    data
  })
}

// 运维赛 是否展示态势状态
export function defenseUse_vis(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/use_vis/',
    params,
    data
  })
}

// 攻防赛 pushflag文件推送
export function pushflag(params) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/upload_pushflag_file/',
    params
  })
}
// 运维赛  场景初始化
export function initSence(params) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/init_scene/',
    params
  })
}

// 运维赛 是否可以上传WP
export function defenseCanUpWP(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/write_up/',
    params,
    data
  })
}

// 运维赛 确认修改回合时间
export function defenseSureEditTime(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/time_change/',
    params,
    data
  })
}

// 运维赛 初始化用户数据
export function defenseChangeStatus(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/event_control/',
    params,
    data
  })
}

// 运维赛 初始虚拟主机
export function initVirtual(params) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/init_virtual/',
    params
  })
}

// 运维赛 修改vpn状态
export function changeVpn(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/vpn/',
    params,
    data
  })
}

// 运维赛 竞赛运维 队伍管理模块----------------------
// 运维赛 队伍列表
export function defenseFetchTeamList(params, ) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/operation_team_data/',
    params
  })
}

// 运维赛 队伍禁赛
export function defenseBan(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/team_status/',
    params,
    data
  })
}

// 运维赛 队伍奖惩分
export function defenseReward_score(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/reward_score/',
    params,
    data
  })
}

// 运维赛 队伍奖惩分
export function defenseReward_scoreDetail(params, data) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/reward_score/',
    params
  })
}

// 运维赛 竞赛运维 题目运维模块----------------------
// 运维赛 题目列表
export function defenseFetchTopicList(params, ) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/challenge_operation_data/',
    params
  })
}

// 运维赛 开关题列表
export function defenseOpenTopic(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/challenge_status/',
    params,
    data
  })
}

// 运维赛 下拉镜像
export function pullImage(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/pull_image/',
    params,
    data
  })
}

// 运维赛 竞赛运维 开始部署环境
export function defenseDeploySence(params, ) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/deploy/init_env/',
    params
  })
}

// 运维赛 竞赛运维 查询部署环境进度
export function defenseProgress(params, ) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/deploy/task_progress/',
    params
  })
}

// 运维赛 竞赛运维 开始部署网络
export function defenseDeployNetwork(params, ) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/deploy/init_network/',
    params
  })
}

// 运维赛 竞赛运维 开始部署队伍
export function defenseDeployTeam(params, ) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/deploy/init_team/',
    params
  })
}

// 运维赛 竞赛运维 开始部署题目环境
export function defenseDeployTopic(params, ) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/deploy/init_challenge_env/',
    params
  })
}

// 运维赛 竞赛运维 题目运维 查看部署情况
export function showDefenseDeploy(params, ) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/deploy_status/',
    params
  })
}

// 运维赛 竞赛运维 题目运维 查看部署情况
export function defenseDeployStatus(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/challenge_env_control/',
    params,
    data
  })
}

// 运维赛 竞赛运维 题目运维 查上传pushfalg脚本
export function defenseDeployUpload(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/upload_pushflag/',
    params,
    data
  })
}

// 运维赛 竞赛运维 监控 check测试
export function defenseTestCheck(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/check_scripts/',
    params,
    data
  })
}

// 运维赛 竞赛运维 监控 pushFlag测试
export function defensePushFlag(params, data) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/push_scripts/',
    params,
    data
  })
}

// 运维赛 竞赛运维 监控模块----------------------
// 运维赛 监控列表
export function defenseFetchMonitorList(params, data) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/operation_monitor/',
    params,
    data
  })
}

// 运维赛 竞赛运维 比赛结果模块----------------------
// 运维赛 比赛结果
export function defenseFetchResultList(params, ) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/event_statistic/',
    params
  })
}
// 运维赛 比赛结果详情
export function defenseResultDetail(params) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/event_statistic_one/',
    params
  })
}

// 运维赛 竞赛运维 展示管理----------------------
// 运维赛 获取展示列表
export function getShow(params) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/show_panel/',
    params
  })
}

// 运维赛 获取是否上传WP
export function canWP(params) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/write_up/',
    params
  })
}

// 运维赛 获取是否展示排行榜
export function canRank(params) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/show_rank/',
    params
  })
}
// 运维赛 初始化虚拟数据
export function initVirData(params) {
  return request({
    method: 'post',
    url: '/api/v1/ops/admin/operation/init_virtual/',
    params
  })
}

//  全部 WP 导出
export function exportAllWp(params) {
  return request({
    method: 'get',
    url: '/api/v1/ops/admin/operation/writeup_download_all',
    params,
    responseType: 'blob'
  })
}
