<template>
  <!-- 选手管理 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listSelect.name"
        class="filter-item"
        size="mini"
        style="width: 200px;"
        placeholder="请输入选手名称"
      />
      <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList">搜索</el-button>
    </div>

    <!--表格 begin-->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        width="50"
        label="序号"
      />

      <el-table-column
        label="选手LOGO"
        prop="logo"
        align="center"
      >
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width: 50px;height: 50px;" alt="">
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="name"
        label="选手名称"
      />
      <el-table-column
        align="center"
        label="账户状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status===1?"正常":"禁赛" }}
        </template>

      </el-table-column>
      <el-table-column
        align="center"
        label="WriteUp上传状态"
      >
        <template slot-scope="scope">
          {{ scope.row.wp_path?"已上传":"未上传" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="WriteUp"
      >
        <template slot-scope="scope">
          <a
            v-if="scope.row.wp_path"
            :href="scope.row.wp_path"
            download
          >
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="primary"
            >下载
            </el-button>
          </a>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-waves
            class="filter-item"
            size="mini"
            type="danger"
            @click="handleBanned(scope.row)"
          >{{ scope.row.status===1?"禁赛":"解禁" }}
          </el-button>
          <el-button
            v-waves
            class="filter-item"
            size="mini"
            type="primary"
            @click="rewardAndPunishment(scope.row)"
          >奖罚分
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listSelect.offset"
      :limit.sync="listSelect.limit"
      @pagination="getPageList"
    />
    <el-dialog
      :visible.sync="showDlg"
      @close="closeDiglog"
    >
      <span
        slot="title"
        style="font-weight: bold;font-size: 18px"
      >奖罚分数</span>
      <el-form
        ref="jiangfa"
        :model="reword"
        label-width="80px"
      >

        <el-form-item label="队伍名称">
          {{ rowName }}
        </el-form-item>
        <el-form-item label="奖罚分">
          <el-col :span="6">
            <el-input v-model.trim="reword.score"/>
          </el-col>
          <el-col
            :span="10"
            style="margin-left:30px"
          >
            可填写正负分，正分表示增加，负分表示减分
          </el-col>

        </el-form-item>
        <el-form-item label="奖罚说明">
          <el-input
            :span="4"
            v-model="reword.content"
            type="textarea"
          />
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="confirmButton"
        >确 定</el-button>
        <el-button @click="cancalButton">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  httpGetOperationTeamData,
  httpPostRewardScore,
  httpPostTeamStatus
} from '@/api/match/penetration'
export default {
  name: 'Rank',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      listSelect: {
        limit: this.$store.state.config.row, // 每页显示数量
        offset: 1, // 页码
        event_id: this.$route.query.id,
        name: ''
      },
      tableData: [],
      total: 0,
      event_id: this.$route.query.id,
      name: '',
      showDlg: false,
      reword: {
        event_id: '',
        contestant_id: 0,
        score: 0,
        content: ''
      },
      rowName: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // ! 奖罚弹窗确认
    confirmButton() {
      if (this.reword.score) {
        httpPostRewardScore(this.reword).then(res => {
          this.reword = {
            event_id: '',
            contestant_id: 0,
            score: 0,
            content: ''
          }
          this.rowName = ''
          this.showDlg = false
          if (res.data.success) {
            this.$message.success('奖罚生效')
          }
        })
      } else {
        this.showDlg = false
      }
    },
    closeDiglog() {
      this.cancalButton()
    },
    // ! 奖罚弹窗点击取消
    cancalButton() {
      this.reword = {
        event_id: '',
        contestant_id: 0,
        score: 0,
        content: ''
      }
      this.rowName = ''
      this.showDlg = false
    },
    // ! 奖罚分按钮事件
    rewardAndPunishment(row) {
      this.rowName = row.name
      this.reword.event_id = this.event_id
      this.reword.contestant_id = row.contestant_id
      this.showDlg = true
    },
    // ! 分页切换
    getPageList(params) {
      this.limit = params.limit
      this.offset = params.page
      this.getList()
    },
    // !获取列表信息
    getList() {
      httpGetOperationTeamData(this.listSelect).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    // !禁赛or解禁
    handleBanned(row) {
      let action
      row.status === 1 ? (action = 2) : (action = 1)

      httpPostTeamStatus({
        action: action,
        contestant_id: row.contestant_id,
        event_id: this.event_id
      }).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
</style>
