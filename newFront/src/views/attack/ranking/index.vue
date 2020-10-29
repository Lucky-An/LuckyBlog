<template>
  <div>
    <div class="video_meng">
      <span class="meng" />
      <video
        autoplay
        muted
        loop="loop"
        style="width:100vw; height:100vh; object-fit: fill;position:absolute;left:0;top:0;z-index:0"
      >
        <source src="@/assets/media/new.mp4">
      </video>
    </div>

    <!-- <div class="guide_wrap" style="padding:10px 0;margin-top:-15px;" :class="{'margTop':!is_login}"> -->
    <!-- 状态类型 -->
    <div class="guide_wrap">
      <!-- 用户信息 -->
      <PlayerInfo
        :show-round="true"
        style="margin-top:30px"
      />
      <!-- 状态类型 -->
      <div class="legend">
        <span class="legend_not_open">{{ $t('attack.legend.not_open') }}</span>
        <span class="legend_normal">{{ $t('attack.legend.normal') }}</span>
        <span class="legend_abnormal">{{ $t('attack.legend.abnormal') }}</span>
        <span class="legend_success">{{ $t('attack.legend.success') }}</span>
        <span class="legend_fail">{{ $t('attack.legend.fail') }}</span>
        <!-- <span class="fullScreen" v-if="!is_login">
          <fullScreen></fullScreen>
        </span>-->
      </div>

      <el-table
        class="coolRank"
        :data="ranks_list"
        :class="{'paddTop':!is_login}"
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column
          align="center"
          prop="rank"
          :label="$t('attack.rank_table.rank')"
          width="50"
        >
          <template slot-scope="scope">
            <span class="rank_number">{{ scope.row.rank }}</span>
          </template>
        </el-table-column>
        <!-- 战队名称 -->
        <el-table-column
          :label="$t('attack.rank_table.team')"
          width="210"
        >
          <template slot-scope="scope">
            <div style="text-align:left;">
              <!-- 无图标显示默认图标 -->
              <span
                v-if="scope.row.team_logo==null"
                class="team_logo_show"
                style="overflow: hidden;"
              >
                <img
                  src="@/assets/match/def_icon.jpg"
                  alt
                  style="width:100%;height:100%;"
                >
              </span>
              <span
                v-else
                class="team_logo_show"
                :style="{backgroundImage:'url(' + scope.row.team_logo + ')'}"
              />
              <span
                v-if="getStrNumber(scope.row.team_name,15,9)"
                class="marque_box"
              >
                <span>{{ scope.row.team_name }}</span>
              </span>
              <span
                v-else
                class="marque_box"
              >
                <span class="marquee">{{ scope.row.team_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.team_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.team_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.team_name }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <!-- 得分 -->
        <el-table-column
          align="center"
          prop="score"
          width="100"
          :label="$t('attack.rank_table.score')"
        >
          <template slot-scope="scope">
            <span
              class
              style="font-style:italic;font-weight:bold;"
            >{{ scope.row.score }}</span>
          </template>
        </el-table-column>
        <!-- 题目 -->
        <el-table-column
          v-for="(t,i) in challenges"
          :key="i"
          align="center"
          prop="task"
          :label="t.challenge_name"
        >
          <template slot-scope="scope">
            <span
              :class="{
                'disabled_task':scope.row.challenges[i].status==1,
                'normal_task':scope.row.challenges[i].status==2,
                'abnormal_task':scope.row.challenges[i].status==4,
                'success_task':scope.row.challenges[i].status==3,
                'fail_task':scope.row.challenges[i].status==5,
              }"
            />
          </template>
        </el-table-column>
        <!-- 攻击得分 -->
        <!-- <el-table-column
          v-if="showAttackDefence"
          align="center"
          :label="$t('attack.rank_table.successful_attack')"
        >
          <template slot-scope="scope">
            <span
              class="txt_color"
              style="font-size:20px;color:#03bb75;font-weight:bold;font-style:italic"
            >{{ scope.row.attack_score }}</span>
          </template>
        </el-table-column> -->
        <!-- 防御得分 -->
        <!-- <el-table-column
          v-if="showAttackDefence"
          align="center"
          :label="$t('attack.rank_table.defence_success')"
        >
          <template slot-scope="scope">
            <span
              class="txt_color lv_color"
              style="font-size:20px;color:#e64c4c;font-weight:bold;font-style:italic"
            >{{ scope.row.defend_score }}</span>
          </template>
        </el-table-column> -->
        <!-- 变化 -->
        <el-table-column
          align="center"
          :label="$t('attack.rank_table.change')"
        >
          <template slot-scope="scope">
            <div
              :class="{
                'change_none':scope.row.rank_change==0,
                'change_up':scope.row.rank_change>0,
                'change_down':scope.row.rank_change<0
              }"
            >
              <span class="txt_color">{{ scope.row.change_score_sum }}</span>
              <span class="icon" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { rankingData } from '@/api/attack'
import { mapGetters } from 'vuex'
import countDown from '@/components/countDown'
import { getStrNumber } from '@/utils'
import PlayerInfo from '@/components/PlayerInfo'

export default {
  name: 'Ranking',
  components: {
    countDown,
    PlayerInfo
  },
  data() {
    return {
      getStrNumber,
      showAttackDefence: true,
      rank: [{}],
      event_id: this.$route.query.id,
      is_login: localStorage.isUserLogin,
      ranks_list: [],
      challenges: [],
      rank_timer: null
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  watch: {
    match_data(val, old) {
      this.getRanking()
    }
  },
  beforeDestroy() {
    clearInterval(this.rank_timer)
  },

  created() {
    // if (this.match_data.id) {
    this.getRanking()
    // }
    this.rank_timer = setInterval(() => {
      this.getRanking()
    }, 60000) // 10秒
  },
  mounted() {},
  methods: {
    getRanking() {
      rankingData({
        event_id: this.event_id
      })
        .then(res => {
          this.ranks_list = res.data
          this.challenges = res.data[0].challenges || []
        })
        .catch(res => {})
    }
  }
}
</script>
<style >
.margTop {
  margin-top: 10px;
}
.paddTop {
  padding-top: 10px;
}
.lv_color {
  color: rgb(3, 187, 117);
}
.lv_color {
  color: rgb(3, 187, 117);
}
</style>
<style lang="scss" scoped>
.guide_wrap {
  position: relative;
  padding: 15px 20px;
  margin-top: -15px;
  .legend {
    clear: both;
    float: right;
    * {
      font-size: 12px;
    }
    .legend_normal {
      color: #fff;
      &:before {
        background-image: url("~@/assets/attack/legend_2.png");
      }
    }
    .legend_abnormal {
      color: #fff;
      &:before {
        background-image: url("~@/assets/attack/legend_3.png");
      }
    }
    .legend_success {
      color: #fff;
      &:before {
        background-image: url("~@/assets/attack/legend_4.png");
      }
    }
    .legend_fail {
      color: #fff;
      &:before {
        background-image: url("~@/assets/attack/legend_5.png");
      }
    }
    .legend_not_open {
      color: #fff;
      &:before {
        background-image: url("~@/assets/attack/legend_1.png");
      }
    }
    .legend_normal,
    .legend_abnormal,
    .legend_success,
    .legend_not_open {
      margin-right: 15px;
    }
    .legend_normal:before,
    .legend_abnormal:before,
    .legend_success:before,
    .legend_fail:before,
    .legend_not_open:before {
      content: "";
      display: inline-block;
      clear: both;
      width: 22px;
      height: 22px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      vertical-align: -7px;
      margin-right: 3px;
    }
  }
}
.team_logo_show {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  background-size: cover;
  background-position: 50%;
  margin-right: 5px;
}
.disabled_task {
  width: 35px;
  height: 35px;
  display: inline-block;
  background: url("~@/assets/attack/xiao1.png") no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
}
.normal_task {
  width: 35px;
  height: 35px;
  display: inline-block;
  background: url("~@/assets/attack/xiao2.png") no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
}
.abnormal_task {
  width: 35px;
  height: 35px;
  display: inline-block;
  background: url("~@/assets/attack/xiao4.png") no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
}
.success_task {
  width: 35px;
  height: 35px;
  display: inline-block;
  background: url("~@/assets/attack/xiao3.png") no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
}
.fail_task {
  width: 35px;
  height: 35px;
  display: inline-block;
  background: url("~@/assets/attack/xiao5.png") no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
}

.change_none {
  .txt_color {
    color: #ffb30fl;
    margin-right: 5px;
  }
  .icon {
    width: 14px;
    height: 20px;
    display: inline-block;
    background: url("~@/assets/attack/none.png") no-repeat;
    background-position: center center;
    vertical-align: -5px;
  }
}
.change_up {
  .txt_color {
    color: #01b671;
    margin-right: 5px;
  }
  .icon {
    width: 14px;
    height: 20px;
    display: inline-block;
    background: url("~@/assets/attack/upup.png") no-repeat;
    background-position: center center;
    vertical-align: -5px;
  }
}
.change_down {
  .txt_color {
    color: #e64c4c;
    margin-right: 5px;
  }
  .icon {
    width: 14px;
    height: 20px;
    display: inline-block;
    background: url("~@/assets/attack/downdown.png") no-repeat;
    background-position: center center;
    vertical-align: -5px;
  }
}
</style>
<style lang="scss">
</style>

