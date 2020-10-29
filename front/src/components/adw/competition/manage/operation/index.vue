<template>
  <div class="app-container tab_style">
    <el-tabs v-model="activeName"  @tab-click="handleClick" style="margin-top:15px;" type="border-card">
      <el-tab-pane key="status" :label="$t('selfHelp_competition.match_status')" name="status">
        <keep-alive>
          <matchStatus/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="sub" :label="$t('selfHelp_competition.topic_manage')" name="sub">
        <keep-alive>
          <topicManagement/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="noice" :label="$t('selfHelp_competition.match_notic')" name="noice">
        <keep-alive>
          <matchNoice/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="user" :label="mode==1?$t('selfHelp_competition.user_manage'):$t('selfHelp_competition.team_manage')" name="user">
        <keep-alive>
          <userManagement/>
        </keep-alive>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import matchStatus from '../components/matchStatus'
import topicManagement from '../components/topicManagement'
import matchNoice from '../components/matchNoice'
import userManagement from '../components/userManagement'
import { getStorage, setStorage } from '@/utils/storage'


export default {
  name: 'Index',
  components: { matchStatus, topicManagement, matchNoice, userManagement },
  data() {
    return {
      mode: getStorage('match_info', 'object').mode, // 1个人2组队
      activeName: getStorage('tab_name','string')||'status',
    }
  },
  created(){
    this.$http.get('/api/sponsor/event_state/'+this.$route.query.id).then(res => {
      setStorage('match_info', res.data)
    })
  },
  methods:{
    handleClick(tab, event) {
      setStorage('tab_name',tab.name)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
