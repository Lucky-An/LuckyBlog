<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="操作员日志" name="operator">
        <operator v-if="activeName=='operator'"/>
      </el-tab-pane>

      <!--<el-tab-pane label="系统审计日志" name="system">-->
      <!--<system v-if="activeName=='system'"/>-->
      <!--</el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import operator from './operator'
import system from './system'

export default {

  components: {
    operator,
    system
  },
  data() {
    return {
      activeName: 'operator'
    }
  }
}
</script>

<style scoped>

</style>
