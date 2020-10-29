/**
 * setStorage 设置Storage
 * @param  {[type]} key   [对应的key值]
 * @param  {[type]} value [存储的数据]
 * @return
 */
export const setStorage = (key, value) => {
  if(typeof value === 'object'){
    localStorage[key] = JSON.stringify(value);
  }else if(value === ''){
    localStorage.removeItem(key);
  }else{
    localStorage[key] = value;
  }
}
/**
 * getStorage 获取Storage
 * @param  {[type]} key   [对应的key值]
 * @return
 */
export const getStorage = (key,type) => {
  if (localStorage[key]) {
    let data
    if (type == 'object') {
      data = JSON.parse(localStorage[key]);
    } else {
      data = localStorage[key];
    }
    return data;
  } else {
    return 0;
  }
}
