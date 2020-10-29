<template>
  <div class="app-container">
    <el-form label-width="190px">
      <el-form-item label="竞赛状态">
        <span v-if="matchInfo.process===1">未开始</span>
        <span v-if="matchInfo.process===0">
          {{ matchStatus[matchInfo.status] }}
        </span>
        <span v-if="matchInfo.process===2">已结束</span>
      </el-form-item>

      <!--<el-form-item label="作弊禁赛时长">-->
      <!--30分钟-->
      <!--</el-form-item>-->

      <!-- <el-form-item label="VPN开关">
        <el-switch v-model="query.vpn_status" :active-value="1" :inactive-value="0" @change="submitForm"/>
      </el-form-item> -->
      <el-form-item
        v-if="event_mode==1"
        label="VPN部署"
      >
        <el-button
          v-if="matchInfo.vpn_deploy_status == 1"
          type="success"
          size="mini"
          @click="handlevpnDeploy"
        >部署</el-button>
        <el-button
          v-if="matchInfo.vpn_deploy_status != 1"
          type="danger"
          size="mini"
          @click="handleRemovevpnDeploy"
        >回收</el-button>
        <el-switch
          v-if="matchInfo.vpn_deploy_status != 1"
          v-model="matchInfo.vpn_join"
          @change="vpnfun()"
        />
        <el-button
          v-if="matchInfo.vpn_deploy_status == 2"
          type="primary"
          size="mini"
          @click="handleApply"
        >申请证书</el-button>
      </el-form-item>

      <el-form-item label="竞赛控制">
        <span v-if="process==1">
          <el-button
            v-if="query.status==2"
            type="success"
            size="mini"
            @click="taskControl('开始比赛')"
          >开始比赛</el-button>
          <span v-else>未开始</span>
        </span>
        <span v-else-if="process==0">
          <!--{{ query.status==3? '进行中':'暂停中' }}-->
          <el-button
            v-show="query.status==2"
            type="success"
            size="mini"
            @click="handleSwitch(1,'继续比赛')"
          >继续比赛</el-button>
          <el-button
            v-show="query.status==3"
            type="danger"
            size="mini"
            @click="handleSwitch(2,'暂停比赛')"
          >暂停比赛</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="taskControl('结束比赛')"
          >结束比赛</el-button>
        </span>
        <span v-else>已结束</span>

      </el-form-item>

      <el-form-item label="网络控制">
        <el-button
          type="danger"
          size="mini"
          @click="initNet"
        >初始化网络</el-button>
        &nbsp;竞赛开始前，一定要先初始化网络，否则无法正常比赛。
      </el-form-item>

      <el-form-item label="竞赛数据管理">
        <el-button
          type="danger"
          size="mini"
          @click="clearData"
        >清除比赛数据</el-button>
        <el-button
          type="danger"
          size="mini"
          @click="initFictitious"
        >初始化虚拟数据</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  updateJeopardyStatus,
  matchJeopardyInfo,
  clearData,
  initNet,
  initFictitious,
  fetchJeopardyInfo
} from '@/api/match/jeopardy'
import {
  vnpDeploy,
  vpnCaDeploy,
  controlJoin,
  removeDeploy
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
      matchStatus,
      id: this.$route.query.id,
      hash: this.$route.query.hash,
      matchInfo: {},
      process: '',
      is_share: '',
      query: {
        vpn_status: 1,
        status: 1 // 比赛控制
      },
      event_mode: '' // 比赛形式 1线上 2线下
    }
  },
  created() {
    this.getList()
    fetchJeopardyInfo(this.$route.query.id).then(res => {
      this.event_mode = res.data.event_mode
    })
  },
  methods: {
    // 回收
    handleRemovevpnDeploy() {
      // 确定回收VPN吗
      this.$confirm('确定回收VPN吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeDeploy(this.$route.query.id).then(res => {
          if (res.data.success) {
            this.$message.success('回收成功')
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
    // 部署
    handlevpnDeploy() {
      vnpDeploy(this.$route.query.id).then(res => {
        if (res.data.success) {
          this.$message.success('部署成功')
          // 暂时将vpn_deploy_status随便置成一个值，防止重复点击部署按钮
          this.matchInfo.vpn_deploy_status = false
          this.getList()
        }
      })
    },
    // 申请证书
    handleApply() {
      vpnCaDeploy(this.$route.query.id).then(res => {
        if (res.data.success) {
          this.$message.success('证书申请成功')
          this.getList()
        }
      })
    },
    vpnfun() {
      controlJoin(this.$route.query.id, this.matchInfo.vpn_status).then(res => {
        if (res.data.success) {
          this.getList()
        }
      })
      // vpnstatus(this.$route.query.id, {
      //   action: this.matchInfo.vpn_status
      // }).then(res => {
      //   if (res.data.success) {
      //     this.$message.success("操作成功");
      //     this.getList();
      //   }
      // });
    },
    clearData() {
      this.$confirm('确定要清除比赛数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clearData({ evt_hash: this.hash }).then(res => {
            if (res.data.success) this.$message.success('操作成功')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          })
        })
    },
    initFictitious() {
      this.$confirm('确定要初始化虚拟数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          initFictitious({ event_id: this.id }).then(res => {
            if (res.data.success) this.$message.success('操作成功')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          })
        })
    },
    initNet() {
      // 初始化网络
      initNet(this.id).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
        }
      })
    },
    getList() {
      matchJeopardyInfo({ evt_hash: this.hash }).then(info => {
        for (const k in this.query) {
          this.query[k] = info.data.data[k]
        }
        this.matchInfo = info.data.data
        this.process = info.data.data.process
      })
    },
    submitForm() {
      updateJeopardyStatus({ evt_hash: this.hash }, this.query).then(res => {
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
          message: '已取消清除'
        })
      })
    },
    // 比赛控制
    taskControl(info) {
      this.$confirm(`确定要${info}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        if (info === '开始比赛') {
          data.start = 1
        } else {
          data.end = 1
        }
        updateJeopardyStatus({ evt_hash: this.hash }, data).then(res => {
          const { data } = res
          if (data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除'
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
