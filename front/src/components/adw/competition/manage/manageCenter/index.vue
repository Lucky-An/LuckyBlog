<template>
  <div class="app-container competition_box wrap_size" id="homepage">
    <!--赛事增删改查 begin-->
    <div class=" btn_handle_group">
      <el-button v-if="user_auth.classes!=-1" size="small" type="primary" @click="addMatch(null)">{{$t('competition.createCompetition')}}</el-button>
      <el-button v-if="user_auth.classes!=-1" size="small" type="danger" @click="removeMatch">{{$t('selfHelp_competition.delete_match')}}</el-button>
      <el-button size="small" type="primary" @click="pubMatch(1)">{{$t('selfHelp_competition.public_match')}}</el-button>
      <el-button size="small" type="info" @click="pubMatch(0)">{{$t('selfHelp_competition.hidden_match')}}</el-button>
    </div>

    <!--表格 begin-->
    <div class="ordinary">
      <el-table
              v-loading="listLoading"
              ref="multipleTable"
              :key="tableKey"
              :data="matchList"
              border
              style="width: 100%"
              @selection-change="checkTable">
        <el-table-column
                align="center"
                width="40px"
                type="selection"/>
        <el-table-column
                align="center"
                prop="name_zh"
                width="200px"
                :label="$t('selfHelp_competition.match_name')"/>
        <el-table-column
                align="center"
                prop="sponsor_zh"
                :label="$t('selfHelp_competition.sponsor_id')"/>
        <el-table-column
                align="center"
                prop="type"
                :label="$t('selfHelp_competition.match_type')">
          <template slot-scope="scope">
            <span v-show="scope.row.type==6">{{$t('selfHelp_competition.invitation')}}</span>
            <span v-show="scope.row.type==7">{{$t('selfHelp_competition.open_tournament')}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="jointype"
                :label="$t('selfHelp_competition.join_type')">
          <template slot-scope="scope">
            <span>{{ scope.row.mode==1?$t('selfHelp_competition.self_match'):$t('selfHelp_competition.team_match')}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="start_time"
                :label="$t('selfHelp_competition.start_tiem')"
                width="160px"/>
        <el-table-column
                align="center"
                prop="end_time"
                :label="$t('selfHelp_competition.end_tiem')"
                width="160px"/>
        <el-table-column
                align="center"
                prop="process"
                :label="$t('selfHelp_competition.progress')">
          <template slot-scope="scope">
            <span v-show="scope.row.process==0">{{$t('selfHelp_competition.processing')}}</span>
            <span v-show="scope.row.process==1">{{$t('selfHelp_competition.no_start')}}</span>
            <span v-show="scope.row.process==2">{{$t('selfHelp_competition.over')}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="status"
                :label="$t('selfHelp_competition.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.public?$t('selfHelp_competition.public'):$t('selfHelp_competition.hide') }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                :label="$t('selfHelp_competition.operating')"
                width="320px">
          <template slot-scope="scope">
            <el-button class="filter-item selfServer-btn-green" size="mini" type="success"
                       @click="editMatch(scope.row.id)">{{$t('selfHelp_competition.edit')}}
            </el-button>
            <el-button
                    v-if="user_auth.classes!=2"
                    class="filter-item selfServer-btn-blue"
                    size="mini"
                    type="danger"
                    @click="accredit(scope.row.id,scope.row.mode)">
              {{ scope.row.mode==1?$t('selfHelp_competition.acc_user'):$t('selfHelp_competition.acc_team') }}
            </el-button>
            <el-button class="filter-item selfServer-btn-yellow" size="mini" type="warning"
                       @click="operation(scope.row.id)">{{$t('selfHelp_competition.match_opera')}}
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
              @pagination="getList"/>
    </div>

    <el-dialog
            :title="$t('dialog_list.validatePhone')"
            :visible.sync="dialogPhone"
            width="600px"
            center
            custom-class="ad_public_modal success_answer"
    >
      <el-form :model="phone_modal"
               ref="phone_modal"
               size="medium"
               class="demo-ruleForm ordinary"
               style="padding:0 50px;"
      >
        <validate-phone
                :config="phone_modal.config"
                @send_parent_phone="get_phone"
                @send_parent_code="get_code">

        </validate-phone>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPhone = false" class="submitphone">{{$t('modal.cancel')}}</el-button>
        <el-button class="cancel" @click="confirm_bind_phone('phone_modal')">{{$t('modal.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {setStorage, getStorage} from '@/utils/storage'
  import Pagination from '@/components/common_components/pagination'
  import validatePhone from '@/components/common_components/validatePhone'

  const matchType = [
    {key: '', display_name: '全部竞赛类型'},
    {key: 7, display_name: '公开赛'},
    {key: 6, display_name: '邀请赛'}
  ]
  const joinType = [
    {key: '', display_name: '全部参赛方式'},
    {key: 1, display_name: '个人赛'},
    {key: 2, display_name: '组队赛'}
  ]
  const matchStatus = [
    {key: '', display_name: '全部赛事进展'},
    {key: 0, display_name: '进行中'},
    {key: 1, display_name: '未开始'},
    {key: 2, display_name: '已结束'}
  ]

  export default {
    name: 'IndexVue',
    components: {Pagination, 'validate-phone': validatePhone},
    data () {
      return {
        dialogPhone: false,
        phone_modal: {

          // phone:getStorage('isUserLogin','object').user.phone,
          code: '',
          config: {
            phone: getStorage('isUserLogin', 'object').user.phone,
            known_phone: true,
            url: '/api/users/send_mobile_captcha/'
          }
        },
        id: this.$route.query.id, // 竞赛id
        tableKey: 0,
        total: 0,
        listLoading: false,
        page: 1,
        matchType,
        joinType,
        matchStatus,
        listQuery: {
          // search: '', // 竞赛名称
          // order: 'asc',
          limit: 10,
          // process: '', // 比赛进展
          // mode: '', // 参赛方式
          // sponsor_zh: '', // 主办方账号昵称
          // type: '', // 竞赛类型
          offset: 0,
          evt:'',
        },
        matchList: [],
        ids: [],// 选中的表格id
        user_auth:(getStorage('isUserLogin','object')).user,
      }
    },
    created () {
      this.getList()
    },
    methods: {
      confirm_bind_phone (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              ids: this.ids,
              phone: this.phone_modal.config.phone,
              verification_code: String(this.phone_modal.code)
            }
            this.$http.delete('/api/sponsor/evts/batch_destroy', {data, loading: true}).then((res) => {//判断是否还可以继续创建比赛
              if (res.data.success) {
                this.$notify.success({
                  title:this.$t('dialog_list.tips'),
                  message:this.$t('api_message.operation_success'),
                });
                // this.$message.success('操作成功')
                this.getList()
                this.dialogPhone = false
              }
            })
          }
        })
      },
      get_phone (val) {
        if (val.length != 0) {
          this.phone_modal.phone = Number(val)
        }
      },
      get_code (val) {
        if (val.length != 0) {
          this.phone_modal.code = Number(val)
        }
      },
      pubMatch (pub) { // 公开、隐藏赛事
        const data = {
          ids: this.ids,
          public: pub
        }
        this.$http.patch('/api/sponsor/evts/batch_public', data, {loading: true}).then(res => {
          if (res.data.success) {
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('api_message.operation_success'),
            });
            // this.$message.success('操作成功')
            this.getList()
          }
        })
      },
      removeMatch () { // 删除赛事
        if (this.ids.length == 0) return

        if (getStorage('isUserLogin', 'object').user.phone === '') {
          this.$alert('请到<a href="/personal/detail" style="color:#0080ff;margin-left:5px;margin-right:5px;">个人中心</a>绑定手机号再来创建战队吧~', '提示', {
            customClass: 'public_confirm public_confirm_sm text-center',
            showConfirmButton: false,
            confirmButtonText: this.$t('modal.confirm'),
            dangerouslyUseHTMLString: true,
          })
          return
        }
        this.dialogPhone = true
      },
      getList () { // 获取赛事列表
        this.listQuery.offset = (this.page - 1) * this.listQuery.limit
        if(this.id)this.listQuery.evt=this.id;
        this.$http.get('/api/sponsor/evts', {params:this.listQuery}).then(res => {
          this.matchList = res.data.rows
          this.total = res.data.total
        })
      },
      checkTable (val) { // 选择表格
        this.ids = val.map(item => {
          return item.id
        })
      },
      addMatch () { // 新增赛事
        this.$http.get('/api/sponsor/create_event').then((res) => {//判断是否还可以继续创建比赛
          if (res.data.success) {
            this.$router.push({
              path: '/common/createMatch'
            })
          }

        })

      },
      editMatch (id) { // 编辑赛事
        this.$router.push({
          path: '/common/editMatch',
          query: {id: id}
        })
      },
      accredit (id, mode) { // 授权管理
        if (mode == 1) {
          this.$router.push({
            path: '/common/manage/accreditUser',
            query: {
              id: id,
              mode: mode
            }
          })
        } else {
          this.$router.push({
            path: '/common/manage/accreditTeam',
            query: {
              id: id,
              mode: mode
            }
          })
        }

      },

      operation (id) { // 竞赛运维
        this.$http.get('/api/sponsor/event_state/' + id).then(res => {

          setStorage('match_info', res.data)

          this.$router.push({
            path: '/common/manage/operation',
            query: {id: id}
          })
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/common/stylus/base.styl'
  .competition_box
    padding-top: 60px;
    text-align: left;

    .btn_handle_group
      margin-bottom: 22px;

    .cancel, .submitphone
      width: 140px;
      height: 30px;
      text-align: center
      color: white
      display: inline-block
      -webkit-background-size: 100% 100%
      background: url('~@/assets/img/button/an.png') no-repeat;
      background-size: 100% 100%
      border: none;
      padding: 0;

      margin-right: 30px;

    .submitphone
      background: url('~@/assets/img/button/anniu.png') no-repeat;
      background-size: 100% 100%;
      padding: 0;

      &:hover {
        background-color: rgba(0, 0, 0, 0) !important;
      }

  .page_info {
    color: #fff;
    float: left;
    line-height :30px;
  }
</style>
