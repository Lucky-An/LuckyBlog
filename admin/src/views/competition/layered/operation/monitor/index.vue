<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="monitorData.task_id" style="vertical-align: top" size="mini" placeholder="题目名称">
        <el-option value="" label="全部题目"/>
        <el-option v-for="item in topicList" :key="item.id" :value="item.id" :label="item.title"/>
      </el-select>
      <el-select v-model="monitorData.id" style="vertical-align: top" size="mini" placeholder="账户名称">
        <el-option value="" label="全部账户"/>
        <el-option v-for="item in teamList" :key="item.obj_id" :value="item.obj_id" :label="item.obj_name"/>

      </el-select>
      <el-input
        v-model.trim="monitorData.search"
        placeholder="请输入账户或者题目名称"
        style="width: 150px;"
        size="mini"
        class="filter-item"/>
      <el-button v-waves class="filter-item" pe="primary" size="mini" @click="getList">搜索</el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"/>
        <el-table-column
          align="center"
          prop="env_name"
          label="名称"/>
        <el-table-column
          align="center"
          prop="name"
          label="昵称"/>
        <el-table-column
          align="center"
          prop="title"
          label="题目名称"/>

        <el-table-column
          align="center"
          prop="expose_ip"
          width="100"
          label="题目IP"/>
        <el-table-column
          align="center"
          prop="vlan"
          label="题目vlan"/>
        <el-table-column
          align="center"
          prop="status"
          label="题目状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">正常</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="is_solved"
          label="解答状态"/>
        <el-table-column
          align="center"
          prop="solved_count"
          label="远程监控"
          width="150">
          <template slot-scope="scope">
            <!--<a :href="scope.row.remote_desktop" v-if="scope.row.remote_desktop" target="_blank">-->
            <!--<el-button-->
            <!--v-waves-->
            <!--class="filter-item"-->
            <!--size="mini"-->
            <!--type="success"-->
            <!--&gt;查看-->
            <!--</el-button>-->
            <!--</a>-->
            <!--<el-button-->
            <!--v-else-->
            <!--v-waves-->
            <!--disabled-->
            <!--class="filter-item"-->
            <!--size="mini"-->
            <!--type="success"-->
            <!--&gt;查看-->
            <!--</el-button>-->

            <a v-for="item in scope.row.lvp_remote_desktop" :key="item" :href="item.console" target="_blank">
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="primary">{{ item.service_name }}
              </el-button>
            </a>

          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="solved_count"-->
        <!--label="题目环境控制"-->
        <!--width="260"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-button-->
        <!--disabled-->
        <!--v-waves-->
        <!--class="filter-item"-->
        <!--size="mini"-->
        <!--type="success"-->
        <!--@click="deployStatus(scope.row,2)">开启-->
        <!--</el-button>-->
        <!--<el-button-->
        <!--disabled-->
        <!--v-waves-->
        <!--class="filter-item"-->
        <!--size="mini"-->
        <!--type="danger"-->
        <!--@click="deployStatus(scope.row,1)">关闭-->
        <!--</el-button>-->
        <!--<el-button-->
        <!--disabled-->
        <!--v-waves-->
        <!--class="filter-item"-->
        <!--size="mini"-->
        <!--type="success"-->
        <!--@click="deployStatus(scope.row,3)">重新部署-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" label="测试操作" width="200">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button-->
        <!--v-waves-->
        <!--class="filter-item"-->
        <!--size="mini"-->
        <!--type="warning"-->
        <!--@click="check(scope.row)">check-->
        <!--</el-button>-->
        <!--<el-button-->
        <!--v-waves-->
        <!--class="filter-item"-->
        <!--size="mini"-->
        <!--type="warning"-->
        <!--@click="pushFlag(scope.row)">pushflag-->
        <!--</el-button>-->

        <!--</template>-->
        <!--</el-table-column>-->

      </el-table>
    </div>

    <div class="footer">
      <pagination
        v-show="listTotal>0"
        :total="listTotal"
        :page.sync="listPage"
        :limit.sync="monitorData.limit"
        @pagination="getList"/>
    </div>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  getMonitorTask,
  getMonitorUser,
  getMonitorList
} from '@/api/match/layered'

export default {
  name: 'Index',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      params: { event_id: this.$route.query.id },
      monitorData: {
        offset: 0,
        limit: this.$store.state.config.row,
        order: 'asc',
        id: '',
        task_id: '',
        search: ''
      },
      matchList: [], //
      teamList: [], // 所有队伍
      topicList: [], // 所有队伍
      listTotal: 0,
      listPage: 1,
      scorePage: 1,

      scoreQuery: {
        order: 'asc',
        event: '',
        user: ''
      }
    }
  },
  created() {
    this.getList()
    this.getTopic()
    this.getTeam()
  },
  methods: {
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
    deployStatus(row, a) { // 题目环境部署
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
      getMonitorTask(this.params.event_id).then(res => {
        this.topicList = res.data
        // this.listTotal = res.data.total
      })
    },
    getTeam() {
      getMonitorUser(this.params.event_id).then(res => {
        this.teamList = res.data
      })
    },
    indexMethod(index) { // 展示序号的方法
      return (this.listPage - 1) * this.monitorData.limit + index + 1
    },
    handleSelectionChange(val) {
      this.userId = val
    },
    getList() {
      this.monitorData.offset = (this.listPage - 1) * this.monitorData.limit
      getMonitorList(this.params.event_id, this.monitorData).then(res => {
        this.matchList = res.data.rows
        this.listTotal = res.data.total
      })
    },
    checkTable() { // 选择表格

    }
  }
}
</script>

<style scoped>
  .footer{
    position: relative;
    min-height: 50px;
  }
  .btnBox{
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    right: 16px;
    top: 0;
  }
</style>
