<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="monitorData.challenge_id"
        style="vertical-align: top"
        size="mini"
        placeholder="请选择题目"
        clearable
      >
        <el-option
          v-for="item in topicList"
          :key="item.id"
          :value="item.id"
          :label="item.title"
        />
      </el-select>
      <el-select
        v-model="monitorData.team_id"
        style="vertical-align: top"
        size="mini"
        placeholder="请选择选手"
        clearable
      >
        <el-option
          v-for="item in teamList"
          :key="item.team_id"
          :value="item.team_id"
          :label="item.team_name"
        />
      </el-select>
      <!-- <el-input
        v-model="monitorData.name"
        placeholder="请输入昵称"
        class="filter-item"
        style="width: 200px;"
        size="mini"/> -->
      <el-button
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList(1)"
      >搜索</el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"
        />
        <el-table-column
          align="center"
          prop="name"
          label="选手名称"
        />
        <!-- <el-table-column
          align="center"
          prop="name"
          label="昵称"/> -->
        <el-table-column
          align="center"
          prop="challenge_name"
          label="题目名称"
        />
        <el-table-column
          align="center"
          prop="image_name"
          label="题目镜像"
        />
        <el-table-column
          align="center"
          prop="ip"
          width="100"
          label="题目IP"
        />
        <el-table-column
          align="center"
          prop="vlan"
          label="题目vlan"
        />

        <el-table-column
          align="center"
          prop="status"
          label="题目状态"
        />

        <el-table-column
          align="center"
          prop="solved_count"
          label="远程监控"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.lvp_remote_desktop"
              :href="scope.row.lvp_remote_desktop"
              target="_blank"
            >
              <el-button
                size="mini"
                type="primary"
              >查看 </el-button>
            </a>
            <span v-else>
              <a target="_blank">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleMessage"
                >查看 </el-button>
              </a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="solved_count"
          label="实例控制"
          width="260"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="success"
              @click="deployStatus(scope.row, 1)"
            >开机
            </el-button>
            <el-button
              v-waves
              size="mini"
              type="danger"
              @click="deployStatus(scope.row, 2)"
            >关机
            </el-button>
            <el-button
              v-waves
              size="mini"
              type="primary"
              @click="deployStatus(scope.row, 3)"
            >重置
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="测试操作"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="warning"
              @click="check(scope.row)"
            >check
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="footer">
      <pagination
        v-show="listTotal > 0"
        :total="listTotal"
        :page.sync="monitorData.offset"
        :limit.sync="monitorData.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  defenseFetchMonitorList,
  defenseFetchTopicList,
  defenseFetchTeamList,
  defenseDeployStatus,
  defenseTestCheck,
  defensePushFlag
} from '@/api/match/DevOps'

export default {
  name: 'Index',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      params: { event_id: this.$route.query.id },
      monitorData: {
        team_id: '',
        challenge_id: '',
        name: '',
        event_id: this.$route.query.id,
        offset: 1,
        limit: this.$store.state.config.row
      },
      matchList: [], //
      teamList: [], // 所有队伍
      topicList: [], // 所有队伍
      listTotal: 0
    }
  },
  created() {
    this.getList()
    this.getTopic()
    this.getTeam()
  },
  methods: {
    handleMessage() {
      this.$message.error('题目环境异常，无法登录')
    },
    lookRemote(row) {
      // var oIframe = document.createElement('iframe');
      // oIframe.src = 'http://192.168.100.135:8080';
      // document.body.appendChild(oIframe);

      window.open(row.remote_desktop)
    },
    pushFlag(row) {
      const data = {
        team_id: row.team_id || 0,
        challenge_id: row.challenge_id || this.challenge_id
      }
      defensePushFlag(this.params, data).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.message_zh)
          this.getList()
        }
      })
    },
    check(row) {
      const data = {
        team_id: row.team_id || 0,
        challenge_id: row.challenge_id || this.challenge_id
      }
      defenseTestCheck(this.params, data).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.message_zh)
          this.getList()
        }
      })
    },
    deployStatus(row, a) {
      // 题目环境部署
      const data = {
        team_id: row.team_id || 0,
        challenge_id: row.challenge_id || this.challenge_id,
        action: a
      }
      defenseDeployStatus(this.params, data).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    getTopic() {
      defenseFetchTopicList(this.params).then(res => {
        this.topicList = res.data
        // this.listTotal = res.data.total
      })
    },
    getTeam() {
      defenseFetchTeamList(this.params).then(({ data }) => {
        if (data.success) {
          this.teamList = data.data
        }
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.monitorData.offset - 1) * this.monitorData.limit + index + 1
    },
    handleSelectionChange(val) {
      this.userId = val
    },
    getList(page) {
      if (page === 1) this.monitorData.offset = page
      defenseFetchMonitorList(this.monitorData).then(res => {
        if (res.data.success !== false) {
          this.matchList = res.data.row
          this.listTotal = res.data.total
        }
      })
    },
    checkTable() {
      // 选择表格
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
</style>
