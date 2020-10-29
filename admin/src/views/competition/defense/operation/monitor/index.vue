<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="monitorData.challenge_id"
        clearable
        style="vertical-align: top"
        size="mini"
        placeholder="请选择题目名称"
      >
        <!-- <el-option :value="0" label="全部题目" /> -->
        <el-option
          v-for="item in topicList"
          :key="item.id"
          :value="item.id"
          :label="item.title"
        />
      </el-select>
      <el-select
        v-model="monitorData.team_id"
        clearable
        style="vertical-align: top"
        size="mini"
        placeholder="请选择选手名称"
      >
        <!-- <el-option :value="0" label="全部选手名称" /> -->
        <el-option
          v-for="item in teamList"
          :key="item.team_id"
          :value="item.team_id"
          :label="item.team_name"
        />
      </el-select>

      <el-input
        v-model.trim="monitorData.name"
        placeholder="请输入选手名称"
        style="width: 200px"
        class="filter-item"
        size="mini"
      />
      <el-button
        v-waves
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
          prop="nickname"
          label="昵称"
        /> -->
        <!-- <el-table-column align="center" prop="env_name" label="题目环境名称" /> -->
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
          label="题目环境状态"
        >
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.status==1">未创建</span>
            <span v-if="scope.row.status==4">运行</span>
            <span v-if="scope.row.status==5">停止</span>
            <span v-if="scope.row.status==6">异常</span>
          </template> -->
        </el-table-column>
        <el-table-column
          align="center"
          prop="solved_count"
          label="Flag查看"
        >
          <template slot-scope="scope">
            <!--<a :href="scope.row.remote_desktop" v-if="scope.row.remote_desktop" target="_blank">-->
            <el-button
              v-waves
              v-if="scope.row.flag"
              class="filter-item"
              size="mini"
              type="success"
              @click="lookFlag(scope.row)"
            >查看</el-button>
            <!--</a>-->
            <el-button
              v-waves
              v-else
              disabled
              class="filter-item"
              size="mini"
              type="primary"
            >查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="solved_count"
          label="远程监控"
        >
          <template slot-scope="scope">
            <!--<a :href="scope.row.remote_desktop" v-if="scope.row.remote_desktop" target="_blank">-->
            <el-button
              v-waves
              v-if="
                scope.row.lvp_remote_desktop && scope.row.status == '运行中'
              "
              class="filter-item"
              size="mini"
              type="primary"
              @click="lookRemote(scope.row)"
            >查看</el-button>
            <!--</a>-->
            <el-button
              v-waves
              v-else
              disabled
              class="filter-item"
              size="mini"
              type="primary"
            >查看</el-button>

            <!--<el-button-->
            <!--v-waves-->
            <!--class="filter-item"-->
            <!--size="mini"-->
            <!--type="primary"-->
            <!--@click="showScore(scope.row)">登陆-->
            <!--</el-button>-->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="solved_count"
          label="实例控制"
          width="260"
        >
          <template slot-scope="scope">
            <!-- v-if="scope.row.scene_status == 5" -->
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              @click="deployStatus(scope.row, 1)"
            >开机</el-button>
            <!-- v-if="scope.row.scene_status == 4" -->
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="danger"
              @click="deployStatus(scope.row, 2)"
            >关机</el-button>
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="primary"
              @click="deployStatus(scope.row, 3)"
            >重置</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="测试操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="warning"
              @click="check(scope.row)"
            >check</el-button>
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="warning"
              @click="pushFlag(scope.row)"
            >pushflag</el-button>
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
    <el-dialog
      :visible.sync="showFlag"
      title="查看Flag"
      width="30%"
      @close="resetFlag"
    >
      <!-- <div>题目名称：{{lookFlagData.name}}</div>
      <div>Flag：{{lookFlagData.flag}}</div> -->
      <el-form label-width="80px">
        <el-form-item label="题目名称:">
          <span>{{ lookFlagData.name }}</span>
        </el-form-item>
        <el-form-item label="Flag:">
          <span>{{ lookFlagData.flag }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
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
} from '@/api/match/defense'

export default {
  name: 'Index',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      params: { event_id: this.$route.query.id },
      monitorData: {
        offset: 0,
        limit: 10,
        team_id: '',
        challenge_id: '',
        name: '',
        event_id: this.$route.query.id
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
      },
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        search: '',
        order: 'asc',
        event: this.$route.query.id
      },
      showFlag: false,
      lookFlagData: {
        name: '',
        flag: ''
      }
    }
  },
  created() {
    this.getList()
    this.getTopic()
    this.getTeam()
  },
  methods: {
    resetFlag() {
      this.lookFlagData = { name: '', flag: '' }
    },
    lookFlag(row) {
      this.showFlag = true
      this.lookFlagData.name = row.challenge_name
      this.lookFlagData.flag = row.flag
    },
    lookRemote(row) {
      // var oIframe = document.createElement('iframe');
      // oIframe.src = 'http://192.168.100.135:8080';
      // document.body.appendChild(oIframe);

      window.open(row.lvp_remote_desktop)
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
