<template>
  <div class="app-container">
    <el-form label-width="130px">
      <el-form-item label="是否显示排名">
        <el-switch v-model="query.public_rank" @change="submitForm"/>
        &nbsp;提示:开启后选手能看到排行榜, 关闭后选手看不到排行榜
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { updateStatus, matchStatus, initSence } from '@/api/match/realWord'

export default {
  name: 'MatchStatus',
  data() {
    return {
      id: this.$route.query.id,
      process: 1,
      competition_type: 1, // 1商业 2xctf
      query: {
        // can_submit_writeup: true,//测试文档提交
        status: 1, // 比赛控制
        process: 0,
        public_rank: true, // 是否显示排名
        use_vis: false
        // delivery: 0, // 开启题目讨论
        // replay_start_time: '',
        // replay_end_time: '',
        // is_replay: 0
      },
      hash: this.$route.query['hash']

    }
  },
  created() {
    this.getList()
  },
  methods: {
    initSence() { // 场景初始化
      initSence(this.hash).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    getList() {
      matchStatus(this.hash).then(res => {
        for (const key in this.query) {
          this.query[key] = res.data[key]
        }
        this.id = res.data.id
        this.process = res.data.process
      })
    },
    submitForm() {
      updateStatus(this.hash, this.query).then(res => {
        const { data } = res
        if (data.success) {
          this.$alert('修改成功', { confirmButtonText: '确定' })
          this.getList()
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
