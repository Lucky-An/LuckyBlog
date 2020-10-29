<template>
  <div class="app-container competition_box">
    <!--表格搜索 begin-->
    <div class="filter-container">

      <el-select v-model="listQuery.process" placeholder="请选择竞赛状态" clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in matchStatus"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"/>
      </el-select>

      <!--<el-select v-model="listQuery.mode" placeholder="参赛方式" clearable class="filter-item" style="width: 130px">-->
      <!--<el-option-->
      <!--v-for="item in joinType"-->
      <!--:key="item.key"-->
      <!--:label="item.display_name"-->
      <!--:value="item.key"/>-->
      <!--</el-select>-->

      <!--<el-input-->
      <!--v-model="listQuery.sponsor_zh"-->
      <!--placeholder="请输入主办方账号昵称关键字搜索"-->
      <!--style="width: 250px;"-->
      <!--class="filter-item"/>-->
      <el-input
        v-model.trim="listQuery.search"
        placeholder="请输入竞赛名称"
        style="width: 200px;"
        class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" @click="getList">搜索</el-button>
    </div>

    <!--竞赛增删改查 begin-->
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" @click="addMatch(null)">新增</el-button>
      <el-button v-waves class="filter-item" type="danger" @click="removeMatch">删除</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="pubMatch(1)">公开</el-button>
      <el-button v-waves class="filter-item" type="danger" @click="pubMatch(0)">隐藏</el-button>
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
      @selection-change="checkTable">
      <el-table-column
        align="center"
        type="selection"/>
      <el-table-column
        align="center"
        prop="name_zh"
        label="竞赛名称"/>
      <el-table-column
        align="center"
        prop="process"
        label="状态">
        <template slot-scope="scope">
          <span v-show="scope.row.process==0">进行中</span>
          <span v-show="scope.row.process==1">未开始</span>
          <span v-show="scope.row.process==2">已结束</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="start_time"
        label="开始时间"/>
      <el-table-column
        align="center"
        prop="end_time"
        label="结束时间"/>

      <el-table-column
        align="center"
        prop="status"
        label="公开/隐藏">
        <template slot-scope="scope">
          <span>{{ scope.row.public?'公开':'隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="create_user"
        label="创建者"/>
      <el-table-column
        label="操作"
        align="center"
        width="200px">
        <template slot-scope="scope">
          <el-button
            v-waves
            v-if="!scope.row.is_sponsor"
            class="filter-item"
            size="mini"
            type="success"
            @click="editMatch(scope.row.id)">编辑
          </el-button>
          <el-button v-waves class="filter-item" size="mini" type="warning" @click="operation(scope.row)">竞赛运维
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>
  </div>
</template>

<script>
import { fetchJeopardyList, deleteJeopardyMatch, publicJeopardyMatch, fetchJeopardyInfo } from '@/api/match/layered'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { setStorage } from '@/utils/storage'

const matchStatus = [
  { key: '', display_name: '所有状态' },
  { key: 0, display_name: '进行中' },
  { key: 1, display_name: '未开始' },
  { key: 2, display_name: '已结束' }
]

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
        process: '', // 比赛进展
        mode: '', // 参赛方式
        sponsor_zh: '', // 主办方账号昵称
        type: '', // 竞赛类型
        offset: 0
      },
      matchList: [],
      ids: []// 选中的表格id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    pubMatch(pub) { // 公开、隐藏竞赛
      const data = {
        ids: this.ids,
        public: pub
      }
      publicJeopardyMatch(data).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    removeMatch() { // 删除竞赛
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
      }).then(() => {
        deleteJeopardyMatch(data).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() { // 获取表格
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      fetchJeopardyList(this.listQuery).then(res => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },
    checkTable(val) { // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    },
    addMatch() { // 新增竞赛
      this.$router.push({
        path: '/competition/layered/createMatch'
      })
    },
    editMatch(id) { // 编辑竞赛
      this.$router.push({
        path: '/competition/layered/editMatch/editMatch',
        query: { id: id }
      })
    },
    accredit(id, mode) { // 授权管理
      this.$router.push({
        path: '/competition/layered/accredit',
        query: {
          id: id,
          mode: mode
        }
      })
    },

    operation(obj) { // 竞赛运维
      if (obj.is_sponsor) {
        window.location.href = '/competition/manageCenter?id=' + obj.id
      } else {
        fetchJeopardyInfo(obj.id).then(res => {
          setStorage('match_info', res.data)

          this.$router.push({
            path: '/competition/layered/operation',
            query: { id: obj.id }
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
