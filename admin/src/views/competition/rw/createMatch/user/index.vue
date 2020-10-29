<template>
  <div class="transfer_box">
    <el-transfer
      :titles="['所有选手', '参赛选手']"
      v-model="value"
      :data="data"
      filterable/>
    <span style="color: red;font-size: 18px;margin-top: 20px;">如果竞赛信息有所更改，一定要先点击保存，否则修改的信息会丢失。</span>
    <div class="btn_box">
      <el-button type="primary" @click="backStep">上一步</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>

</template>

<script>
import { getMatchTeam, submitMatchTeam } from '@/api/match/realWord'

export default {
  data() {
    return {
      data: [],
      value: [],
      hash: this.$route.query.hash
    }
  },
  created() {
    this.getTeamList()
  },
  methods: {
    getTeamList() {
      getMatchTeam(this.hash,).then(res => {
        this.data = res.data.teams
        this.value = res.data.team_ids
      })
    },
    submitForm() {
      const team_ids = {
        team_ids: this.value
      }
      submitMatchTeam(this.hash, team_ids).then(res => {
        if (res.data.success) {
          this.$message.success('添加成功')
        }
      })
    },
    nextStep() {
      this.$emit('nextStep',)
    },
    backStep() {
      this.$emit('backStep',)
    }
  }
}
</script>

<style scoped>
  .transfer_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .btn_box{
    margin-top: 20px;
  }
</style>
