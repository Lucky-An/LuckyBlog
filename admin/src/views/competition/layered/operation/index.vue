<template>
  <div class="app-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeTab">
      <el-tab-pane key="status" label="竞赛状态" name="status">
        <keep-alive>
          <matchStatus ref="status"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="topic" label="题目运维" name="topic">
        <keep-alive>
          <topic ref="topic"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="monitor" label="监控" name="monitor">
        <keep-alive>
          <monitor ref="monitor"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="noice" label="公告" name="noice">
        <keep-alive>
          <matchNoice ref="noice"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="user" :label="mode==1?'用户管理':'队伍管理'" name="user">
        <keep-alive>
          <userManagement ref="user"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="result" label="比赛结果" name="result">
        <keep-alive>
          <result ref="result"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="sence" label="场景链接" name="sence">
        <keep-alive>
          <sence ref="sence"/>
        </keep-alive>
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
import sence from './sence'
import { matchJeopardyInfo, fetchJeopardyInfo } from '@/api/match/layered'
import { getStorage, setStorage } from '@/utils/storage'

export default {
  name: 'Index',
  components: { topic, matchStatus, monitor, result, matchNoice, userManagement, sence },
  data() {
    return {
      mode: getStorage('match_info', 'object').mode, // 1个人2组队
      activeName: 'status'
    }
  },
  created() {
    matchJeopardyInfo(this.$route.query.id).then(res => {
      setStorage('match_info', res.data)
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
