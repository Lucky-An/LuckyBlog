<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.search"
        placeholder="请输入选手名称"
        style="width: 150px"
        size="mini"
        class="filter-item"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList"
      >搜索</el-button
      >

      <div class="fr">
        <!-- <a
          :href="
            '/api/v1/jeopardy/admin/event/wps/export?evt_hash=' +
            listQuery.evt_hash
          "
          download
        >
          <el-button type="warning" size="mini">导出全部WP</el-button>
        </a> -->
        <el-button
          type="warning"
          size="mini"
          @click="handleExport"
        >导出全部WP</el-button
        >
      </div>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"
        />

        <el-table-column align="center" prop="obj_name" label="选手名称" />

        <el-table-column align="center" prop="solved_count" label="解题数" />

        <el-table-column align="center" prop="status" label="账户状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? "正常" : "禁赛" }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" label="WP上传状态">
          <template slot-scope="scope">
            {{ scope.row.writeup ? "已上传" : "未上传" }}
          </template>
        </el-table-column>

        <el-table-column align="center" width="160" label="WriteUp">
          <template slot-scope="scope">
            <div v-if="scope.row.writeup">
              <!-- <a :href="scope.row.writeup" class="filter-item">
                <el-button v-waves size="mini" type="primary"> 查看 </el-button>
              </a> -->
              <a :href="scope.row.writeup" class="filter-item" download>
                <el-button v-waves size="mini" type="primary"> 下载 </el-button>
              </a>
            </div>
            <div v-else>无</div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          align="center"
          label="Token"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="primary"
              @click="showToken(scope.row.token)"
            >
              查看
            </el-button>
          </template>
        </el-table-column> -->

        <el-table-column align="center" prop="status" label="作弊信息">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.status != 1"
              size="mini"
              type="primary"
              @click="showResion(scope.row.cheat_log)"
            >
              查看
            </el-button>
            <span v-else>暂无</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="270px">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.status == 1"
              size="mini"
              type="danger"
              @click="showBanDia(scope.row)"
            >禁赛
            </el-button>
            <el-button
              v-waves
              v-else
              size="mini"
              type="success"
              @click="banMatch(scope.row.signup_id, 1)"
            >解禁
            </el-button>
            <!--<el-button-->
              <!--v-waves-->
              <!--size="mini"-->
              <!--type="primary"-->
              <!--@click="showScore(scope.row)"-->
            <!--&gt;成绩管理-->
            <!--</el-button>-->
            <el-button
              v-waves
              size="mini"
              type="primary"
              @click="showRewardScore(scope.row)"
            >奖罚分数
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />

    <!--成绩管理 begin-->
    <el-dialog :visible.sync="scoreDig" title="成绩管理">
      <el-table :data="scoreList" border>
        <el-table-column
          align="center"
          width="50px"
          label="序号"
          type="index"
        />
        <el-table-column align="center" prop="title" label="题目" />
        <el-table-column align="center" prop="score" label="分值" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">未解出</span>
            <span v-if="scope.row.status == 1">解出</span>
            <span v-if="scope.row.status == 2">无效</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="title_dsc" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.status == 1"
              size="mini"
              type="danger"
              @click="invalid(scope.row.id, 2)"
            >标记无效
            </el-button>
            <el-button
              v-waves
              v-if="scope.row.status == 2"
              size="mini"
              type="primary"
              @click="invalid(scope.row.id, 1)"
            >恢复分数
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--成绩管理 end-->

    <!--查看作弊信息  begin-->
    <el-dialog :visible.sync="reasonDlg" title="作弊信息">
      <el-table :data="reason" border>
        <el-table-column align="center" type="index" label="序号" width="80"/>

        <el-table-column
          align="center"
          label="时间"
          width="170"
          prop="create_time"
        />
        <el-table-column align="center" label="原因" prop="remark" />
      </el-table>
      <!-- <el-table
        :data="reason"
        border
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
        />
        <el-table-column
          align="center"
          label="选手名称"
          width="170"
          prop="create_time"
        />
        <el-table-column
          align="center"
          label="作弊题目"
          width="170"
          prop="create_time"
        />
        <el-table-column
          align="center"
          label="作弊Flag"
          width="170"
          prop="create_time"
        />
        <el-table-column
          align="center"
          label="竞赛时间"
          width="170"
          prop="create_time"
        />

        <el-table-column
          align="center"
          label="禁赛原因"
          prop="remark"
        />
      </el-table> -->
    </el-dialog>
    <!--查看作弊信息 end-->

    <!--查看Token  begin-->
    <el-dialog :visible.sync="isToekn" title="Token">
      {{ Token }}
    </el-dialog>
    <!--查看Token end-->

    <!--奖励分数  begin-->
    <el-dialog :visible.sync="scoreDlg" title="奖罚分数" width="900px">
      <el-form ref="form" :model="reward_score" label-width="80px">
        <el-form-item label="选手名称">
          {{ playerName }}
        </el-form-item>

        <el-form-item label="奖罚分数">
          <el-input-number
            v-model="reward_score.reward_score"
            :min="-100000"
            :max="1000000"
            size="mini"
          />
        </el-form-item>

        <el-form-item
          :rules="{
            required: true, message: '请填写奖惩原因', trigger: 'blur',
          }"
          prop="reward_reason"
          label="奖惩原因">
          <el-input v-model.trim="reward_score.reward_reason" type="textarea" />
        </el-form-item>
        <el-form-item>
          <div class="fr">
            <el-button type="primary" @click="submitScore">确定</el-button>
            <el-button @click="scoreDlg = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-alert :closable="false" title="奖惩分详情" type="success" center />
      <el-table :data="rewardScoreList" border height="250" style="width: 100%">
        <el-table-column
          align="center"
          width="50px"
          label="序号"
          type="index"
        />
        <el-table-column align="center" prop="reward_score" label="奖罚分数" />
        <el-table-column align="center" prop="content" label="奖惩原因" />
      </el-table>
    </el-dialog>
    <!--查看flag  end-->

    <!--禁赛  begin-->
    <el-dialog :visible.sync="banDia" title="填写禁赛原因" @close="close">
      <el-form :modal="form" :rules="banRules">
        <el-form-item label="禁赛原因" label-width="100px" prop="cheat_log">
          <el-input v-model.trim="form.cheat_log" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="banMatch(form.id, 2)"
        >确 定</el-button
        >
        <el-button @click="banDia = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--禁赛  end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  getPlayerList,
  getPlayerScore,
  invalidPlayerAnswer,
  banPaylerMatch,
  fetchReward_scoreLsit,
  submitReward_score,
  exportAllWp
} from '@/api/match/jeopardy'
import { checkFileAvailable } from '@/utils/common'

export default {
  name: 'UserManagement',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      banDia: false,
      reason: '', // 禁赛原因
      form: {
        cheat_log: '',
        id: ''
      },
      banRules: {
        cheat_log: [{ max: 500, message: '最长为500个字', trigger: 'blur' }]
      },

      scoreDlg: false,
      playerName: '', // 选手名称
      reward_score: {
        reward_reason: '',
        reward_score: 0,
        obj_id: '',
        evt_hash: this.$route.query.hash
      },

      reasonDlg: false, // 禁赛原因弹窗
      id: this.$route.query.id,
      scoreDig: false,
      scoreList: [], // 成绩管理
      matchList: [], //
      rewardScoreList: [], //

      userId: [],
      listTotal: 0,

      mode: null, // 1个人2组队
      scoreQuery: {
        evt_hash: this.$route.query.hash,
        obj_id: ''
      },
      groupList: [], // 用户分组列表
      usergroups: [],
      listQuery: {
        page: 0,
        per_page: this.$store.state.config.row,
        search: '',
        evt_hash: this.$route.query.hash
      },

      isToekn: false, // 展示token弹窗
      Token: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    showToken(Token) {
      this.isToekn = true
      this.Token = Token
    },
    close() {
      this.form = {
        cheat_log: '',
        id: ''
      }
      this.banDia = false
    },
    showBanDia(row) {
      this.banDia = true
      this.form.id = row.signup_id
    },
    showRewardScore(row) {
      const params = {
        obj_id: row.obj_id || this.reward_score.obj_id,
        evt_hash: this.listQuery.evt_hash
      }
      fetchReward_scoreLsit(params).then((res) => {
        if (res.data.success) {
          this.scoreDlg = true
          this.playerName = row.obj_name
          this.reward_score.obj_id = row.obj_id || this.reward_score.obj_id
          this.rewardScoreList = res.data.data
        }
      })
    },
    submitScore() {
      // 提交奖惩分
      submitReward_score(this.reward_score).then((res) => {
        if (res.data.success) {
          this.reward_score.reward_reason = ''
          this.reward_score.reward_score = 0
          this.$message.success('操作成功')
          this.showRewardScore(1)
        }
      })
    },
    showResion(reason) {
      // 显示禁赛原因按钮
      this.reason = reason
      this.reasonDlg = true
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.page - 1) * this.listQuery.per_page + index + 1
    },
    handleSelectionChange(val) {
      this.userId = val
    },
    showScore(info) {
      // 展示成绩
      if (info) this.scoreQuery.obj_id = info.obj_id

      getPlayerScore(this.scoreQuery).then((res) => {
        this.scoreList = res.data.data
        this.scoreDig = true
      })
    },
    invalid(id, status) {
      // 使成绩无效、有效
      const data = {
        status: status,
        answer_id: id
      }
      invalidPlayerAnswer(data).then((res) => {
        this.showScore()
      })
    },
    banMatch(obj_id, status) {
      // 解开、禁赛
      const data = {
        status: status,
        sign_id: obj_id,
        evt_hash: this.listQuery.evt_hash
      }
      if (status == 2) {
        if (this.form.cheat_log == '') this.form.cheat_log = '未添加禁赛原因'
        data.cheat_log = this.form.cheat_log
      }

      banPaylerMatch(data).then((res) => {
        this.close()
        this.listTotal = 1
        this.getList()
      })
    },
    // 获取选手列表
    getList() {
      getPlayerList(this.listQuery).then((res) => {
        this.matchList = res.data.data
        this.listTotal = res.data.total
      })
    },
    checkTable() {
      // 选择表格
    },

    handleExport() {
      exportAllWp({
        evt_hash: this.listQuery.evt_hash
      }).then(res => {
        checkFileAvailable(res)
      })
    }
  }
}
</script>

<style scoped>
</style>
