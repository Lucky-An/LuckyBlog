<template>
  <div class="app-container competition_box">
    <!--表格搜索 begin-->
    <div class="filter-container">
      <!--<el-select v-model="listQuery.type" placeholder="竞赛类型" clearable class="filter-item" style="width: 130px">-->
      <!--<el-option-->
      <!--v-for="item in matchType"-->
      <!--:key="item.key"-->
      <!--:label="item.display_name"-->
      <!--:value="item.key"/>-->
      <!--</el-select>-->

      <el-select v-model="listQuery.status" placeholder="请选择竞赛状态" class="filter-item" clearable size="mini">
        <el-option
          v-for="(val,k) in matchStatus"
          :key="k"
          :label="val"
          :value="k"/>
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
        v-model="listQuery.name"
        placeholder="请输入竞赛名称"
        style="width: 200px;"
        class="filter-item"
        size="mini"/>
      <el-button class="filter-item" type="primary" size="mini" @click="getList(1)">搜索</el-button>
    </div>

    <!--竞赛增删改查 begin-->
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" @click="addMatch(null)">新增</el-button>
      <el-button class="filter-item" type="danger" size="mini" @click="removeMatch">删除</el-button>
      <el-button class="filter-item" type="success" size="mini" @click="pubMatch(1)">公开</el-button>
      <el-button class="filter-item" type="danger" size="mini" @click="pubMatch(0)">隐藏</el-button>
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

      <el-table-column :index="indexMethod" align="center" width="50px" label="序号" type="index" />

      <el-table-column
        align="center"
        prop="name_zh"
        label="竞赛名称"/>
      <el-table-column
        align="center"
        label="竞赛状态">
        <template slot-scope="scope">
          <span v-if="scope.row.process===1">未开始</span>
          <span v-if="scope.row.process===0">
            {{ matchStatus[scope.row.status] }}
          </span>
          <span v-if="scope.row.process===2">已结束</span>
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
            v-if="!scope.row.is_sponsor"
            class="filter-item"
            size="mini"
            type="success"
            @click="editMatch(scope.row.id)">编辑
          </el-button>

          <el-button class="filter-item" size="mini" type="warning" @click="operation(scope.row)">竞赛运维
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
import { fetchDefenseList, deleteDefenseMatch, publicDefenseMatch, fetchDefenseInfo } from '@/api/match/DevOps'
import Pagination from '@/components/Pagination'
import { setStorage } from '@/utils/storage'

const matchType = [
  { key: '', display_name: '全部竞赛' },
  { key: 7, display_name: '公开赛' },
  { key: 6, display_name: '邀请赛' }
]
const joinType = [
  { key: '', display_name: '全部参赛方式' },
  { key: 1, display_name: '个人赛' },
  { key: 2, display_name: '组队赛' }
]
const matchStatus = {
  1: '未开始',
  2: '暂停中',
  3: '进行中',
  4: '已结束'
}

export default {
  name: 'IndexVue',
  components: { Pagination },
  data() {
    return {
      id: this.$route.id, // 竞赛id

      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      matchType,
      joinType,
      matchStatus,
      listQuery: {
        name: '', // 竞赛名称
        order: 'asc',
        limit: this.$store.state.config.row,
        status: '', // 比赛进展
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
      publicDefenseMatch(data).then(res => {
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
      this.$confirm('建议删除比赛前先删除掉本比赛已创建网络和题目环境，是否删除比赛？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDefenseMatch(data).then(res => {
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
    getList(page) {
      if (page === 1) this.page = page

      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      fetchDefenseList(this.listQuery).then(res => {
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
        path: '/competition/DevOps/createMatch'
      })
    },
    editMatch(id) { // 编辑竞赛
      this.$router.push({
        path: '/competition/DevOps/editMatch/editMatch',
        query: { id: id }
      })
    },
    accredit(id, mode) { // 授权管理
      this.$router.push({
        path: '/competition/DevOps/accredit',
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
        fetchDefenseInfo(obj.id).then(res => {
          setStorage('match_info', res.data)

          this.$router.push({
            path: '/competition/DevOps/operation',
            query: { id: obj.id }
          })
        })
      }
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.page - 1) * this.listQuery.limit + index + 1
    }
  }
}
</script>

<style scoped>

</style>
