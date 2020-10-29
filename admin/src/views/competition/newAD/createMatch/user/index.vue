<template>
  <div class="transfer_box">
    <el-transfer
      :titles="['所有选手', '参赛选手']"
      :props="{key: 'id',label: 'name'}"
      v-model="value"
      :data="data"
      :render-content="renderFunc"
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
import { fetchDefenseTeamList, submitDefenseTeamList } from '@/api/match/newAD'

export default {
  data() {
    return {
      data: [],
      value: [],
      id: this.$route.query.id,
      join_mode: 1
    }
  },
  created() {
    this.getTeamList()
  },
  methods: {
    getTeamList() {
      const params = { event_id: this.id }
      fetchDefenseTeamList(params).then((res) => {
        const { teams, team_ids = [], join_mode } = res.data
        this.join_mode = join_mode
        this.data = teams
        this.value = team_ids
        // team_ids.forEach((team_item) => {
        //   this.data.forEach((item) => {
        //     if (team_item == item.event_competitor_id) {
        //       this.value.push(item.id)
        //     }
        //   })
        // })
      })
    },
    submitForm() {
      const team_ids = {
        ids: this.value
      }
      const params = { event_id: this.id }
      submitDefenseTeamList(params, team_ids).then((res) => {
        if (res.data.success) {
          this.$message.success('添加成功')
        }
      })
    },
    nextStep() {
      this.$emit('nextStep')
    },
    backStep() {
      this.$emit('backStep')
    },

    renderFunc(h, option) {
      if (this.join_mode === 2) {
        return (
          <span>
            {option.name}
          </span>
        )
      } else {
        return <span>{option.name}</span>
      }
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
