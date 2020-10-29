<template>
  <div class="app-container match_devops_wrapper">
    <el-form label-width="120px">
      <el-form-item label="竞赛状态">
        <span v-if="formData.process === 1">未开始</span>
        <span v-if="formData.process === 0">
          {{ matchStatus[formData.status] }}
        </span>
        <span v-if="formData.process === 2">已结束</span>
      </el-form-item>

      <el-form-item v-if="formData.event_mode == 1" label="VPN部署">
        <el-button
          v-if="formData.vpn_deploy_status == 1"
          type="success"
          size="mini"
          @click="handlevpnDeploy"
        >部署
        </el-button
        >
        <el-button
          v-if="formData.vpn_deploy_status != 1"
          type="danger"
          size="mini"
          @click="handleRemovevpnDeploy"
        >回收
        </el-button
        >
        <el-switch
          v-if="formData.vpn_deploy_status != 1"
          v-model="formData.vpn_join"
          @change="vpnfun()"
        />
        <el-button
          v-if="formData.vpn_deploy_status == 2"
          type="primary"
          size="mini"
          @click="handleApply"
        >申请证书
        </el-button
        >
      </el-form-item>

      <el-form-item label="场景部署">
        <el-button
          v-if="progressData.status === 1"
          type="danger"
          size="mini"
          @click="handleDestroy"
        >资源回收
        </el-button
        >
        <span v-else-if="progressData.status === 3">部署中</span>
        <el-button
          v-else
          type="primary"
          size="mini"
          @click="handleDeploy"
        >开始部署
        </el-button
        >
      </el-form-item>

      <el-form-item label="实体设备部署">
        <el-button
          v-if="formData.entity_status"
          type="danger"
          size="mini"
          @click="handlePhysical(0)"
        >资源回收
        </el-button
        >
        <el-button
          v-else
          type="primary"
          size="mini"
          @click="handlePhysical(1)"
        >开始部署
        </el-button
        >
      </el-form-item>

      <el-form-item label="开始时间">
        {{ formData.start_time }}
      </el-form-item>

      <el-form-item label="结束时间">
        {{ formData.end_time }}
      </el-form-item>

      <el-form-item label="网络规则控制">
        <el-button
          type="primary"
          size="mini"
          @click="intRuleControl"
        >重新下发
        </el-button
        >
        &nbsp;&nbsp;<span style="color: #696969">如果场景部署过程下发的网络规则出现异常，请点击重新下发按钮重置网络规则解决故障。</span>
      </el-form-item>

      <el-form-item label="Flag推送控制">
        <el-button
          type="primary"
          size="mini"
          @click="flagControl"
        >立即执行
        </el-button
        >
      </el-form-item>

      <!-- <el-form-item label="VPN开关">
        <el-switch
          v-model="vpn"
          :active-value="1"
          :inactive-value="0"
          @change="changeVpn"
        />
      </el-form-item> -->

      <el-form-item label="比赛控制">
        <template v-if="formData.status === 3">
          <el-button
            type="warning"
            size="mini"
            @click="handleOperation(1,'暂停比赛')"
          >暂停
          </el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="handleOperation(3,'结束比赛')"
          >结束
          </el-button
          >
        </template>

        <el-button
          v-else-if="formData.status === 2"
          type="primary"
          size="mini"
          @click="handleOperation(2,'恢复比赛')"
        >恢复
        </el-button
        >
        <el-button
          v-else-if="formData.status === 4 || formData.status === 1"
          type="primary"
          size="mini"
          @click="handleOperation(0,'开始比赛')"
        >开始
        </el-button
        >
      </el-form-item>

      <el-form-item label="数据清理">
        <el-button
          type="danger"
          size="mini"
          @click="handleOperation(4,'初始化数据')"
        >初始化
        </el-button
        >
      </el-form-item>

      <el-form-item label="部署进度">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="progressData.progress"
          style="width: 70%; display: inline-block"
          status="success"
        />
      </el-form-item>
    </el-form>
    <div v-if="progressData.message.length > 0" class="info">
      <p v-for="item in progressData.message" :key="item">{{ item }}</p>
    </div>
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import {
  fetchPenetrationInfo,
  sceneDeploy,
  sceneDestroy,
  eventControl,
  deployProgress,
  flagControl,
  intRuleControl,
  changeVpn,
  destroyPhysical,
  deployPhysical
} from '@/api/match/penetration'
import {
  vnpDeploy,
  vpnCaDeploy,
  controlJoin,
  removeDeploy
} from '@/api/match/vpn'

export default {
  name: 'MatchStatus',

  components: {
    QuillEditor
  },

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
      formData: {
        process: '',
        start_time: '',
        end_time: '',
        deploy_status: '',
        status: '',
        event_mode: '',
        vpn_status: '',
        vpn_deploy_status: '',
        vpn_join: '',
        entity_status: ''
      },
      progressData: {
        message: [],
        status: '',
        progress: 0
      },
      timer: null,
      vpn: 1 // vpn开关
    }
  },

  computed: {
    description: {
      get() {
        return this.progressData.message.join('\n')
      },
      set(val) {
        if (val) {
          this.progressData.message = val.split('\n')
        } else {
          this.progressData.message = []
        }
      }
    }
  },
  created() {
    this.getList()
  },

  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
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
        removeDeploy(this.$route.query.id).then((res) => {
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
      vnpDeploy(this.$route.query.id).then((res) => {
        if (res.data.success) {
          // 暂时将vpn_deploy_status随便置成一个值，防止重复点击部署按钮
          this.matchInfo.vpn_deploy_status = false
          this.$message.success('部署成功')
          this.getList()
        }
      })
    },
    // 申请证书
    handleApply() {
      vpnCaDeploy(this.$route.query.id).then((res) => {
        if (res.data.success) {
          this.$message.success('证书申请成功')
          this.getList()
        }
      })
    },
    vpnfun() {
      controlJoin(this.$route.query.id, this.formData.vpn_status).then(
        (res) => {
          if (res.data.success) {
            this.getList()
          }
        }
      )
    },
    // 监听vpn状态
    changeVpn(val) {
      changeVpn({ event_id: this.id }, { action: val }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
        }
        this.getList()
      })
    },
    // flag推送控制
    flagControl() {
      flagControl({ event_id: this.id }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
        }
      })
    },
    // 网络规则控制
    intRuleControl() {
      intRuleControl({ event_id: this.id }).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
        }
      })
    },
    getList() {
      fetchPenetrationInfo(this.id).then((res) => {
        const { data } = res
        for (const key in this.formData) {
          this.formData[key] = data[key]
        }

        if (data.deploy_status == 1) {
          this.progressData.progress = data.progress
        }
        this.progressData.status = data.deploy_status
      })
    },

    handleOperation(action, info) {
      this.$confirm(`确定要${info}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          eventControl({ event_id: this.id }, { action }).then((res) => {
            this.handleRes(res, () => {
              this.getList()
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 获取进度
    getProgress() {
      const query = {
        event_id: this.id
      }
      deployProgress(query).then((res) => {
        const { data } = res
        if (data.success) {
          for (const key in this.progressData) {
            this.progressData[key] = data[key]
          }
          if (data.progress >= 100) {
            clearInterval(this.timer)
            this.getList()
          }
        }
      })
    },

    progressInterval() {
      this.getProgress()
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.getProgress()
      }, 5000)
    },
    // 部署
    handleDeploy() {
      const query = {
        event_id: this.id
      }
      sceneDeploy(query).then((res) => {
        this.handleRes(res, this.progressInterval)
      })
    },
    // 回收
    handleDestroy() {
      sceneDestroy({
        event_id: this.id
      }).then((res) => {
        this.handleRes(res, this.progressInterval)
      })
    },

    handleRes(res, func) {
      const { data } = res
      if (data.success) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        if (func) func()
      }
    },

    handlePhysical(type) {
      const params = {
        event_id: this.id
      }
      const func = type ? deployPhysical : destroyPhysical
      func(params).then(({ data }) => {
        if (data.success) {
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .match_devops_wrapper {
    .el-form {
      margin: 0 auto;
      width: 80%;

      .el-form-item__label {
        text-align: left;
      }
    }

    .markdown_box {
      margin: 0 auto;
      width: 80%;
    }

    .info {
      margin: 0 auto;
      width: 80%;
      padding: 10px;
      border: 1px solid #d3d3d3;

      p {
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
  }
</style>
