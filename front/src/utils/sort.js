//排序降序
export const sortMax = arr => {
  for(let i=0;i<arr.length-1;i++){//排序降序
    for(let j=0;j<arr.length-i-1;j++){
      let a = new Date(arr[j].create_time).getTime();
      let b = new Date(arr[j+1].create_time).getTime();
      if(a<b){
        let setdata = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = setdata;
      }
    }
  }
  return arr;
}
