<template>
  <div>
    <div
      class="video_meng"
      style="background:#140d43;position:absolute;left:0;top:0;z-index:0"
    >
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
    <div
      class="guide_wrap"
      :class="{'margTop':!is_login,'paddTop':!is_login}"
    >
      <!-- 调用倒计时 -->
      <PlayerInfo :show-round="true" />
      <el-table
        class="coolRank"
        :data="ranks_list"
        style="width: 100%;"
      >
        <!-- 轮次 -->
        <el-table-column
          prop="round"
          :label="$t('attack.attack_table.round')"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <span class="rank_number">{{ scope.row.round }}</span>
          </template>
        </el-table-column>
        <!-- 攻击方 -->
        <el-table-column
          :label="$t('attack.attack_table.success')"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <span
                v-if="scope.row.attack_logo==null"
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
                :style="{backgroundImage:'url(' + scope.row.attack_logo + ')'}"
              />
              <span
                v-if="getStrNumber(scope.row.attack_name,15,9)"
                class="marque_box"
              >
                <span>{{ scope.row.attack_name }}</span>
              </span>
              <span
                v-else
                class="marque_box"
              >
                <span class="marquee">{{ scope.row.attack_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.attack_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.attack_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.attack_name }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <!-- 击败 -->
        <el-table-column
          prop="score"
          :label="$t('attack.attack_table.KO')"
          align="center"
        >
          <template slot-scope="scope">
            <span>Pwn3d</span>
          </template>
        </el-table-column>
        <!-- 题目 -->
        <el-table-column
          prop="challenge_name"
          :label="$t('attack.attack_table.task')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.challenge_name }}</span>
          </template>
        </el-table-column>
        <!-- 被攻击方 -->
        <el-table-column
          width="250"
          :label="$t('attack.attack_table.fail')"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <span
                v-if="scope.row.target_logo==null"
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
                :style="{backgroundImage:'url(' + scope.row.target_logo + ')'}"
              />
              <span
                v-if="getStrNumber(scope.row.target_name,15,9)"
                class="marque_box"
              >
                <span>{{ scope.row.target_name }}</span>
              </span>
              <span
                v-else
                class="marque_box"
              >
                <span class="marquee">{{ scope.row.target_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.target_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.target_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.target_name }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <!-- 时间 -->
        <el-table-column
          prop="time"
          :label="$t('attack.attack_table.time')"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import countDown from "@/components/countDown";
import { getStrNumber } from '@/utils'
import { attackData } from '@/api/newAD'
import PlayerInfo from '@/components/PlayerInfo'

export default {
  name: 'AttackRanking',
  components: {
    PlayerInfo
  },
  data() {
    return {
      is_login: localStorage.isUserLogin,
      getStrNumber,
      screenStatus: true,
      ranks_list: [],
      attack_timer: null
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  watch: {
    match(val, old) {
      this.getAttack()
    }
  },
  beforeDestroy() {
    clearInterval(this.attack_timer)
  },
  created() {
    if (this.match.id) {
      this.getAttack()
    }
    this.attack_timer = setInterval(() => {
      this.getAttack()
    }, 10000) // 10秒
  },
  methods: {
    getAttack() {
      attackData({
        event_id: this.match.id
      })
        .then(res => {
          this.ranks_list = res.data
        })
        .catch(res => {})
    }
  }
}
</script>
<style lang='scss' scoped>
.guide_wrap {
  position: relative;
  padding: 10px 20px;
  margin-top: -15px;
  .coolRank{
    margin-top: 30px;
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
</style>
