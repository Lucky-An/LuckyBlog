<template>

  <div class="user_manage" id="homepage">
    <div class=" clearfix mrg20T mrg15B">
      <div class="fl">
        <el-button size="small" type="primary" icon="el-icon-download" :disabled="userId.length<=0" @click="downloadWP"> {{$t('selfHelp_competition.down_WP')}}</el-button>
        <a v-if="mode==1" :href="'/api/sponsor/event_users_scores/down_score?event='+id" download>
          <el-button size="small" type="primary" icon="el-icon-upload2" > {{$t('selfHelp_competition.result_export')}}</el-button>
        </a>
        <a v-if="mode==2" :href="'/api/sponsor/event_teams_scores/down_score?event='+id" download>
          <el-button size="small" type="primary" icon="el-icon-upload2">{{$t('selfHelp_competition.result_export')}}</el-button>
        </a>
      </div>
      <div class="fr">
        <search @searchEvent="getSearchVal"></search>
      </div>
    </div>

    <div class=" ordinary">
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
          align="center"
          width="80px"
          :label="$t('selfHelp_competition.rank_num')"
          :index="indexMethod"
          type="index"/>
        <el-table-column
          align="center"
          prop="obj_name"
          :label="$t('selfHelp_competition.player_name')"/>
        <el-table-column
          align="center"
          prop="solved_count"
          :label="$t('selfHelp_competition.question_num')"/>
        <el-table-column
          align="center"
          prop="sum_score"
          :label="$t('selfHelp_competition.fraction')"/>
        <el-table-column
          align="center"
          prop="max_time"
          width="160px"
          :label="$t('selfHelp_competition.last_time')"/>
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
          :label="$t('selfHelp_competition.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status==1?$t('selfHelp_competition.normal'):$t('selfHelp_competition.ban_match') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="time"
          width="160px"
          :label="$t('selfHelp_competition.check_time')"/>
        <el-table-column align="center" :label="$t('team.table.operation')" width="210px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==1"
              class="filter-item selfServer-btn-red"
              size="mini"
              @click="banMatch(scope.row.id,2)">{{$t('selfHelp_competition.ban_match')}}
            </el-button>
            <el-button
              v-else
              class="filter-item selfServer-btn-green"
              size="mini"
              @click="banMatch(scope.row.id,1)">{{$t('selfHelp_competition.lift_ban')}}
            </el-button>
            <el-button
              class="filter-item selfServer-btn-blue"
              size="mini"
              @click="showScore(scope.row)">{{$t('selfHelp_competition.grade_manage')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页 begin-->
    <div class="clearfix text-right pad30T" v-show="listTotal>0">
      <!--<div class="page_info" v-if="$i18n.locale == 'CN'">显示第 {{(listPage-1)*listQuery.limit+1}} 到第-->
        <!--{{listPage*listQuery.limit>listTotal?listTotal:listPage*listQuery.limit}} 条记录，总共-->
        <!--{{listTotal}} 条记录-->
      <!--</div>-->
      <!--<div class="page_info" v-else>-->
        <!--Showing {{(listPage-1)*listQuery.limit+1}} through-->
        <!--{{listPage*listQuery.limit>listTotal?listTotal:listPage*listQuery.limit}} records for a total of-->
        <!--{{listTotal}} records.-->

      <!--</div>-->

      <pagination
        v-show="listTotal>listQuery.limit"
        :total="listTotal"
        :page.sync="listPage"
        :limit.sync="listQuery.limit"
        layout='prev, pager, next'
        @pagination="getList"/>
    </div>


    <el-dialog :visible.sync="scoreDig"
               custom-class="ad_public_modal title-center"
               :title="$t('selfHelp_competition.grade_manage')">
      <div class="ordinary">
        <el-table
          :data="scoreList"
          height="500"
          border>
          <el-table-column
            align="center"
            prop="title"
            :label="$t('selfHelp_competition.title')"/>
          <el-table-column
            align="center"
            prop="score"
            :label="$t('selfHelp_competition.fraction')"/>
          <el-table-column
            align="center"
            prop="status"
            :label="$t('selfHelp_competition.status')">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0">{{$t('selfHelp_competition.unsolved')}}</span>
              <span v-if="scope.row.status==1">{{$t('selfHelp_competition.solve')}}</span>
              <span v-if="scope.row.status==2">{{$t('selfHelp_competition.invalid')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="nickname"
            :label="$t('selfHelp_competition.name')"/>
          <el-table-column
            align="center"
            prop="title_dsc"
            :label="$t('selfHelp_competition.operating')">
            <template slot-scope="scope">
              <el-button

                v-if="scope.row.status==1"
                class="filter-item"
                size="mini"
                type="danger"
                icon="el-icon-circle-close"
                @click="invalid(scope.row.id,2)">{{$t('selfHelp_competition.invalid_tag')}}
              </el-button>
              <el-button

                v-if="scope.row.status==2"
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-circle-check"
                @click="invalid(scope.row.id,1)">{{$t('selfHelp_competition.rec_score')}}
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/common_components/pagination'
  import search from '../common/search'
  import {getStorage} from '@/utils/storage'

  export default {
    name: 'UserManagement',
    components: {Pagination,search},
    data() {
      return {
        id: this.$route.query.id,
        scoreDig: false,
        scoreList: [], // 成绩管理
        matchList: [], //
        userId: [],
        listTotal: 1,
        scoreTotal: 1,
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
          limit: 10,
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
      indexMethod(index) {//展示序号的方法
        return (this.listPage - 1) * this.listQuery.limit + index + 1
      },
      getSearchVal(val){
        this.listQuery.search=val
        this.getList();
      },
      downloadWP() { // 下载WP
        if (this.userId.length == 0) {
          return
        }
        if (this.mode == 1) { // 判断是个人还是团队
          this.userId.forEach(item => {
            if (item.writeup) {
              window.open('/api/sponsor/event_task_user/down_wp?event=' + this.$route.query.id + '&user=' + item.obj_id)
            }
          })
        } else {
          this.userId.forEach(item => {
            if (item.writeup) {
              window.open('/api/sponsor/event_task_team/down_wp?event=' + this.$route.query.id + '&team=' + item.obj_id)
            }
          })
        }
      },
      handleSelectionChange(val) {
        this.userId = val
      },
      showScore(info) { // 展示成绩
        this.scoreQuery.event = this.id
        if (this.mode == 1) {
          this.scoreQuery.user = info.obj_id
          this.getUsersScore()
        } else {
          this.scoreQuery.team = info.obj_id
          this.getTeamScore()
        }
      },
      getUsersScore() { // 获取比赛成绩
        this.$http.get('/api/sponsor/event_users_scores_details',{params:this.scoreQuery}).then(res => {
          this.scoreList = res.data.rows
          this.scoreDig = true
        })
      },
      getTeamScore() { // 获取队伍成绩
        this.$http.get('/api/sponsor/event_teams_scores_details',{params:this.scoreQuery}).then(res => {
          this.scoreList = res.data.rows
          this.scoreDig = true
        })
      },
      invalid(id, status) { // 使成绩无效、有效
        const q = {status: status}
        this.$http.patch('/api/sponsor/event_user_answers/'+id, q).then(res => {
          if (this.mode == 1) {
            this.getUsersScore()
            this.listTotal = 1
            this.getList()
          } else {
            this.getTeamScore()
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
          this.$http.patch('/api/sponsor/event_signup_users/'+obj_id, data).then(res => {
            this.listTotal = 1
            this.getList()
          })
        } else {
          this.$http.patch('/api/sponsor/event_signup_teams/'+obj_id, data).then(res => {
            this.listPage = 1
            this.getList()
          })
        }
      },
      getList() {
        this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
        if (this.mode == 1) {
          this.$http.get('/api/sponsor/event_signup_user_details',{params:this.listQuery}).then(res => {
            this.matchList = res.data.rows
            this.listTotal = res.data.total
          })
        } else {
          this.$http.get('/api/sponsor/event_signup_team_details',{params:this.listQuery}).then(res => {
            this.matchList = res.data.rows
            this.listTotal = res.data.total
          })
        }
      },
      checkTable() { // 选择表格

      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .user_manage{

    .page_info {
      color: #fff;
      float: left;
      line-height :30px;
    }
  }


</style>


