<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="search"
        placeholder="请输入选手名称"
        style="width: 150px;"
        size="mini"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList()"
      >搜索
      </el-button>

      <!--<a-->
        <!--:href="'/api/v1/inf/admin/operation/event_data_download/?event_id='+$route.query.id"-->
        <!--download-->
        <!--style="float: right;"-->
      <!--&gt;-->
        <!--<el-button-->
          <!--v-waves-->
          <!--class="filter-item"-->
          <!--type="warning"-->
          <!--size="mini"-->
        <!--&gt;竞赛数据导出-->
        <!--</el-button>-->
      <!--</a>-->
      <a
        :href="'/api/v1/inf/admin/operation/statistic_download/?event_id='+$route.query.id"
        download
        style="float: right;"
      >
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          style="margin-right:30px"
          size="mini"
        >成绩导出
        </el-button>
      </a>

    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >

        <el-table-column
          align="center"
          width="50px"
          label="名次"
          type="index"
        />

        <el-table-column
          align="center"
          prop="logo"
          label="选手LOGO"
        >
          <template slot-scope="scope">
            <img :src="scope.row.logo" style="width: 50px;height: 50px;" alt="">
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="name"
          label="选手名称"
        />

        <el-table-column
          align="center"
          prop="totle_score"
          label="总积分"
        />
        <el-table-column
          align="center"
          prop="solving_score"
          label="解题得分"
        />
        <el-table-column
          align="center"
          prop="reward_score"
          label="奖罚分数"
        />

        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">

            <el-button
              v-waves
              size="mini"
              type="success"
              @click="getDetialList(scope.row)"
            >查看详情
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="showDialog"
      title="查看详情"
      @close="closeDiglog"
    >
      <p>
        当前选手: {{ name }}
      </p>
      <el-table
        :data="detialList"
        border
      >

        <el-table-column
          align="center"
          width="50px"
          label="序号"
          type="index"
        />

        <el-table-column
          align="center"
          prop="title"
          label="题目名称"
        />

        <el-table-column
          align="center"
          prop="create_time"
          label="解题时间"
        />

        <el-table-column
          align="center"
          prop="content"
          label="提交内容"
        />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listSelect.offset"
        :limit.sync="listSelect.limit"
        @pagination="getPageList"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDiglog">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  httpGetEventStatistic,
  httpGetDetialEventStatistic,
  matchPenetrationInfo
} from '@/api/match/penetration'

export default {
  name: 'MyResult',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      search: '',
      event_id: this.$route.query.id,
      tableData: [],
      total: 0,
      listSelect: {
        limit: 10, // 每页显示数量
        offset: 1 // 页码
      },
      detialList: [],
      showDialog: false,
      rowData: {},
      name: ''// 当前选手
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeDiglog() {
      this.showDialog = false
    },
    // ! 分页切换
    getPageList(params) {
      this.limit = params.limit
      this.offset = params.page
      this.getDetialList(this.rowData)
    },
    // 结果列表
    getList() {
      httpGetEventStatistic({
        event_id: this.event_id,
        name: this.search
      }).then(res => {
        this.tableData = res.data.data_list
      })
    },
    getDetialList(row) {
      if (row) {
        this.rowData = row
        this.name = row.name
      }
      httpGetDetialEventStatistic(
        {
          event_id: this.event_id,
          page: this.listSelect.offset,
          per_page: this.listSelect.limit
        },
        row.contestant_id
      ).then(res => {
        this.detialList = res.data.data_list
        this.total = res.data.total
        this.showDialog = true
      })
    }
  }
}
</script>

<style scoped>
</style>
