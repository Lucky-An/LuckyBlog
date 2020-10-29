<template>
  <div class="app-container competition_box">
    <!--表格搜索 begin-->
    <div class="filter-container">
      <el-select v-model="listQuery.status" class="filter-item" size="mini" placeholder="请选择竞赛状态" clearable>
        <el-option
          v-for="(val,k) in matchStatus"
          :key="k"
          :label="val"
          :value="k"/>
      </el-select>
      <el-input
        v-model.trim="listQuery.search"
        placeholder="请输入竞赛名称"
        style="width: 200px;"
        size="mini"
        class="filter-item"
      />
      <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList(1)">搜索</el-button>
    </div>

    <!--竞赛增删改查 begin-->
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="success" size="mini" @click="addMatch(null)">新增</el-button>
      <el-button v-waves class="filter-item" type="danger" size="mini" @click="removeMatch">删除</el-button>
      <el-button v-waves class="filter-item" type="success" size="mini" @click="pubMatch(1)">公开</el-button>
      <el-button v-waves class="filter-item" type="danger" size="mini" @click="pubMatch(0)">隐藏</el-button>
    </div>

    <!--表格 begin-->
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="matchList"
      border
      fit
      highlight-current-row
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="checkTable"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column :index="indexMethod" align="center" type="index" width="50" label="序号" />
      <el-table-column align="center" prop="name_zh" label="竞赛名称" />
      <el-table-column align="center" label="参赛形式">
        <template slot-scope="scope">{{ matchModeMap[scope.row.mode] }}</template>
      </el-table-column>
      <el-table-column align="center" prop="process" label="竞赛状态">
        <template slot-scope="scope">
          <span v-if="scope.row.process===1">未开始</span>
          <span v-if="scope.row.process===0">
            {{ matchStatus[scope.row.status] }}
          </span>
          <span v-if="scope.row.process===2">已结束</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="竞赛时长">
        <template slot-scope="scope">{{ handleTimeRange(scope.row) }}</template>
      </el-table-column> -->
      <el-table-column align="center" prop="start_time" label="开始时间" min-width="160px;" />
      <el-table-column align="center" prop="end_time" label="结束时间" min-width="160px;" />

      <el-table-column align="center" label="奖励方式" min-width="90px;">
        <template slot-scope="scope">{{ rewardModeMap[scope.row.reward_mode] }}</template>
      </el-table-column>

      <el-table-column align="center" prop="status" label="公开/隐藏">
        <template slot-scope="scope">
          <span>{{ scope.row.public?'公开':'隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_user" label="创建者" />
      <el-table-column label="操作" width="200px" align="center" >
        <template slot-scope="scope">
          <el-button
            v-waves
            v-if="!scope.row.is_sponsor"
            class="filter-item"
            size="mini"
            type="success"
            @click="editMatch(scope.row)"
          >编辑</el-button>
          <el-button
            v-waves
            class="filter-item"
            size="mini"
            type="warning"
            @click="operation(scope.row)"
          >竞赛运维</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  fetchJeopardyList,
  deleteJeopardyMatch,
  publicJeopardyMatch
} from '@/api/match/jeopardy'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const matchStatus = {
  1: '未开始',
  2: '暂停中',
  3: '进行中',
  4: '已结束'
}

const matchModeMap = ['', '个人赛', '组队赛']
const rewardModeMap = ['无', '一二三血额外奖励']

export default {
  name: 'IndexVue',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      id: this.$route.id, // 竞赛id
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      matchStatus,
      listQuery: {
        search: '', // 竞赛名称
        order: 'asc',
        limit: this.$store.state.config.row,
        status: '', // 比赛进展
        mode: '', // 参赛方式
        sponsor_zh: '', // 主办方账号昵称
        type: '', // 竞赛类型
        offset: 0
      },
      matchList: [],
      ids: [], // 选中的表格id
      matchModeMap,
      rewardModeMap
    }
  },
  created() {
    this.getList()
  },
  methods: {
    pubMatch(pub) {
      // 公开、隐藏竞赛
      const data = {
        ids: this.ids,
        public: pub
      }
      publicJeopardyMatch(data).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    removeMatch() {
      // 删除竞赛
      const data = {
        ids: this.ids
      }
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteJeopardyMatch(data).then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getList(page) {
      if (page === 1) this.page = page

      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      fetchJeopardyList(this.listQuery).then((res) => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.id
      })
    },
    addMatch() {
      // 新增竞赛
      this.$router.push({
        path: '/competition/jeopardy/createMatch'
      })
    },
    editMatch(row) {
      // 编辑竞赛
      this.$router.push({
        path: '/competition/jeopardy/editMatch/editMatch',
        query: { id: row.id, hash: row.hash }
      })
    },
    accredit(id, mode) {
      // 授权管理
      this.$router.push({
        path: '/competition/jeopardy/accredit',
        query: {
          id: id,
          mode: mode
        }
      })
    },

    operation(obj) {
      // 竞赛运维
      if (obj.is_sponsor) {
        window.location.href = '/competition/manageCenter?id=' + obj.id
      } else {
        this.$router.push({
          path: '/competition/jeopardy/operation',
          query: { id: obj.id, hash: obj.hash }
        })
      }
    },

    indexMethod(index) {
      // 展示序号的方法
      return this.listQuery.offset * this.listQuery.limit + index + 1
    },

    handleTimeRange({ start_time, end_time }) {
      const st = new Date(start_time).getTime()
      const et = new Date(end_time).getTime()
      return parseInt((et - st) / 1000 / 60 / 6) / 10 + ' 小时'
    }
  }
}
</script>

<style scoped>
</style>
