<template>
    <div>
      <div class="guide_wrap"
           style="padding:10px 15px 0 0!important;height:55px;background:rgba(21,27,66,.7);margin-top:25px;">
        <countDown
          v-if="is_login"
          style="float:right;"
          class="time_wrap"
          :api="api.events"
          :arg="arg"
        ></countDown>
      </div>
      <div class="guide_wrap" style="padding:15px 0 0 0;background:rgba(21,27,66,.7)" >
        <trend_el ref="trendBody"
                  :api="api"
                  :agar="agar"
                  :config="config">
        </trend_el>
      </div>
    </div>
</template>

<script>
  import {trends,events} from '@/api/competitionMode/layeredMode'
  import trend_el from '../../common/competition_trend'
  import countDown from '@/components/common_components/countDown.vue'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
    export default {
      components:{
        trend_el,
        countDown
      },
      name: "trend",
      data(){
        return{
          is_login:localStorage.isUserLogin,
          config:{//曲线图请求的接口
            showBoard:false,//是否显示右侧选手数据面板
          },
          arg:this.$route.query.hash,
          api:{
            trends:trends,
            events
          },
          agar:{}
        }
      },
      created(){
        this.agar=  {
          target:'evt',
          id:this.match_data.hash
        }
      },
      methods:{

      },
      watch: {
        match_data (val, old) {
          this.agar=  {
            target:'evt',
            id:this.match_data.hash
          }
        }
      },
      computed:{
        ...mapState(['match_data']),
      }
    }

</script>
