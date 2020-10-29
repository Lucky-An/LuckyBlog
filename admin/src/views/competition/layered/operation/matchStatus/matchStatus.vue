<template>
  <div class="app-container">
    <el-form label-width="130px">
      <el-form-item label="是否显示排名">
        <el-switch v-model="query.public_rank" :active-value="1" :inactive-value="0" @change="submitForm"/>
      </el-form-item>

      <el-form-item label="是否开放上传WP">
        <el-switch v-model="query.can_submit_writeup" :active-value="1" :inactive-value="0" @change="submitForm"/>
      </el-form-item>
      <el-form-item label="题目环境">
        <span v-show="is_share==1">共享</span>
        <span v-show="is_share==0">独享</span>
      </el-form-item>
      <el-form-item label="排行榜">
        <el-button type="primary" size="mini">查看</el-button>

      </el-form-item>
      <el-form-item label="态势状态">
        <el-switch v-model="query.use_vis" @change="submitForm"/>
      </el-form-item>

      <el-form-item label="态势展示">
        <el-button type="success" size="mini" disabled>查看</el-button>
        <el-button type="success" size="mini" @click="initSence">场景初始化</el-button>
      </el-form-item>
      <el-form-item label="竞赛状态">
        <span v-show="process==1">未开始</span>
        <span v-show="process==0">进行中</span>
        <span v-show="process==2">已结束</span>
      </el-form-item>
      <el-form-item label="竞赛控制">
        <span v-if="process==1">未开始</span>
        <span v-else-if="process==0">
          {{ query.status==1? '进行中':'暂停中' }}&nbsp;&nbsp;&nbsp;
          <el-button v-show="query.status==2" type="success" size="mini" @click="handleSwitch(1)">继续比赛</el-button>
          <el-button v-show="query.status==1" type="danger" size="mini" @click="handleSwitch(2)">暂停比赛</el-button>
        </span>
        <span v-else="process==2">已结束</span>

      </el-form-item>

      <el-form-item label="竞赛数据管理">
        <el-button type="primary" size="mini">清除比赛数据</el-button>
      </el-form-item>

      <!--<el-form-item>-->
      <!--<div class="fcenter">-->
      <!--<el-button type="primary" @click="submitForm">保存</el-button>-->
      <!--</div>-->
      <!--</el-form-item>-->
    </el-form>
  </div>
</template>

<script>
import { updateJeopardyStatus, matchJeopardyInfo, initSence } from '@/api/match/layered'
import { getStorage, setStorage } from '@/utils/storage'

export default {
  name: 'MatchStatus',
  data() {
    return {
      id: this.$route.query.id,
      process: 1,
      query: {
        can_submit_writeup: 1,
        status: 1, // 比赛控制
        public_rank: 1, // 是否显示排名
        // delivery: 0, // 开启题目讨论
        replay_start_time: '',
        replay_end_time: '',
        is_replay: 0,
        url: '',
        is_share: '',
        use_vis: ''
      }

    }
  },
  created() {
    this.initData()
  },
  methods: {
    initSence() { // 场景初始化
      initSence(this.id).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.initData()
        }
      })
    },
    initData() {
      const match_info = getStorage('match_info', 'object')
      for (const k in this.query) {
        this.query[k] = match_info[k]
      }

      this.process = match_info.process
      this.is_share = match_info.is_share
    },
    submitForm() {
      updateJeopardyStatus(this.id, this.query).then(res => {
        const { data } = res
        if (data.success) {
          matchJeopardyInfo(this.$route.query.id).then(info => {
            setStorage('match_info', info.data)
            this.initData()
            this.$alert('修改成功', { confirmButtonText: '确定' })
          })
        } else {
          this.$alert('请求异常', '警告', { confirmButtonText: '确定' })
        }
      })
    },
    handleSwitch(key) {
      this.query.status = key
      this.submitForm()
    }
  }

}
</script>

<style scoped>
  .fcenter {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
