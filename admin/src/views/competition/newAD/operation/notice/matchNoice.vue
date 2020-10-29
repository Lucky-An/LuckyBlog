<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="success" size="mini" @click="showDlg">新增</el-button>
      <el-button type="danger" size="mini" @click="romoveNoice">删除</el-button>
      <el-button type="success" size="mini" @click="topNoice(1)">置顶</el-button>
      <el-button type="danger" size="mini" @click="topNoice(0)">取消置顶</el-button>
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

        <el-table-column type="index" width="50" align="center" label="序号"/>

        <el-table-column prop="notice" label="公告内容" />

        <el-table-column align="center" prop="jointype" label="是否置顶" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.is_topped==0?'否':'是' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="create_time" label="发布时间" width="200px" />
        <el-table-column align="center" width="200px" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              @click="editNoice(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--<pagination-->
    <!--v-show="total>0"-->
    <!--:total="total"-->
    <!--:page.sync="page"-->
    <!--:limit.sync="listQuery.limit"-->
    <!--@pagination="getList"/>-->

    <el-dialog :visible.sync="addDlg" @close="closeDiglog">
      <span slot="title" style="font-weight: bold;font-size: 18px">{{ diaTitle }}</span>
      <el-input :rows="4" v-model.trim="addQuery.notice" type="textarea" placeholder="请输入内容" />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNotice">确 定</el-button>
        <el-button @click="addDlg = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from "@/components/Pagination";
import waves from '@/directive/waves'
import {
  fetchDefenseNotice,
  removeDefenseNotice,
  topDefenseNotice,
  addDefenseNotice,
  amendDefenseNotice
} from '@/api/match/newAD'

export default {
  name: 'MatchNotice',
  directives: { waves },
  //
  data() {
    return {
      params: { event_id: parseInt(this.$route.query.id) },
      addQuery: {
        notice: ''
      },
      diaTitle: '', // 弹窗题目
      noticeId: false, // 公告id
      addDlg: false,
      ids: [],
      matchList: [],
      tableKey: 0,
      total: 1,
      page: 1,
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
    this.getList()
  },
  methods: {
    topNoice(init) {
      // 置顶、取消置顶
      const data = {
        ids: this.ids,
        action: init
      }

      topDefenseNotice(this.params, data).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
          this.ids = []
        }
      })
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
          removeDefenseNotice(this.params, data).then((res) => {
            if (res.data.success) {
              this.$message.success('删除成功')
              this.getList()
              this.ids = []
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    submitNotice() {
      // 发布、编辑 公告
      if (this.noticeId) {
        this.updateNoice()
      } else {
        this.addNoice()
      }
    },
    updateNoice() {
      // 提交公告编辑
      const data = {
        notice_id: this.noticeId, // id
        notice: this.addQuery.notice // 内容
      }
      amendDefenseNotice(this.params, data).then((res) => {
        if (res.data.success) {
          this.$message.success('修改成功')
          this.getList()
          this.addDlg = false
          this.noticeId = ''
        }
      })
    },
    addNoice() {
      // 提交新增公告
      addDefenseNotice(this.params, this.addQuery).then((res) => {
        if (res.data.success) {
          this.$message.success('新增成功')
          this.getList()
          this.addDlg = false
        }
      })
    },
    showDlg() {
      this.diaTitle = '新增公告'
      this.addDlg = true
    },
    getList() {
      this.getNoiceList()
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

    getNoiceList() {
      // 获取公告列表
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      fetchDefenseNotice(this.params).then((res) => {
        this.matchList = res.data
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
    }
  }
}
</script>

<style>
.texLeft .el-form-item__label {
  text-align: left;
}
</style>
