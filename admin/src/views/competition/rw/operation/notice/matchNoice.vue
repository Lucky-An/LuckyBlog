<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button type="success" size="mini" @click="showDlg"> 新增</el-button>
      <el-button type="danger" size="mini" @click="romoveNoice"> 删除</el-button>
      <el-button type="success" size="mini" @click="topNoice(true)"> 置顶</el-button>
      <el-button type="danger" size="mini" @click="topNoice(false)"> 取消置顶</el-button>

      <!--<div style="float: right;">-->
      <!--<el-input-->
      <!--v-model="listQuery.search"-->
      <!--placeholder="题目提示"-->
      <!--style="width: 150px;"-->
      <!--size="mini"-->
      <!--class="filter-item"/>-->
      <!--<el-button v-waves class="filter-item" type="primary"   size="mini" @click="getList">搜索-->
      <!--</el-button>-->

      <!--</div>-->

    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="checkTable">
        <el-table-column
          align="center"
          type="selection"/>

        <el-table-column :index="indexMethod" align="center" type="index" width="50" label="序号" />

        <el-table-column
          prop="notice"
          label="公告内容"
        />
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="notice_en"-->
        <!--label="比赛公告英文"/>-->

        <el-table-column
          align="center"
          prop="jointype"
          label="是否置顶"
          width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.is_topped==0?'否':'是' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_time"
          label="发布时间"
          width="200px"/>
        <el-table-column
          align="center"
          label="操作"
          width="200px">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="success"
              @click="editNoice(scope.row)">编辑
            </el-button>
            <!--<el-button-->
            <!--v-waves-->
            <!--size="mini"-->
            <!--type="danger"-->
            <!--@click="remove(scope.row.id)">删除-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <el-dialog :visible.sync="addDlg" title="" @close="closeDiglog">
      <span slot="title" style="font-weight: bold;font-size: 18px">新增公告</span>
      <el-form :model="addQuery" class="texLeft" label-width="100px">
        <el-form-item label="公告中文内容" style="text-align: left">
          <el-input
            :rows="4"
            v-model="addQuery.notice"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
        <!--<el-form-item label="公告英文内容">-->
        <!--<el-input-->
        <!--:rows="4"-->
        <!--v-model="addQuery.notice_en"-->
        <!--type="textarea"-->
        <!--placeholder="请输入内容"/>-->
        <!--</el-form-item>-->
        <el-form-item label="是否置顶">
          <el-switch
            v-model="addQuery.is_topped"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNotice">确 定</el-button>
        <el-button @click="addDlg = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  fetchTopicList,
  fetchNoiceList,
  addNoice,
  updateNoice,
  removeNoice,
  topNoice
} from '@/api/match/realWord'

export default {
  name: 'MatchNotice',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      addQuery: {
        notice: '',
        // notice_en: '',
        is_topped: true
      },
      event_task: [], // 题目列表
      task_id: '', // 题目id
      noticeId: false, // 公告id
      addDlg: false,
      ids: [],
      matchList: [],
      topicList: [],
      topic: '',
      total: 1,
      page: 1,
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row
      },
      hash: this.$route.query['hash'],
      noiceType: 1// 设置默认为公告
    }
  },
  created() {
    this.getList()
  },
  methods: {
    topNoice(init) { // 置顶、取消置顶
      const data = {
        ids: this.ids,
        is_topped: init
      }

      if (this.noiceType === 1) {
        topNoice(this.hash, data).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
            this.ids = []
          }
        })
      }
    },
    // 单个删除
    remove(id) {
      this.ids = [id]
      this.romoveNoice()
    },
    romoveNoice() { // 删除
      const data = { ids: this.ids }
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.noiceType === 1) {
          removeNoice(this.hash, data).then(res => {
            if (res.data.success) {
              this.$message.success('删除成功')
              this.getList()
              this.ids = []
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleType() { // 切换公告、提示
      this.ids = []
      this.page = 1
      this.getList()
    },
    submitNotice() { // 发布、编辑 公告
      if (this.noticeId) {
        this.updateNoice()
      } else {
        this.addNoice()
      }
    },
    updateNoice() { // 提交公告编辑
      updateNoice(this.hash, this.noticeId, this.addQuery).then(res => {
        if (res.data.success) {
          this.$message.success('修改成功')
          this.getList()
          this.addDlg = false
          this.addQuery = {
            notice: '',
            notice_en: '',
            is_topped: true
          }
          this.noticeId = ''
        }
      })
    },
    addNoice() { // 提交新增公告
      addNoice(this.hash, this.addQuery).then(res => {
        if (res.data.success) {
          this.$message.success('新增成功')
          this.addQuery = {
            notice: '',
            notice_en: '',
            is_topped: true
          }
          this.getList()
          this.addDlg = false
        }
      })
    },
    showDlg() {
      if (this.noiceType === 2 && !this.task_id) {
        this.$alert('请选择题目', '警告', { confirmButtonText: '确定' })
        return
      }
      this.diaTitle = '新增题目提示'
      this.addDlg = true
    },
    getList() {
      if (this.noiceType === 1) {
        this.getNoiceList()
      }
    },
    editNoice(row) { // 编辑公告
      this.noticeId = row.id
      if (this.noiceType === 1) {
        this.addQuery.notice = row.notice
        this.addQuery.notice_en = row.notice_en
        this.addQuery.is_topped = row.is_topped
        this.addQuery.event_id = row.event_id
      } else {
        this.addQuery.notice = row.notice
        this.addQuery.event_id = row.event_id
      }
      this.addDlg = true
    },
    getTopicList() { // 获取题目列表
      const data = {}
      data.event = this.$route.query.id
      fetchTopicList(data).then(res => {
        this.topicList = res.data.rows
      })
    },
    getNoiceList() { // 获取公告列表
      this.listQuery.offset = this.page
      fetchNoiceList(this.hash, this.listQuery).then(res => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },

    checkTable(val) { // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    },
    closeDiglog() {
      this.textarea = ''
      this.noticeId = ''
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.page - 1) * this.listQuery.limit + index + 1
    }
  }
}
</script>

<style>
.texLeft .el-form-item__label{
  text-align: left;
}
</style>
