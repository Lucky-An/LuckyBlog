export const removeHTMLTag=(str) =>{
  str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
  str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
  str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
  str = str.replace(/&nbsp;/ig,'');
  str = str.replace(/(^\s*)|(\s*$)/g, "");
  str = str.replace(/\r\n/g,"");
  str = str.replace(/\n/g,"");
  str = str.replace(/\s/g,"");
  return str;
}
export const filter_content=(str,n)=>{
  var new_str = removeHTMLTag(str);
  if(new_str.length>n){
    new_str = new_str.substring(0,n) + '...' ;
  }
  return new_str;
}
