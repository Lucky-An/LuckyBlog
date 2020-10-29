export default {
  namespaced:true,
  state:{
  },
  mutations:{
    setData(state,ary){
      let key=Object.keys(ary)[0]
      state[key]=ary[key];
    },
  }
}
