<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input-->
      <!--v-model="listQuery.team_name"-->
      <!--placeholder="请输入题目名称"-->
      <!--style="width: 150px;"-->
      <!--class="filter-item"/>-->
      <!--<el-button v-waves class="filter-item" type="primary"   @click="getList">搜索</el-button>-->
      <a
        :href="'/api/v1/rw/admin/evts/' + hash + '/scores/teams/import'"
        download
      >
        <el-button
          v-waves
          class="filter-item"
          size="mini"
          type="warning"
        >成绩导出</el-button
        >
      </a>

      <!--<a :href="' /api/v1/rw/admin/evts/'+hash+'/export_data'" download>-->
      <!--<el-button v-waves class="filter-item" type="success">竞赛数据导出</el-button>-->
      <!--</a>-->

      <el-button
        v-waves
        size="mini"
        style="float: right"
        type="primary"
        class="filter-item"
        @click="showDialog"
      >奖惩分</el-button
      >
    </div>

    <el-table
      v-loading="listLoading"
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
        label="名次"
      />
      <el-table-column align="center" prop="team_name" label="选手名称">
        <template slot-scope="scope">
          <div style="text-align: left">
            <span
            ><img
              :src="scope.row.logo"
              style="width: 30px; height: 30px; border-radius: 50px"
              alt=""
            ></span>
            <span
              style="
                vertical-align: top;
                display: inline-block;
                line-height: 30px;
              "
            >{{ scope.row.name }}</span
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in subAry"
        :key="index"
        :label="item.title"
        align="center"
        prop="team_name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row[item.id] }}</span>
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

    <!--奖惩分弹窗 begin-->
    <el-dialog
      :visible.sync="editDlg"
      :title="dlgTitle + ' 奖罚分值'"
      center
      @close="closeDlg"
    >
      <el-form
        :model="editForm"
        style="width: 50%; margin: 0 auto"
        label-width="100px"
      >
        <p class="filter-container">说明：输入正分表示加分，输入负分表示罚分</p>
        <el-form-item label=" 奖罚用户：">
          <el-select v-model="editForm.team_id" placeholder="请选择">
            <el-option
              v-for="item in teamList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label=" 奖罚分值：">
          <el-input-number
            v-model="editForm.reward_score"
            :min="-1000"
            :max="100000"
            :step="1"
            size="small"
          />
          <!--<el-input-number v-model="num" :step="2" step-strictly></el-input-number>-->
        </el-form-item>
        <el-form-item label=" 奖罚事件：">
          <el-input
            v-model.trim="editForm.reward_reason"
            type="textarea"
            size="small"
          />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="editDlg = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--分数详情弹窗 -->
    <el-dialog
      :visible.sync="detailDlg"
      :title="dlgTitle + ' 奖罚分值'"
      width="90%"
      center
    >
      <el-table
        v-loading="listLoading"
        :data="gridData"
        border
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" prop="obj_name" label="战队名称" />

        <el-table-column property="name" align="center" label="解题赛">
          <el-table-column
            v-for="(wb, index) in subList"
            v-if="wb.protocol == 3"
            :key="index"
            :label="wb.title"
            property="address"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row[wb.id] ? scope.row[wb.id].score : "" }}
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column property="name" align="center" label="White-box">
          <el-table-column
            v-for="(wb, index) in subList"
            v-if="wb.protocol == 1"
            :key="index"
            :label="wb.devicename"
            property="address"
            align="center"
          >
            <el-table-column
              v-for="(child, index) in wb.childs"
              v-if="wb.protocol == 1"
              :key="index"
              :label="child.title"
              property="address"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row[child.id] ? scope.row[child.id].score : "" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="subList[index].protocol == 1"
              :label="subList[index].title"
              property="address"
              align="center"
            >
              <template slot-scope="scope">
                {{
                  scope.row[subList[index].id]
                    ? scope.row[subList[index].id].score
                    : ""
                }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column property="name" align="center" label="Black-box">
          <el-table-column
            v-for="(wb, index) in subList"
            v-if="wb.protocol == 2"
            :key="index"
            :label="wb.devicename"
            property="address"
            align="center"
          >
            <el-table-column
              v-for="(child, index) in wb.childs"
              v-if="wb.protocol == 2"
              :key="index"
              :label="child.title"
              property="address"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row[child.id] ? scope.row[child.id].score : "" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="subList[index].protocol == 2"
              :label="subList[index].title"
              property="address"
              align="center"
            >
              <template slot-scope="scope">
                {{
                  scope.row[subList[index].id]
                    ? scope.row[subList[index].id].score
                    : ""
                }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="detailDlg = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!--奖罚详情弹窗 -->
    <el-dialog :visible.sync="rewardDlg" :title="dlgTitle + ' 奖罚详情'" center>
      <el-table
        v-loading="listLoading"
        :data="rewardList"
        border
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" prop="create_time" label="奖惩时间" />
        <el-table-column align="center" prop="reward_score" label="奖惩分" />
        <el-table-column align="center" prop="reason" label="奖惩原因" />
      </el-table>
      <div slot="footer">
        <el-button @click="rewardDlg = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import {
  getMatchResult,
  rewardScore,
  getDetailSub,
  getScoreDetail,
  getTeamList
} from '@/api/match/realWord'

export default {
  name: 'Idnex',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      num: '', // 奖惩分
      gridData: [], //
      subList: [], //
      mode: 1, // 授权类型1个人2组队
      editForm: {
        team_id: '',
        reward_score: 0,
        reward_reason: ''
      },
      teamMembers: [],
      teamDlg: false,
      editDlg: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      listQuery: {
        team_name: '',
        limit: this.$store.state.config.row,
        offset: 0
      },
      checkAry: [], // 选择的数组
      accreditList: [
        // 列表数据
      ],
      hash: this.$route.query['hash'],
      dlgTitle: '', // 点击的队伍名
      detailDlg: false,
      rewardDlg: false, // 奖惩详情弹窗
      rewardList: [], // 奖罚详情
      subAry: [], // 题目列表
      teamList: [] // 队伍列表
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) {
      // 展示序号的方法
      return (this.page - 1) * this.listQuery.limit + index + 1
    },
    closeDlg() {
      // 关闭弹窗的回调
      this.editForm = {
        // 审核通过与否的参数
        team_id: '',
        reward_score: 0,
        reason: ''
      }
    },
    showReward(row) {
      this.rewardDlg = true
      this.dlgTitle = row.team_name
      rewardDetail(this.hash, row.team_id).then((res) => {
        this.rewardList = res.data.rows
      })
    },
    showDetail(row) {
      this.detailDlg = true
      const data = {
        team: row.team_id
      }
      getDetailSub(this.hash, data).then((res) => {
        this.subList = res.data.rows
      })
      getScoreDetail(this.hash, data).then((res) => {
        this.gridData = res.data
      })
    },
    submitForm() {
      // 提交编辑
      rewardScore(this.hash, this.editForm).then((res) => {
        if (res.data.success) {
          this.editDlg = false
          this.getList()
          this.editForm = {
            team_id: '',
            reward_score: 0,
            reward_reason: ''
          }
        }
      })
    },
    showDialog(obj) {
      // 显示编辑弹窗
      getTeamList(this.hash).then((res) => {
        this.teamList = res.data
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
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      getMatchResult(this.hash, this.listQuery).then((res) => {
        this.accreditList = res.data.rows
        this.subAry = res.data.tasks
        this.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>
</style>
