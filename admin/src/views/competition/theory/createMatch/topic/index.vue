<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button type="success" size="mini" @click="goImport"> 导入题目</el-button>

      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
      <el-button type="success" size="mini" @click="viewPaper">试卷预览</el-button>
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
        style="width: 100%"
        @selection-change="checkTable">
        <el-table-column
          align="center"
          type="selection"/>
        <el-table-column
          align="center"
          prop="title"
          label="题目名称">
          <template slot-scope="scope">
            <span style="text-align: left">{{ scope.row.title.length>20?scope.row.title.substr(0,20)+'...':scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="type_name"
          label="题目类型"/>
        <el-table-column
          align="center"
          prop="category_name"
          label="题目方向"/>
        <el-table-column
          align="center"
          prop="tag_name"
          label="题目标签"/>
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
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>

    <el-dialog
      :visible.sync="showView"
      title="试卷预览"
      width="80%"
    >
      <paper
        :judge-list.sync="judgeList"
        :check-box-list.sync="checkBoxList"
        :radio-list.sync="radioList"
        :judge-score="judgeScore"
        :radio-score="radioScore"
        :check-box-score="checkBoxScore"
        :show-user="false"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  fetchTopicList,
  deleteSub,
  viewPaper,
  canImport
} from '@/api/match/theory'
import paper from '@/views/competition/theory/common/paper'

export default {
  name: 'TopicManagement',
  directives: { waves },
  components: {
    Pagination,
    paper
  },
  data() {
    return {
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      tableKey: 0,
      listTotal: 0, // 题目列表总条数
      listLoading: false,
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        evt_hash: this.$route.query.hash
      },

      showView: false, // 试卷预览弹窗控制按钮
      judgeList: [], // 判断题列表
      radioList: [], // 单选题列表
      checkBoxList: [], // 多选题列表
      judgeScore: 0, // 多选题列表
      radioScore: 0, // 多选题列表
      checkBoxScore: 0// 多选题列表
    }
  },
  created() {
    this.getList()
  },
  methods: {
    goImport() {
      // 进入导入题目页面之前先请求
      canImport(this.listQuery.evt_hash).then(res => {
        if (res.data.success) {
          this.$router.push({
            path: '/competition/theory/editMatch/importTopic',
            query: { hash: this.listQuery.evt_hash }
          })
        }
      })
    },
    viewPaper() { // 预览试卷
      viewPaper(this.listQuery.evt_hash).then(res => {
        this.radioList = res.data[1]
        this.judgeList = res.data[3]
        this.checkBoxList = res.data[2]
        // 获取总分
        this.getSore(this.judgeList, 'judgeScore')
        this.getSore(this.radioList, 'radioScore')
        this.getSore(this.checkBoxList, 'checkBoxScore')

        this.showView = true
      })
    },
    getSore(arr3, type) { // 获取分数总和
      this[type] = arr3.reduce((acc, cur) => {
        return acc + cur.point
      }, 0)
    },
    nextStep() {
      this.$emit('nextStep')
    },
    indexMethod(index) { // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    backStep() {
      this.$emit('backStep')
    },
    removeSub() { // 删除题目
      const params = {}
      params.ids = this.ids
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSub(this.listQuery.evt_hash, params).then(res => {
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
      this.listQuery.offset = this.listPage
      fetchTopicList(this.listQuery.evt_hash, this.listQuery).then(res => {
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total

        // 如果在最后一页删除条目，则重新请求接口修正页码
        if (this.listTotal <= (this.listQuery.offset - 1) * this.listQuery.limit && this.listTotal != 0) {
          this.listQuery.offset = this.listQuery.offset - 1
          this.getList()
        }
      })
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

  .topicStep_box {
    display: flex;

    justify-content: center;
    align-items: center;
  }
</style>
