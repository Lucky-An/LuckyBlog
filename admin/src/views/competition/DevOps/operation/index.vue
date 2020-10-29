<template>
  <div class="app-container">
    <el-tabs
      v-model="activeName"
      style="margin-top: 15px"
      type="border-card"
      @tab-click="changeTab"
    >
      <el-tab-pane key="deployScene" label="部署环境" name="deployScene">
        <deployScene v-if="activeName === 'deployScene'" ref="deployScene" />
      </el-tab-pane>

      <el-tab-pane key="status" label="竞赛状态" name="status">
        <keep-alive>
          <matchStatus ref="status" />
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane key="topic" label="题目运维" name="topic">
        <keep-alive>
          <topic ref="topic" />
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane key="monitor" label="实例运维" name="monitor">
        <keep-alive>
          <monitor ref="monitor" />
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane key="noice" label="公告管理" name="noice">
        <keep-alive>
          <matchNoice ref="noice" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="user" :label="'选手管理'" name="user">
        <keep-alive>
          <userManagement ref="user" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="result" label="比赛结果" name="result">
        <keep-alive>
          <result ref="result" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="show" label="展示管理" name="show">
        <keep-alive>
          <show ref="show" />
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane v-if="event_mode == 1" key="vpn" label="VPN管理" name="vpn">
        <keep-alive>
          <vpn ref="vpn" />
        </keep-alive>
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
import { fetchDefenseInfo } from '@/api/match/DevOps'
import show from './showManagement'
import vpn from '../../vpn'
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
      activeName: 'deployScene',
      getList: [
        'deployScene',
        'scene',
        'topic',
        'status',
        'monitor',
        'noice',
        'user',
        'result',
        'show'
      ],
      event_mode: '' // 比赛形式 1线上 2线下
    }
  },

  created() {
    fetchDefenseInfo(this.$route.query.id).then((res) => {
      this.event_mode = res.data.event_mode
      this.$store.dispatch('changeMatchName', res.data.name_zh)
    })
  },
  beforeDestroy() {
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    changeTab(e) {
      if (this.getList.includes(this.activeName)) {
        if (this.activeName === 'deployScene') return
        this.$refs[this.activeName].getList()
      }
    }
  }
}
</script>

<style scoped>
</style>
