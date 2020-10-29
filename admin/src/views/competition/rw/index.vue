<template>
  <div class="app-container competition_box">
    <div class="filter-container">
      <el-select
        v-model="listQuery.process_"
        placeholder="请选择竞赛状态"
        clearable
        class="filter-item"
        size="mini"
      >
        <el-option
          v-for="(val, k) in matchStatusList"
          :key="k"
          :label="val"
          :value="k"
        />
      </el-select>

      <el-input
        v-model.trim="listQuery.name"
        placeholder="请输入题目名称"
        style="width: 150px"
        size="mini"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList(1)"
      >搜索
      </el-button>
    </div>

    <!--竞赛增删改查 begin-->
    <div v-if="roles !== 'referee'" class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="success"
        size="mini"
        @click="addMatch(null)"
      >新增</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        size="mini"
        @click="removeMatch"
      >删除</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        type="success"
        size="mini"
        @click="pubMatch(1)"
      >公开</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        size="mini"
        @click="pubMatch(0)"
      >隐藏</el-button
      >
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
      <el-table-column
        :index="indexMethod"
        align="center"
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column align="center" prop="name_zh" label="竞赛名称" />

      <el-table-column align="center" prop="process" label="竞赛状态">
        <template slot-scope="scope">
          <span>
            {{ matchStatusList[scope.row.process] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="start_time"
        label="开始时间"
        width="160px"
      />
      <el-table-column
        align="center"
        prop="end_time"
        label="结束时间"
        width="160px"
      />

      <el-table-column align="center" prop="status" label="公开/隐藏">
        <template slot-scope="scope">
          <span>{{ scope.row.public ? "公开" : "隐藏" }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="create_user" label="创建者" />

      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-waves
            v-if="!scope.row.is_sponsor && roles !== 'referee'"
            class="filter-item"
            size="mini"
            type="success"
            @click="editMatch(scope.row.hash)"
          >编辑
          </el-button>
          <el-button
            v-waves
            class="filter-item"
            size="mini"
            type="warning"
            @click="operation(scope.row)"
          >竞赛运维
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {
  fetchList,
  removeMatch,
  publicMatch,
  matchInfo,
  canCreate,
  matchStatus
} from '@/api/match/realWord'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const matchType = [
  { key: '', display_name: '全部竞赛类型' },
  { key: 7, display_name: '公开赛' },
  { key: 6, display_name: '邀请赛' }
]
const joinType = [
  { key: '', display_name: '全部参赛方式' },
  { key: 1, display_name: '个人赛' },
  { key: 2, display_name: '组队赛' }
]
const matchStatusList = ['进行中', '未开始', '已结束']

export default {
  name: 'IndexVue',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      roles: Cookies.get('Admin-Token'), // 获取登陆的角色
      id: this.$route.id, // 竞赛id
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      matchType,
      joinType,
      matchStatusList: matchStatusList,
      listQuery: {
        name: '', // 竞赛名称
        // order: 'asc',
        limit: this.$store.state.config.row,
        process_: '', // 比赛进展
        // mode: '', // 参赛方式
        // sponsor_zh: '', // 主办方账号昵称
        // type: '', // 竞赛类型
        offset: 0
      },
      matchList: [],
      hashs: [] // 选中的表格id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    pubMatch(pub) {
      // 公开、隐藏竞赛
      const data = {
        hashs: this.hashs,
        public: pub
      }
      publicMatch(data).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    removeMatch() {
      // 删除竞赛
      const data = {
        hashs: this.hashs
      }
      if (this.hashs.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeMatch(data).then((res) => {
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
      // 获取表格
      if (page === 1) this.page = 1
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      fetchList(this.listQuery).then((res) => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.hashs = val.map((item) => {
        return item.hash
      })
    },
    addMatch() {
      // 新增竞赛
      this.$router.push({
        path: '/competition/rw/createMatch'
      })
    },
    editMatch(hash) {
      // 编辑竞赛
      this.$router.push({
        path: '/competition/rw/editMatch',
        query: { hash: hash }
      })
    },
    accredit(id, mode) {
      // 授权管理
      this.$router.push({
        path: '/competition/accredit',
        query: {
          id: id,
          mode: mode
        }
      })
    },

    operation(obj) {
      // 竞赛运维
      matchStatus(obj.hash).then((res) => {
        this.$router.push({
          path: '/competition/rw/operation',
          query: { hash: obj.hash }
        })
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.page - 1) * this.listQuery.limit + index + 1
    }
  }
}
</script>
