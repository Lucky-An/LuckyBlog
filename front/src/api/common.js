//攻防世界和ad5公用的接口写在这里，前缀跟比赛不一样
import request from '@/utils/request'
import {prefix_url} from '@/api/urlPrefix'

let prefix = prefix_url

//登录提交用户名和密码
export function ad5_login_post(data) {
  return request({
    url: prefix + 'auth/login',
    method: 'post',
    data
  })
}

//ad5和adw公用退出登录
export function ad5_logout() {
  return request({
    url: prefix + 'auth/logout',
    method: 'get',
  })
}


//ad5获取竞赛列表数据
export function competitionList(data) {
  return request({
    url: prefix + 'evts/list',
    method: 'get',
    params:data
  })
}

//ad5和adw公用获取图形验证码
export function getImageCode(data) {
  return request({
    url: prefix + 'auth/image_code?image_code_id='+data,
    method: 'get',
  })
}

//获取总榜数据
export function all_rank() {
  return request({
    url: prefix + 'evts/',
    method: 'get',
  })
}

//获取观众席接口
export function look_match() {
  return request({
    url: prefix + 'onlook/look_match/look/',
    method: 'get',
  })
}


//工具库
export function tools(data) {
  return request({
    url: prefix + 'tools/',
    method: 'get',
    params:data
  })
}

//工具类型
export function tools_tag() {
  return request({
    url: prefix + 'tool_tag/',
    method: 'get',
  })
}

//工具库下载接口
let down_tools = prefix + 'tool_download/?tool_id=';
export {down_tools}

//个人中心用户数据
export function personalCenter() {
  return request({
    url: prefix + 'personal/center',
    method: 'get',
  })
}

//个人中心用户数据
export function personalInfo(data) {
  return request({
    url: prefix + 'personal/info',
    method: 'post',
    data
  })
}

//个人中心修改头像
export function personalLogo(data) {
  return request({
    url: prefix + 'personal/logo',
    method: 'patch',
    data
  })
}

//个人中心修改密码
export function personalPass(data) {
  return request({
    url: prefix + 'personal/paword',
    method: 'patch',
    data
  })
}

//获取个人信息接口
let personal_url = prefix
export {personal_url};
