<template>
  <div class="solving_type" style="min-height:100%;">
    <!--此组件为除解题赛之外页面公用部分（上方个人赛事信息导航等）-->
    <competitionHome :logo="logo"
                     :nav="nav"
                     :format_time="format_time"
                     :match_status="match_status"
                     :match_all_data="match_all_data"
                     :dialogVisible="dialogVisible"
    >
      <div slot="nav_menu" class="guide_wrap"
           style="padding:0;margin-top:25px;"
           v-if="$route.path.indexOf('examine')!==-1">
        <div class="nav_tab_select" >
          <countDown
            style="float:right;margin-top:-35px;margin-right:20px;"
            class="time_wrap"
            :api="api.matchStatus"
            :arg="arg"
          ></countDown>
        </div>
      </div>
    </competitionHome>
  </div>
</template>

<script>
  import competitionHome from '../../common/competition_home'
  import {createNamespacedHelpers} from 'vuex'
  import {setStorage,getStorage} from '@/utils/storage'
  import {dateformat} from '@/utils/dateformat'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import countDown from '@/components/common_components/countDown.vue'
  import menuNav from '@/components/match/common/small_part/challenge_menu.vue'
  import {
    matchStatus,
  } from '@/api/competitionMode/rwMode'
  import {
    eventData,
    navData
  } from '@/api/competitionMode/attackMode'
  export default {
    name: 'ad5_home',
    components:{
      countDown,
      competitionHome,
      menuNav
    },
    inject: ['reload'],
    data(){
      return{
        api:{
          matchStatus:matchStatus
        },
        nav:[
          {
            path:'/'+window.location.pathname.split('/')[1]+'/referee/realWorld/examine',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.referee")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/referee/realWorld/ranking',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.ranking")
          },
        ],
        notice_visible:false,
        eventData,
        arg:this.$route.query.hash,
        logo:{
          logo:'',
          add_link:true,
          url:'/competition'
        },
        distance_match_time:0,
        match_all_time:0,
        format_time:'',
        match_status:-1,
        dialogVisible:false,
        match_id:'',
        match_all_data:'',
        user:JSON.parse(localStorage.isUserLogin).user,
        team:{},
        score_timer:null,
        is_new_data:{}
      }
    },
    beforeDestroy () {
    },
    created(){
      this.team = this.userInformation.team
      this.match_id = this.$route.query.event;
      var param = this.$route.query;
      matchStatus(param.hash).then(res => {//获取赛事信息接口
        let d = res.data;
        this.logo.logo = d.logo;
        this.setData({match_data:d});
        this.match_all_data = d;//赛事详细信息
        this.match_status = d.process;//比赛状态
        this.match_all_time = parseInt(d.all_seconds)*1000;//比赛总时间
        this.distance_match_time = parseInt(d.remain_seconds)*1000;//距离比赛时间/剩余时间
        if(this.match_data.process==2){//比赛结束
          this.dialogVisible = true;//弹框
        }else{//比赛未结束进行的事情
          this.dialogVisible = false;
        }
      })
        .catch(()=>{
        })
    },
    methods:{
      begining(){
        this.reload();
      },
      ending(){
        this.dialogVisible = true;
      },
      ...mapMutations(['setData']),
    },
    computed:{
      ...mapState(['userInformation','match_data','team_data']),
    },
  }
</script>

<style scoped>

</style>
