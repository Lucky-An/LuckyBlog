<template>
  <div class="app-container competition_box">
    <!--表格搜索 begin-->
    <div class="filter-container">
      <el-select
        v-model="listQuery.status"
        placeholder="请选择竞赛状态"
        clearable
        class="filter-item"
        size="mini"
      >
        <el-option
          v-for="(val,k) in matchStatus"
          :key="k"
          :label="val"
          :value="k"
        />
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
        v-model.trim="listQuery.name"
        placeholder="请输入竞赛名称"
        style="width: 200px;"
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

    <!--竞赛增删改查 begin-->
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="success"
        size="mini"
        @click="addMatch(null)"
      >新增</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        size="mini"
        @click="removeMatch"
      >删除</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="success"
        size="mini"
        @click="pubMatch(1)"
      >公开</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        size="mini"
        @click="pubMatch(0)"
      >隐藏</el-button>
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
      <el-table-column
        align="center"
        type="selection"
      />

      <el-table-column
        :index="indexMethod"
        align="center"
        type="index"
        width="50"
        label="序号"
      />

      <el-table-column
        align="center"
        prop="name_zh"
        label="竞赛名称"
      />
      <el-table-column
        align="center"
        prop="process"
        label="竞赛状态"
      >
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
        label="开始时间"
      />

      <el-table-column
        align="center"
        prop="end_time"
        label="结束时间"
      />

      <el-table-column
        align="center"
        prop="task_num"
        label="题目数量"
      />

      <el-table-column
        align="center"
        prop="status"
        label="公开/隐藏"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.public?'公开':'隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="create_user"
        label="创建者"
      />
      <el-table-column
        label="操作"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-waves
            v-if="!scope.row.is_sponsor"
            class="filter-item"
            size="mini"
            type="success"
            @click="editMatch(scope.row.id)"
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
  fetchPenetrationList,
  deletePenetrationMatch,
  publicPenetrationMatch,
  fetchPenetrationInfo
} from '@/api/match/penetration'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const matchStatus = {
  1: '未开始',
  2: '暂停中',
  3: '进行中',
  4: '已结束'
}

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
        name: '', // 竞赛名称
        limit: this.$store.state.config.row,
        status: '', // 比赛进展
        offset: 0
      },
      matchList: [],
      ids: [] // 选中的表格id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    pubMatch(pub) {
      if (this.ids.length == 0) {
        return
      }
      // 公开、隐藏竞赛
      const data = {
        ids: this.ids,
        public: pub
      }
      publicPenetrationMatch(data).then(res => {
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
          deletePenetrationMatch(data).then(res => {
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
      console.log(this.page)
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      fetchPenetrationList(this.listQuery).then(res => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    },
    addMatch() {
      // 新增竞赛
      this.$router.push({
        path: '/competition/penetration/createMatch'
      })
    },
    editMatch(id) {
      // 编辑竞赛
      this.$router.push({
        path: '/competition/penetration/editMatch/editMatch',
        query: { id: id }
      })
    },
    accredit(id, mode) {
      // 授权管理
      this.$router.push({
        path: '/competition/penetration/accredit',
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
          path: '/competition/penetration/operation',
          query: { id: obj.id }
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
