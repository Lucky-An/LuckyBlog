<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.team_name"
        placeholder="请输入选手名称"
        class="filter-item"
        style="width: 200px;"
        size="mini"
      />
      <el-button
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList"
      >搜索</el-button>
      <div style="float: right">
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
      >

        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"
        />

        <el-table-column
          align="center"
          prop="repr_logo"
          label="选手logo"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.logo"
              style="width: 40px;height: 40px;border-radius: 50%;"
              alt=""
            >
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="team_name"
          label="选手名称"
        />

        <el-table-column
          align="center"
          prop="status"
          label="账户状态"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status==1?'正常':'禁赛' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="score"
          label="当前得分"
        />

        <el-table-column
          align="center"
          label="WP上传状态"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.writeup_status?'已上传':'未上传' }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="score"
          label="WriteUp"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.writeup_path"
              :href="scope.row.writeup_path"
              download
            >
              <el-button
                type="warning"
                size="mini"
              >下载
              </el-button>
            </a>
            <span v-else>
              无
            </span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          width="210px"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.status==1"
              size="mini"
              type="danger"
              @click="banMatch(scope.row,2)"
            >禁赛
            </el-button>

            <el-button
              v-waves
              v-else
              size="mini"
              type="primary"
              @click="banMatch(scope.row,1)"
            >解禁
            </el-button>

            <el-button
              v-waves
              size="mini"
              type="success"
              @click="showScore(scope.row)"
            >奖罚分数
            </el-button>

          </template>
        </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--奖励分数  begin-->
    <el-dialog
      :visible.sync="scoreDlg"
      class="addsub"
      title="奖罚分数"
      width="900px"
    >
      <el-form
        ref="form"
        label-width="80px"
      >
        <el-form-item label="奖罚分数">
          <el-input-number
            v-model="reward_score.score"
            :min="-100000"
            :max="1000000"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="奖惩原因" required>
          <el-input
            v-model.trim="reward_score.content"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitScore"
          >确定</el-button>
          <el-button @click="scoreDlg=false">取消</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        :closable="false"
        title="奖惩分详情"
        type="success"
        center
      />
      <el-table
        :data="rewardScoreList"
        border
        height="250"
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
        <el-table-column
          align="center"
          prop="reward_score"
          label="奖罚分数"
        />
        <el-table-column
          align="center"
          prop="content"
          label="奖惩原因"
        />
      </el-table>
    </el-dialog>
    <!--查看flag  end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  defenseFetchTeamList,
  defenseBan,
  defenseReward_score,
  defenseReward_scoreDetail,
  exportAllWp
} from '@/api/match/DevOps'
import { checkFileAvailable } from '@/utils/common'

export default {
  name: 'UserManagement',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      params: { event_id: this.$route.query.id },
      reward_score: {
        content: '',
        score: '',
        team_id: ''
      },
      scoreDlg: false, // 奖励弹窗
      id: this.$route.query.id,
      matchList: [], //
      rewardScoreList: [], //

      listTotal: 0,
      listPage: 1,
      scorePage: 1,

      scoreQuery: {
        order: 'asc',
        event: '',
        user: ''
      },
      listQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        team_name: '',
        event_id: this.$route.query.id
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    submitScore() {
      defenseReward_score(this.params, this.reward_score).then((res) => {
        if (res.data.success) {
          this.reward_score.content = ''
          this.reward_score.score = 0

          this.$message.success('操作成功')
          this.showScore(1)
        }
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    handleSelectionChange(val) {
      this.userId = val
    },
    showScore(row) {
      // 展示成绩
      const params = {
        event_id: this.params.event_id,
        team_id: row.team_id || this.reward_score.team_id
      }
      defenseReward_scoreDetail(params).then((res) => {
        this.scoreDlg = true
        this.reward_score.team_id = row.team_id || this.reward_score.team_id
        this.rewardScoreList = res.data
      })
    },

    banMatch(row, a) {
      // 解开、禁赛
      defenseBan(this.params, { action: a, team_id: row.team_id }).then(
        (res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        }
      )
    },
    getList() {
      defenseFetchTeamList(this.listQuery).then((res) => {
        this.matchList = res.data.data
        this.listTotal = res.data.total
      })
    },

    handleExport() {
      exportAllWp({
        event_id: this.id
      }).then(res => {
        checkFileAvailable(res)
      })
    }
  }
}
</script>

<style scoped>
</style>
