<template>
  <div class="solving_type" style="min-height:100%;">

    <competitionHome :logo="header_logo"
                     :nav="nav"
                     :format_time="format_time"
                     :match_status="match_status"
                     :match_all_data="match_all_data"
                     :dialogVisible="dialogVisible"
    >
      <div slot="nav_menu" class="guide_wrap"
           style="padding:0;margin-top:25px;"
           v-if="$route.path.indexOf('guide')==-1 && $route.path.indexOf('trend')==-1 && $route.path.indexOf('ranking')==-1"
      >
        <menuNav
          @the_begin="begining"
          @the_end="ending"
          :team_data="team_data"
          :api="api.matchStatus"
          :arg="arg"
          :hide_some_menu="true"
          v-if="userInformation.team&&team_data&&match_all_time">
          <span slot="user_school" class="user_school">
            {{$t('ad5.theory.school')}}<span class="school">{{team_data.group}}</span>
          </span>
          <el-button type="primary"
                     size="medium"
                     slot="theory_btn"
                     v-if="match_data.process==0&&!team_data.is_submit"
                     style="opacity:0;"
                     class="theory_btn">{{$t('ad5.theory.jiaojuan')}}</el-button>
          <span slot="theory_grade" class="theory_grade" v-if="match_data.process==2&&match_data.is_review_shows">
            {{$t('ad5.theory.myScore')}}<span class="grade" >{{team_data.score}}{{$t('ad5.theory.score')}}</span>
          </span>
        </menuNav>
      </div>
    </competitionHome>
  </div>
</template>

<script>
  import {
    matchStatus,
    nav_datas
  } from '@/api/competitionMode/theoryMode'
  import competitionHome from '../../common/competition_home'
  import {createNamespacedHelpers} from 'vuex'
  import {setStorage,getStorage} from '@/utils/storage'
  import {dateformat} from '@/utils/dateformat'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import menuNav from '@/components/match/common/small_part/challenge_menu.vue'

  export default {
    components:{
      competitionHome,
      menuNav
    },
    data(){
      return{
        btn_status:null,
        arg:this.$route.query.hash,
        team_data:{
        },
        header_logo:{
          logo:'',
          add_link:true,
          url:'/'
        },
        nav:[
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/theory/guide',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.guide")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/theory/contest_challenge',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.questionBoard")
          },
        ],
        api:{//接口数据
          matchStatus,
        },
        distance_match_time:0,
        match_all_time:0,
        format_time:'',
        match_status:-1,
        dialogVisible:false,
        match_id:'',
        match_all_data:'',
        user:JSON.parse(localStorage.isUserLogin).user,
        nav_timer:null
      }
    },
    name: "home",
    created(){
      this.getNav();
      // this.nav_timer = setInterval(()=>{
      //   this.getNav()
      // },60000)//60秒
      this.match_id = this.$route.query.event;
      let that = this;
      var param = this.$route.query;
      this.header_logo.logo = this.match_data.logo;
      let d = this.match_data;
      this.match_all_data = d;//赛事详细信息
      this.match_status = d.process;//比赛状态
      this.match_all_time = parseInt(d.all_seconds)*1000;//比赛总时间
      this.distance_match_time = parseInt(d.remain_seconds)*1000;//距离比赛时间/剩余时间
      if(d.process==2){//比赛结束
        // if(!d.is_replay){
        //   this.dialogVisible = true;//弹框
        // }
      }else{//比赛未结束进行的事情
        this.dialogVisible = false;//弹框
        this.format_time = dateformat(this.distance_match_time)
      }
    },
    beforeDestroy () {
      clearInterval(this.nav_timer);
    },
    methods:{
      getNav(){
        nav_datas(this.$route.query.hash)
          .then(res=>{
            this.team_data = res.data;
            this.setData({team_data:res.data});
          })
          .catch(res=>{

          })
      },
      ...mapMutations(['setData']),
      begining(){
        this.reload();
      },
      ending(){
        //this.dialogVisible = false;
      },
    },
    watch:{
      match_data(newVal,old){
        if(newVal.process==2){
          this.getNav();
        }
      }
    },
    computed:{
      ...mapState(['match_data','userInformation']),
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .user_school
    display:inline-block;
    color:#fff;
    font-size:16px;
    font-weight:bold;
    vertical-align 3px;
    margin-left:35px;
    .school
      color:lightblue;
      font-weight:bold;
  .theory_btn
    float:right;
    height:36px;
    line-height:36px;
    padding-top:0;
    padding-bottom:0;
    padding-left:35px;
    padding-right:35px;
    margin-top:-4px;
    margin-left:35px;
  .theory_grade
    color:#fff;
    font-size:18px;
    float:right;
    margin-top:2px;
    .grade
      font-size:24px;
      font-style:italic;
      font-weight:bold;
      color:lightblue;
      vertical-align: middle
</style>
