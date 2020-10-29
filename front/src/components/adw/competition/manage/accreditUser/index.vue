<template>
  <div class="accredit_user wrap_size" id="homepage">
    <div class="clearfix mrg15B">
      <div class=" fl">
        <el-input
                @change="changeNum('generateval',500)"
                v-model="generateval"
                type="number"
                size="small"
                :placeholder="$t('selfHelp_competition.generate_code')"
                style="width: 250px;margin-right: 10px;"
        />
        <!--<el-input-number v-model="generateval"  placeholder="123" :min="1" :max="10"></el-input-number>-->
        <el-button class=" def_btn" type="primary" @click="generate">{{$t('selfHelp_competition.generate')}}</el-button>
        <el-button class=" def_btn" :disabled="total<=0" type="warning" @click="download">{{$t('selfHelp_competition.download')}}</el-button>
      </div>
      <div class=" fr">
        <el-select
                v-model="listQuery.status"
                :placeholder="$t('selfHelp_competition.use_status')"
                clearable
                size="small"
                style="width: 130px">
          <el-option :label="$t('selfHelp_competition.all_states')" value=""/>
          <el-option :value="1" :label="$t('selfHelp_competition.Used')"/>
          <el-option :value="0" :label="$t('selfHelp_competition.Unused')"/>
        </el-select>
        <div style="display:inline-block" class="mrg5L">
          <search @searchEvent="getSearchVal"></search>
        </div>
      </div>
    </div>
    <div class="ordinary mrg30B">
      <!--用户授权表格 begin-->
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
                prop="username"
                :label="$t('selfHelp_competition.user')"/>
        <el-table-column
                align="center"
                prop="password"
                :label="$t('selfHelp_competition.password')"/>
        <el-table-column
                align="center"
                prop="nickname"
                :label="$t('selfHelp_competition.nickname')">
          <template slot-scope="scope">
            <span v-if="editForm.flag!==scope.$index">{{scope.row.nickname}}</span>
            <span v-else>
              <el-input class="editNickname" v-focus="true" v-model="editForm.nickname"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="jointype"
                :label="$t('selfHelp_competition.use_status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status?$t('selfHelp_competition.Used'):$t('selfHelp_competition.Unused') }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                :label="$t('selfHelp_competition.operating')"
                width="280px">
          <template slot-scope="scope">
            <el-button v-if="editForm.flag!==scope.$index" class="filter-item selfServer-btn-green" type="primary"
                       @click="showEdit(scope)">
              {{$t('selfHelp_competition.operating')}}
            </el-button>
            <span v-if="editForm.flag==scope.$index">
              <el-button class="filter-item selfServer-btn-green" type="primary" @click="submitForm">{{$t('modal.confirm')}}</el-button>
              <el-button class="filter-item selfServer-btn-blue" type="primary" @click="editForm.flag=-1">{{$t('modal.cancel')}}</el-button>
            </span>
            <el-button class="filter-item selfServer-btn-red mrg10L" type="danger" @click="remove(scope.row.id)">{{$t('selfHelp_competition.delete')}}
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
        {{page*listQuery.limit>total?total:page*listQuery.limit}}  records for a total of
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
        editForm: {nickname: '', flag: -1, user_id: ''},
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
        generateval: '', // 生成input
        accreditList: [// 列表数据

        ],
        team: this.$route.query.team,
      }
    },
    created () {
      this.getList()
    },
    methods: {
      changeNum (type, num) {//修改生成数量
        if(this[type]* 1+this.total>num)this[type]=num-this.total;

        if (this.$route.name == 'veterans'){
          if(this[type]* 1+this.total>20)this[type]=20-this.total;
        }

        if (this[type] < 0) this[type] = 0
      },
      getSearchVal (val) {
        this.listQuery.search = val
        this.getList()
      },
      showEdit (scope) {
        this.editForm.nickname = scope.row.nickname
        this.editForm.user_id = scope.row.user_id
        this.editForm.flag = scope.$index
      },
      submitForm () { // 提交编辑
        const obj = {}
        obj.nickname = this.editForm.nickname
        this.$http.patch('/api/sponsor/user_invite_code/' + this.editForm.user_id, obj).then(res => {
          if (res.data.success) {
            this.editForm.flag = -1
            this.getList()
          }
        })
      },
      getList () {
        this.editForm.flag=-1;
        this.getUserList()
      },
      remove (id) {
        let obj = {team: this.team || 0}
        this.$confirm(this.$t('selfHelp_competition.delete_sure'), this.$t('dialog_list.tips'), {
          confirmButtonText: this.$t('modal.confirm'),
          cancelButtonText: this.$t('modal.cancel'),
          customClass:'public_confirm public_confirm_sm',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/api/sponsor/user_invite_code/' + id, {data: obj}).then(res => {
            if (res.data.success) {
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message:this.$t('api_message.operation_success'),
              });
              // this.$message.success('删除成功')
              this.getList()
            }
          })

        }).catch(res=>{})

      },
      getUserList () {
        this.listQuery.offset = (this.page - 1) * this.listQuery.limit

        if (this.team) {
          this.listQuery.team = this.team
        }

        this.$http.get('/api/sponsor/user_invite_codes', {params: this.listQuery}).then(res => {
          this.accreditList = res.data.rows
          this.total = res.data.total
        })
      },
      generate () { // 生成邀请码
        if (this.generateval == '') {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('selfHelp_competition.generate_num'),
          });
          // this.$message.error('请填写生成数量')
          return
        }

        let obj = {user_num: Number(this.generateval), event: this.$route.query.id, team: this.team || 0}

        this.$http.post('/api/sponsor/user_invite_codes', obj,{loading:true}).then(res => {
          if (res.data.success) {
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('api_message.operation_success'),
            });
            // this.$message.success('生成成功')
            this.generateval = ''
            this.getList()
          }
        })
      },
      download () { // 下载
        if (this.team) {
          window.open('/api/sponsor/user_invite_code/down_excel?team=' + this.team + '&event=' + this.$route.query.id)
        } else {
          window.open('/api/sponsor/user_invite_code/down_excel?team=&event=' + this.$route.query.id)
        }

      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .accredit_user {
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
