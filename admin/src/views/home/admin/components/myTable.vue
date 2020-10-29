<template>
  <el-table
    :data="tableData"
    class="my_table"
    style="width: 100%">
    <el-table-column
      prop="name"
      label="节点名称"
      align="center"/>
    <el-table-column
      prop="ip"
      align="center"
      label="节点IP"/>
    <el-table-column
      prop="role"
      label="角色"
      align="center"/>
    <el-table-column
      prop="status"
      align="center"
      label="服务状态">
      <template slot-scope="scope">
        <span v-if="scope.row.status==0">正常</span>
        <span v-if="scope.row.status!==0">异常</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="serve"
      align="center"
      label="管理状态">
      <template slot-scope="scope">
        <span v-if="scope.row.status==0">正常</span>
        <span v-if="scope.row.status!==0">异常</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="cpu_rate"
      align="center"
      label="CPU">
      <template slot-scope="scope">
        {{ scope.row.cpu_rate }} / {{ scope.row.max_vcpu }}核
      </template>
    </el-table-column>
    <el-table-column
      width="250px"
      prop="memory_rate"
      align="center"
      label="内存">
      <template slot-scope="scope">
        {{ scope.row.memory_rate }}( {{ (scope.row.used_memory/1024/1024).toFixed(2) }}G / {{ (scope.row.physical_memory/1024/1024).toFixed(2) }}G )
      </template>
    </el-table-column>
    <el-table-column
      width="220px"
      prop="disk_rate"
      align="center"
      label="硬盘">
      <template slot-scope="scope">
        {{ scope.row.disk_rate }} ( {{ (scope.row.used_storage/1024/1024/1024).toFixed(2) }}G / {{ (scope.row.physical_storage/1024/1024/1024).toFixed(2) }}G )
      </template>
    </el-table-column>
    <!--<el-table-column-->
    <!--prop="hardDisk"-->
    <!--align="center"-->
    <!--label="虚拟机运行数量"/>-->
    <!--<el-table-column-->
    <!--prop="hardDisk"-->
    <!--align="center"-->
    <!--label="运行时长"/>-->
  </el-table>
</template>

<script>
export default {
  name: 'MyTable',
  props: ['tableData'],
  data() {
    return {}
  }
}
</script>
<style>
  .my_table thead{
    color: #000;
  }
</style>
