<template>
  <div class="timer"
       v-show="show_down"
       :class="{
       'timer_font':$route.path.indexOf('jeopardy')==-1,
       'is_end':matchInfo.process==2
       }"
  >
    <span class="el-icon-time" style="font-size:20px;vertical-align: -2px;"></span>
    <span v-if="matchInfo.process==1" class="status_txt">{{$t('dialog_list.match_before')}}:</span>
    <span v-if="matchInfo.process==0" class="status_txt">{{$t('dialog_list.match_after')}}:</span>
    <span v-if="matchInfo.process==2" class="status_txt">{{$t('dialog_list.match_end')}}</span>
    <span style="vertical-align:middle;" v-html="format_time" v-if="matchInfo.process!=2"></span>
  </div>
</template>

<script>
  import {dateformat} from '@/utils/dateformat'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState,mapMutations } = createNamespacedHelpers('match');

  export default {
    name: 'countDown',
    props:['api','arg'],//剩余时间，比赛数据，比赛总时间
    data(){
      return{
        format_time:'',
        timers:null,
        distance_time:'',
        distance_match_time:'',
        match_data:'',
        match_all_time:'',
        show_down:false,
        matchInfo:{}
      }
    },
    created(){
      this.show_down = false
      this.api(this.arg)
        .then(res=>{
          this.matchInfo = res.data;
          this.match_all_time = parseInt(this.matchInfo.all_seconds)*1000;//比赛总时间
          this.distance_match_time = parseInt(this.matchInfo.remain_seconds)*1000;//距离比赛时间/剩余时间
          this.format_time = dateformat(this.distance_match_time)
          this.show_down = true
          if(this.matchInfo.process!=2){
            this.timers = setInterval(()=>{//倒计时
              this.distance_match_time -= 1000;
              if(this.distance_match_time<=0){//当倒计时为0时判断
                if(this.matchInfo.process==1){//首先判断当前状态，如果是1则未开始
                  this.$emit('matchBegin')
                  this.matchInfo.process = 0;//把当前状态改为正在进行
                  this.distance_match_time = this.match_all_time;//当前倒计时为比赛全部时间
                  this.setData({match_data:this.matchInfo});//更新状态存储的数据
                }else{//下面是比赛结束的状态
                  this.distance_match_time = 0;
                  this.matchInfo.process = 2;//切换状态为已结束
                  this.setData({match_data:this.matchInfo});//更新状态存储的数据
                  clearInterval(this.timers)//清定时器
                  this.$emit('matchEnd')
                }
              }
              this.format_time = dateformat(this.distance_match_time)
            },1000)
          }
        })
        .catch(res=>{

        })
    },
    methods:{
      ...mapMutations(['setData']),
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .timer *:not(.el-icon-time){
    color:#fff!important;
    font-size:22px;
  }
  .status_txt{
    color:#fff;
    font-size:18px!important;
  }
  .timer_font{
    color:#fff;
  }
  .is_end{
    width:150px!important;
  }
</style>
