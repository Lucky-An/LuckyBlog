<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select-->
      <!--v-if="mode==1"-->
      <!--v-model="listQuery.status"-->
      <!--placeholder="使用状态"-->
      <!--clearable-->
      <!--class="filter-item"-->
      <!--style="width: 130px">-->
      <!--<el-option label="全部状态" value=""/>-->
      <!--<el-option :value="1" label="已使用"/>-->
      <!--<el-option :value="0" label="未使用"/>-->
      <!--</el-select>-->
      <!--<el-select-->
      <!--v-if="mode==1"-->
      <!--v-model="listQuery.status"-->
      <!--placeholder="使用状态"-->
      <!--clearable-->
      <!--class="filter-item"-->
      <!--style="width: 130px">-->
      <!--<el-option label="全部状态" value=""/>-->
      <!--<el-option :value="1" label="已使用"/>-->
      <!--<el-option :value="0" label="未使用"/>-->
      <!--</el-select>-->
      <!--<el-input-->
      <!--v-model="listQuery.search"-->
      <!--placeholder="请输入题目名称"-->
      <!--style="width: 150px;"-->
      <!--class="filter-item"/>-->
      <a
        :href="
          '/api/v1/rw/admin/evts/' +
            hash +
            '/challenges/verification/logs/import'
        "
        download
      >
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          size="mini"
        >导出</el-button
        >
      </a>
      <router-link
        :to="{
          path: '/competition/rw/operation/index',
          query: { hash: this.hash, activeName: 'audit' },
        }"
      >
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          size="mini"
          @click="goback"
        >返回</el-button
        >
      </router-link>
    </div>

    <el-table
      v-loading="listLoading"
      v-if="mode == 1"
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
        align="center"
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column align="center" prop="team_name" label="选手名称">
        <template slot-scope="scope">
          <span><img :src="scope.row.team_logo" alt="" ></span
          ><span>{{ scope.row.team_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="event_task_name" label="申请题目" />
      <el-table-column align="center" prop="time" label="审核时间" />
      <el-table-column
        align="center"
        prop="request_count"
        label="当前题目申请次数"
      />

      <el-table-column align="center" prop="auditor_name" label="审核结果">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? "通过" : "未通过" }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="auditor_name" label="审核人" />
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--查看弹窗 begin-->
    <el-dialog
      :visible.sync="editDlg"
      :title="gridData[0].team_name + ' 提交文档查看'"
      center
    >
      <el-table :data="gridData" border>
        <el-table-column
          label="序号"
          width="50px"
          align="center"
          type="index"
        />
        <el-table-column property="team_name" align="center" label="战队名称" />
        <el-table-column property="task_name" align="center" label="题目名称" />
        <el-table-column property="task_type" align="center" label="题目类别" />
        <el-table-column
          property="writeup_upload_time"
          align="center"
          label="上传时间"
          width="155px"
        />
        <el-table-column property="address" align="center" label="下载">
          <template slot-scope="scope">
            <a
              style="
                display: inline-block;
                position: relative;
                height: 35px;
                padding-top: 5px;
              "
            >
              <div
                v-show="scope.row.download_status == 1"
                style="
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background: #55d473;
                  top: 0px;
                  right: -10px;
                  color: #fff;
                  z-index: 10;
                "
              >
                √
              </div>
              <el-button
                v-waves
                class="filter-item"
                size="mini"
                type="primary"
                @click="
                  download(scope.row.writeup_link, scope.row.submitlog_id)
                "
              >
                下载
              </el-button>
            </a>
          </template>
        </el-table-column>
        <el-table-column property="address" align="center" label="是否阅卷">
          <template slot-scope="scope">
            <span
              v-if="scope.row.download_status == 1"
              style="color: #44d363"
            >已阅卷</span
            >
            <span v-else style="color: red">未阅卷</span>
          </template>
        </el-table-column>
      </el-table>
      <!--&lt;!&ndash;分页 begin&ndash;&gt;-->
      <pagination
        v-show="detailTotal.total > 0"
        :total="detailTotal"
        :page.sync="detailQuery.offset"
        :limit.sync="detailQuery.limit"
        @pagination="getList"
      />
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import {
  auditRecord,
  subManageDetail,
  changeDownStatus,
  fetchMatchInfo
} from '@/api/match/realWord'

export default {
  name: 'Idnex',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      gridData: [{}],
      mode: 1, // 授权类型1个人2组队
      editForm: {},
      teamMembers: [],
      teamDlg: false,
      editDlg: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      listQuery: {
        limit: this.$store.state.config.row,
        offset: 0,
        search: ''
      },
      detailTotal: 0,
      detailQuery: {
        limit: this.$store.state.config.row,
        offset: 1
      },
      hash: this.$route.query['hash'],
      checkAry: [], // 选择的数组
      accreditList: [
        // 列表数据
      ],
      team_id: ''
    }
  },
  created() {
    this.getList()

    // 获取比赛信息用以展示在面包屑
    fetchMatchInfo(this.$route.query.hash).then((res) => {
      this.$store.dispatch('changeMatchName', res.data.name_zh)
    })
  },
  beforeDestroy() {
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    indexMethod(index) {
      // 展示序号的方法
      return (this.page - 1) * this.listQuery.limit + index + 1
    },
    download(url, id) {
      changeDownStatus(this.hash, id).then((res) => {
        this.showDialog()
      })
      window.open(url)
    },
    showDialog(row) {
      // 显示编辑弹窗
      if (row) this.team_id = row.team_id

      subManageDetail(this.hash, this.team_id, this.detailQuery).then((res) => {
        this.gridData = res.data.rows
        this.detailTotal = res.data.total
      })
      this.editDlg = true
    },
    handleChange(val) {
      // 选择表格
      this.checkAry = val.map((item) => {
        return item.id
      })
    },
    getList() {
      this.listQuery.offset = (this.page - 1) * 10
      auditRecord(this.hash, this.listQuery).then((res) => {
        this.accreditList = res.data.rows
        this.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>
</style>
