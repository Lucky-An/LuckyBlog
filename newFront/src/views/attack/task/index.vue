<template>
  <div class="taskcon">
    <!-- 调用倒计时 -->
    <PlayerInfo :show-round="true" style="margin-top:30px" />
    <div class="listcon" />
    <card>
      <div slot="task_body" slot-scope="scope">
        <div
          class="status"
          :class="{
            'status1':scope.now_item.status==1,
            'status2':scope.now_item.status==2,
            'status3':scope.now_item.status==3,
            'status4':scope.now_item.status==4,
            'status5':scope.now_item.status==5,
          }"
        >
          <span v-if="scope.now_item.status==5" class>
            <!--异常-->
            <img src="@/assets/attack/icon5.png" alt class="img_status">
            <span class="status_info">{{ $t('attack.question_board.check_file_attacked') }}</span>
          </span>
          <span v-if="scope.now_item.status==4" class>
            <!--异常-->
            <img src="@/assets/attack/icon4.png" alt class="img_status">
            <span class="status_info">{{ $t('attack.question_board.check_file') }}</span>
          </span>
          <span v-if="scope.now_item.status==3" class>
            <!--异常-->
            <img src="@/assets/attack/icon3.png" alt class="img_status">
            <span class="status_info">{{ $t('attack.question_board.task_abnormal') }}</span>
          </span>
          <span v-if="scope.now_item.status==2">
            <!--正常-->
            <img src="@/assets/attack/icon2.png" alt class="img_status">
            <span class="status_info">{{ $t('attack.question_board.task_normal') }}</span>
          </span>
          <span v-if="scope.now_item.status==1">
            <!--未开放-->
            <img src="@/assets/attack/icon1.png" alt class="img_status">
            <span class="status_info">{{ $t('attack.question_board.task_not_open') }}</span>
          </span>
          <div class="now_score">{{ scope.now_item.score }}pt</div>
          <div
            style="color:#aaaeb9;text-align:center;margin-top:8px;"
          >{{ $t('attack.question_board.now_score') }}</div>
        </div>
      </div>
    </card>
    <ClickHere :mac="false" />

  </div>
</template>

<script>
import PlayerInfo from '@/components/PlayerInfo'
import ClickHere from '@/components/ClickHere'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('match')
import card from './card'

// import menuNav from '@/components/match/common/small_part/challenge_menu.vue'

import {
  attackedData,
  competitionData,
  download_task_info,
  navData,
  challenge_data,
  submit_flag
} from '@/api/attack'
export default {
  name: 'QuestionBoard',
  components: {
    PlayerInfo,
    card,
    ClickHere
    // questionBoard,
    // menuNav
  },
  data() {
    return {
      // download_task_info:download_task_info + "?event_id=" + this.$route.query.event,
      api: {
        attackedData,
        competitionData,
        navData,
        challenge_data,
        submit_flag
      },
      task_data: [],
      flag_data: {},
      attack_data: [],
      match_id: this.$route.query.event,
      getDataTimer: null
    }
  },
  watch: {},
  beforeDestroy() {
    clearInterval(this.getDataTimer)
  },
  created() {},
  methods: {},
  computed: {
    ...mapState(['userInformation', 'team_data'])
  }
}
</script>

<style lang='scss' scoped>
.taskcon {
  width: 80%;
  margin: 0 auto;
  min-width: 1300px;
}
</style>
