export default {
  namespaced:true,
  state:{
    match_data:{},
    lang:'',
    tips_notice:[],
    threeblood_notice:[],
    system_notice:[],
    skey:null,
    all_notice:[],
    userInformation:{},
    show_now_task:false,
    team_data:{
      rank:0,
      round:0,
      score:0
    },
  },
  getters:{
    getData:(state)=>{
      if(state.skey){
        var key=state.skey;
        return state[key];
      }else{
        return null;
      }
    }
  },
  mutations:{
    setData(state,ary){
      let key=Object.keys(ary)[0]
      // console.log(Object.keys(ary));
      // console.log(key);
      state[key]=ary[key];
    },
    setKey(state,skey){
      // console.log("skey:"+skey);
      state.skey=skey;
    }
  }

}
