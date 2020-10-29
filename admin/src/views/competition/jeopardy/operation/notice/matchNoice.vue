<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="noiceType"
        size="mini"
        placeholder="竞赛公告"
        @change="handleType"
      >
        <el-option :value="1" label="竞赛公告" />
        <el-option :value="2" label="题目提示" />
      </el-select>

      <span
        v-show="noiceType === 2"
        style="display: inline-block; margin-left: 10px; font-size: 14px"
      >
        请选择题目:
        <el-select v-model="task_id" size="mini" placeholder="请选择题目名称">
          <el-option
            v-for="item in topicList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </span>
    </div>

    <div class="filter-container">
      <el-button type="success" size="mini" @click="showDlg"> 新增</el-button>
      <el-button type="danger" size="mini" @click="romoveNoice">
        删除</el-button
        >
      <el-button type="success" size="mini" @click="topJeopardyNoice(1)">
        置顶</el-button
        >
      <el-button type="danger" size="mini" @click="topJeopardyNoice(0)">
        取消置顶</el-button
        >
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :key="tableKey"
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="checkTable"
      >
        <el-table-column align="center" type="selection" />

        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          width="50"
          label="序号"
        />

        <el-table-column
          v-if="noiceType === 2"
          align="center"
          prop="event_task"
          label="题目名称"
          width="200"
        />
        <el-table-column
          :label="noiceType === 2 ? '题目提示' : '竞赛公告'"
          prop="notice"
        />

        <el-table-column
          align="center"
          prop="jointype"
          label="是否置顶"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.is_topped == 0 ? "否" : "是" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_time"
          label="发布时间"
          width="200px"
        />
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="success"
              @click="editNoice(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-waves
              size="mini"
              type="danger"
              @click="remove(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />

    <el-dialog :visible.sync="addDlg" @close="closeDiglog">
      <span slot="title" style="font-weight: bold; font-size: 18px">{{
        diaTitle
      }}</span>
      <el-input
        :rows="4"
        v-model="addQuery.notice"
        type="textarea"
        placeholder="请输入内容"
      />

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
  getAllTipick,
  fetchJeopardyNoiceList,
  fetchJeopardyTipList,
  addJeopardyNoice,
  addJeopardyTIP,
  updateJeopardyNoice,
  updateJeopardyTIP,
  removeJeopardyNoice,
  removeJeopardyTIP,
  topJeopardyNoice,
  topJeopardyTIP
} from '@/api/match/jeopardy'

export default {
  name: 'MatchNotice',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      addQuery: {
        event_id: this.$route.query.id,
        notice: ''
      },
      event_task: [], // 题目列表
      task_id: '', // 题目id
      diaTitle: '', // 弹窗题目
      noticeId: false, // 公告id
      addDlg: false,
      ids: [],
      matchList: [],
      topicList: [],
      topic: '',
      noiceType: 1, // 公告类型
      tableKey: 0,
      total: 1,
      page: 1,
      listQuery: {
        page: 0,
        per_page: this.$store.state.config.row,
        evt_hash: this.$route.query.hash
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    topJeopardyNoice(init) {
      // 置顶、取消置顶
      if (this.ids.length == 0) {
        return false
      }
      const data = {
        ids: this.ids,
        is_topped: init
      }

      if (this.noiceType === 1) {
        topJeopardyNoice(data).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
            this.ids = []
          }
        })
      } else {
        topJeopardyTIP(data).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
            this.ids = []
          }
        })
      }
    },
    romoveNoice() {
      // 删除
      const data = { ids: this.ids }
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.noiceType === 1) {
            removeJeopardyNoice(data).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getList()
                this.ids = []
              }
            })
          } else {
            removeJeopardyTIP(data).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getList()
                this.ids = []
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleType() {
      // 切换公告、提示
      this.ids = []
      this.listQuery.page = 1
      this.getList()
    },
    submitNotice() {
      // 发布、编辑 公告
      if (this.noticeId) {
        this.noiceType === 1
          ? this.updateJeopardyNoice()
          : this.updateJeopardyTIP()
      } else {
        this.noiceType === 1 ? this.addJeopardyNoice() : this.addJeopardyTIP()
      }
    },
    updateJeopardyNoice() {
      // 提交公告编辑
      updateJeopardyNoice({ notice_id: this.noticeId }, this.addQuery).then(
        (res) => {
          if (res.data.success) {
            this.$message.success('修改成功')
            this.getList()
            this.addDlg = false
            this.noticeId = ''
          }
        }
      )
    },
    updateJeopardyTIP() {
      // 提交提示编辑
      updateJeopardyTIP({ notice_id: this.noticeId }, this.addQuery).then(
        (res) => {
          if (res.data.success) {
            this.$message.success('修改成功')
            this.getList()
            this.addDlg = false
            this.noticeId = ''
          }
        }
      )
    },
    addJeopardyTIP() {
      // 提交新增提示
      const data = this.addQuery
      data.task_id = this.task_id
      addJeopardyTIP(data).then((res) => {
        if (res.data.success) {
          this.$message.success('新增成功')
          this.getList()
          this.addDlg = false
        }
      })
    },
    addJeopardyNoice() {
      // 提交新增公告
      addJeopardyNoice(this.addQuery).then((res) => {
        if (res.data.success) {
          this.$message.success('新增成功')
          this.getList()
          this.addDlg = false
        }
      })
    },
    showDlg() {
      this.diaTitle = '新增公告'
      if (this.noiceType === 2 && !this.task_id) {
        this.$alert('请选择题目', '警告', { confirmButtonText: '确定' })

        return
      }
      if (this.noiceType === 2) {
        this.diaTitle = '新增题目提示'
      }
      this.addDlg = true
    },
    getList() {
      if (this.noiceType === 1) {
        this.getNoiceList()
      } else {
        this.getTopicList()
        this.getTipList()
      }
    },
    remove(row) {
      this.ids = [row.id]
      this.romoveNoice()
    },
    editNoice(row) {
      // 编辑公告
      this.noticeId = row.id
      if (this.noiceType === 1) {
        this.diaTitle = '编辑公告'
        this.addQuery.notice = row.notice
        this.addQuery.event_id = row.event_id
      } else {
        this.diaTitle = '编辑题目提示'
        this.addQuery.notice = row.notice
        this.addQuery.event_id = row.event_id
      }
      this.addDlg = true
    },
    getTopicList() {
      // 获取题目列表
      getAllTipick({ evt_hash: this.$route.query.hash }).then((res) => {
        this.topicList = res.data.data
      })
    },
    getNoiceList() {
      // 获取公告列表
      fetchJeopardyNoiceList(this.listQuery).then((res) => {
        const { data } = res
        this.matchList = data.data
        this.total = data.total
      })
    },
    getTipList() {
      // 获取提示列表
      fetchJeopardyTipList(this.listQuery).then((res) => {
        this.matchList = res.data.data
        this.total = res.data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.id
      })
    },
    closeDiglog() {
      this.textarea = ''
      this.noticeId = ''
      this.addQuery.notice = ''
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.page - 1) * this.listQuery.per_page + index + 1
    }
  }
}
</script>

<style scoped>
</style>
