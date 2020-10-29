<template>
  <div class="app-container">
    <el-form label-width="190px">
      <el-form-item label="是否显示排名">
        <el-switch
          v-model="query.public_rank"
          :active-value="1"
          :inactive-value="0"
          @change="submitForm"
        />
        <span style="margin-left: 20px">提示:开启后选手能看到排行榜, 关闭后选手看不到排行榜</span>
      </el-form-item>

      <el-form-item label="是否开放上传WP">
        <el-switch
          v-model="query.can_submit_writeup"
          :active-value="1"
          :inactive-value="0"
          @change="submitForm"
        />
      </el-form-item>

      <!-- <el-form-item label="态势状态">{{
        use_vis ? "开启" : "关闭"
      }}</el-form-item> -->

      <!-- <el-form-item label="题目环境">独享</el-form-item> -->

      <el-form-item label="态势展示">
        <a
          :href="sisdk"
          download
        >
          <el-button
            type="warning"
            size="mini"
          >客户端下载</el-button>
        </a>
        <el-button
          type="success"
          size="mini"
          @click="initSence"
        >场景初始化</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getShow, editShow, initSencejad } from '@/api/match/jeopardy'

export default {
  name: 'MatchStatus',
  data() {
    return {
      params: {
        evt_hash: this.$route.query.hash
      },
      query: {
        can_submit_writeup: 1,
        public_rank: 1 // 是否显示排名
      },
      // use_vis: true,
      sisdk: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    initSence() {
      // 场景初始化
      this.$confirm('确定要场景初始化吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          initSencejad(this.params).then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消初始化'
          })
        })
    },
    getList() {
      getShow(this.params).then(info => {
        for (const k in this.query) {
          this.query[k] = info.data.data[k]
        }
        // this.use_vis = info.data.data.use_vis;
        this.sisdk = info.data.data.sisdk
      })
    },
    submitForm() {
      editShow(this.params, this.query).then(res => {
        const { data } = res
        if (data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
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
</style>
