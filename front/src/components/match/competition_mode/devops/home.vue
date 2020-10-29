<template>
  <div class="solving_type attack_wrap" style="min-height:100%;">
    <competitionHome  :nav="nav" :api="api">
      <!--<div slot="crazy_call" class="crazy_call" v-if="$route.path.indexOf('contest_challenge')!==-1">-->
        <!--<span class="el-icon-phone"></span>-->
        <!--呼叫主办方-->
      <!--</div>-->
    </competitionHome>
  </div>
</template>

<script>
  import {
    dev_matchStatus,
    signup_users,
    signup_teams,
    notices,
    task_notices,
    editProfile,
    nav_datas
  } from '@/api/competitionMode/devopsMode'
  import competitionHome from '../../common/ad5_home'

  export default {
    components:{
      competitionHome
    },
    data(){
      return{
        header_logo:{
          logo:'',
          add_link:true,
          url:'/'
        },
        arg:this.$route.query.hash,
        nav:[
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/devops/guide',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.guide")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/devops/notice',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.notice")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/devops/contest_challenge',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.questionBoard")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/devops/ranking',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.ranking")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/devops/trend',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.trend")
          }
        ],
        api:{//接口数据
          matchStatus:dev_matchStatus,
          signup_users:signup_users,
          signup_teams:signup_teams,
          new_notices:notices,
          task_notices:task_notices,
          editProfile:editProfile,
          nav_data:nav_datas
        }
      }
    },
    created(){
      $('.header').show();
      $('.match_title').removeClass('width100')
      $('.guide_wrap').removeClass('width100')
    },
    name: "home",
    methods:{
    }
  }
  //给解题赛假设两种样式类型
  //1、攻防世界解题赛样式-->类型=adWorld，2、单独竞赛解题赛样式-->类型=ad5；
  //传统攻防赛样式

</script>

