<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="系统功能" name="function">
        <funtion v-if="activeName=='function'"/>
      </el-tab-pane>

      <el-tab-pane label="许可信息" name="permit">
        <permit v-if="activeName=='permit'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import funtion from './function'
import permit from './permit'

export default {

  components: {
    funtion,
    permit
  },
  data() {
    return {
      activeName: 'function'
    }
  }
}
</script>

<style scoped>

</style>
