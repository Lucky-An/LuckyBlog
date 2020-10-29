<template>
  <div
    v-show="show_down"
    class="timer"
    :class="{
      'timer_font':$route.path.indexOf('jeopardy')==-1,
      'is_end':match.process==2
    }"
  >
    <span
      class="el-icon-time"
      style="font-size:20px;"
    />
    <span
      v-if="match.process==1"
      class="status_txt"
    >{{ $t('dialog_list.match_before') }}:</span>
    <span
      v-if="match.process==0"
      class="status_txt"
    >{{ $t('dialog_list.match_after') }}:</span>
    <span
      v-if="match.process==2"
      class="status_txt"
    >{{ $t('dialog_list.match_end') }}</span>
    <span
      v-if="match.process!=2"
      v-html="format_time"
    />
  </div>
</template>

<script>
import { dateformat } from '@/utils/dateformat'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CountDown',
  data() {
    return {
      format_time: '',
      timers: null,
      distance_time: '',
      distance_match_time: '',
      match_all_time: '',
      show_down: true,
      type: {
        // 7种路由地址，对应不同的竞赛模式 竞赛类型 1攻防 2新攻防 3运维 4解题 5闯关 6rw 7理论
        1: {
          path: 'match/getAttackInfo',
          params: {
            event_id: this.$route.query.id,
            evt: this.$route.query.hash
          }
        },
        2: {
          path: 'match/getNewADMatchInfos',
          params: {
            event_id: this.$route.query.id,
            evt: this.$route.query.hash
          }
        },
        3: {
          path: 'match/getDevopsInfos',
          params: this.$route.query.id
        },
        4: {
          path: 'match/getjadInfo',
          params: this.$route.query.hash
        },
        5: '',
        6: {
          path: 'match/getRwMatchInfos',
          params: this.$route.query.hash
        },
        7: {
          path: 'match/getTheoryInfo',
          params: this.$route.query.hash
        },
        8: {
          path: 'match/getInfInfo',
          params: { event_id: this.$route.query.id }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['match'])
  },
  watch: {
    match: {
      immediate: true,
      handler: function(newval, oldval) {
        if (newval.all_seconds) {
          this.showDown()
        }
      }
    }
  },
  created() {
    // this.showDown()
  },
  methods: {
    ...mapMutations(['SET_REMAIN_SECONDS']),
    showDown() {
      clearInterval(this.timers) // 清定时器
      this.match_all_time = parseInt(this.match.all_seconds) * 1000 // 比赛总时间
      this.distance_match_time = parseInt(this.match.remain_seconds) * 1000 // 距离比赛时间/剩余时间
      this.format_time = dateformat(this.distance_match_time)
      if (this.match.process != 2) {
        this.timers = setInterval(() => {
          // 倒计时
          this.distance_match_time -= 1000
          if (this.distance_match_time <= 0) {
            // 当倒计时为0时判断
            if (this.match.process == 1) {
              // 如果比赛是未开始，倒计时结束，重新请求后台接口时间。
              this.$store.dispatch(this.type[this.$route.query.type].path, this.type[this.$route.query.type].params)
            } else {
              // 下面是比赛结束的状态
              this.distance_match_time = 0
              this.match.process = 2 // 切换状态为已结束
              this.$EventBus.$emit('IntervalTimeOut')
              clearInterval(this.timers) // 清定时器
            }
          }

          this.format_time = dateformat(this.distance_match_time)
          this.$store.commit('match/SET_REMAIN_SECONDS', this.distance_match_time / 1000)// 更新状态存储的数据
          // this.SET_REMAIN_SECONDS(this.distance_match_time)// 更新状态存储的数据
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .timer {
    display: inline-block;
  }

  .el-icon-time {
    color: #0080ff;
    margin-right: 10px;
  }

  .timer *:not(.el-icon-time) {
    color: #fff;
    font-size: 18px;
  }

  .status_txt {
    color: #fff;
    font-size: 18px;
  }

  .timer_font {
    color: #fff;
  }

  .is_end {
    width: 150px;
  }

</style>
