<template>
  <div class="accredit_team wrap_size" id="homepage">
    <div class="clearfix mrg15B">
      <div class=" fl">
        <el-input
                @change="changeNum('team_num',50)"
                v-model="team_num"
                type="number"
                :placeholder="$t('selfHelp_competition.enter_team_num')"
                style="width: 250px;margin-right: 10px;"
                class="filter-item"
        />
        <el-input
                v-model="user_num"
                @change="changeNum('user_num',20)"
                type="number"
                :placeholder="$t('selfHelp_competition.enter_player_num')"
                style="width: 250px;margin-right: 10px;"
                class="filter-item"
        />
        <el-button class="filter-item def_btn" type="primary" @click="generate">{{$t('selfHelp_competition.generate')}}</el-button>
        <el-button class="filter-item def_btn" :disabled="total<=0"  type="warning" @click="download">{{$t('selfHelp_competition.download')}}</el-button>
      </div>
    </div>
    <div class="ordinary mrg30B">
      <!--队伍授权表格 begin-->
      <el-table
              v-loading="listLoading"
              :data="accreditList"
              style="width: 100%"
      >
        <el-table-column
                :label="$t('selfHelp_competition.serial_num')"
                width="110px"
                align="center"
                type="index"/>
        <el-table-column
                align="center"
                prop="team_name"
                :label="$t('selfHelp_competition.team_name')">
          <template slot-scope="scope">
            <span v-if="editForm.flag!==scope.$index">{{scope.row.team_name}}</span>
            <span v-else>
              <el-input class="editNickname" v-model="editForm.team_name" style="width:80%;" v-focus="true"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                :label="$t('selfHelp_competition.player_details')">
          <template slot-scope="scope">
            <el-button class="filter-item selfServer-btn-blue" type="primary" @click="veteransDeatil(scope.row)">{{$t('selfHelp_competition.view')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="use_count"
                :label="$t('selfHelp_competition.user_num')"/>
        <el-table-column
                align="center"
                :label="$t('selfHelp_competition.operating')"
                width="350px">
          <template slot-scope="scope">
            <el-button class="filter-item selfServer-btn-green" type="primary" @click="showEdit(scope)"
                       v-if="editForm.flag!==scope.$index">
              {{$t('selfHelp_competition.edit')}}
            </el-button>
            <div style="display:inline-block;" v-if="editForm.flag==scope.$index">
              <el-button class="filter-item selfServer-btn-green" type="primary" @click="submitForm">{{$t('modal.confirm')}}</el-button>
              <el-button class="filter-item selfServer-btn-blue" type="primary" @click="editForm.flag=-1">{{$t('modal.cancel')}}</el-button>
            </div>
            <el-button class="filter-item selfServer-btn-red mrg10L" type="danger" @click="remove(scope.row)">{{$t('selfHelp_competition.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页 begin-->
    <div class="grail_apge clearfix text-right pad30T" v-show="total>0">
      <div class="page_info" v-if="$i18n.locale == 'CN'">显示第 {{(page-1)*listQuery.limit+1}} 到第
        {{page*listQuery.limit>total?total:page*listQuery.limit}} 条记录，总共
        {{total}} 条记录
      </div>
      <div class="page_info" v-else>
        Showing {{(page-1)*listQuery.limit+1}} through
        {{page*listQuery.limit>total?total:page*listQuery.limit}} records for a total of
        {{total}} records.

      </div>

      <pagination
              v-show="total>listQuery.limit"
              :total="total"
              :page.sync="page"
              :limit.sync="listQuery.limit"
              layout='prev, pager, next'
              @pagination="getTeamList"/>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/common_components/pagination'
  import search from '../common/search'

  export default {
    name: 'Idnex',
    components: {Pagination, search},
    data () {
      return {
        mode: this.$route.query.mode, // 授权类型1个人2组队
        editForm: {team_name: '', flag: -1, team_id: ''},
        teamMembers: [],
        teamDlg: false,
        editDlg: false,
        tableKey: 0,
        total: 0,
        listLoading: false,
        page: 1,
        listQuery: {
          event: this.$route.query.id,
          offset: 0,
          limit: 10,
          search: '',
          status: '',
          order: 'asc'
        },
        checkAry: [], // 选择的数组
        team_num: '', // 生成input
        user_num: '', // 生成input
        accreditList: [// 列表数据

        ]
      }
    },
    created () {
      this.getTeamList()
    },
    methods: {
      changeNum (type, num) {//修改生成数量
        if (this[type]*1 > num) this[type] = num

        if(type=='team_num'){
          if(this[type]* 1+this.total>num)this[type]=num-this.total;
        }

        if (this[type]* 1 < 0) this[type] = 0
      },
      veteransDeatil (obj) {
        this.$router.push({
          path: '/common/manage/team/veterans',
          query: {
            id: this.$route.query.id,
            team: obj.team_id,
          }
        })
      },
      submitForm () { // 提交编辑
        let obj = {}
        obj.team_name = this.editForm.team_name
        this.$http.patch('/api/sponsor/team_invite_code/' + this.editForm.team_id, obj).then(res => {
          if (res.data.success) {
            this.editForm.flag = -1
            this.getTeamList()
          }
        })
      },
      showEdit (scope) {
        this.editForm.team_name = scope.row.team_name
        this.editForm.team_id = scope.row.team_id
        this.editForm.flag = scope.$index
      },
      handleChange (val) { // 选择表格
        this.checkAry = val.map(item => {
          return item.id
        })
      },
      remove (obj) {
        let data = {
          event: this.$route.query.id
        }

        this.$confirm(this.$t('selfHelp_competition.delete_sure'), this.$t('dialog_list.tips'), {
          confirmButtonText: this.$t('modal.confirm'),
          cancelButtonText: this.$t('modal.cancel'),
          customClass:'public_confirm public_confirm_sm',
          type: 'warning'
        }).then(() => {

          this.$http.delete('/api/sponsor/team_invite_code/' + obj.team_id, {data}).then(res => {
            if (res.data.success) {
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message:this.$t('api_message.operation_success'),
              });
              // this.$message.success('删除成功')
              this.getTeamList()
            }
          })

        }).catch(res=>{})

      },
      getTeamList () {
        this.listQuery.offset = (this.page - 1) * this.listQuery.limit
        this.$http.get('/api/sponsor/team_invite_codes', {params: this.listQuery}).then(res => {
          this.accreditList = res.data.rows
          this.total = res.data.total
        })
      },
      showTeamUser (ary) { // 显示团队成员
        this.teamDlg = true
        this.teamMembers = ary
      },
      generate () { // 生成邀请码
        if (this.team_num == '' || this.user_num == '') {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('selfHelp_competition.generate_num'),
          });
          // this.$message.error('请填写生成数量')
          return
        }

        const obj = {
          team_num: Number(this.team_num),
          user_num: Number(this.user_num),
          event: this.$route.query.id,
        }
        this.$http.post('/api/sponsor/team_invite_codes', obj,{loading:true}).then(res => {
          if (res.data.success) {
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('api_message.operation_success'),
            });
            // this.$message.success('生成成功')
            this.team_num = ''
            this.user_num = ''
            this.getTeamList()
          }
        })
      },
      download () { // 下载
        window.open('/api/sponsor/team_invite_code/down_excel/' + this.$route.query.id)
      }
    },
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .accredit_team {
    .page_info {
      color: #fff;
      float: left;
      line-height: 30px;
    }
  }
</style>
<style>
  #homepage .editNickname .el-input__inner{
    border:2px solid #0080ff!important;
  }
</style>
