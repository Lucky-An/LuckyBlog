<template>
  <div class="solving_type attack_wrap" style="min-height:100%;">
    <competitionHome  :nav="nav" :api="api">
    </competitionHome>
  </div>
</template>

<script>
  import {
    eventData,
    notices,
    new_notices,
    navData
  } from '@/api/competitionMode/attackMode'
  import competitionHome from '../../common/ad5_home'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState } = createNamespacedHelpers('match');

  export default {
    components:{
      competitionHome,
    },
    data(){
      return{
        nav:[
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/attack/guide',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.guide")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/attack/notice',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.notice")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/attack/contest_challenge',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.questionBoard")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/attack/ranking',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.ranking")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/attack/attackRanking',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.attack")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/attack/trend',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.trend")
          }
        ],
        api:{//接口数据
          matchStatus:eventData,
          notices,
          new_notices,
          nav_data:navData
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
    },
    computed:{
      ...mapState(['match_data']),
    },
  }

</script>

