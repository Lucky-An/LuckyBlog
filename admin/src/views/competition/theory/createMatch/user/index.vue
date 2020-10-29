<template>
  <div class="transfer_box">
    <el-transfer
      :titles="['所有选手', '参赛选手']"
      :props="{key: 'id',label: 'name'}"
      v-model="value"
      :data="data"
      filter-placeholder="请输入选手名称"
      filterable
    />
    <span style="color: red;font-size: 18px;margin-top: 20px;">如果竞赛信息有所更改，一定要先点击保存，否则修改的信息会丢失。</span>
    <div class="btn_box">
      <el-button
        type="primary"
        @click="backStep"
      >上一步</el-button>
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
      >保存</el-button>&nbsp;&nbsp;
      <!--<router-link to="/competition/theory/index"><el-button type="success">竞赛列表</el-button></router-link>-->
    </div>
  </div>

</template>

<script>
import { fetchUserList, submitUserList } from '@/api/match/theory'

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
      fetchUserList(this.hash).then(res => {
        this.data = res.data.teams
        this.value = res.data.team_ids
        // this.data.forEach(item => {
        //   item.tag = item.tag + " (" + item.user_count + ")";
        // });
      })
    },
    submitForm() {
      const team_ids = {
        ids: this.value
      }
      submitUserList(this.hash, team_ids).then(res => {
        if (res.data.success) {
          this.$router.push({ path: '/competition/theory/index' })
          this.$message.success('操作成功')
        }
      })
    },
    nextStep() {
      this.$emit('nextStep')
    },
    backStep() {
      this.$emit('backStep')
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

.btn_box {
  margin-top: 20px;
}
</style>
