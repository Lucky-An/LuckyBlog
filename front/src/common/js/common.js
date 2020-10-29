export const getStrNumber = (str,enNumber,cnNumber) => {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
  if(reg.test(str)){
    return str.length <= cnNumber;
  }else{
    return str.length <= enNumber;
  }
}
export const setCsrf = (config) => {
  let toke_key = 'X-CSRF-Token'
  let token = getCookie('X-CSRF-Token')
  if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers[toke_key] = `${token}`
  }
}
//获取cookie
function getCookie (name) {
  var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}
