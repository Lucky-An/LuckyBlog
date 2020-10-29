<template>
  <div class="app-container">
    <div class="filter-container">
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="基本信息"/>
        <el-step title="选择选手"/>
        <el-step title="场景信息"/>
        <el-step title="拓扑设计"/>
        <el-step title="题目分值"/>
      </el-steps>
    </div>
    <!--<div @click="nextStep">123</div>-->
    <div v-if="active==0">
      <createMatch @nextStep="nextStep" />
    </div>
    <div v-if="active==1">
      <user @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-if="active==2">
      <scene @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-if="active==3">
      <topo @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-if="active==4">
      <score @nextStep="nextStep" @backStep="backStep" />
    </div>

    <!--<el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">-->
    <!--<el-tab-pane key="status" label="基本信息" name="status">-->
    <!--<keep-alive>-->
    <!--<createMatch/>-->
    <!--</keep-alive>-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane key="sub" label="用户" name="sub">-->
    <!--<keep-alive>-->
    <!--<user></user>-->
    <!--</keep-alive>-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane key="noice" label="题目" name="noice">-->
    <!--<keep-alive>-->

    <!--</keep-alive>-->
    <!--</el-tab-pane>-->

    <!--</el-tabs>-->
  </div>
</template>

<script>
import createMatch from './createMatch'
import user from './user'
import scene from './scene'
import score from './score'
import topo from './topo'
import { fetchPenetrationInfo } from '@/api/match/penetration'

export default {
  name: 'Index',
  components: { createMatch, user, scene, topo, score },
  data() {
    return {
      tabMapOptions: [
        { label: '基本信息', key: 'status' },
        { label: '用户', key: 'user' },
        { label: '题目', key: 'sub' }
      ],
      activeName: 'status',
      active: this.$route.query.step * 1 || 0
    }
  },
  created() {
    // 获取比赛信息用以展示在面包屑
    if (this.$route.query.id) {
      fetchPenetrationInfo(this.$route.query.id).then(res => {
        this.$store.dispatch('changeMatchName', res.data.name_zh)
      })
    }
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    nextStep() {
      if (this.active++ > 3) this.active = 0
      this.$route.query.step = this.active
    },
    backStep() {
      if (this.active-- < 0) this.active = 0
      this.$route.query.step = this.active
    }
  }
}
</script>

<style scoped>
</style>
