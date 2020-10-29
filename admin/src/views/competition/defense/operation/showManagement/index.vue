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
      <el-form-item label="是否开放上传WP">
        <el-switch
          v-model="matchInfo.can_upload_writeup"
          :active-value="true"
          :inactive-value="false"
          @change="canUploadWP"
        />
      </el-form-item>
      <el-form-item label="态势展示">
        <!-- <el-button type="success" size="mini" disabled>查看</el-button> -->
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
  defenseIsShowRank,
  defenseUse_vis,
  fetchDefenseMatchShowPanel,
  defenseCanUpWP,
  defenseSureEditTime,
  defenseChangeStatus,
  initSence,
  initVirtual
} from '@/api/match/defense'

export default {
  name: 'MatchStatus',
  data() {
    return {
      id: this.$route.query.id,
      process: 1,
      competition_type: 1, // 1商业 2xctf
      params: { event_id: this.$route.query.id },
      matchInfo: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    initVirtual() {
      // 初始化虚拟数据
      this.$confirm('确定要初始化虚拟数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          initVirtual(this.params).then((res) => {
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
    sureEdit() {
      // 确认修改回合时间
      defenseSureEditTime(this.params, {
        time: this.matchInfo.round_time
      }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    getList() {
      // 初始化数据
      fetchDefenseMatchShowPanel(this.params).then((res) => {
        this.matchInfo = res.data.data
      })
    },
    defenseUse_vis(i) {
      // 是否展示态势状态
      defenseUse_vis(this.params, { use_vis: i }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    isShowRank(i) {
      // 是否展示排行榜
      defenseIsShowRank(this.params, { show_rank: i }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    canUploadWP(i) {
      // 是否开放上传wp
      defenseCanUpWP(this.params, { writeup: i }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    }
    // submitForm() {
    //   updateStatus(this.id, this.query).then((res) => {
    //     const { data } = res;
    //     if (data.success) {
    //       matchInfo(this.$route.query.id).then((info) => {
    //         this.getList();
    //         this.$alert("修改成功", { confirmButtonText: "确定" });
    //       });
    //     } else {
    //       this.$alert("请求异常", "警告", { confirmButtonText: "确定" });
    //     }
    //   });
    // },
    // handleSwitch(a) {
    //   if (a === 4) {
    //     this.$confirm("确定要初始化用户数据吗？", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     })
    //       .then(() => {
    //         defenseChangeStatus(this.params, { action: a }).then((res) => {
    //           if (res.data.success) {
    //             this.$message.success("操作成功");
    //             this.getList();
    //           }
    //         });
    //       })
    //       .catch(() => {
    //         this.$message({
    //           type: "info",
    //           message: "已取消初始化",
    //         });
    //       });
    //   } else {
    //     defenseChangeStatus(this.params, { action: a }).then((res) => {
    //       if (res.data.success) {
    //         this.$message.success("操作成功");
    //         this.getList();
    //       }
    //     });
    //   }
    // },
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
