<template>
  <div class="app-container">
    <el-form label-width="130px">
      <el-form-item label="是否显示排名">
        <el-switch
          v-model="matchInfo.show_rank"
          :active-value="true"
          :inactive-value="false"
          @change="isShowRank"
        />
        <span style="margin-left:20px">提示:开启后选手能看到排行榜, 关闭后选手看不到排行榜</span>
      </el-form-item>
      <!-- <el-form-item label="root私钥下载">
        <a :href="'/api/v1/att_def/admin/operation/event_status_download/?event_id='+id" download>
          <el-button type="warning" size="mini" disabled>点击下载</el-button>
        </a>
      </el-form-item> -->
      <!--<el-form-item label="root私钥下载">-->
      <!--<a :href="'/api/v1/att_def/admin/operation/event_status_download/?event_id='+id" download>-->
      <!--<el-button type="warning" size="mini" disabled>点击下载</el-button>-->
      <!--</a>-->
      <!--</el-form-item>-->
      <el-form-item label="是否开放上传WP">
        <el-switch
          v-model="matchInfo.can_upload_writeup"
          @change="canUploadWP"
        />
      </el-form-item>
      <!-- <el-form-item label="态势状态">
        <el-switch
          v-model="matchInfo.use_vis"
          :active-value="true"
          :inactive-value="false"
          @change="defenseUse_vis"
        />
      </el-form-item> -->

      <el-form-item label="态势展示">
        <!-- <el-button type="success" size="mini" disabled>态势客户端下载</el-button> -->
        <a :href="matchInfo.vis_zip_path" download>
          <el-button type="warning" size="mini">客户端下载</el-button>
        </a>
        <el-button type="success" size="mini" @click="initSence">场景初始化</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getShow,
  canWP,
  canRank,
  initSence
} from '@/api/match/DevOps'

export default {
  name: 'MatchStatus',
  data() {
    return {
      id: this.$route.query.id,
      process: 1,
      competition_type: 1, // 1商业 2xctf
      params: { event_id: this.$route.query.id },
      matchInfo: {
        show_rank: 1,
        can_upload_writeup: 1
      }
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
          initSence(this.params).then((res) => {
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
    isShowRank(i) {
      // 是否展示排行榜
      canRank(this.params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    canUploadWP(i) {
      // 是否开放上传wp
      canWP(this.params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    getList() {
      getShow(this.params).then(res => {
        this.matchInfo = res.data.data
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
