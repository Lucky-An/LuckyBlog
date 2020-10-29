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

    <div
      class="guide_wrap"
      :class="{'margTop':!is_login,'paddTop':!is_login}"
    >
      <!-- 调用倒计时 -->
      <PlayerInfo :show-round="true" />
      <el-table
        class="coolRank"
        :data="ranks_list"
        style="width: 100%"
      >
        <!-- 轮次 -->
        <!-- align="center" -->
        <el-table-column
          prop="round"
          :label="$t('attack.attack_table.round')"
          align="center"
          width="140"
        >
          <template slot-scope="scope">
            <span class="rank_number">{{ scope.row.round }}</span>
          </template>
        </el-table-column>
        <!-- 攻击方 -->
        <el-table-column
          :label="$t('attack.attack_table.success')"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <div style="text-align:center;">
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
          align="center"
          :label="$t('attack.attack_table.KO')"
        >
          <template slot-scope="scope">
            <span>Pwn3d</span>
          </template>
        </el-table-column>
        <!-- 题目 -->
        <el-table-column
          prop="challenge_name"
          align="center"
          :label="$t('attack.attack_table.task')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.challenge_name }}</span>
          </template>
        </el-table-column>
        <!-- 被攻击方 -->
        <el-table-column
          width="250"
          align="center"
          :label="$t('attack.attack_table.fail')"
        >
          <template slot-scope="scope">
            <div style="text-align:center;">
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
          align="center"
          :label="$t('attack.attack_table.time')"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import countDown from '@/components/countDown'
import { getStrNumber } from '@/utils'
import { attackData } from '@/api/attack'
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
  },
  computed: {
    ...mapGetters(['config', 'match'])
  }
}
</script>
<style lang='scss' scoped>
.guide_wrap {
  position: relative;
  padding: 15px 20px;
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
