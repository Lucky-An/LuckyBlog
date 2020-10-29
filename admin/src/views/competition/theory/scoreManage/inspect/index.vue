<template>
  <div class="inspect">
    <div class="goBack">
      <el-button v-waves class="filter-item" type="warning" @click="goBack">
        返回
      </el-button>
    </div>
    <paper
      :judge-list.sync="judgeList"
      :check-box-list.sync="checkBoxList"
      :radio-list.sync="radioList"
      :judge-score="judgeScore"
      :radio-score="radioScore"
      :check-box-score="checkBoxScore"
      :sum_score="sum_score"
      :username="username"
      :edit="false"
      :show-user="true"
    />
  </div>

</template>

<script>
import waves from '@/directive/waves'
import { inspect, fetchJeopardyInfo } from '@/api/match/theory'
import paper from '@/views/competition/theory/common/paper'

export default {
  name: 'Index',
  directives: { waves },
  components: {
    paper
  },
  data() {
    return {
      judgeList: [], // 判断题列表
      radioList: [], // 单选题列表
      checkBoxList: [], // 多选题列表
      judgeScore: 0, // 多选题列表
      radioScore: 0, // 多选题列表
      checkBoxScore: 0, // 多选题列表
      username: '', // 用户名称
      sum_score: 0
    }
  },
  created() {
    inspect(this.$route.query.hash, this.$route.query.id).then(res => {
      this.radioList = res.data[1]
      this.judgeList = res.data[3]
      this.checkBoxList = res.data[2]
      // 获取总分
      this.getSore(this.judgeList, 'judgeScore')
      this.getSore(this.radioList, 'radioScore')
      this.getSore(this.checkBoxList, 'checkBoxScore')
      this.sum_score = res.data.sum_score
      this.username = res.data.username
    })

    // 获取比赛信息用以展示在面包屑
    if (this.$route.query.hash) {
      fetchJeopardyInfo(this.$route.query.hash).then(res => {
        this.$store.dispatch('changeMatchName', res.data.name_zh)
      })
    }
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    goBack() {
      history.back()
    },
    getSore(arr3, type) { // 获取分数总和
      this[type] = arr3.reduce((acc, cur) => {
        return acc + cur.point
      }, 0)
    }
  }
}
</script>

<style scoped>
  .inspect{
    padding:0 20px;
  }
  .goBack {
    display: flex;
    flex-direction: row-reverse;
    padding-bottom: 20px;
  }
</style>
