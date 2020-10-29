<template>
  <div class="app-container audit_box">
    <div class="filter-container">
      <router-link
        :to="{
          path: '/competition/rw/operation/applyRecord',
          query: { hash: hash },
        }"
      >
        <el-button type="primary" size="mini">战队申请记录</el-button>
      </router-link>
      <router-link
        :to="{
          path: '/competition/rw/operation/auditRecord',
          query: { hash: hash },
        }"
      >
        <el-button type="primary" size="mini">裁判审核记录</el-button>
      </router-link>

      <el-button
        type="primary"
        size="mini"
        style="float: right"
        @click="getList"
      >刷新</el-button
      >
    </div>

    <!--白盒列表-->
    <el-table
      v-loading="listLoading"
      v-if="task_type == 'WX'"
      :data="accreditList"
      border
      fit
      highlight-current-row
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleChange"
    >
      <el-table-column
        :index="indexMethod"
        label="排序"
        width="50px"
        align="center"
        type="index"
      />
      <el-table-column align="center" prop="team_name" label="挑战选手" />

      <el-table-column align="center" prop="event_task_name" label="申请题目" />

      <el-table-column
        align="center"
        prop="time"
        width="180px"
        label="申请时间"
      />
      <el-table-column
        align="center"
        prop="request_count"
        label="当前题目申请次数"
      />
      <el-table-column align="center" prop="status" width="180px" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.$index == 0">正在挑战</span>
          <span v-else-if="scope.$index == 1">即将挑战</span>
          <span v-else>等待挑战</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="裁判操作" width="280px">
        <template slot-scope="scope">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            size="mini"
            @click="auditPass(scope.row)"
          >
            审核通过
          </el-button>
          <el-button
            v-waves
            class="filter-item"
            type="danger"
            size="mini"
            @click="auditFailedWrite(scope.row)"
          >
            审核不通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--黑白盒审核通过 begin-->
    <el-dialog :visible.sync="editDlg" title="审核通过" center>
      <el-form
        :model="editForm"
        style="width: 50%; margin: 0 auto"
        label-width="100px"
      >
        <el-form-item label="挑战队伍：">
          {{ auditPassList.team_name }}
        </el-form-item>
        <el-form-item label="挑战题目：">
          {{ auditPassList.event_task_name }}
        </el-form-item>

        <el-form-item label="审核结果："> 审核通过 </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="submitForm(1)">确 定</el-button>
        <el-button @click="editDlg = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--白盒审核不通过 begin-->
    <el-dialog
      :visible.sync="writeBoxDlg"
      title="审核不通过"
      center
      @close="closeDlg"
    >
      <el-form
        :model="editForm"
        style="width: 80%; margin: 0 auto"
        label-width="120px"
      >
        <el-form-item label="挑战队伍：">
          {{ auditPassList.team_name }}
        </el-form-item>
        <el-form-item label="挑战题目：">
          {{ auditPassList.event_task_name }}
        </el-form-item>
        <el-form-item label="审核结果："> 审核不通过 </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="submitForm(0)">确 定</el-button>
        <el-button @click="writeBoxDlg = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      title="提示"
      width="30%"
    >
      <span>有新的挑战需要审核!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import {
  subAuditList,
  fetchTopicList,
  submitAudit,
  changeDownStatus,
  getApplyMessage
} from '@/api/match/realWord'

export default {
  name: 'Idnex',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogVisible: false,

      editForm: {
        reward_score: 0,
        reason: ''
      },
      taskList: [], // 所有题目列表
      editDlg: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row
        // task: ''
      },
      ban_start_time: '', // 惩罚开始时间
      ban_time_length: 180, // 惩罚时长
      checkAry: [], // 选择的数组
      accreditList: [
        // 列表数据
      ],
      task_type: 'WX',
      hash: this.$route.query['hash'],
      // hash:'30809b4a-34ac-4426-81bf-fe438f784163.event',
      diaTitle: '', // 弹窗title
      auditPassList: {}, // 审核弹窗展示出来的信息
      blackBoxDlg: false, // 黑盒不通过弹窗
      writeBoxDlg: false, // 白盒不通过弹窗
      showDownloaddlg: false, // 下载列表弹窗
      auditQuery: {
        // 审核通过与否的参数
        challenge_id: '',
        is_valid: 1
      },
      dlgTitle: '', // 选中的队伍名称
      rewardDlg: false, // 奖罚详情弹窗
      rewardDetail: '', // 奖罚详情内容
      timer: null // 定时器
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 轮询请求接口,有新的审核时提醒裁判员
    this.timer = setInterval(() => {
      const apply_max_id = localStorage.applyMaxId
        ? localStorage.applyMaxId
        : 0
      this.get_apply_message(apply_max_id)
    }, 20000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    get_apply_message(apply_max_id) {
      // 轮询是否有新的提交
      getApplyMessage(this.hash, {
        id: apply_max_id
      }).then((res) => {
        if (res.data.message_zh && res.data.success) {
          this.dialogVisible = true
          localStorage.applyMaxId = res.data.max_id
        }
      })
    },
    closeDlg() {
      // 关闭弹窗的回调
      this.auditQuery = {
        // 审核通过与否的参数
        challenge_id: '',
        is_valid: 1
      }
    },
    download(url, id) {
      changeDownStatus(this.hash, id).then((res) => {
        this.getList()
      })
      window.open(url)
    },
    indexMethod(index) {
      // 展示序号的方法
      return this.listQuery.offset + index + 1
    },
    getTopicList() {
      // 获取黑盒题目
      fetchTopicList(this.hash).then((res) => {
        this.taskList = res.data
        this.listQuery.task = res.data[0].id
      })
    },
    submitForm(bol, type) {
      // 提交审核
      const data = JSON.parse(JSON.stringify(this.auditQuery))

      // if (type == 'WX') {
      //   data.ban_start_time = this.ban_start_time
      //   data.ban_time_length = this.ban_time_length
      //
      //   if (this.ban_start_time == '') {
      //     this.$message.error('请选择时间')
      //     return
      //   }
      // }
      data.is_valid = bol
      submitAudit(this.hash, data).then((res) => {
        if (res.data.success) {
          this.writeBoxDlg = false
          this.blackBoxDlg = false
          this.editDlg = false
          this.getList()
          this.$message.success('操作成功')
        }
      })
    },
    handleChange(val) {
      // 选择表格
      this.checkAry = val.map((item) => {
        return item.id
      })
    },
    getList(num) {
      // if (num == 1) {
      //   this.page = 1
      //   this.listQuery.task = this.taskList[0].id
      // }
      // if (this.task_type == 'WX') {
      //   this.listQuery.task = ''
      // }
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      subAuditList(this.hash, this.listQuery).then((res) => {
        this.accreditList = res.data.rows
        this.total = res.data.total
        this.dialogVisible = false

        // 取最后一个位的id放入本地存储，用来判断是否需要弹出新的审核弹窗。
        localStorage.applyMaxId = this.accreditList[
          this.accreditList.length - 1
        ].id
      })
    },
    auditFailedBlack(row, index, title) {
      // 黑盒审核不通过
      this.blackBoxDlg = true
      this.auditPassList = row
      this.auditPassList.index = index
      this.auditQuery.challenge_id = row.id
      this.diaTitle = title
    },
    auditFailedWrite(row, index, title) {
      // 白盒审核不通过
      this.writeBoxDlg = true
      this.auditPassList = row
      this.auditPassList.index = index
      this.auditQuery.challenge_id = row.id
      this.diaTitle = title
    },
    auditPass(row, index, title) {
      // 审核通过
      this.editDlg = true
      this.auditPassList = row
      this.auditPassList.index = index
      this.auditQuery.challenge_id = row.id
      this.diaTitle = title
    }
  }
}
</script>

<style>
.audit_box .el-table th .cell {
  overflow: auto;
}
</style>
