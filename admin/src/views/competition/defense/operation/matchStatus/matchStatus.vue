<template>
  <div class="app-container">
    <el-form label-width="130px">
      <el-form-item label="竞赛状态">
        {{ matchStatus[matchInfo.status] }}
      </el-form-item>

      <el-form-item v-if="event_mode == 1" label="VPN部署">
        <el-button
          v-if="matchInfo.vpn_deploy_status === 1"
          type="success"
          size="mini"
          @click="vnpDeploy"
        >部署</el-button
        >
        <el-button
          v-else
          type="danger"
          size="mini"
          @click="removeDeploy"
        >回收</el-button
        >
        <el-switch
          v-if="matchInfo.vpn_deploy_status !== 1"
          v-model="matchInfo.vpn_join"
          @change="vpnfun()"
        />
        <el-button
          v-if="matchInfo.vpn_deploy_status === 2"
          type="primary"
          size="mini"
          @click="vpnCaDeploy"
        >申请证书</el-button
        >

      </el-form-item>

      <el-form-item label="开始时间">
        <span>{{ matchInfo.start_time }}</span>
      </el-form-item>
      <el-form-item label="结束时间">
        <span>{{ matchInfo.end_time }}</span>
      </el-form-item>
      <!--  -->
      <el-form-item label="当前轮次">{{ matchInfo.round }}</el-form-item>

      <el-form-item label="回合结束时间">{{
        matchInfo.round_end_time
      }}</el-form-item>

      <el-form-item label="当前服务器时间">{{ matchInfo.time }}</el-form-item>

      <el-form-item label="比赛控制">
        <el-button
          v-show="matchInfo.status == 1 || matchInfo.status == 4"
          type="success"
          size="mini"
          @click="handleSwitch(0)"
        >开始比赛</el-button
        >
        <el-button
          v-show="matchInfo.status == 2"
          type="success"
          size="mini"
          @click="handleSwitch(2)"
        >恢复比赛</el-button
        >
        <el-button
          v-show="matchInfo.status == 3"
          type="warning"
          size="mini"
          @click="handleSwitch(1)"
        >暂停比赛</el-button
        >
        <el-button
          v-show="
            matchInfo.status != 1 &&
              matchInfo.status != 4 &&
              matchInfo.status != 0
          "
          type="danger"
          size="mini"
          @click="handleSwitch(3)"
        >结束比赛</el-button
        >
      </el-form-item>

      <el-form-item label="数据清理">
        <el-button
          type="danger"
          size="mini"
          @click="handleSwitch(4)"
        >初始化用户数据</el-button
        >
        <el-button
          type="danger"
          size="mini"
          @click="initVirtual"
        >初始化虚拟数据</el-button
        >
      </el-form-item>
      <el-form-item label="pushflag文件推送">
        <el-button
          type="success"
          size="mini"
          @click="pushflag"
        >立即执行</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  defenseIsShowRank,
  defenseUse_vis,
  fetchDefenseMatchStatus,
  defenseCanUpWP,
  defenseSureEditTime,
  defenseChangeStatus,
  initSence,
  initVirtual,
  // vpnstatus,
  fetchDefenseInfo,
  pushflag
} from '@/api/match/defense'

import {
  vnpDeploy,
  vpnCaDeploy,
  removeDeploy,
  controlJoin
} from '@/api/match/vpn'

export default {
  name: 'MatchStatus',
  data() {
    const matchStatus = {
      1: '未开始',
      2: '暂停中',
      3: '进行中',
      4: '已结束'
    }

    return {
      id: this.$route.query.id,
      matchStatus,
      process: 1,
      competition_type: 1, // 1商业 2xctf
      params: { event_id: this.$route.query.id },
      matchInfo: {},
      event_mode: '' // 比赛形式 1线上 2线下
    }
  },
  created() {
    this.getList()
    fetchDefenseInfo(this.$route.query.id).then((res) => {
      this.event_mode = res.data.event_mode
    })
  },
  methods: {
    // pushflag文件推送
    pushflag() {
      pushflag({ event_id: this.$route.query.id }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    removeDeploy() {
      // 确定回收VPN吗
      this.$confirm('确定回收VPN吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeDeploy(this.id).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消回收'
        })
      })
    },
    vnpDeploy() {
      vnpDeploy(this.id).then((res) => {
        if (res.data.success) {
          // 暂时将vpn_deploy_status随便置成一个值，防止重复点击部署按钮
          this.matchInfo.vpn_deploy_status = false
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },

    vpnCaDeploy() {
      vpnCaDeploy(this.id).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    vpnfun() {
      controlJoin(this.id).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
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
      fetchDefenseMatchStatus(this.params).then((res) => {
        this.matchInfo = res.data
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
      // 是否展示排行榜
      defenseCanUpWP(this.params, { writeup: i }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    // submitForm() {
    //   updateStatus(this.id, this.query).then((res) => {
    //     const { data } = res
    //     if (data.success) {
    //       matchInfo(this.$route.query.id).then((info) => {
    //         this.getList()
    //         this.$alert('修改成功', { confirmButtonText: '确定' })
    //       })
    //     } else {
    //       this.$alert('请求异常', '警告', { confirmButtonText: '确定' })
    //     }
    //   })
    // },
    handleSwitch(a) {
      this.$confirm('确定要执行该操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          defenseChangeStatus(this.params, { action: a }).then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
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
</style>
