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
           v-if="is_login && $route.path.indexOf('guide')==-1 && $route.path.indexOf('trend')==-1">
        <div v-if="$route.path.indexOf('devops/ranking')==-1">
          <menuNav
            :api="api.matchStatus"
            :arg="arg"
            @the_begin="begining"
            @the_end="ending"
            :team_data="team_data"
            :count_down_time="distance_match_time"
            v-if="userInformation.team&&team_data&&match_all_time">
            <span class="rank" slot="other">
              <span>ROUND:</span>
              <span class="data_weight">{{team_data.round}}</span>
            </span>
          </menuNav>
        </div>
        <div class="nav_tab_select" v-else>
          <countDown
            style="float:right;margin-top:-35px;margin-right:20px;"
            class="time_wrap"
            :api="api.matchStatus"
            :arg="arg"
          ></countDown>
        </div>
      </div>
    </competitionHome>
    <el-dialog
      :title="$t('header.match.notice')"
      :visible.sync="notice_visible"
      width="600px"
      center
      custom-class="public-dialog"
    >
        <span>
          <span class="font16">{{is_new_data.notice}}</span>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import competitionHome from './competition_home'
  import {createNamespacedHelpers} from 'vuex'
  import {setStorage,getStorage} from '@/utils/storage'
  import {dateformat} from '@/utils/dateformat'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import countDown from '@/components/common_components/countDown.vue'
  import menuNav from '@/components/match/common/small_part/challenge_menu.vue'

  import {
    eventData,
    navData
  } from '@/api/competitionMode/attackMode'
  export default {
    name: 'ad5_home',
    props:['nav','api'],
    components:{
      countDown,
      competitionHome,
      menuNav
    },
    inject: ['reload'],
    data(){
        return{
          notice_visible:false,
          eventData,
          arg:{event_id:this.$route.query.event},
          arg2:this.$route.query.hash,
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
          is_login:localStorage.isUserLogin,
          user:localStorage.isUserLogin ? JSON.parse(localStorage.isUserLogin).user:'',
          team:{},
          notice_timer:null,
          score_timer:null,
          is_new_data:{}
        }
    },
    beforeDestroy () {
      clearInterval(this.score_timer);
      // clearInterval(this.notice_timer);
    },
    created(){
      if(!this.is_login) return;
      this.getScore()
      this.score_timer = setInterval(()=>{
        this.getScore()
      },60000)//60秒
      if(this.$route.path.indexOf('adw')!= -1){
        this.team = JSON.parse(localStorage.isUserLogin).team
      }else{
        this.team = this.userInformation.team
      }
      this.match_id = this.$route.query.event;
      var param = this.$route.query;
      let d = this.match_data;
      this.logo.logo = d.logo;
      this.match_all_data = d;//赛事详细信息
      this.match_status = d.process;//比赛状态
      this.match_all_time = parseInt(d.all_seconds)*1000;//比赛总时间
      this.distance_match_time = parseInt(d.remain_seconds)*1000;//距离比赛时间/剩余时间
      if(this.match_data.process==2){//比赛结束
        this.dialogVisible = true;//弹框
      }else{//比赛未结束进行的事情
        this.dialogVisible = false;
      }

    },
    methods:{
      getScore(){
        this.api.nav_data({
          event_id:this.$route.query.event
        })
          .then(res=>{
            if(!res.data.message){
              this.setData({team_data:res.data});
            }
          })
          .catch(res=>{

          })
      },
      begining(){
        this.reload();
      },
      ending(){
        this.dialogVisible = true;
      },
      ...mapMutations(['setData']),
      get_new_notice(){
        this.api.new_notices({
          event_id:this.match_all_data.id
        }).then((res)=>{//最新一条平台公告消息
          this.is_new_data = res.data;
          this.notice_visible  = !res.data.is_pop
        })
          .catch((err)=>{

          })
      }
    },
    computed:{
      ...mapState(['userInformation','match_data','team_data']),
    },
  }
</script>

<style scoped>

</style>
