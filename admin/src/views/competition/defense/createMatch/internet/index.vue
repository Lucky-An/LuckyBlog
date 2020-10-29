<template>
  <div class="app-container ">

    <div class="filter-container">
      <el-button type="success" size="mini" @click="addInternet"> 增加网络</el-button>
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
    </div>

    <div class="filter-container">
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
        style="width: 100%">
        <el-table-column
          align="center"
          prop="team_name"
          label="账户"/>
        <el-table-column
          align="center"
          prop="name"
          label="网络名称"/>
        <el-table-column
          align="center"
          prop="ip"
          label="网络"/>
        <el-table-column
          align="center"
          prop="vlan"
          label="vlan"/>
        <el-table-column
          align="center"
          prop="mask"
          label="掩码"/>
        <el-table-column
          align="center"
          prop="gateway"
          label="网关"/>
        <el-table-column
          align="center"
          width="100px"
          label="操作">
          <template slot-scope="scope">
            <el-button v-waves class="filter-item" size="mini" type="success" @click="editInternet(scope.row.id)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <div class="btn_box topicStep_box">
      <el-button type="primary" @click="backStep">上一步</el-button>

      <router-link :to="{path:'/competition/defense/index'}">
        <el-button style="margin-left: 10px;" type="primary">完成</el-button>
      </router-link>

      <router-link :to="{path:'/competition/defense/operation',query:{id:id}}"><el-button style="margin-left: 10px;" type="warning">竞赛运维</el-button></router-link>
    </div>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  fetchInternet,
  delInternet
} from '@/api/match/defense'

export default {
  name: 'TopicManagement',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      matchList: [], // 网络列表
      hashs: [], // 选择的所有表格的项
      tableKey: 0,
      listTotal: 0, // 题目列表总条数
      subTotal: 0, // 导入题目弹窗总条数
      listLoading: false,
      listPage: 1, // 题目列表页码
      subPage: 1, // 导入题目弹窗页码
      topicQuery: {// 习题列表参数
        offset: 0,
        limit: this.$store.state.config.row
      },
      importData: {
        event: this.$route.query.id,
        hashs: []
      },
      id: this.$route.query.id,
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row
      }

    }
  },
  created() {
    this.getList()
    // this.getType()
  },
  methods: {
    indexMethod(index) { // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    backStep() {
      this.$emit('backStep')
    },

    handleChange(val) {
      this.importData.hashs = val.map(item => {
        return item.hash
      })
    },
    addInternet() { // 添加网络
      this.$router.push({
        path: '/competition/defense/editMatch/addInetnet', query: { id: this.id, step: 3 }
      },)
    },
    editInternet(i_id) { // 添加网络
      this.$router.push({
        path: '/competition/defense/editMatch/editInetnet', query: { id: this.id, internet_id: i_id, step: 3 }
      },)
    },
    removeSub() { // 删除网络
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = { event_id: this.id }
        delInternet(params).then(res => {
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
    getList(id) {
      // this.listQuery.offset = this.listPage
      const params = { event_id: this.id }
      fetchInternet(params).then(res => {
        if (id) this.closeLoading(id)
        const { data } = res
        this.matchList = data
        // this.listTotal = data.total
      })
    },
    checkTable(val) { // 选择表格
      this.hashs = val.map(item => {
        return item.hash
      })
    }
  }
}
</script>

<style scoped>
  .addsub .pagination-container {
    padding: 0;
  }

  .topicStep_box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
