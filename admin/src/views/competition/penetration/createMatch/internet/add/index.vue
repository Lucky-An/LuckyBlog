<template>

  <div class="app-container create_internet">

    <div v-if="!is_share||!internet_id" class="internet_box">
      <el-checkbox v-model="is_user_share">用户网络信息创建（每账号创建一个VLAN，用户题目环境网络地址与用户段地址处于相同的VLAN）</el-checkbox>
      <el-form ref="ruleForm" :model="ruleForm" label-width="130px" class="internet_form">
        <el-form-item v-if="!internet_id" :label="mode==1?'用户数量':'队伍数量'" prop="name_zh">
          <el-input.trim v-model="teamNum" disabled="" placeholder="请填写竞赛名称"/>
        </el-form-item>
        <el-form-item :label="internet_id?'VLAN':'VLAN范围'" prop="name_zh">
          <el-input :disabled="!is_user_share" v-model.trim="ruleForm.vlan" style="width: 48%;" placeholder="例如：1050"/>
          <span v-if="!internet_id">
            --
            <el-input.trim v-model.trim="ruleForm.vlan*1+teamNum*1-1" style="width: 48%;" disabled/>
          </span>

        </el-form-item>
        <el-form-item label="网络地址配置" prop="name_zh">
          <el-input :disabled="!is_user_share" v-model.trim="ruleForm.ip" placeholder="例如：10.20.1.20"/>
        </el-form-item>
        <el-form-item label="网络掩码配置" prop="name_zh">
          <el-input :disabled="!is_user_share" v-model.trim="ruleForm.mask" placeholder="例如：255.255.255.0"/>
        </el-form-item>
        <el-form-item label="网关统一配置" prop="name_zh">
          <el-input :disabled="!is_user_share" v-model.trim="ruleForm.gateway" placeholder="例如：10.20.1.254"/>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="is_share||!internet_id" class="internet_box">
      <el-checkbox v-model="senceForm._is_share">共享场景题目网络创建（竞赛中所有共享题目使用如下网络信息）</el-checkbox>
      <el-form ref="ruleForm" :model="ruleForm" label-width="130px" class="internet_form">
        <el-form-item label="VLAN" prop="name_zh">
          <el-input :disabled="!senceForm._is_share" v-model.trim="senceForm._vlan" placeholder="例如：1050"/>
        </el-form-item>
        <el-form-item label="网络地址配置" prop="name_zh">
          <el-input :disabled="!senceForm._is_share" v-model.trim="senceForm._ip" placeholder="例如：10.20.1.20"/>
        </el-form-item>
        <el-form-item label="网络掩码配置" prop="name_zh">
          <el-input :disabled="!senceForm._is_share" v-model.trim="senceForm._mask" placeholder="例如：255.255.255.0"/>
        </el-form-item>
        <el-form-item label="网关统一配置" prop="name_zh">
          <el-input :disabled="!senceForm._is_share" v-model.trim="senceForm._gateway" placeholder="例如：10.20.1.254"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="fcenter">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button type="warning" @click="goback()">返回</el-button>
    </div>

  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { fetchTeamNum, addInternet, pollingAdd, editInternet, fetchInternet, fetchInternetInfo, matchPenetrationInfo } from '@/api/match/penetration'

export default {
  components: {
  },
  data() {
    return {
      mode: null, // 1个人2组队
      is_share: false, // 编辑时候编辑的是用户还是场景
      is_user_share: true, // 用户是否填写
      teamNum: 0,
      ruleForm: {
        is_share: false,
        vlan: '',
        ip: '',
        gateway: '',
        mask: ''
      },
      senceForm: {
        _is_share: false,
        _vlan: '',
        _ip: '',
        _gateway: '',
        _mask: ''
      },
      id: this.$route.query.id,
      internet_id: this.$route.query.internet_id,
      timer: null,
      num: 0,
      loadingId: null// 存储loadingID
    }
  },
  created() {
    matchPenetrationInfo(this.$route.query.id).then(info => {
      this.mode = info.data.mode
    })
    this.getTeamNum()
    if (this.internet_id) {
      this.getInfo()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    goback() {
      this.$router.push({
        path: '/competition/penetration/editMatch/editMatch',
        query: { id: this.id, step: 3 }
      })
    },
    getTeamNum() {
      fetchTeamNum(this.id).then(res => {
        this.teamNum = res.data.groups
      })
    },
    getInfo() { // 获取网络详情
      fetchInternetInfo(this.id, this.internet_id).then(res => {
        const { data } = res
        this.is_share = data._is_share
        if (!data._is_share) {
          for (const key in this.ruleForm) {
            this.ruleForm[key] = data[key]
          }
        } else {
          for (const key in this.senceForm) {
            this.senceForm[key] = data[key]
          }
        }
      })
    },
    onSubmit() {
      if (this.internet_id) {
        if (!this.is_share) { // 编辑的是用户还是环境
          editInternet(this.id, this.internet_id, this.ruleForm).then(res => {
            if (res.data.success) {
              this.$router.push({
                path: '/competition/penetration/editMatch/editMatch',
                query: { id: this.id, step: 3 }
              })
            }
          })
        } else {
          editInternet(this.id, this.internet_id, this.senceForm).then(res => {
            if (res.data.success) {
              this.$router.push({
                path: '/competition/penetration/editMatch/editMatch',
                query: { id: this.id, step: 3 }
              })
            }
          })
        }
      } else {
        let data = {}

        if (this.senceForm._is_share) {
          data = this.senceForm
        }
        if (this.is_user_share) {
          data = this.ruleForm
        }

        // 如果下面的场景环境勾选了，那么将两个对象合并在一起。
        if (this.is_user_share && this.senceForm._is_share) {
          for (const key in this.senceForm) {
            this.ruleForm[key] = this.senceForm[key]
          }
        }
        // 添加网络的方法。
        addInternet(this.id, data).then(res => {
          if (res.data.success) {
            if (res.data.status === 'creating') {
              this.loadingId = Loading.service({
                lock: true,
                text: '网络创建中，请稍后',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              this.timer = setInterval(() => {
                this.pollingAdd(res.data.id)
              }, 1000)
            }
          }
        })
      }
    },
    pollingAdd(id) {
      pollingAdd(id).then(res => {
        if (res.data.success) {
          this.num++
          // 大于5分钟则超时
          if (this.num > 300) {
            clearInterval(this.timer)
            this.num = 0
            this.$message.error('创建失败')
            this.loadingId.close()
          }
          // 创建成功
          if (res.data.status === 'created') {
            clearInterval(this.timer)
            this.loadingId.close()
            this.$router.push({
              path: '/competition/penetration/editMatch/editMatch',
              query: { id: this.id, step: 3 }
            })
          }
        } else {
          clearInterval(this.timer)
          this.loadingId.close()
          this.num = 0
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.is_user_share && !this.senceForm._is_share) {
            this.$message.error('请至少选择一项')
            return
          }
          this.onSubmit()
        } else {
          this.$message.error('填写信息有误')
          return false
        }
      })
    }
  }
}
</script>

<style>
  .create_internet {
    width: 60%;
    min-width: 600px;
    margin: 0 auto;
  }

  .create_internet .te-switch-button {
    vertical-align: top;
  }

  .internet_box {
    padding: 10px 20px;
    border: 1px solid #d3d3d3;
    margin-top: 20px;
  }

  .internet_form {
    margin-top: 20px;
  }
  .fcenter{
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
