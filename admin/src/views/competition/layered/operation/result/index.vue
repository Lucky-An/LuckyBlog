<template>
  <div class="app-container">
    <div class="filter-container">
      <a :href="'/api/v1/att_def/admin/operation/statistic_download/?event_id='+id" download>
        <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList">成绩导出
        </el-button>
      </a>

    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
      >

        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="名次"
          type="index"/>
        <el-table-column
          align="center"
          prop="name"
          label="队伍名称"/>

        <el-table-column
          align="center"
          prop="last_time"
          label="最后提交时间"/>

        <el-table-column
          align="center"
          prop="init_score"
          label="分数"/>

        <el-table-column align="center" label="操作" width="210px">
          <template slot-scope="scope">

            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-document"
              @click="showScore(scope.row)">查看详情
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--<pagination-->
    <!--v-show="listTotal>0"-->
    <!--:total="listTotal"-->
    <!--:page.sync="listPage"-->
    <!--:limit.sync="listQuery.limit"-->
    <!--@pagination="getList"/>-->

    <el-dialog :visible.sync="scoreDig" title="成绩管理">
      <el-table
        :data="scoreList"
        border>
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"/>

        <el-table-column
          align="center"
          prop="team_defend_name"
          label="队伍名称"/>
        <el-table-column
          align="center"
          prop="challenge_name"
          label="题目名称"/>

        <el-table-column
          align="center"
          prop="create_time"
          label="创建时间"/>

        <el-table-column
          align="center"
          prop="round"
          label="回合数"/>

        <el-table-column
          align="center"
          prop="create_time"
          label="提交时间"/>

        <el-table-column
          align="center"
          prop="round"
          label="提交内容"/>

      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getStorage } from '@/utils/storage'

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
      listPage: 1,
      scorePage: 1,
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        search: '',
        order: 'asc',
        event: this.$route.query.id
      }
    }
  },
  created() {
    // this.getList()
  },
  methods: {

    indexMethod(index) { // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    showScore(row) { // 展示成绩
      const params = {
        event_id: this.params.event_id,
        team_id: row.id
      }
      defenseResultDetail(params).then(res => {
        this.scoreDig = true
        this.scoreList = res.data
      })
    },
    getList() {
      defenseFetchResultList(this.params).then(res => {
        this.matchList = res.data
        // this.listTotal = res.data.total
      })
    },
    checkTable() { // 选择表格

    }
  }
}
</script>

<style scoped>

</style>
