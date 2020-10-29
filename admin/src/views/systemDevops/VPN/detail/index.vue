<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <!--<el-button type="danger" size="mini" @click="close">重置所有密钥</el-button>-->

      <el-button class="fr" type="warning" size="mini" @click="goBack">返回</el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border>
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="50"/>

        <el-table-column
          align="center"
          prop="event_name"
          label="竞赛名称"/>
        <el-table-column
          align="center"
          prop="user_name"
          label="账户名"/>
        <el-table-column
          align="center"
          prop="vpn_account"
          label="VPN账号"/>
        <el-table-column
          align="center"
          prop="virtual_address"
          label="VPN地址"/>
        <el-table-column
          align="center"
          prop="status"
          label="密钥管理">
          <template slot-scope="scope">
            <a :href="scope.row.download_path" download>
              <el-button type="warning" size="mini">下载</el-button>
            </a>
            <!--<el-button type="primary" size="mini" @click="close">重置密钥</el-button>-->
          </template>
        </el-table-column>

        <el-table-column
          prop="disk_rate"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="offline(scope.row.virtual_address)">强制下线</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.per_page"
      @pagination="getList"/>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import { vpnDetail, offline } from '@/api/systemDevOps'

export default {
  name: 'Config',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      id: this.$route.query.id,
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        page: 0,
        per_page: this.$store.state.config.row
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      vpnDetail(this.id, this.listQuery).then(res => {
        if (res.data.success) {
          const { data } = res
          this.matchList = data.data
          this.listTotal = data.total
        }
      })
    },
    // 强制下线
    offline(virtual_address) {
      offline(this.id, { virtual_address }).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    goBack(val) {
      history.back()
    }
  }
}
</script>

<style scoped>
  .title{
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: 1px solid #EBEEF5;
    padding: 0 20px;
    position: relative;
    top: 5px;
  }
</style>
