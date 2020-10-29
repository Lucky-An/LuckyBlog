<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.team_name"
        placeholder="请输入选手名称"
        style="width: 200px"
        class="filter-item"
        size="mini"
      />
      <el-button
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList"
      >搜索</el-button
      >

      <div class="fr">
        <a
          :href="
            '/api/v1/ops/admin/operation/statistic_download/?event_id=' + id
          "
          download
        >
          <el-button
            v-waves
            class="filter-item"
            type="warning"
            size="mini"
          >成绩导出
          </el-button>
        </a>
        <!--<a-->
          <!--:href="-->
            <!--'/api/v1/ops/admin/operation/event_status_download/?event_id=' + id-->
          <!--"-->
          <!--download-->
        <!--&gt;-->
          <!--<el-button-->
            <!--v-waves-->
            <!--class="filter-item"-->
            <!--type="warning"-->
            <!--size="mini"-->
          <!--&gt;竞赛数据导出-->
          <!--</el-button>-->
        <!--</a>-->
      </div>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="matchList" border style="width: 100%">
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="名次"
          type="index"
        />
        <el-table-column align="center" prop="name" label="选手名称" />

        <el-table-column align="center" prop="final_score" label="总积分" />

        <el-table-column align="center" label="分数">
          <template slot-scope="scope">
            {{ scope.row.final_score + scope.row.reward }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="reward" label="奖罚分数" />

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="primary"
              @click="showScore(scope.row)"
            >
              查看详情
            </el-button>
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

    <!--查看详情-->
    <el-dialog :visible.sync="scoreDig" title="查看详情">
      <p>当前选手：{{ scoreQuery.name }}</p>
      <el-table :data="scoreList" border>
        <el-table-column
          :index="indexMethod2"
          align="center"
          width="50px"
          label="序号"
          type="index"
        />
        <el-table-column align="center" prop="challenge_name" label="漏洞点" />

        <el-table-column align="center" prop="round" label="轮次" />

        <el-table-column align="center" prop="score" label="得分" />
      </el-table>

      <pagination
        v-show="scoreTotal > 0"
        :total="scoreTotal"
        :page.sync="scoreQuery.offset"
        :limit.sync="scoreQuery.limit"
        @pagination="getDeatil"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  defenseFetchResultList,
  defenseResultDetail
} from '@/api/match/DevOps'

export default {
  name: 'UserManagement',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      params: { event_id: this.$route.query.id },
      id: this.$route.query.id,
      scoreDig: false,
      scoreList: [], // 成绩管理
      matchList: [], //
      listTotal: 0,
      scoreTotal: 0,
      listQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        team_name: '',
        event_id: this.$route.query.id
      },
      scoreQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        team_id: '',
        event_id: this.$route.query.id,
        name: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    showScore(row) {
      // 查看详情
      this.scoreQuery.team_id = row.id
      this.scoreQuery.name = row.name
      this.getDeatil()
    },
    // 展示成绩详情
    getDeatil() {
      defenseResultDetail(this.scoreQuery).then((res) => {
        this.scoreDig = true
        this.scoreList = res.data.data
        this.scoreTotal = res.data.total
      })
    },
    // 获取列表
    getList() {
      defenseFetchResultList(this.listQuery).then((res) => {
        this.matchList = res.data.data
        this.listTotal = res.data.total
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    indexMethod2(index) {
      // 展示序号的方法
      return (this.scoreQuery.offset - 1) * this.scoreQuery.limit + index + 1
    }
  }
}
</script>

<style scoped>
</style>
