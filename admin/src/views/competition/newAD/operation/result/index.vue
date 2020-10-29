<template>
  <div class="app-container">
    <div class="filter-container" style="float: left">
      <el-input
        v-model.trim="listQuery.team_name"
        placeholder="请输入选手名称"
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
      >搜索</el-button
      >
    </div>

    <div class="filter-container" style="float: right">
      <a
        :href="
          '/api/v1/att_def/admin/operation/statistic_download/?event_id=' + id
        "
        download
      >
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          size="mini"
        >成绩导出</el-button
        >
      </a>
      <!--<a-->
        <!--:href="-->
          <!--'/api/v1/att_def/admin/operation/event_status_download/?event_id=' +-->
            <!--id-->
        <!--"-->
        <!--download-->
      <!--&gt;-->
        <!--<el-button-->
          <!--v-waves-->
          <!--class="filter-item"-->
          <!--type="warning"-->
          <!--size="mini"-->
        <!--&gt;竞赛数据导出</el-button-->
        <!--&gt;-->
      <!--</a>-->
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="matchList" border style="width: 100%">
        <el-table-column
          align="center"
          width="50px"
          label="名次"
          type="index"
        />
        <el-table-column align="center" prop="name" label="选手名称" />

        <el-table-column align="center" prop="last_time" label="最后提交" />

        <el-table-column align="center" prop="final_score" label="得分" />

        <el-table-column align="center" prop="reward" label="奖罚分数" />
        <el-table-column align="center" label="查看详情">
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              @click="showScore(scope.row)"
            >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :visible.sync="scoreDig" title="查看详情" width="80%">
      <p>当前选手:{{ rowdata.name }}</p>
      <el-table :data="scoreList" border height="300">
        <!-- <el-table-column
          align="center"
          width="50px"
          label="序号"
          type="index"
        /> -->
        <el-table-column
          :index="indexMethod"
          type="index"
          width="55"
          label="序号"
          align="center"
        />
        <el-table-column align="center" label="分数">
          <template slot-scope="scope">
            {{ `${scope.row.change_score} ` }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="round" label="轮次" />
        <el-table-column align="center" prop="create_time" label="提交时间" />
      </el-table>

      <pagination
        v-show="scoreTotal > 0"
        :total="scoreTotal"
        :page.sync="scoreQuery.offset"
        :limit.sync="scoreQuery.limit"
        @pagination="showScore"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { defenseFetchResultList, defenseResultDetail } from '@/api/match/newAD'

export default {
  name: 'UserManagement',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      rowdata: {},
      name: '',
      params: { event_id: this.$route.query.id, name: '' },
      id: this.$route.query.id,
      scoreDig: false,
      scoreList: [], // 成绩管理
      matchList: [], //
      listTotal: 0,
      listPage: 1,
      listQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        event_id: this.$route.query.id,
        name: ''
      },
      scoreQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        event_id: this.$route.query.id
      },
      scoreTotal: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) {
      // 展示序号的方法
      return (this.scoreQuery.offset - 1) * this.scoreQuery.limit + index + 1
    },
    showScore(row) {
      // 展示成绩
      if (row.id) {
        this.rowdata = row
        this.scoreDig = true
        this.scoreQuery.offset = 1
      }
      defenseResultDetail(this.scoreQuery, this.rowdata.id).then(({ data }) => {
        if (data.success) {
          this.scoreList = data.row
          this.scoreTotal = data.total
        }
      })
    },
    getList() {
      defenseFetchResultList(this.listQuery).then((res) => {
        const { data } = res
        if (data.success) {
          this.matchList = data.data
        }
        this.listTotal = res.data.total
      })
    },
    checkTable() {
      // 选择表格
    }
  }
}
</script>

<style scoped>
</style>
