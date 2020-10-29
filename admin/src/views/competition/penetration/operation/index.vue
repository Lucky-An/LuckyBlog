<template>
  <div class="app-container">
    <el-tabs
      v-model="activeName"
      style="margin-top:15px;"
      type="border-card"
    >
      <el-tab-pane
        key="status"
        label="竞赛状态"
        name="status"
      >
        <matchStatus v-if="activeName === 'status'" />
      </el-tab-pane>
      <el-tab-pane
        key="teamScene"
        label="选手场景"
        name="teamScene"
      >
        <teamScene v-if="activeName === 'teamScene'" />
      </el-tab-pane>

      <el-tab-pane
        key="reportReview"
        label="报告审核"
        name="reportReview"
      >
        <reportReview v-if="activeName === 'reportReview'" />
      </el-tab-pane>

      <el-tab-pane
        key="bulletinManage"
        label="公告管理"
        name="bulletinManage"
      >
        <bulletinManage v-if="activeName === 'bulletinManage'" />
      </el-tab-pane>
      <el-tab-pane
        key="rank"
        label="选手管理"
        name="rank"
      >
        <rank v-if="activeName === 'rank'" />
      </el-tab-pane>
      <el-tab-pane
        key="myResult"
        label="比赛结果"
        name="myResult"
      >
        <myResult v-if="activeName === 'myResult'" />
      </el-tab-pane>

      <el-tab-pane
        key="reveal"
        label="展示管理"
        name="reveal"
      >
        <reveal v-if="activeName === 'reveal'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="event_mode==1"
        key="vpn"
        label="VPN管理"
        name="vpn"
      >
        <keep-alive>
          <vpn ref="vpn" />
        </keep-alive>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import matchStatus from './matchStatus/matchStatus'
import bulletinManage from './bulletinManage/bulletinManage'
import teamScene from './teamScene/teamScene'
import reveal from './reveal/reveal'
import rank from './rank/rank'
import reportReview from './reportReview/reportReview'
import myResult from './myResult/myResult'
import vpn from '../../vpn'
import { fetchPenetrationInfo } from '@/api/match/penetration'

export default {
  name: 'Index',
  components: {
    matchStatus,
    teamScene,
    bulletinManage,
    reveal,
    rank,
    reportReview,
    myResult,
    vpn
  },
  data() {
    return {
      mode: null, // 1个人2组队
      activeName: 'status',
      id: this.$route.query.id,
      event_mode: ''
    }
  },

  created() {
    fetchPenetrationInfo(this.id).then(res => {
      const { data } = res
      this.mode = data.mode
      this.event_mode = data.event_mode
      this.$store.dispatch('changeMatchName', data.name_zh)
    })
    // 查看url中是否包含activeName
    const activeName = this.$route.query.activeName
    if (activeName) {
      this.activeName = activeName
    }
  },
  beforeDestroy() {
    this.$store.dispatch('changeMatchName', '')
  }
}
</script>
