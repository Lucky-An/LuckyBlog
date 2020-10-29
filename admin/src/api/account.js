import request from '@/utils/request'

/* *
* 接口说明：
* 以下请求为用户管理相关接口
*/
// 用户模块----------------------

// 获取用户角色列表
export function fetchUserRole() {
  return request({
    url: '/api/v1/common/admin/users/roles',
    method: 'get'
  })
}

// 获取用户列表
export function fetchUserList(query) {
  return request({
    url: '/api/v1/common/admin/users',
    method: 'get',
    params: query
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/api/v1/common/admin/users/batch_destroy',
    method: 'delete',
    data
  })
}

// 删除用户头像
export function deleteUserLogo(data) {
  return request({
    url: '/api/v1/common/admin/delete_user_logo/',
    method: 'post',
    data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/api/v1/common/admin/users',
    method: 'post',
    data
  })
}

// 用户信息回显
export function showUserInfo(id) {
  return request({
    url: '/api/v1/common/admin/users/' + id,
    method: 'get'
  })
}

// 用户恢复禁用
export function changeUserStatus(data) {
  return request({
    url: '/api/v1/common/admin/users/operating',
    method: 'patch',
    data
  })
}

// 编辑用户
export function editUser(id, data) {
  return request({
    url: '/api/v1/common/admin/users/' + id,
    method: 'patch',
    data
  })
}

// 修改密码
export function editPassword(id, data) {
  return request({
    url: '/api/v1/common/admin/users/reset_password/' + id,
    method: 'patch',
    data
  })
}

// 批量修改密码
export function editAllPassword(data) {
  return request({
    url: '/api/v1/common/admin/users/reset_password',
    method: 'patch',
    data
  })
}

// 队伍模块----------------------
// 获取用户列表
export function fetchTeamList(params) {
  return request({
    url: '/api/v1/common/admin/teams',
    method: 'get',
    params
  })
}

// 删除战队logo
export function deleteTeamLogo(data) {
  return request({
    url: '/api/v1/common/admin/delete_team_logo/',
    method: 'post',
    data
  })
}

// 删除战队
export function deleteTeam(data) {
  return request({
    url: '/api/v1/common/admin/teams/batch_destroy',
    method: 'delete',
    data
  })
}

// 查看队员
export function showMember(id) {
  return request({
    url: '/api/v1/common/admin/teams/' + id + '/users',
    method: 'get'
  })
}

// 创建战队
export function addTeam(data) {
  return request({
    url: '/api/v1/common/admin/teams',
    method: 'post',
    data
  })
}
// 战队信息回显
export function teamInfo(id) {
  return request({
    url: '/api/v1/common/admin/teams/' + id,
    method: 'get'
  })
}
// 创建战队
export function editTeam(id, data) {
  return request({
    url: '/api/v1/common/admin/teams/' + id,
    method: 'patch',
    data
  })
}

