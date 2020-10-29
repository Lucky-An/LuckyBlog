<template>
  <div class="dashboard-editor-container" style="height: 100%">

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height: 100%;">

      <myMap/>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from '../components/PanelGroup'
import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'
import myTable from '../components/myTable'
import myMap from '../components/map'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165, 120, 161, 134, 105, 160, 165, 120, 161, 134, 105, 160, 165, 160, 165, 160, 165, 160],
    actualData: [134, 105, 160, 165, 160, 165, 160, 165, 160, 100, 120, 161, 134, 105, 160, 165, 120, 161, 134, 105, 160, 165, 120, 161],
    correct: [100, 120, 161, 134, 105, 160, 134, 105, 160, 165, 160, 165, 160, 165, 160, 165, 120, 161, 134, 105, 160, 165, 120, 161],
    notice: [105, 1600, 165, 134, 105, 165, 160, 165, 160, 165, 160, 100, 120, 161, 134, 105, 160, 165, 120, 161, 134, 160, 120, 161]
  },
  pieData1: {
    title: '虚拟机数量',
    legend: ['已使用', '未使用'],
    series: [
      { value: 0, name: '已使用' },
      { value: 310, name: '未使用' }
    ]
  },
  pieData2: {
    title: 'Vcpu',
    legend: ['已使用', '未使用'],
    series: [
      { value: 135, name: '已使用' },
      { value: 310, name: '未使用' }
    ]
  },
  pieData3: {
    title: '内存',
    legend: ['已使用', '未使用'],
    series: [
      { value: 235, name: '已使用' },
      { value: 10, name: '未使用' }
    ]
  },
  pieData4: {
    title: '磁盘',
    legend: ['已使用', '未使用'],
    series: [
      { value: 335, name: '已使用' },
      { value: 310, name: '未使用' }
    ]
  },
  tableData: [{
    name: 'cpu',
    ip: '192.168.10.111',
    serve: '打开',
    manage: '已关闭',
    cpu: 'I5005',
    memory: '5G',
    hardDisk: '1024T'
  }, {
    name: 'cpu',
    ip: '192.168.10.111',
    serve: '打开',
    manage: '已关闭',
    cpu: 'I5005',
    memory: '5G',
    hardDisk: '1024T'
  }, {
    name: 'cpu',
    ip: '192.168.10.111',
    serve: '打开',
    manage: '已关闭',
    cpu: 'I5005',
    memory: '5G',
    hardDisk: '1024T'
  }]
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    myTable,
    myMap
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      pieData: lineChartData,
      tableData: lineChartData.tableData
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
