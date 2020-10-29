<template>
  <div v-if="user.nickname" class="player_box">
    <!--选手头像和名字-->
    <div class="info">
      <div class="avatar">
        <img :src="player.logo" alt="">
      </div>
      <!--mode 2组队赛，1 个人赛-->
      <span class="blue ellipsis">{{ player.name }}</span>
    </div>

    <div class="match_info">
      <!--某些比赛(例：理论赛)不需要展示排行-->
      <div v-if="showRank" class="match_box">
        <span>RANK:</span>
        <span class="blue">{{ player.rank }}</span>
      </div>

      <!--某些比赛需要 展示轮次 由props控制-->
      <div v-if="showRound" class="match_box">
        <span>ROUND:</span>
        <span class="blue">{{ player.round }}</span>
      </div>

      <!--某些比赛(例：理论赛)不需要展示分数-->
      <div v-if="showScore" class="match_box">
        <span>SCORE:</span>
        <span class="blue">{{ player.score }}</span>
      </div>
    </div>

    <div class="countDown">
      <countDown />
    </div>
  </div>
  <div v-else>
    <countDown  class="countDown_box"/>
  </div>
</template>

<script>
import countDown from '@/components/countDown'
import { mapGetters } from 'vuex'
import { commonRequest } from '@/api/match'

export default {
  name: 'Index',
  components: { countDown },
  props: {
    showRound: {
      type: Boolean,
      default: false
    },
    showRank: {
      type: Boolean,
      default: true
    },
    showScore: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      type: this.$route.query.type,
      player: {
        logo: '',
        name: '',
        rank: 0,
        round: 0,
        score: 0
      },

      url: {
        // 7种路由地址，对应不同的竞赛模式 竞赛类型 1攻防 2新攻防 3运维 4解题 5闯关 6rw 7理论
        1: '/api/v1/att_def/web/nav_data/',
        2: '/api/v1/jad/web/nav_data/',
        3: '/api/v1/ops/web/nav_data/',
        4: '/api/v1/jeopardy/web/nav_data/',
        5: '/api/v1/layered/web/nav_data/',
        6: '/api/v1/rw/web/nav_data/',
        7: '/api/v1/theory/web/nav_data/',
        8: '/api/v1/inf/web/nav_data/'
      }
    }
  },
  computed: {
    ...mapGetters(['match', 'user', 'team'])
  },
  created() {
    if (this.user.nickname) this.getUserRank()
  },
  methods: {
    // 获取用户当前竞赛排名，得分等信息。
    getUserRank() {
      let url = this.url[this.type]
      if (this.type != 2 && this.type != 3 && this.type != 8 && this.type != 1) {
        url = `${url}${this.$route.query.hash}?evt=${this.$route.query.hash}`
      } else {
        url = `${url}?event_id=${this.$route.query.id}&evt=${this.$route.query.hash}`
      }

      // 根据竞赛类型请求不同的接口,获取当前用户排名，得分等信息
      commonRequest(url, 'get').then((res) => {
        const { data } = res
        this.player = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.player_box {
  width: 100%;
  height: 50px;
  background: rgba(36, 43, 117, 0.8);
  margin-bottom: 15px;
  border-radius: 6px;
  color: #fff;
  display: flex;
  padding: 0 20px;
  font-size: 18px;

  .info {
    width: 18%;
    display: flex;
    align-items: center;
    .avatar {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50px;
      border: 2px solid #3173fd;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50px;
      }
    }
  }

  .match_info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .match_box {
      // width: 33.33%;
      margin-left: 20%;
    }
    .match_box:first-child {
      margin-left: 0;
    }
  }

  .countDown {
    width: 320px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .blue {
    color: #0080ff;
    margin-left: 5px;
    font-weight: bold;
    font-size: 20px;
    flex: 1;
  }
}
.countDown_box {
  margin: 0;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
