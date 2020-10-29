<template>
  <div class="app-container">
    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="matchList" border style="width: 100%">
        <el-table-column align="center" prop="model" width="100" label="模块" />
        <el-table-column align="center" prop="solved_count" label="进度">
          <template slot-scope="scope">
            <div style="position: relative">
              <el-progress
                :text-inside="true"
                :stroke-width="24"
                :percentage="scope.row.progress"
                :status="scope.row.status"
                style="width: 90%"
              />
              <span style="position: absolute;right: 0;top: 0;">{{ scope.row.statusText }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              :disabled="is_disabled"
              class="filter-item"
              size="mini"
              type="success"
              @click="startDeloy(scope.row.id)"
            >开始部署</el-button>
            <!--<el-button-->
            <!--v-waves-->
            <!--class="filter-item"-->
            <!--size="mini"-->
            <!--type="primary"-->
            <!--@click="showLog(scope.row)">查看网络日志-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="message.length>0" class="filter-container dev_info">
      <p v-for="item in message">{{ item }}</p>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  defenseDeploySence,
  defenseDeployNetwork,
  defenseDeployTeam,
  defenseDeployTopic,
  defenseProgress
} from '@/api/match/defense'
import { getScene } from '@/api/match/common'

export default {
  name: 'Index',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      params: { event_id: this.$route.query.id },
      message: [], // 进度条报错信息。
      matchList: [
        {
          model: '环境模块',
          progress: 0,
          id: 1,
          status: 'success',
          statusText: ''
        },
        {
          model: '队伍模块',
          progress: 0,
          id: 2,
          status: 'success',
          statusText: ''
        },
        {
          model: '网络模块',
          progress: 0,
          id: 3,
          status: 'success',
          statusText: ''
        },
        {
          model: '题目环境模块',
          progress: 0,
          id: 4,
          status: 'success',
          statusText: ''
        }
        // { model: '场景部署', progress: 0, id: 5, status: 'success', statusText: '' }
      ],
      is_disabled: false, // 按钮是否可以点击
      intervalId: null, // 定时器id
      id: this.$route.query.id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getScene({ event_id: this.id }).then((res) => {
        const { data } = res

        if (data.deploy_env === false) {
          this.matchList[0].progress = 100
          this.matchList[0].status = 'exception'
        } else if (data.deploy_env) {
          this.matchList[0].progress = 100
        }

        if (data.deploy_team === false) {
          this.matchList[1].progress = 100
          this.matchList[1].status = 'exception'
        } else if (data.deploy_team) {
          this.matchList[1].progress = 100
        }

        if (data.deploy_network === false) {
          this.matchList[2].progress = 100
          this.matchList[2].status = 'exception'
        } else if (data.deploy_network) {
          this.matchList[2].progress = 100
        }

        if (data.deploy_challenge === false) {
          this.matchList[3].progress = 100
          this.matchList[3].status = 'exception'
        } else if (data.deploy_challenge) {
          this.matchList[3].progress = 100
        }
      })
    },

    startDeloy(id) {
      // 开始部署
      if (id == 1) {
        // 环境模块
        defenseDeploySence(this.params).then((res) => {
          if (res.data.success) {
            this.showProgress('deploy_env', id - 1)
          }
        })
      }
      if (id == 2) {
        // 队伍模块
        defenseDeployTeam(this.params).then((res) => {
          if (res.data.success) {
            this.showProgress('deploy_team', id - 1)
          }
        })
      }
      if (id == 3) {
        // 网络模块
        defenseDeployNetwork(this.params).then((res) => {
          if (res.data.success) {
            this.showProgress('deploy_network', id - 1)
          }
        })
      }
      if (id == 4) {
        // 题目环境模块
        defenseDeployTopic(this.params).then((res) => {
          if (res.data.success) {
            this.showProgress('deploy_challenge', id - 1)
          }
        })
      }
    },
    showLog() {
      // 查看日志
    },

    showProgress(name, index) {
      // 查询进度条
      // 初始化进度条颜色
      this.matchList[index].status = 'success'
      this.is_disabled = true
      const params = JSON.parse(JSON.stringify(this.params))
      params.task_type = name
      this.intervalId = setInterval(() => {
        defenseProgress(params).then((res) => {
          const { data } = res
          // this.matchList[index].progress = data.progress * 1
          // this.message = data.message

          if (!data.success) {
            // 如果任务没启动，则终止。
            clearInterval(this.intervalId)

            // 初始化
            this.intervalId = null
            this.is_disabled = false
          } else {
            this.matchList[index].progress = data.progress * 1
            this.message = data.message
          }
          if (data.progress >= 100) {
            // 如果进度大于100，则终止
            clearInterval(this.intervalId)

            // 初始化
            this.intervalId = null
            this.is_disabled = false
          }

          if (data.fail_task) {
            // 如果任务启动出现错误，进度条变红
            this.matchList[index].status = 'exception'
            this.matchList[index].statusText = '失败'
          } else if (data.progress === 100) {
            this.matchList[index].status = 'success'
            this.matchList[index].statusText = '成功'
          }
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.footer {
  position: relative;
  min-height: 50px;
}

.btnBox {
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  right: 16px;
  top: 0;
}

.dev_info {
  background: #000;
  height: 350px;
  border: 1px solid #ebeef5;
  overflow: auto;
  padding: 0;
}

.dev_info p {
  font-size: 16px;
  color: #fff;
  margin: 0;
  padding: 5px;
}
</style>
