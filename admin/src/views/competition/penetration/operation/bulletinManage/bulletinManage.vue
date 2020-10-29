<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="is_task"
        size="mini"
        placeholder="比赛公告"
        @change="selectChange"
      >
        <el-option :value="0" label="比赛公告" />
        <el-option :value="1" label="题目提示" />
      </el-select>
      <!--! 题目提示后的input -->
      <span
        v-show="is_task === 1"
        style="display: inline-block; margin-left: 10px; font-size: 14px"
      >
        请选择题目:
        <el-select
          v-model="task_id"
          size="mini"
          placeholder="请选择题目名称"
          clearable
        >
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
      <el-button type="danger" size="mini" @click="deleteNotice">
        删除</el-button
        >
      <el-button type="success" size="mini" @click="topPenetrationNoice(1)">
        置顶</el-button
        >
      <el-button type="danger" size="mini" @click="topPenetrationNoice(0)">
        取消置顶</el-button
        >
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="checkTable"
      >
        <el-table-column align="center" type="selection" />

        <el-table-column type="index" width="50" align="center" label="序号" />

        <el-table-column
          :label="is_task === 1 ? '题目提示' : '竞赛公告'"
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
        <el-table-column align="center" label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="success"
              @click="editNoice(scope.row)"
            >编辑
            </el-button>
            <!-- <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="danger"
              @click="deleteNotice(scope.row)"
              >删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listSelect.offset"
      :limit.sync="listSelect.limit"
      @pagination="getPageList"
    />

    <el-dialog :visible.sync="addDlg" @close="closeDiglog">
      <span slot="title" style="font-weight: bold; font-size: 18px">{{
        diaTitle
      }}</span>
      <el-input
        :rows="4"
        v-model="noticeContente"
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
  httpGetNoticeList, //! 公告列表
  httpPostNoticeList, //! 创建公告
  httpPostNoticeDelete, //! 删除公告
  httpPostNoticeTop, //! 公告置顶与取消置顶
  httpGetNoticeDetail, //! 公告回显
  httpPostNoticeDetail, //! 公告编辑
  httpGetNoticeTasks //! 题目提示列表
} from '@/api/match/penetration'
export default {
  name: 'BulletinManage',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      is_task: 0,
      event_id: this.$route.query.id,
      matchList: [],
      ids: [], // 选中项id数组
      addDlg: false,
      diaTitle: '',
      noticeContente: '', // 公告内容
      topicList: [], // 题目列表
      task_id: '', // 选中题目
      noticeId: '', // 公告id
      total: 0,
      listSelect: {
        limit: 10, // 每页显示数量
        offset: 1 // 页码
      }
    }
  },
  created() {
    this.getNoticeList()
    httpGetNoticeTasks({ event_id: this.event_id }).then((res) => {
      this.topicList = res.data
    })
  },
  methods: {
    // ! 分页切换
    getPageList(params) {
      this.limit = params.limit
      this.offset = params.page
      this.getNoticeList()
    },
    selectChange() {
      this.getNoticeList()
    },
    // !获取竞赛列表
    getNoticeList() {
      httpGetNoticeList({
        event_id: this.event_id,
        is_task: this.is_task,
        page: this.listSelect.offset,
        per_page: this.listSelect.limit
      }).then((res) => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },
    // ! 复选框切换
    checkTable(val) {
      this.ids = []
      val.forEach((element) => {
        this.ids.push(element.id)
      })
    },
    //! 删除公告调用接口
    deleteNotice(row) {
      let ids = []
      if (row.id) {
        ids.push(row.id)
      } else {
        ids = this.ids
      }
      if (ids.length > 0) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            httpPostNoticeDelete(
              { event_id: this.event_id },
              { ids: ids }
            ).then((res) => {
              this.ids = []
              this.getNoticeList()
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          type: 'info',
          message: '未选中任何数据'
        })
      }
    },
    // !置顶
    topPenetrationNoice(action) {
      if (this.ids.length) {
        const data = {
          ids: this.ids,
          action
        }
        httpPostNoticeTop({ event_id: this.event_id }, data).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.ids = []
            this.getNoticeList()
          }
        })
      } else {
        this.$message.warning('请选择要操作内容')
      }
    },
    // ! 新增公告  编辑公告
    submitNotice() {
      if (this.noticeId) {
        // 这是编辑公告
        httpPostNoticeDetail(
          { event_id: this.event_id, notice_id: this.noticeId },
          { notice: this.noticeContente }
        ).then((res) => {
          if (res.data.message) {
            this.$message.success('操作成功')
            this.addDlg = false
            this.noticeContente = ''
            this.task_id = ''
            this.noticeId = 0
            this.getNoticeList()
          }
        })
      } else {
        if (this.is_task === 1) {
          if (this.task_id === '') {
            this.$message.warning('请选择题目')
          } else {
            httpPostNoticeList(
              { event_id: this.event_id },
              {
                notice: this.noticeContente,
                is_task: this.is_task,
                task_id: this.task_id
              }
            ).then((res) => {
              if (res.data.message) {
                this.$message.success('操作成功')
                this.addDlg = false
                this.noticeContente = ''
                this.task_id = ''
                this.getNoticeList()
              }
            })
          }
        } else {
          httpPostNoticeList(
            { event_id: this.event_id },
            {
              notice: this.noticeContente,
              is_task: this.is_task,
              task_id: 0
            }
          ).then((res) => {
            if (res.data.message) {
              this.$message.success('操作成功')
              this.addDlg = false
              this.noticeContente = ''
              this.task_id = ''
              this.getNoticeList()
            }
          })
        }
      }
    },

    showDlg() {
      if (this.is_task == 0) {
        // this.$alert("请选择题目", "警告", { confirmButtonText: "确定" });
        // return;
        this.diaTitle = '新增公告'
      }
      if (this.is_task == 1) {
        this.diaTitle = '新增题目提示'
      }
      this.addDlg = true
    },
    closeDiglog() {
      this.addDlg = false
      this.noticeContente = ''
      this.task_id = ''
      this.noticeId = 0
      this.getNoticeList()
    },

    editNoice(row) {
      // 编辑公告
      this.noticeId = row.id
      if (this.is_task === 0) {
        this.diaTitle = '编辑公告'
      } else {
        this.diaTitle = '编辑题目提示'
      }
      this.noticeContente = row.notice
      this.addDlg = true
    }
  }
}
</script>

<style scoped>
</style>
