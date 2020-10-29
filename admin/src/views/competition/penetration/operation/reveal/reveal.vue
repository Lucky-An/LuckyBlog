<template>
  <!-- 展示管理 -->
  <div class="revealContainer">
    <el-form
      ref="form"
      :model="formData"
      label-width="200px"
    >

      <el-form-item label="是否显示排名">
        <el-switch
          v-model="formData.showRank"
          @change="rankChange"
        />
      </el-form-item>

      <el-form-item label="是否显示趋势">
        <el-switch
          v-model="formData.showRank"
          @change="trendChange"
        />
      </el-form-item>

      <el-form-item label="是否开放上传WP">
        <el-switch
          v-model="formData.openUploadWP"
          @change="WpChange"
        />
      </el-form-item>
      <el-form-item label="态势展示">
        <a
          :href="vis_path"
          download
        >
          <el-button
            v-waves
            class="filter-item"
            size="mini"
            type="warning"
          >客户端下载
          </el-button>
        </a>
        <el-button type="success" size="mini" @click="initSence">场景初始化</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import {
  httpGetOperationData,
  httpPostShowRank,
  httpPostWriteUp,
  initSence
} from '@/api/match/penetration'
export default {
  name: 'Reveal',
  directives: { waves },
  components: {},
  data() {
    return {
      params: { event_id: this.$route.query.id },
      formData: {
        showRank: false,
        openUploadWP: false
      },
      vis_path: ''
    }
  },
  created() {
    httpGetOperationData({ event_id: this.$route.query.id }).then((res) => {
      this.formData.showRank = res.data.show_rank
      this.vis_path = res.data.vis_path
      this.formData.openUploadWP = res.data.can_upload_writeup
    })
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
          initSence(this.params).then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              httpGetOperationData({ event_id: this.$route.query.id }).then((res) => {
                this.formData.showRank = res.data.show_rank
                this.vis_path = res.data.vis_path
                this.formData.openUploadWP = res.data.can_upload_writeup
              })
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
    // 排名切换
    rankChange() {
      httpPostShowRank({ event_id: this.$route.query.id }).then((res) => {})
    },
    // 排名切换
    trendChange() {

    },
    // WP切换
    WpChange() {
      httpPostWriteUp({ event_id: this.$route.query.id }).then((res) => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
.revealContainer {
  height: 500px;
}
</style>
