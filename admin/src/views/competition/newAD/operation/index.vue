<template>
  <div class="app-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane key="scene" label="部署环境" name="scene">
        <deployScene v-if="activeName==='scene'" ref="scene" />
      </el-tab-pane>
      <el-tab-pane key="status" label="竞赛状态" name="status">
        <matchStatus v-if="activeName==='status'" ref="status" />
      </el-tab-pane>
      <el-tab-pane key="topic" label="题目运维" name="topic">
        <topic v-if="activeName==='topic'" ref="topic" />
      </el-tab-pane>
      <el-tab-pane key="monitor" label="实例运维" name="monitor">
        <monitor v-if="activeName==='monitor'" ref="monitor" />
      </el-tab-pane>
      <el-tab-pane key="noice" label="公告管理" name="noice">
        <matchNoice v-if="activeName==='noice'" ref="noice" />
      </el-tab-pane>
      <el-tab-pane key="user" :label="'选手管理'" name="user">
        <userManagement v-if="activeName==='user'" ref="user" />
      </el-tab-pane>
      <el-tab-pane key="result" label="比赛结果" name="result">
        <result v-if="activeName==='result'" ref="result" />
      </el-tab-pane>
      <el-tab-pane key="show" label="展示管理" name="show">
        <show v-if="activeName==='show'" ref="show" />
      </el-tab-pane>
      <el-tab-pane
        v-if="event_mode==1"
        key="vpn"
        label="VPN管理"
        name="vpn"
      >
        <vpn v-if="activeName==='vpn'" ref="vpn"/>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import deployScene from './deployScene'
import topic from './topic'
import matchStatus from './matchStatus/matchStatus'
import monitor from './monitor'
import matchNoice from './notice/matchNoice'
import userManagement from './userManagement/userManagement'
import result from './result'
import show from './showManagement'
import vpn from '../../vpn'
import { fetchDefenseInfo } from '@/api/match/newAD'

export default {
  name: 'Index',
  components: {
    deployScene,
    topic,
    matchStatus,
    monitor,
    result,
    matchNoice,
    userManagement,
    show,
    vpn
  },
  data() {
    return {
      activeName: 'scene',
      event_mode: ''// 比赛形式 1线上 2线下
    }
  },

  created() {
    fetchDefenseInfo(this.$route.query.id).then((res) => {
      this.$store.dispatch('changeMatchName', res.data.name_zh)
      this.event_mode = res.data.event_mode
    })
  },
  beforeDestroy() {
    this.$store.dispatch('changeMatchName', '')
  }
}
</script>

<style scoped>
</style>
