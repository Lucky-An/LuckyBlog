<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.search"
        placeholder="请输入选手名称"
        style="width: 150px;"
        size="mini"
        class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList">搜索
      </el-button>
      <div style="float: right;">

        <a :href="'/api/v1/layered/admin/'+id+'/export_data'" download>
          <el-button type="danger" icon="el-icon-download" size="mini">竞赛数据导出</el-button>
        </a>
        <a :href="'/api/v1/layered/admin/event/'+id+'/export_wp'" download>
          <el-button type="danger" icon="el-icon-download" size="mini"> 下载全部WP</el-button>
        </a>

        <el-button type="danger" icon="el-icon-download" size="mini" @click="downloadWP"> 下载WP</el-button>
        <el-button :disabled="listTotal==0" type="danger" icon="el-icon-upload2" size="mini" @click="downScore">成绩导出
        </el-button>

      </div>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="名次"
          type="index"/>

        <el-table-column
          align="center"
          prop="repr_logo"
          label="选手logo">
          <template slot-scope="scope">
            <img :src="scope.row.obj_logo" style="width: 40px;height: 40px;border-radius: 50%;" alt="">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="obj_name"
          label="选手名称"/>
        <el-table-column
          align="center"
          prop="solved_count"
          label="解题数"/>
        <el-table-column
          align="center"
          prop="sum_score"
          label="分数"/>
        <el-table-column
          align="center"
          prop="max_time"
          width="160px"
          label="最后提交时间"/>
        <el-table-column
          align="center"
          label="writeup">
          <template slot-scope="scope">
            {{ scope.row.writeup.split('/')[scope.row.writeup.split('/').length-1] }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status==1?'正常':'禁赛' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="status"
          label="禁赛原因">
          <template slot-scope="scope">

            <el-button
              v-waves
              v-if="scope.row.status!=1"
              class="filter-item"
              size="mini"
              type="success"
              @click="showResion(scope.row.cheat_log)">
              查看
            </el-button>

            <span v-else>暂无</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="time"
          width="160px"
          label="签到时间"/>
        <el-table-column align="center" label="操作" width="210px">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.status==1"
              class="filter-item"
              size="mini"
              type="danger"
              icon="el-icon-goods"
              @click="banMatch(scope.row.id,2)">禁赛
            </el-button>
            <el-button
              v-waves
              v-else
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-goods"
              @click="banMatch(scope.row.id,1)">解禁
            </el-button>
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-document"
              @click="showScore(scope.row)">成绩管理
            </el-button>
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-document"
              @click="showRewardScore(scope.row)">奖惩分
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <el-dialog :visible.sync="scoreDig" title="成绩管理">
      <el-table
        :data="scoreList"
        border>
        <el-table-column
          align="center"
          prop="nickname"
          label="名称"/>
        <el-table-column
          align="center"
          prop="title"
          label="标题"/>
        <el-table-column
          align="center"
          prop="score"
          label="分数"/>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">未解出</span>
            <span v-if="scope.row.status==1">解出</span>
            <span v-if="scope.row.status==2">无效</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="title_dsc"
          label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.status==1"
              class="filter-item"
              size="mini"
              type="danger"
              icon="el-icon-circle-close"
              @click="invalid(scope.row.id,2)">标记无效
            </el-button>
            <el-button
              v-waves
              v-if="scope.row.status==2"
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-circle-check"
              @click="invalid(scope.row.id,1)">恢复分数
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--查看flag  begin-->
    <el-dialog :visible.sync="reasonDlg" class="addsub" title="查看禁赛原因" width="900px">
      <el-table
        :data="reason"
        border
      >

        <el-table-column
          align="center"
          label="时间"
          width="170"
          prop="create_time"/>
        <el-table-column
          align="center"
          label="原因"
          prop="remark"/>

      </el-table>
    </el-dialog>
    <!--查看flag  end-->

    <!--奖励分数  begin-->
    <el-dialog :visible.sync="scoreDlg" class="addsub" title="奖惩分数" width="900px">
      <el-form ref="form" label-width="80px">
        <el-form-item label="奖惩分数">
          <el-input-number v-model="reward_score.reward_score" :min="-100000" :max="1000000" size="mini"/>
        </el-form-item>
        <el-form-item label="奖惩原因" required>
          <el-input v-model.trim="reward_score.reward_reason" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitScore">确定</el-button>
          <el-button @click="scoreDlg=false">取消</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        :closable="false"
        title="奖惩分详情"
        type="success"

        center/>
      <el-table
        :data="rewardScoreList"
        border
        height="250"
        style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"/>
        <el-table-column
          align="center"
          prop="reward_score"
          label="奖惩分数"/>
        <el-table-column
          align="center"
          prop="content"
          label="奖惩原因"/>
      </el-table>
    </el-dialog>
    <!--查看flag  end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  fetchJeopardyUserList,
  fetchJeopardyTeamManger,
  getJeopardyUsersScore,
  getJeopardyTeamScore,
  invalidJeopardyUserAnswer,
  invalidJeopardyTeamAnswer,
  banJeopardyUserMatch,
  banJeopardyTeamMatch,
  fetchReward_scoreLsit,
  submitReward_score,
  downloadAllWP,
  downloadEachWP
} from '@/api/match/layered'
import { getStorage } from '@/utils/storage'

export default {
  name: 'UserManagement',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      scoreDlg: false,
      reward_score: {
        reward_reason: '',
        reward_score: 0,
        obj_id: ''
      },
      reason: '', // 禁赛原因
      reasonDlg: false, // 禁赛原因弹窗
      id: this.$route.query.id,
      scoreDig: false,
      scoreList: [], // 成绩管理
      matchList: [], //
      rewardScoreList: [], //

      userId: [],
      listTotal: 0,
      listPage: 1,
      scorePage: 1,
      mode: getStorage('match_info', 'object').mode, // 1个人2组队
      scoreQuery: {
        order: 'asc',
        event: '',
        user: ''
      },
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
    showRewardScore(row) {
      const params = {
        obj_id: row.obj_id || this.reward_score.obj_id
      }
      fetchReward_scoreLsit(this.id, params).then(res => {
        if (res.data.success) {
          this.scoreDlg = true
          this.reward_score.obj_id = row.obj_id || this.reward_score.obj_id
          this.rewardScoreList = res.data.data
        }
      })
    },
    submitScore() { // 提交奖惩分
      submitReward_score(this.id, this.reward_score).then(res => {
        if (res.data.success) {
          this.reward_score.reward_reason = ''
          this.reward_score.reward_score = 0

          this.$message.success('操作成功')
          this.showRewardScore(1)
        }
      })
    },
    showResion(reason) { // 显示禁赛原因按钮
      this.reason = reason
      this.reasonDlg = true
    },
    indexMethod(index) { // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    downloadAllWP() {
      downloadAllWP(this.id).then(res => {
        if (res.data.success === undefined) {
          window.location.href = '/api/v1/jeopardy/admin/event/' + this.id + '/export_wp'
        }
      })
    },
    downloadWP() { // 下载WP
      if (this.userId.length == 0) {
        return
      }

      this.userId.forEach(item => {
        if (item.writeup) {
          downloadEachWP(this.id, item.obj_id).then(res => {
            if (res.data.success === undefined) {
              window.open('/api/v1/jeopardy/admin/event/' + this.id + '/down_wp/' + item.obj_id)
            }
          })
        }
      })

      // if (this.mode == 1) { // 判断是个人还是团队
      //   this.userId.forEach(item => {
      //     if (item.writeup) {
      //       window.open('/api/v1/jeopardy/admin/event_task_user/down_wp?event=' + this.$route.query.id + '&user=' + item.obj_id)
      //     }
      //   })
      // } else {
      //   this.userId.forEach(item => {
      //     if (item.writeup) {
      //       window.open('/api/v1/jeopardy/admin/event_task_team/down_wp?event=' + this.$route.query.id + '&team=' + item.obj_id)
      //     }
      //   })
      // }
    },
    downScore() { // 成绩导出
      if (this.listTotal == 0) {
        return
      }
      window.open('/api/v1/layered/admin/event/' + this.$route.query.id + '/export_scores')

      // if (this.mode == 1) { // 判断是个人还是团队
      //
      // } else {
      //   window.open('/api/ad_event/event_teams_scores/down_score?event=' + this.$route.query.id)
      // }
    },
    handleSelectionChange(val) {
      this.userId = val
    },
    showScore(info) { // 展示成绩
      this.scoreQuery.event = this.id
      if (this.mode == 1) {
        this.scoreQuery.user = info.obj_id
        this.getJeopardyUsersScore()
      } else {
        this.scoreQuery.team = info.obj_id
        this.getJeopardyTeamScore()
      }
    },
    getJeopardyUsersScore() { // 获取比赛成绩
      getJeopardyUsersScore(this.scoreQuery).then(res => {
        this.scoreList = res.data.rows
        this.scoreDig = true
      })
    },
    getJeopardyTeamScore() { // 获取队伍成绩
      getJeopardyTeamScore(this.scoreQuery).then(res => {
        this.scoreList = res.data.rows
        this.scoreDig = true
      })
    },
    invalid(id, status) { // 使成绩无效、有效
      const q = { status: status }
      invalidJeopardyUserAnswer(id, q).then(res => {
        if (this.mode == 1) {
          this.getJeopardyUsersScore()
          this.listTotal = 1
          this.getList()
        } else {
          this.getJeopardyTeamScore()
          this.listPage = 1
          this.getList()
        }
      })
    },
    banMatch(obj_id, status) { // 解开、禁赛
      const data = {
        status: status
        // event:this.id
      }
      if (this.mode == 1) {
        banJeopardyUserMatch(obj_id, data).then(res => {
          this.listTotal = 1
          this.getList()
        })
      } else {
        banJeopardyTeamMatch(obj_id, data).then(res => {
          this.listPage = 1
          this.getList()
        })
      }
    },
    getList() {
      this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      if (this.mode == 1) {
        fetchJeopardyUserList(this.listQuery).then(res => {
          this.matchList = res.data.rows
          this.listTotal = res.data.total

          if (this.listTotal <= this.listQuery.offset && this.listTotal != 0) {
            this.listQuery.offset = this.listQuery.offset - this.listQuery.limit
            this.getList()
          }
        })
      } else {
        fetchJeopardyTeamManger(this.listQuery).then(res => {
          this.matchList = res.data.rows
          this.listTotal = res.data.total

          if (this.listTotal <= this.listQuery.offset && this.listTotal != 0) {
            this.listQuery.offset = this.listQuery.offset - this.listQuery.limit
            this.getList()
          }
        })
      }
    },
    checkTable() { // 选择表格

    }
  }
}
</script>

<style scoped>

</style>
