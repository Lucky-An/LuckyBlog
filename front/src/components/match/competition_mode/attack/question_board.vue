<template>
    <div>
      <questionBoard
        :task_data="task_data"
        :flag_data="flag_data"
        :attack_data="attack_data"
        :download_url="download_task_info"
        :submit_url="api.submit_flag"
      >
        <div slot="task_body" slot-scope="scope">
          <div class="status" :class="{
            'status1':scope.now_item.status==1,
            'status2':scope.now_item.status==2,
            'status3':scope.now_item.status==3,
            'status4':scope.now_item.status==4,
            'status5':scope.now_item.status==5,
            }"
          >
            <span class="" v-if="scope.now_item.status==5"><!--异常-->
              <img src="@/assets/img/ad5/attack/icon5.png" alt="" class="img_status">
              <span class="status_info">{{$t('attack.question_board.check_file_attacked')}}</span>
            </span>
            <span class="" v-if="scope.now_item.status==4"><!--异常-->
              <img src="@/assets/img/ad5/attack/icon4.png" alt="" class="img_status">
              <span class="status_info">{{$t('attack.question_board.check_file')}}</span>
            </span>
            <span class="" v-if="scope.now_item.status==3"><!--异常-->
              <img src="@/assets/img/ad5/attack/icon3.png" alt="" class="img_status">
              <span class="status_info">{{$t('attack.question_board.task_abnormal')}}</span>
            </span>
            <span v-if="scope.now_item.status==2"><!--正常-->
                <img src="@/assets/img/ad5/attack/icon2.png" alt="" class="img_status">
                <span class="status_info">{{$t('attack.question_board.task_normal')}}</span>
              </span>
            <span v-if="scope.now_item.status==1"><!--未开放-->
              <img src="@/assets/img/ad5/attack/icon1.png" alt="" class="img_status">
              <span class="status_info">{{$t('attack.question_board.task_not_open')}}</span>
            </span>
            <div class="now_score">
              {{scope.now_item.score}}pt
            </div>
            <div style="color:#aaaeb9;text-align:center;margin-top:8px;">{{$t('attack.question_board.now_score')}}</div>
          </div>
        </div>
      </questionBoard>
    </div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
  const {mapState} = createNamespacedHelpers('match')
  import questionBoard from '../../common/attack_question_board.vue'
  import menuNav from '@/components/match/common/small_part/challenge_menu.vue'

  import {
    attackedData,
    competitionData,
    download_task_info,
    navData,
    challenge_data,
    submit_flag
  } from '@/api/competitionMode/attackMode'
  export default {
    name: 'question_board',
    components: {
      questionBoard,
      menuNav
    },
    data () {
      return {
        download_task_info:download_task_info+'?event_id='+this.$route.query.event,
        api:{
          attackedData,
          competitionData,
          navData,
          challenge_data,
          submit_flag
        },
        task_data:[
        ],
        flag_data:{
        },
        attack_data:[
        ],
        match_id:this.$route.query.event,
        getDataTimer:null
      }
    },
    beforeDestroy () {
      clearInterval(this.getDataTimer);
    },
    created () {
      this.getAttackedList();
      this.getTaskData();
      this.getDataTimer = setInterval(()=>{
        this.getAttackedList();
        this.getTaskData();
      },30000)
      this.api.competitionData({
        event_id:this.match_id
      })
        .then(res=>{
          if(!res.data.message){
            this.flag_data = res.data;
          }
        })
        .catch(res=>{

        })

    },
    methods:{
      getTaskData(){
        this.api.challenge_data({
          event_id:this.match_id
        })
          .then(res=>{
            if(!res.data.message){
              this.task_data = res.data;
            }
          })
          .catch(res=>{

          })
      },
      getAttackedList(){
        this.api.attackedData({
          event_id:this.match_id
        })
          .then(res=>{
            this.attack_data = res.data;
          })
          .catch(res=>{

          })
      }
    },
    watch: {
    },
    computed: {
      ...mapState(['userInformation','team_data']),
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
