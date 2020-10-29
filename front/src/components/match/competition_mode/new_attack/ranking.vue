<template>
  <div>
    <div class="video_meng" style="background:#140d43;position:absolute;left:0;top:0;z-index:0">
      <span class="meng"></span>
      <video autoplay loop="loop"
             style="width:100%; height:100%; object-fit: fill;position:absolute;left:0;top:0;z-index:0">
        <source src="../../../../../static/media/new.mp4">
      </video>
    </div>
    <rankPanel :rank="ranks_list" showAttackDefence="true">
    </rankPanel>
  </div>
</template>

<script>
  import {
    rankingData,
  } from '@/api/competitionMode/newAttackMode'
  import rankPanel from '../../common/attack_rank.vue'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState,mapMutations } = createNamespacedHelpers('match');

  export default {
    name: 'ranking',
    components: {
      rankPanel
    },
    data () {
      return {
        api:{
          rankingData:rankingData,
        },
        ranks_list:[
        ],
        rank_timer:null
      }
    },
    beforeDestroy () {
      clearInterval(this.rank_timer);
    },
    created () {
      if(this.match_data.id){
        this.getRanking()
      }
      this.rank_timer = setInterval(()=>{
        this.getRanking();
      },60000)//10秒
    },
    methods: {
      getRanking(){
        this.api.rankingData({
          event_id:this.match_data.id
        }).then((res)=>{
          this.ranks_list = res.data;
        })
          .catch(res=>{

          })
      }
    },
    watch: {
      match_data (val, old) {
        this.getRanking()
      }
    },
    computed:{
      ...mapState(['match_data']),
    }
  }
</script>


