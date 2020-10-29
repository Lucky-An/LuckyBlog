<template>
  <div class="app-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeTab">
      <el-tab-pane v-if="roles!='referee'" key="status" label="竞赛状态" name="status">
        <keep-alive>
          <matchStatus ref="status"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane v-if="roles!='referee'" key="topic" label="题目运维" name="topic">
        <keep-alive>
          <topic ref="topic"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane v-if="roles!='referee'" key="noice" label="公告管理" name="noice">
        <keep-alive>
          <matchNoice ref="noice"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="audit" label="挑战分配" name="audit">
        <keep-alive v-if="activeName=='audit'">
          <audit ref="audit"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane key="result" label="比赛结果" name="result">
        <keep-alive>
          <result ref="result"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane
        key="reveal"
        label="展示管理"
        name="reveal"
      >
        <reveal v-if="activeName === 'reveal'" />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import topic from './topic'
import matchStatus from './matchStatus/matchStatus'
import matchNoice from './notice/matchNoice'
import result from './result'
import audit from './audit'
import reveal from './reveal/reveal'
import { fetchMatchInfo } from '@/api/match/realWord'

export default {
  name: 'Index',
  components: { topic, matchStatus, result, matchNoice, audit, reveal },
  data() {
    return {
      roles: Cookies.get('Admin-Token'), // 获取登陆的角色
      activeName: 'status',
      getList: ['topic', 'status', 'monitor', 'noice', 'user', 'result']
    }
  },
  created() {
    if (this.roles === 'referee') this.activeName = 'audit'

    fetchMatchInfo(this.$route.query.hash).then(res => {
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
      if (this.getList.includes(this.activeName)) {
        this.$refs[this.activeName].getList()
      }
    }
  }
}
</script>

<style scoped>

</style>
