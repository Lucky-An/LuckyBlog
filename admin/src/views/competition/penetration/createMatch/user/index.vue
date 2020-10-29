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
      <el-button type="primary" @click="backStep">上一步</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
import {
  fetchPenetrationTeamList,
  submitPenetrationTeamList
} from '@/api/match/penetration'

export default {
  data() {
    return {
      data: [],
      value: [],
      id: this.$route.query.id
    }
  },
  created() {
    this.getTeamList()
  },
  methods: {
    getTeamList() {
      fetchPenetrationTeamList({
        event_id: this.id
      }).then((res) => {
        const { data } = res
        this.data = data.teams
        this.value = data.team_ids
        // this.data.forEach(item=>{
        //   item.tag=item.tag+" ("+item.user_count+")"
        // })
      })
    },
    submitForm() {
      const team_ids = {
        ids: this.value
      }
      submitPenetrationTeamList(
        {
          event_id: this.id
        },
        team_ids
      ).then((res) => {
        if (res.data.success) {
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
