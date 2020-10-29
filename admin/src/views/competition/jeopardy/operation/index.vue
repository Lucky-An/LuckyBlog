<template>
  <div class="app-container">
    <el-tabs
      v-model="activeName"
      style="margin-top:15px;"
      type="border-card"
    >
      <el-tab-pane
        key="status"
        label="任务状态"
        name="status"
      >
        <matchStatus v-if="activeName=='status'" ref="status" />
      </el-tab-pane>
      <el-tab-pane
        key="topic"
        label="题目运维"
        name="topic"
      >
        <topic v-if="activeName=='topic'" ref="topic" />
      </el-tab-pane>
      <el-tab-pane
        key="monitor"
        label="实例运维"
        name="monitor"
      >
        <monitor v-if="activeName=='monitor'" ref="monitor" />
      </el-tab-pane>
      <el-tab-pane
        key="noice"
        label="公告管理"
        name="noice"
      >
        <matchNoice v-if="activeName=='noice'" ref="noice" />
      </el-tab-pane>
      <el-tab-pane
        key="user"
        label="选手管理"
        name="user"
      >
        <userManagement v-if="activeName=='user'" ref="user" />
      </el-tab-pane>
      <el-tab-pane
        key="result"
        label="比赛结果"
        name="result"
      >
        <result v-if="activeName=='result'" ref="result" />
      </el-tab-pane>
      <el-tab-pane
        key="show"
        label="展示管理"
        name="show"
      >
        <show v-if="activeName=='show'" ref="show" />
      </el-tab-pane>
      <el-tab-pane
        v-if="event_mode==1"
        key="vpn"
        label="VPN管理"
        name="vpn"
      >
        <vpn v-if="activeName=='vpn'" ref="vpn" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import topic from './topic'
import matchStatus from './matchStatus/matchStatus'
import monitor from './monitor'
import matchNoice from './notice/matchNoice'
import userManagement from './userManagement/userManagement'
import result from './result'
import show from './show'
import vpn from '../../vpn'
import { matchJeopardyInfo, fetchJeopardyInfo } from '@/api/match/jeopardy'

export default {
  name: 'Index',
  components: {
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
      mode: null, // 1个人2组队
      activeName: 'status',
      event_mode: '' // 比赛形式 1线上 2线下
    }
  },
  created() {
    fetchJeopardyInfo(this.$route.query.id).then(res => {
      this.event_mode = res.data.event_mode
    })
    matchJeopardyInfo({ evt_hash: this.$route.query.hash }).then(res => {
      this.mode = res.data.mode
      this.$store.dispatch('changeMatchName', res.data.name_zh)
    })

    // 查看url中是否包含activeName
    const activeName = this.$route.query.activeName
    if (activeName) this.activeName = activeName
  },
  beforeDestroy() {
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    changeTab(e) {
      this.$refs[this.activeName].getList()
    }
  }
}
</script>

<style scoped>
</style>
