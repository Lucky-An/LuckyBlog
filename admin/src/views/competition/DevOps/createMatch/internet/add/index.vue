<template>
  <div class="app-container create_internet">
    <el-form ref="ruleForm" :model="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item v-if="!internet_id" label="队伍数量" prop="name_zh">
        <el-input v-model.trim="teamNum" disabled="" placeholder="请输入竞赛名称"/>
      </el-form-item>
      <el-form-item :label="internet_id?'VLAN':'VLAN范围'" prop="name_zh">
        <el-input v-model.trim="ruleForm.vlan_start" style="width: 48%;" placeholder="例如：1050"/>
        <span v-if="!internet_id">
          --
          <el-input v-model.trim="ruleForm.vlan_start*1+teamNum*1-1" style="width: 48%;" disabled/>
        </span>

      </el-form-item>
      <el-form-item label="网络地址配置" prop="name_zh">
        <el-input v-model.trim="ruleForm.ip_start" placeholder="例如：10.20.1.20"/>
      </el-form-item>
      <el-form-item label="网络掩码配置" prop="name_zh">
        <el-input v-model.trim="ruleForm.mask" placeholder="例如：255.255.255.0"/>
      </el-form-item>
      <el-form-item label="网关统一配置" prop="name_zh">
        <el-input v-model.trim="ruleForm.gateway" placeholder="例如：10.20.1.254"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存 </el-button>
        <el-button type="warning" @click="goback()">返回 </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import { fetchTeamNum, addInternet, editInternet, fetchInternet } from '@/api/match/DevOps'

export default {
  components: {
    QuillEditor
  },
  data() {
    return {
      teamNum: 0,
      ruleForm: {
        vlan_start: '',
        ip_start: '',
        mask: '',
        gateway: ''
      },
      params: { event_id: this.$route.query.id },
      internet_id: this.$route.query.internet_id
    }
  },
  created() {
    this.getTeamNum()
    if (this.internet_id) {
      this.getInfo()
    }
  },
  methods: {
    getTeamNum() {
      fetchTeamNum(this.params).then(res => {
        this.teamNum = res.data.team_count
      })
    },
    getInfo() { // 获取网络详情
      const params = JSON.parse(JSON.stringify(this.params))
      params.id = this.internet_id
      fetchInternet(params).then(res => {
        const { data } = res
        this.ruleForm.vlan_start = data.vlan
        this.ruleForm.ip_start = data.ip
        this.ruleForm.mask = data.mask
        this.ruleForm.gateway = data.gateway
      })
    },
    goback() {
      this.$router.push({
        path: '/competition/DevOps/editMatch/editMatch',
        query: { id: this.params.event_id, step: 3 }
      })
    },
    onSubmit() {
      if (this.internet_id) {
        const params = JSON.parse(JSON.stringify(this.params))
        params.id = this.internet_id
        editInternet(params, this.ruleForm).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/competition/DevOps/editMatch/editMatch',
              query: { id: this.params.event_id, step: 3 }
            })
          }
        })
      } else {
        addInternet(this.params, this.ruleForm).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/competition/DevOps/editMatch/editMatch',
              query: { id: this.params.event_id, step: 3 }
            })
          }
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$message.error('输入信息有误')
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
</style>
