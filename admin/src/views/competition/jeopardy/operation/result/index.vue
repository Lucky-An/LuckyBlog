<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.search"
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
      >搜索
      </el-button>

      <div class="fr">
        <!--<a :href="'/api/v1/jeopardy/admin/event/scores/export?evt_hash='+listQuery.evt_hash" download>-->
        <!--<el-button v-waves class="filter-item" type="warning" size="mini">导出成绩</el-button>-->
        <!--</a>-->

        <a
          :href="
            '/api/v1/jeopardy/admin/event/data/export?evt_hash=' +
              listQuery.evt_hash
          "
          download
        >
          <el-button
            v-waves
            class="filter-item"
            type="warning"
            size="mini"
          >竞赛数据导出</el-button
          >
        </a>
        <!-- <el-button
          v-waves
          class="filter-item"
          type="warning"
          size="mini"
          @click="handleExport"
          >竞赛数据导出</el-button
        > -->
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
        <el-table-column label="选手名称" align="center" prop="obj_name" />

        <el-table-column align="center" prop="max_time" label="最后提交时间" />

        <el-table-column align="center" prop="sum_scores" label="总积分" />

        <el-table-column align="center" prop="sum_score" label="题目分数" />

        <el-table-column align="center" prop="rank" label="奖罚分数">
          <template slot-scope="scope">
            {{ scope.row.reward_score ? scope.row.reward_score : 0 }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="primary"
              @click="showScore(scope.row)"
            >查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />

    <el-dialog :visible.sync="scoreDig" title="成绩管理" @close="closeScore">
      <el-table :data="scoreList" border>
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"
        />

        <el-table-column align="center" prop="name" label="选手名称" />
        <el-table-column align="center" prop="title" label="题目" />

        <el-table-column align="center" prop="time" label="解题时间" />

        <el-table-column align="center" prop="score" label="解题分数" />
      </el-table>
      <pagination
        v-show="detailTotal > 0"
        :total="detailTotal"
        :page.sync="detailQuery.page"
        :limit.sync="detailQuery.per_page"
        @pagination="showScore"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  getResultList,
  ResultDetail,
  exportResult
} from '@/api/match/jeopardy'

import { checkFileAvailable } from '@/utils/common'

export default {
  name: 'UserManagement',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      scoreDig: false,
      scoreList: [], // 成绩管理
      matchList: [], //
      listTotal: 0,
      listQuery: {
        page: 0,
        per_page: this.$store.state.config.row,
        search: '',
        evt_hash: this.$route.query.hash
      },

      detailTotal: 0,
      detailQuery: {
        page: 0,
        per_page: this.$store.state.config.row,
        evt_hash: this.$route.query.hash,
        obj_id: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeScore() {
      this.detailPage = 1
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.page - 1) * this.listQuery.per_page + index + 1
    },
    showScore(row) {
      // 展示成绩
      if (row.obj_id) this.detailQuery.obj_id = row.obj_id

      ResultDetail(this.detailQuery).then((res) => {
        if (res.data.success) {
          this.scoreDig = true
          this.scoreList = res.data.data
          this.detailTotal = res.data.total
        }
      })
    },
    getList(page) {
      if (page === 1) this.listQuery.page = page
      getResultList(this.listQuery).then((res) => {
        this.matchList = res.data.data
        this.listTotal = res.data.total
      })
    },
    checkTable() {
      // 选择表格
    },

    handleExport() {
      exportResult({
        evt_hash: this.listQuery.evt_hash
      }).then(res => {
        checkFileAvailable(res)
      })
    }
  }
}
</script>

<style scoped>
</style>
