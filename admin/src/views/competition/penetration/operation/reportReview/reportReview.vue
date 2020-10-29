<template>
  <div>
    <!--<el-col-->
    <!--:span="4"-->
    <!--style="margin-bottom:30px"-->
    <!--&gt;-->
    <!--<el-button-->
    <!--v-waves-->
    <!--style="margin-left:30px"-->
    <!--class="filter-item"-->
    <!--size="medium "-->
    <!--type="primary"-->
    <!--&gt;裁判审核记录-->
    <!--</el-button>-->
    <!--</el-col>-->
    <el-button
      v-waves
      style="float: right; margin-bottom: 10px"
      class="filter-item"
      size="mini "
      type="primary"
      @click="getList"
    >
      刷新
    </el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" label="序号" />

      <el-table-column align="center" label="选手名称" prop="user_name" />

      <el-table-column align="center" prop="challenge_name" label="题目名称" />
      <el-table-column align="center" prop="update_time" label="提交时间" />

      <el-table-column align="center" label="报告下载">
        <template slot-scope="scope">
          <a :href="scope.row.path" download>
            <el-button
              v-waves
              class="filter-item"
              size="mini "
              type="primary"
            >下载
            </el-button>
          </a>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="count" label="提交次数" /> -->
      <el-table-column align="center" label="裁判操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-waves
            :disabled="scope.row.status === 1 || scope.row.status === 0"
            size="mini"
            type="success"
            @click="auditReport(scope.row, 1)"
          >审核通过
          </el-button>
          <el-button
            v-waves
            :disabled="scope.row.status === 1 || scope.row.status === 0"
            size="mini"
            type="danger"
            @click="auditReport(scope.row, 0)"
          >审核不通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listSelect.offset"
      :limit.sync="listSelect.limit"
      @pagination="getPageList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  httpGetReportCheck,
  httpPostRefereeOperation,
  httpPostReportCheck
} from '@/api/match/penetration'
export default {
  name: 'ReportReview',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      listSelect: {
        limit: 10, // 每页显示数量
        offset: 1 // 页码
      },
      tableData: [],
      event_id: this.$route.query.id
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // !报告审核
    auditReport(row, action) {
      // action 1审核通过需要进行二次确认 0审核不通过
      if (action) {
        this.$confirm('确定要审核通过吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.httpPostRefereeOperation(row, action)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        this.httpPostRefereeOperation(row, action)
      }
    },
    httpPostRefereeOperation(row, action) {
      httpPostRefereeOperation(
        { event_id: this.event_id },
        { report_id: row.id, action: action }
      ).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    // ! 文件查看
    downFile(row) {
      httpPostReportCheck({
        event_id: this.event_id,
        report_id: row.id
      }).then((res) => {})
    },
    // ! 分页切换
    getPageList(params) {
      this.limit = params.limit
      this.offset = params.page
      this.getList()
    },
    getList() {
      httpGetReportCheck({
        event_id: this.event_id,
        page: this.listSelect.offset,
        per_page: this.listSelect.limit
      }).then((res) => {
        this.tableData = res.data.rows
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
</style>
