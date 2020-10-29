<template>
  <div class="app-container systemConfig">
    <div class="transfer_box">
      <el-transfer
        :titles="['已公开比赛', '已选竞赛']"
        :props="{key: 'id',label: 'name_zh'}"
        v-model="ids"
        :data="data"
        filterable/>
      <span style="color: red;font-size: 18px;margin-top: 20px;">如果信息所更改，一定要先点击保存，否则修改的信息会丢失。</span>
      <div class="btn_box">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
      <div class="path">
        <p>竞赛观摩地址：<a :href="path + 'vhdsufvgsduigdsugvguisdgvusidviusdv'" target="_blank">{{ path + 'vhdsufvgsduigdsugvguisdgvusidviusdv' }}</a></p>
        <p class="notes">注：复制此链接，可以跳转到观摩页面，该链接不需要登录。</p>
      </div>
    </div>

  </div>
</template>

<script>
import { getAllMatch, submitMatch } from '@/api/systemManage'

export default {
  data() {
    return {
      data: [],
      ids: [],
      path: ''
    }
  },
  created() {
    this.getPath()
    this.getTeamList()
  },
  methods: {
    getPath() {
      this.path = window.location.origin + '/#/watch'
    },
    getTeamList() {
      getAllMatch().then(res => {
        this.data = res.data.rows
        this.ids = res.data.ids
      })
    },
    submitForm() {
      const team_ids = {
        ids: this.ids
      }
      submitMatch(team_ids).then(res => {
        if (res.data.success) {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>

<style scoped>
  .path{
    margin-top: 20px;
  }
  .path p{
    margin: 10px 0px;
  }
  .path a{
    color: blue;
    text-decoration: underline;
  }
  .path .notes{
    color: #818181;
    font-size: 15px;
  }
  .transfer_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .btn_box {
    margin-top: 20px;
  }
</style>
