<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.name" placeholder="操作员" class="filter-item" style="width: 130px" @change="log_message">
        <el-option value="" label="全部操作员"/>
        <el-option
          v-for="item in roleList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.time"
        style="vertical-align: top"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="搜索该时间段之后的数据"
        @change="log_message"/>

      <div style="float: right;">
        <el-date-picker
          v-model="time"
          style="vertical-align: top"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="删除该时间段之前的数据"/>
        <el-button v-waves class="filter-item" type="danger" @click="deleteLog">按时间删除日志</el-button>
      </div>
    </div>
    <el-table
      :data="matchList"
      border
      @selection-change="checkTable">

      <el-table-column
        align="center"
        prop="username"
        label="操作员"/>

      <el-table-column
        align="center"
        prop="create_time"
        label="操作时间"/>
      <el-table-column
        align="center"
        prop="action"
        label="动作"/>
      <el-table-column
        align="center"
        prop="user_ip"
        label="登陆IP地址"/>

    </el-table>
    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import { log_message, deleteLog, getAllRole } from '@/api/systemManage'

export default {
  name: 'MatchRecord',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      roleList: [], // 操作员列表
      activeName: 'status',
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        name: '',
        time: ''
      },
      time: ''
    }
  },
  created() {
    this.getList()
    this.getAllRole()
  },
  methods: {
    getAllRole() {
      getAllRole().then(res => {
        this.roleList = res.data.role
      })
    },
    deleteLog() { // 删除操作员日志
      if (!this.time) {
        this.$message.error('请选择删除哪个时间之前的日志')
        return
      }
      this.$confirm(`确定要删除${this.time}之前的日志吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLog({ time: this.time }).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.listPage = 1
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
    changeTab() {
      this.matchList = []
      this.listPage = 1
      this.getList()
    },
    log_message(k, v) { // 获取操作员日志
      this.listQuery[k] = v
      this.listQuery.offset = this.listPage
      log_message(this.listQuery).then(res => {
        this.matchList = res.data.row
        this.listTotal = res.data.total
      })
    },
    getList() {
      if (this.activeName === 'status') {
        this.log_message()
      } else if (this.activeName === 'system') {

      } else {

      }
    },
    checkTable(val) { // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    }
  }
}
</script>

<style scoped>
  .addsub .pagination-container {
    padding: 0;
  }

  .dict-secong-trans {
    text-decoration: underline;
    color: #4395ff;
  }

  .bm {
    padding-bottom: 20px;
    border-bottom: 1px solid #bbb;
  }
</style>
