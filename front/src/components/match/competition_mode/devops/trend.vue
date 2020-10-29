<template>
    <div>
      <div class="guide_wrap" style="padding:15px 0 0 0;" >
        <trend_el ref="trendBody"
                  :api="api"
                  :agar="agar"
                  :config="config">
        </trend_el>
      </div>
    </div>
</template>

<script>
  import {trends} from '@/api/competitionMode/devopsMode'
  import trend_el from '../../common/competition_trend'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
    export default {
      components:{
        trend_el
      },
      name: "trend",
      data(){
        return{
          config:{//曲线图请求的接口
            showBoard:false,//是否显示右侧选手数据面板
          },
          api:{
            trends:trends
          },
          agar:{}
        }
      },
      created(){
        this.agar=  {
          target:'event_id',
          id:this.match_data.id
        }
      },
      methods:{

      },
      computed:{
        ...mapState(['match_data']),
      }
    }

</script>
