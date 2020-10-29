<template>
  <div class="app-container">
    <div class="task_resou_box">
      <div class="module_title">
        题目资源统计
      </div>
      <div class="task_resou">
        <div class="taskType_box">
          <div class="img_box">
            <img
              src="@/assets/img/jeopardy.png"
              alt=""
            >
          </div>
          <div class="content">
            <p class="title">理论题</p>
            <p class="num num1">{{ TaskResou.theory_num }}道</p>
            <!--<p class="unit">单位：道</p>-->
          </div>
        </div>
        <div class="taskType_box">
          <div class="img_box">
            <svg-icon icon-class="jeopardy" />
          </div>
          <div class="content">
            <p class="title">解题赛题目 </p>
            <p class="num num2">{{ TaskResou.jeopardy_num }}道</p>
            <!--<p class="unit">单位：道</p>-->
          </div>
        </div>
        <div class="taskType_box">
          <div class="img_box">
            <img
              src="@/assets/img/defense.png"
              alt=""
            >
          </div>
          <div class="content">
            <p class="title">攻防赛题目</p>
            <p class="num num4">{{ TaskResou.ad_num }}道</p>
            <!--<p class="unit">单位：道</p>-->
          </div>
        </div>
        <div class="taskType_box">
          <div class="img_box">
            <img
              src="@/assets/img/DevOps.png"
              alt=""
            >
          </div>
          <div class="content">
            <p class="title">运维赛题 </p>
            <p class="num num3">{{ TaskResou.ops_num }}道</p>
            <!--<p class="unit">单位：道</p>-->
          </div>
        </div>
        <div class="taskType_box">
          <div class="img_box">
            <img
              src="@/assets/img/defense.png"
              alt=""
            >
          </div>
          <div class="content">
            <p class="title">新攻防题目</p>
            <p class="num num4">{{ TaskResou.jad_num }}道</p>
            <!--<p class="unit">单位：道</p>-->
          </div>
        </div>
        <div class="taskType_box">
          <div class="img_box">
            <svg-icon icon-class="rw" />
          </div>
          <div class="content">
            <p class="title">RealWorld题目</p>
            <p class="num num2">{{ TaskResou.rw_num }}道</p>
            <!--<p class="unit">单位：道</p>-->
          </div>
        </div>
        <div class="taskType_box">
          <div class="img_box">
            <img
              src="@/assets/img/jeopardy.png"
              alt=""
            >
          </div>
          <div class="content">
            <p class="title">渗透赛题</p>
            <p class="num num2">{{ TaskResou.inf_num }}道</p>
            <!--<p class="unit">单位：道</p>-->
          </div>
        </div>
      </div>
    </div>

    <div style="background: #Fff;padding: 12px 20px;">
      <div class="module_title">
        集群运行状况
      </div>
      <LineChart
        v-if="allNode.xAxis"
        :chart-data="allNode"
      />
      <div
        v-else
        style="padding: 50px;text-align: center"
      >加载中</div>
    </div>

    <div style="background: #Fff;padding: 12px 20px;position: relative">
      <div class="module_title">
        从节点运行状况
      </div>
      <el-select
        v-model="value"
        style="position: absolute;top: 12px;right: 20px;"
        placeholder="请选择"
        size="mini"
        @change="getNode('change')"
      >

        <el-option
          v-for="item in name"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <LineChart
        v-if="node.xAxis"
        :chart-data="node"
      />
      <div
        v-else
        style="padding: 50px;text-align: center"
      >加载中</div>
    </div>

  </div>
</template>

<script>
import PanelGroup from '../components/PanelGroup'
import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'
import myTable from '../components/myTable'
import {
  fetchTaskResou,
  allNode,
  getNodeName,
  getNode
} from '@/api/dataCenter'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    myTable
  },
  data() {
    return {
      TaskResou: {}, // 题目资源统计
      allNode: {},
      name: [],
      node: {},
      value: '',
      allTimer: null,
      nodeTimer: null
    }
  },
  created() {
    this.fetchTaskResou()
    this.allTimer = setInterval(() => {
      this.getallNode()
    }, 5000)
    this.getNodeName()
  },
  beforeDestroy() {
    clearInterval(this.allTimer)
    clearInterval(this.nodeTimer)
  },
  methods: {
    fetchTaskResou() {
      // 题目资源统计
      fetchTaskResou().then(res => {
        this.TaskResou = res.data
      })
    },
    getallNode() {
      // 获取所有节点趋势
      allNode().then(res => {
        const { data } = res
        if (this.allNode.legend) {
          // 后台的数据只有办法返回1条，所以做一个存储，最多存储10条
          this.allNode.series = this.allNode.series.map((item, index) => {
            item.data = item.data.concat(data.series[index].data)
            // 如果数据超过10条，删掉第一条
            if (item.data.length > 10) {
              item.data.shift()
            }
            return item
          })
          this.allNode.xAxis.data = this.allNode.xAxis.data.concat(
            data.xAxis.data
          )
          if (this.allNode.xAxis.data.length > 10) {
            this.allNode.xAxis.data.shift()
          }
        } else {
          this.allNode = data
        }
      })
    },
    getNodeName() {
      // 获取当前节点类型
      getNodeName().then(res => {
        this.name = res.data
        if (this.name.length) {
          for (let i = 0; i < this.name.length; i++) {
            this.name[i] =
              this.name[i].slice(0, 1).toUpperCase() +
              this.name[i].slice(1).toLowerCase()
          }
        }
        this.value = this.name[0]
        this.nodeTimer = setInterval(() => {
          this.getNode()
        }, 5000)
      })
    },
    getNode(type) {
      // 获取所有当前节点趋势
      getNode(this.value).then(res => {
        const { data } = res
        // 如果node存在，并且不是通过切换节点进行的操作
        if (this.node.legend && type !== 'change') {
          // 后台的数据只有办法返回1条，所以做一个存储，最多存储10条
          this.node.series = this.node.series.map((item, index) => {
            item.data = item.data.concat(data.series[index].data)
            // 如果数据超过10条，删掉第一条
            if (item.data.length > 10) {
              item.data.shift()
            }
            return item
          })
          this.node.xAxis.data = this.node.xAxis.data.concat(data.xAxis.data)
          if (this.node.xAxis.data.length > 10) {
            this.node.xAxis.data.shift()
          }
        } else {
          this.node = data
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
p {
  margin: 0;
}

.app-container {
  min-width: 1010px;
  background-color: rgb(240, 242, 245);

  .module_title {
    border-left: 4px solid #00a0e9;
    padding-left: 6px;
    font-size: 16px;
    color: #8f939a;
  }

  /*题目资源统计begin*/
  .task_resou_box {
    background: #fff;
    height: 140px;
    padding: 12px 20px;
    margin-bottom: 17px;
    display: flex;
    flex-direction: column;
  }

  .task_resou {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .taskType_box {
    flex: 1;
    display: flex;
    justify-content: center;
    border-right: 1px solid #dbdfe6;

    .img_box {
      display: flex;
      align-items: center;
    }
    .img_box .svg-icon {
      width: 50px;
      height: 50px;
    }
    .content {
      margin-left: 21px;

      p {
        margin-bottom: 7px;
      }

      .title,
      .unit {
        font-size: 14px;
        color: #8f939a;
      }

      .num {
        font-size: 30px;
        font-weight: bold;
      }

      .num1 {
        color: #00a8ff;
      }

      .num2 {
        color: #4eb77f;
      }

      .num4 {
        color: #ffa681;
      }

      .num3 {
        color: #8287f0;
      }
    }
  }

  .taskType_box:last-child {
    border: none;
  }

  .chart-wrapper {
    background: #fff;
    padding: 9px 20px 0;
    margin-bottom: 32px;

    .content {
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      p {
        margin-bottom: 15px;
        font-size: 16px;
        color: #303133;
      }
    }
  }
}
</style>
