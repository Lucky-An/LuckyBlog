<template>
  <div class="app-container">
    <el-form label-width="130px">
      <el-form-item label="排行榜">
        &nbsp;&nbsp;
        <a
          :href="'/#/rw/ranking?id=' + id + '&hash=' + hash + '&type=6'"
          target="_blank"
        >
          <el-button type="success" size="mini">查看</el-button>
        </a>
      </el-form-item>

      <el-form-item label="竞赛状态">
        <span class="text_wrapper">
          {{ matchStatusList[process] }}
        </span>
      </el-form-item>

      <el-form-item label="竞赛控制">
        <span v-if="process == 1" class="text_wrapper">未开始</span>
        <span v-else-if="process == 2" class="text_wrapper">已结束</span>
        <span v-else-if="process == 0">
          <span v-if="process == 1">未开始</span>
          <span v-else-if="process == 0">
            &nbsp;&nbsp;
            <el-button
              v-if="query.status == 2"
              type="success"
              size="mini"
              @click="handleSwitch(1,'继续比赛')"
            >继续比赛</el-button>
            <el-button
              v-if="query.status == 1"
              type="danger"
              size="mini"
              @click="handleSwitch(2,'暂停比赛')"
            >暂停比赛</el-button>
          </span>
        </span>
      </el-form-item>
      <!-- <el-form-item label="竞赛数据管理"
        >&nbsp;&nbsp;
        <el-button type="danger" size="mini" @click="clearData"
          >清空比赛数据</el-button
        >
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import {
  updateStatus,
  matchStatus,
  initSence,
  clearData
} from '@/api/match/realWord'

export default {
  name: 'MatchStatus',
  data() {
    const matchStatusList = ['进行中', '未开始', '已结束']
    return {
      matchStatusList,
      id: this.$route.query.id,
      process: 1,
      competition_type: 1, // 1商业 2xctf
      query: {
        status: 1, // 比赛控制
        process: 0,
        public_rank: true, // 是否显示排名
        use_vis: false
      },
      hash: this.$route.query['hash']
    }
  },
  created() {
    this.getList()
  },
  methods: {
    initSence() {
      // 场景初始化
      initSence(this.hash).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    clearData() {
      this.$confirm('确认清除比赛数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clearData(this.$route.query.hash).then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getList() {
      matchStatus(this.hash).then((res) => {
        for (const key in this.query) {
          this.query[key] = res.data[key]
        }
        this.id = res.data.id
        this.process = res.data.process
      })
    },
    submitForm() {
      updateStatus(this.hash, this.query).then((res) => {
        const { data } = res
        if (data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    handleSwitch(key, info) {
      this.$confirm(`确定要${info}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.query.status = key
        this.submitForm()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
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
.text_wrapper {
  margin-left: 15px;
}
</style>
