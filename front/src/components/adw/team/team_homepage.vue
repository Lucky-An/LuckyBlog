<template>
  <div id="homepage">
    <div class="clearfix">
      <router-link to="/team/list" class="list_btn">{{$t('team.teamWall')}}</router-link>
    </div>
    <div class="home_wrap clearfix">
      <div id="leftnav" v-cloak>
        <div id="tops" class="team_info mrg20B">


          <el-upload
                  class="avatar-uploader"
                  style="float:none;"
                  :action="'/api/teams/upload/team_avatar/'+t_id"
                  :headers="{'X-CSRF-Token':csrfToken}"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  name="logo"
                  :before-upload="beforeAvatarUpload">
            <img v-if="tdata.logo_url" id="team_logo" :src="tdata.logo_url" alt="" width="120" height="120">
            <!--<img v-if="form_data.logo" :src="form_data.logo" class="avatar">-->
            <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <div class="ellipsis_txt" :title="tdata.name" v-text="tdata.name"
               style="font-size:22px;margin:20px 0 10px;"></div>
          <div>ID:{{tdata.id}}</div>
        </div>
        <div class="notice">
          <div class="notice_title">{{$t('team.teamNotice')}}</div>
          <div class="notice_content">
            <div>
              <span v-if="tdata.notice==''" style="width:100%;display:inline-block;text-align:center;">{{$t('team.noNotice')}}</span>
              <span class="notcie_box" v-else v-text="splitstr(80)" v-show="!change_onoff"></span>
            </div>
            <div id="write_notice" v-show="change_onoff">
                                <textarea name=""
                                          v-model="tdata.notice"
                                          v-focus="change_onoff"
                                ></textarea>
              <div class="text-center">
                <el-button type="primary" round size="mini" @click="changed_notice">{{$t('modal.confirm')}}</el-button>
                <el-button round size="mini" @click="cancel_edit">{{$t('modal.cancel')}}</el-button>
              </div>
            </div>
            <span v-if="user_authority.position==1||user_authority.position==2">
                            <span class="edit_notice" @click="change_notice" v-show="!change_onoff"><i
                                    class="el-icon-edit"></i>{{$t('team.edit')}}</span>
                        </span>
          </div>
        </div>
        <router-link id="team_detail" :to="{path:'/team/detail',query: {id: t_id}}">{{$t('team.teamInfo')}}
        </router-link>
      </div>
      <div class="list_table">
        <div class="member" key="team-list" v-if="!showJoinList">
          <div class="join_btn">
            <span class="content_btn" @click="showApply"
                  v-if="user_authority.position==1||user_authority.position==2">
              <span>{{$t('team.applyJoin')}}</span>
              <span class="apply_count" v-if="tdata.apply_count" v-text="applyCount"></span>
            </span>
          </div>
          <div class="gf-table posRelative ordinary hide_last_row user_logo_radius">
            <template>
              <el-table
                      ref="singleTable"
                      :data="tableData"
                      v-loading="loadingUsergroupList"
                      :element-loading-text="$t('team.table.loading')"
                      :default-sort="{prop: 'position', order: 'ascending'}"
                      border
                      @row-click="clickrow"
                      :row-class-name="addActive"
                      style="width: 100%">
                <el-table-column
                        type=index
                        :label="$t('team.table.order')"
                        :index="indexMethod"
                        width="80">
                </el-table-column>
                <el-table-column
                        :label="$t('team.table.member_name')"
                        width="220">
                  <template slot-scope="scope">
                    <div class="text-left">
                      <span class="team_logo" :style="{backgroundImage:'url(' + scope.row.user.logo + ')'}"></span>
                      <span v-text="scope.row.user.nickname.length>10 ? scope.row.user.nickname.substr(0,9)+'…' : scope.row.user.nickname"></span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                        prop="job_name"
                        :label="$t('team.table.position')">
                </el-table-column>
                <el-table-column
                        prop="user.level"
                        :label="$t('team.table.level')">
                  <template slot-scope="scope">
                    {{$i18n.locale=='CN'? scope.row.user.level.zh : scope.row.user.level.en}}
                  </template>
                </el-table-column>
                <el-table-column
                        prop="user.good_at"
                        :label="$t('team.table.goodat')">
                </el-table-column>
                <el-table-column
                        prop="user.points"
                        :label="$t('team.table.points')">
                </el-table-column>
                <el-table-column
                        prop="user.competition_num"
                        :label="$t('team.table.competition_num')"
                        width="120"
                >
                </el-table-column>
                <el-table-column
                        v-if="0"
                        sortable
                        property="position"
                        :label="$t('team.table.level')">
                </el-table-column>
              </el-table>
            </template>
          </div>
          <div style="position:absolute;bottom:10px;left:0;right:0;margin:0 auto;">
            <v-page
                    v-show="pager.total>pager.pageSize"
                    :total="pager.total"
                    :page.sync="pager.currentPage"
                    :limit.sync="pager.pageSize"
                    :layout="pager.layout"

                    @pagination="getList"


            ></v-page>
          </div>
          <div class="teamer_handle clearfix mrg30T">
            <div v-cloak>
              <div class="cursor md_blue_btn fr" @click="leave_team">{{$t('team.leave.name')}}</div>
              <div class="cursor md_blue_btn fr mrg15R" @click="pass_to"
                   v-if="user_authority.position==1&&tableData.length!=1"
              >{{$t('team.transfer.name')}}
              </div>
              <div class="cursor md_blue_btn fr mrg15R"
                   @click="expulsion"
                   v-if="!has_team_member"
              >{{$t('team.expulsion.name')}}
              </div>
              <div class="cursor md_blue_btn fr mrg15R" @click="assignment"
                   v-if="user_authority.position==1&&tableData.length!=1">{{$t('team.appointment.name')}}
              </div>
            </div>
          </div>
        </div>
        <div class="apply ordinary disabled_hover" key="apply-list" v-else>
          <div class="member_btn">
            <span class="content_btn" @click="showJoinList = !showJoinList">{{$t('team.team_members')}}</span>
          </div>
          <div class="table_wrap">
            <el-table
                    :data="apply_data"
                    v-loading="loadingapply"
                    border
                    style="width: 100%">
              <el-table-column
                      type=index
                      :label="$t('team.table.order')"
                      :index="indexMethod2"
                      width="80">
              </el-table-column>
              <el-table-column
                      :label="$t('team.table.member_name')"
                      width="120">
                <template slot-scope="scope">
                  <div class="text-left">
                    <span class="team_logo" :style="{backgroundImage:'url(' + scope.row.apply_user.logo + ')'}"></span>
                    <span v-text="scope.row.apply_user.nickname.length>10 ? scope.row.apply_user.nickname.substr(0,9)+'…' : scope.row.apply_user.nickname"></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                      prop="apply_user.level"
                      :label="$t('team.table.level')">
                <template slot-scope="scope">
                  {{$i18n.locale=='CN'? scope.row.apply_user.level.zh : scope.row.apply_user.level.en}}
                </template>
              </el-table-column>
              <el-table-column
                      prop="apply_user.good_at"
                      :label="$t('team.table.goodat')">
              </el-table-column>
              <el-table-column
                      prop="apply_user.points"
                      :label="$t('team.table.points')">
              </el-table-column>
              <el-table-column
                      prop="apply_content"
                      :label="$t('team.table.leavingMessage')">
                <template slot-scope="scope">
                  <div class="look_message" @click="look_apply_content(scope.row)">{{$t('team.table.look')}}</div>
                </template>
              </el-table-column>
              <el-table-column
                      prop="join_num"
                      width="260"
                      :label="$t('team.table.operation')">
                <template slot-scope="scope">
                  <button class="handle_btn"
                          @click="apply_solve(1,scope.row,scope.$index)">{{$t('team.agree')}}
                  </button>
                  <button class="handle_btn"
                          @click="apply_solve(2,scope.row,scope.$index)">{{$t('team.refuse')}}
                  </button>
                  <button class="handle_btn"
                          @click="apply_solve(0,scope.row,scope.$index)">{{$t('team.ignore')}}
                  </button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="position:absolute;bottom:20px;left:0;right:0;margin:0 auto;">
            <v-page
                    v-show="pager2.total>pager2.pageSize"
                    :total="pager2.total"
                    :page.sync="pager2.currentPage"
                    :limit.sync="pager2.pageSize"
                    :layout="pager2.layout"

                    @pagination="getapply"
            ></v-page>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
            :title="$t('team.appointment.name')"
            :visible.sync="handleVisible"
            width="700px"
            custom-class="ad_public_modal ">
      <div class="task_group">
        <div class="text-left font16"><span>{{$t('team.appointment.line1')}}<span
                style="color:#0080ff;font-size:18px;font-weight:bold;"
                v-text="currentRow.job_name"></span></span></div>
        <div class="mrg20T text-left font16">
          <span>{{$t('team.appointment.line2')}}:</span>
          <span v-text="assignment_modal.assignd_list.assign_name"
                class="select_job select_job_active"
          >
                    </span>
        </div>
        <div v-if="just_write" class="text-left mrg20T font14 blueC">{{$t('team.appointment.vice_captain_tips')}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleVisible = false">{{$t('modal.cancel')}}</el-button>
        <el-button type="primary" @click="changed_job">{{$t('modal.confirm')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
            :title="$t('team.transfer.selectPassed')"
            :visible.sync="passVisible"
            width="700px"
            custom-class="ad_public_modal ">
      <el-form :model="passtoForm" :rules="passto_rules"
               ref="passtoForm"
               size="medium"
               class="demo-ruleForm"
      >
        <el-form-item label="" prop="name" style="width:300px;margin-bottom:8px;">
          <el-input v-model="passtoForm.searchWord" @input="search_passto"
                    :placeholder="$t('team.transfer.input')"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:20px;" prop="passto_user">
          <div class="modal_table posRelative writeup_content" style="border:1px solid #053a66;background:#0d223d;">
            <el-table
                    :data="tableData_passto"
                    height="250"
                    border
                    @row-click="click_passed"
                    :row-class-name="addpassActive"
                    style="width: 100%">
              <el-table-column
                      prop="user.nickname"
                      :label="$t('team.table.member_name')"
                      width="180">
              </el-table-column>
              <el-table-column
                      prop="user.id"
                      label="ID"
                      width="180">
              </el-table-column>
              <el-table-column
                      prop="user.level"
                      :label="$t('team.table.level')">
                <template slot-scope="scope">
                  {{$i18n.locale=='CN'? scope.row.user.level.zh : scope.row.user.level.en}}
                </template>
              </el-table-column>
              <el-table-column
                      prop="user.points"
                      :label="$t('team.table.points')">
              </el-table-column>
            </el-table>
            <textarea name="" id="write_passto" cols="30" rows="10" v-model="passtoForm.passto_user"></textarea>
          </div>
        </el-form-item>
        <div v-if="!loadingUsergroupList" class="imcode">
          <v-phone :config="phone_modal.config"
                   @send_parent_phone="get_phone"
                   @send_parent_code="get_code"
                   v-if="user_authority.user.is_china"
                   ref="validatePhone"
          ></v-phone>
        </div>
        <div class="mrg0L dialog-footer pad10T">
          <el-button @click="passVisible = false">{{$t('modal.cancel')}}</el-button>
          <el-button type="primary" @click="submitpasstoForm('passtoForm')">{{$t('modal.confirm')}}</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
  import {setStorage, getStorage} from '@/utils/storage'
  import page from '@/components/common_components/pagination'
  import phone from '@/components/common_components/validatePhone'

  export default {
    name: 'team_homepage',
    components: {
      'v-page': page,
      'v-phone': phone
    },
    data () {
      return {
        handleVisible: false,
        passVisible: false,
        tableData: [],
        tableData_passto: [],
        pagination_data: {
          click_url: '/x_person/api/team_users/',
          list_total: 0,
        },
        page_config: {
          now_page_num: 1,
          page_size: 10
        },
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 10,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
          class: 'bluepage'
        },
        pager2: {//页码
          currentPage: 1,//当前第几页
          pageSize: 10,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
          class: 'bluepage'
        },
        user_authority: {
          position: 3
        },
        modal_config: {
          title: '',
          showCancelButton: true,
          customClass: 'public_confirm public_confirm_md',
        },
        assignment_modal: {
          id: 'assignment_modal',
          header: {
            title: this.$t('team.appointment.name')
          },
          assignd_list: {},
          changed_index: 0
        },
        phone_modal: {
          id: 'phone_modal',
          header: {
            title: this.$t('dialog_list.tips')
          },
          assignd_list: {},
          changed_index: 0,
          clickBg_nohidden: true,
          phone: '',
          code: '',
          config: {
            known_phone: true,
            phone: (getStorage('isUserLogin', 'object')).user.phone,
            url: '/api/users/send_mobile_captcha/'
          }
        },
        currentRow: '',
        header: '',
        left_nav: {},
        passto_modal: {
          id: 'passto_modal',
          header: {
            title: this.$t('team.transfer.selectPassed')
          },
        },
        passtoForm: {
          passto: {},
          searchWord: '',
          passto_user: '',
          phone: (getStorage('isUserLogin', 'object')).user.phone,
          code: '',
        },
        passto_rules: {
          passto_user: [{required: true, message: this.$t('team.transfer.validate_person'), trigger: 'blur'}],
          code: [
            {required: true, message: this.$t('team.transfer.validate_phone'), trigger: 'blur'},
          ],
        },
        filter_table: [],
        init_user_index: '',
        loadingUsergroupList: true,
        loadingapply: true,
        t_id: (getStorage('isUserLogin', 'object')).team.data.id,
        has_vice_captain: false,
        just_write: false,
        has_team_member: true,
        is_community_member: false,
        tdata: {},
        apply_data: [],
        showJoinList: false,
        user_data: localStorage.isUserLogin,
        change_onoff: false,
        notice: {
          new_notice: '',
          old_notice: ''
        },
        header: '',
        todoNumber: 0,
        show_code_validate: getStorage('isUserLogin', 'object').user.is_china,
      }
    },
    created () {
      this.getList()
      this.$http.get('/api/teams/' + this.t_id)
      .then((res) => {
        this.tdata = res.data
      })
      .catch((err) => {
        this.$router.push({path: '/team/list'})
      })

    },
    methods: {
      handleAvatarSuccess (res, file) {
        if (res.success) {
          this.tdata.logo_url = URL.createObjectURL(file.raw)
          this.$http.get('/api/teams/'+this.t_id)
          .then((res) => {
            if (res.data.success) {
              console.log(res.data.message)
              this.$nextTick(() => {
                this.tdata.logo_url=res.data.logo_url;
              })

            }
          })
          .catch((err) => {

          })
        } else {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('api_message.' + res.message),
          })
          // this.$message.error(this.$t('api_message.' + res.message));
        }
      },
      beforeAvatarUpload (file) {
        var isJPG = false
        if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
          isJPG = true
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('validateImg.logo_require'),
          })
          // this.$message.error(this.$t('validateImg.logo_require'));
        }
        if (!isLt2M) {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('validateImg.size'),
          })
          // this.$message.error(this.$t('validateImg.size'));
        }
        return isJPG && isLt2M
      },
      getList () {
        this.$http.get('/api/teams/users/' + this.t_id, {
          params: {
            offset: (this.pager.currentPage - 1) * this.pager.pageSize,
            limit: this.pager.pageSize,
            key: ''
          }
        })
        .then((res) => {
          // 响应成功回调
          var data = res.data
          this.tableData = data.rows
          this.pager.total = data.total
          this.tableData_passto = data.rows
          this.loadingUsergroupList = false
          for (var i = 0; i < this.tableData.length; i++) {
            add_jobname(this.tableData[i], this)
            if (this.tableData[i].id == data.current_user.id) {
              this.init_user_index = i
            }

            if (this.tableData[i].position == 2) {
              this.has_vice_captain = true
            }
          }
          this.pagination_data.list_total = data.total
          this.user_authority = data.current_user
          if (this.user_authority.position !== 3) {
            this.getapply()
          }
          if (this.user_authority.position == 1) {
            this.passtoForm.phone = this.user_authority.bind_phone
            if (this.tableData.length <= 1) {
              this.has_team_member = true
            } else {
              this.has_team_member = false
            }
            if (this.user_authority.is_creator) {
              if (this.show_code_validate && this.user_authority.bind_phone == '') {
                this.is_community_member = false
                let alertTitle = this.$i18n.locale == 'CN' ? '为不影响操作,请到<a href="/personal/detail" style="color:#0080ff;margin-left:5px;margin-right:5px;">个人中心</a>绑定手机号' : 'In order not to affect the operation, please go to the <a href="/personal/detail" style="color:#0080ff;margin-left:5px;margin-right:5px;">personal center</a> to bind the mobile phone number.'
                this.$alert(alertTitle, this.$t('el.messagebox.title'), {
                  customClass: 'public_confirm public_confirm_sm text-center',
                  showConfirmButton: false,
                  showClose: false,
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: this.$t('modal.confirm'),
                })
              }
            } else {
              if (this.show_code_validate && this.user_authority.bind_phone == '') {
                let alertTitle2 = this.$i18n.locale == 'CN' ? this.user_authority.handle_user + '已把队长职位转让给您,为不影响操作，请到<a href="/personal/detail" style="color:#0080ff;margin-left:5px;margin-right:5px;">个人中心</a>绑定手机号' : this.user_authority.handle_user + ' has transferred the position of captain to you. In order not to affect the operation, please go to the <a href="/personal/detail" style="color:#0080ff;margin-left:5px;margin-right:5px;">personal center</a> to bind the mobile phone number.'
                this.$alert(alertTitle2, this.$t('el.messagebox.title'), {
                  customClass: 'public_confirm public_confirm_sm text-center',
                  showConfirmButton: false,
                  showClose: false,
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: this.$t('modal.confirm'),
                })
              }
            }
          } else if (this.user_authority.position == 2) {
            if (this.tableData.length <= 2) {
              this.has_team_member = true
            } else {
              this.has_team_member = false
            }
          }
          add_jobname(this.user_authority, this)
        }).catch((err) => {
          this.$http.get('/api/personal/reload_profile')
          .then((res) => {
            if (res.data.success) {
              setStorage('isUserLogin', res.data.user_data)
            }
          })
          this.$router.push({path: '/team/list'})
        })
      },
      getapply () {
        if (this.todoNumber > 0) {
          return
        }
        this.loadingapply = true
        this.$http.get('/api/teams/user_records', {
          params: {
            offset: (this.pager2.currentPage - 1) * this.pager2.pageSize,
            limit: this.pager2.pageSize,
            team_id: this.t_id
          }
        })
        .then((res) => {
          this.loadingapply = false
          this.apply_data = res.data.rows
          this.pager2.total = res.data.total
          this.todoNumber++
        })
        .catch((err) => {
          this.$router.push({path: '/team/list'})
        })
      },
      showApply () {
        this.showJoinList = !this.showJoinList
      },
      init_list (list) {
        this.tableData = list
      },
      clickrow (row, columnIndex) {
        if (row.position == 3 && this.has_vice_captain) {
          this.just_write = true
        } else {
          this.just_write = false
        }
        if (row.position > this.user_authority.position) {
          this.currentRow = row
          if (row.position == 2) {
            this.assignment_modal.assignd_list = {
              assign_num: 3,
              assign_name: this.$t('team.job.team_member')
            }
          } else if (row.position == 3) {
            this.assignment_modal.assignd_list = {
              assign_num: 2,
              assign_name: this.$t('team.job.vice_captain')
            }
          }
        } else {
          this.currentRow = ''
        }
      },
      addActive (row, rowIndex) {
        if (this.user_authority.position < 3) {
          if (row.row.position <= this.user_authority.position) {
            return 'disabled_row'
          } else if (row.row.id == this.currentRow.id) {
            return 'activerow'
          }
        }
      },
      get_phone (val) {
        if (val.length != 0) {
          this.passtoForm.phone = Number(val)
        }
      },
      get_code (val) {
        if (val.length != 0) {
          this.passtoForm.code = Number(val)
        }
      },
      confirm_bind_phone (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams()
            params.append('phone', this.phone_modal.phone)
            params.append('verification_code', this.phone_modal.code)
            axios.post('/x_person/api/team_users/' + this.user_authority.id + '/bind_phone/',
              params, {headers: this.header})
            .then((res) => {
              if (res.data.success) {
                var str_phone = String(this.phone_modal.phone)
                this.user_authority.bind_phone = this.passtoForm.phone = str_phone.substr(0, 3) + '****' + str_phone.substr(7, 4)

                this.$notify.error({
                  customClass: 'error_notify',
                  title: this.$t('public.error'),
                  message: res.data.data,
                })

                // this.$message.error(res.data.data);
                $('#phone_modal').modal('hide')
              }
            })
            .catch((err) => {
              this.$router.push({path: '/team/list'})
              // alert_message('error', err.response.data.error.message,true);
            })
          } else {
            return false
          }
        })
      },
      leave_team () {//离队
        this.modal_config.confirmButtonText = this.$t('modal.confirm')
        this.modal_config.cancelButtonText = this.$t('modal.cancel')
        var jurisdiction = this.user_authority.position
        const h = this.$createElement
        if (this.tableData.length === 1) {
          var modal_inner = {
            message: h('div', {style: 'text-align:center'}, [
              h('p', null, [
                h('span', null, this.$t('team.leave.onlyoneTips')),
              ])
            ])
          }
          this.$msgbox(Object.assign(this.modal_config, modal_inner)).then(action => {
            leave_team_handle(this)
          })
        } else {
          if (jurisdiction === 1) {
            var modal_inner = {
              message: h('div', {style: 'text-align:center'}, [
                h('p', null, [
                  h('span', null, this.$t('team.leave.line1')),
                  h('span', {style: 'color:#0181fe;font-weight:bold;font-size:16px;margin-left:5px;'}, this.user_authority.job_name),
                ]),
                h('p', null, this.$t('team.leave.line2'))
              ])
            }
            this.$msgbox(Object.assign(this.modal_config, modal_inner)).then(action => {
              this.passVisible = true
            })
          } else {
            var modal_inner = {
              message: h('div', {style: 'text-align:center'}, [
                h('p', null, this.$t('team.leave.confirmleave')),
                h('p', null, this.$t('team.leave.leavedThing')),
              ])
            }

            this.$msgbox(Object.assign(this.modal_config, modal_inner)).then(action => {
              leave_team_handle(this)
            })
          }
        }
      },
      pass_to () {//转让
        this.modal_config.confirmButtonText = this.$t('modal.confirm')
        this.modal_config.cancelButtonText = this.$t('modal.cancel')
        const h = this.$createElement
        var jurisdiction = this.user_authority
        var modal_inner = {
          message: h('div', {style: 'text-align:center'}, [
            h('p', null, [
              h('span', null, this.$t('team.leave.line1')),
              h('span', {style: 'color:#0181fe;font-weight:bold;font-size:16px;margin-left:5px;'}, this.user_authority.job_name),
            ]),
            h('p', null, this.$t('team.transfer.line2') + this.user_authority.job_name + ',' + this.$t('team.transfer.line3')),
          ]),
        }
        this.$msgbox(Object.assign(this.modal_config, modal_inner)).then(action => {
          this.passVisible = true
        })
      },
      search_passto () {
        this.$http.get('/api/teams/users/' + this.t_id, {
          params: {
            key: this.passtoForm.searchWord
          }
        }).then((res) => {
          this.tableData_passto = res.data.rows
        })
        .catch((err) => {
          this.$router.push({path: '/team/list'})
        })
      },
      assignment () {//任命
        if (!this.currentRow) {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('team.selectMember'),
          })
          // this.$message.error(this.$t('team.selectMember'));
        } else {
          this.handleVisible = true
        }
      },
      select_job (i) {
        this.assignment_modal.changed_index = i
      },
      changed_job () {//任命点击确定
        this.$http.patch('/api/teams/users/' + this.currentRow.id, {
          position: this.assignment_modal.assignd_list.assign_num,
          type: 5
        },)
        .then((res) => {
          if (res.data.success) {
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.currentRow.position == 3) {
                if (this.tableData[i].position == 2) {
                  this.tableData[i].position = 3
                  this.tableData[i].job_name = this.$t('team.job.team_member')
                }
              }
              if (this.tableData[i].id == this.currentRow.id) {
                this.tableData[i].position = this.assignment_modal.assignd_list.assign_num
                this.tableData[i].job_name = this.assignment_modal.assignd_list.assign_name
              }
            }
            this.tableData.sort((a, b) => a.position - b.position)
            this.$notify.success({
              title: this.$t('dialog_list.tips'),
              message: this.$t('team.appointment.success'),
            })
            // this.$message({
            //   message: this.$t('team.appointment.success'),
            //   type: 'success'
            // });
            this.handleVisible = false
          }
        })
        .catch((err) => {
          this.$router.push({path: '/team/list'})
        })
      },
      expulsion () {//逐出
        if (!this.currentRow) {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('team.selectMember'),
          })

          // this.$message.error(this.$t('team.selectMember'));
        } else {
          this.$prompt(this.$t('team.expulsion.title'), this.$t('team.expulsion.name'), {
            confirmButtonText: this.$t('modal.confirm'),
            cancelButtonText: this.$t('modal.cancel'),
            inputPattern: /\S/,
            inputErrorMessage: this.$t('team.expulsion.tips'),
            showClose: false,
            inputType: 'textarea',
            inputPlaceholder: this.$t('team.expulsion.placeholder'),
            customClass: 'public_confirm public_confirm_md'
          }).then(({value}) => {
            this.$http.patch('/api/teams/users/' + this.currentRow.id,
              {
                type: 6,
                content: value
              }).then((res) => {
              if (res.data.success) {
                this.$notify.success({
                  title: this.$t('dialog_list.tips'),
                  message: this.$t('team.expulsion.confirm'),
                })
                this.getList()
                this.currentRow = ''
              }
            }).catch((err) => {
              this.$router.push({path: '/team/list'})
            })
          }).catch((err) => {
            this.$notify.success({
              title: this.$t('dialog_list.tips'),
              message: this.$t('team.expulsion.cancel'),
            })
            // this.$message({
            //   message: this.$t('team.expulsion.cancel'),
            //   type: 'success'
            // });
          })
        }
      },
      indexMethod (index) {
        return (this.pager.currentPage - 1) * this.pager.pageSize + index + 1
      },
      indexMethod2 (index) {
        return (this.pager2.currentPage - 1) * this.pager2.pageSize + index + 1
      },
      click_passed (row, columnIndex) {
        this.passtoForm.pass_to = row
        this.passtoForm.passto_user = row.id
      },
      addpassActive (row, rowIndex) {
        if (row.row.position <= this.user_authority.position) {
          return 'disabled_row'
        } else if (row.row.id == this.passtoForm.passto_user) {
          return 'activerow'
        }
      },
      submitpasstoForm (formName) {//点击提交转让按钮
        if (this.user_authority.user.is_china) {
          this.$refs.validatePhone.changeImg()
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.patch('/api/teams/users/' + this.passtoForm.pass_to.id, {
              type: 4,
              position: this.user_authority.position,
              verification_code: this.passtoForm.code,
              phone: this.passtoForm.phone
            })
            .then((response) => {
              if (response.data.success) {
                this.$notify.success({
                  title: this.$t('dialog_list.tips'),
                  message: this.$t('team.transfer.success'),
                })
                // this.$message({
                //   message: this.$t('team.transfer.success'),
                //   type: 'success'
                // });
                this.passVisible = false
                for (var i = 0; i < this.tableData.length; i++) {
                  if (this.tableData[i].id == this.passtoForm.passto_user) {
                    this.tableData[i].position = this.user_authority.position
                    this.tableData[i].job_name = this.user_authority.job_name
                  }
                }
                this.user_authority.position = 3
                this.tableData[this.init_user_index].position = 3
                this.has_team_member = true
                this.tableData[this.init_user_index].job_name = this.$t('team.job.team_member')
                this.tableData.sort((a, b) => a.position - b.position)
              }
            })
            .catch((err) => {
              this.$router.push({path: '/team/list'})
            })
          } else {
            return false
          }
        })
      },
      look_apply_content (content) {
        let message = content.apply_content == null ? this.$t('team.nomessage') : content.apply_content
        this.$alert(message, '', {
          customClass: 'public_confirm public_confirm_sm',
          showConfirmButton: false,
          center: true,
          closeOnClickModal: true,
        })
      },
      apply_solve (num, row, i) {
        var params = new URLSearchParams()
        params.append('type', num)
        this.$http.patch('/api/teams/user_records/' + row.id, {
          type: num
        }).then((res) => {
          if (res.data.success) {
            if (num == 1) {
              this.getList()
            }
            this.apply_data.splice(i, 1)
            this.tdata.apply_count--
            this.$notify.success({
              title: this.$t('dialog_list.tips'),
              message: this.$t('team.handle_success'),
            })
            // this.$message({
            //   message: this.$t('team.handle_success'),
            //   type: 'success'
            // });
          }
        }).catch((err) => {
          this.$router.push({path: '/team/list'})
        })
      },
      splitstr (num) {
        var str = this.tdata.notice
        if (str) {
          if (str.length > num) {
            return str.substring(0, num) + '……'
          } else {
            return str
          }
        }
      },
      change_notice () {
        this.change_onoff = true
        this.notice.old_notice = this.tdata.notice
      },
      changed_notice () {
        this.$http.patch('/api/teams/' + this.tdata.id, {
          notice: this.tdata.notice
        }).then((res) => {
          if (res.data.success) {
            this.$notify.success({
              title: this.$t('dialog_list.tips'),
              message: this.$t('team.edit_success'),
            })
            // this.$message({
            //   message: this.$t('team.edit_success'),
            //   type: 'success'
            // });
          }
        }).catch((err) => {
          this.$router.push({path: '/team/list'})
        })
        this.change_onoff = false
        this.notice.old_notice = this.tdata.notice
      },
      cancel_edit () {
        this.change_onoff = false
        this.tdata.notice = this.notice.old_notice
      }
    },
    computed: {
      applyCount () {
        return this.tdata.apply_count > 10 ? '10+' : this.tdata.apply_count
      },
      csrfToken(){
        var arr,reg=new RegExp("(^| )"+'X-CSRF-Token'+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
          return unescape(arr[2]);
        else
          return null;
      }

    },
    directives: {
      focus: {
        // 指令的定义
        update: function (el) {
          el.focus()
        }
      }
    },
  }
  var add_jobname = (who, target) => {
    switch (who.position) {
      case 1:
        who.job_name = target.$t('team.job.captain')
        break
      case 2:
        who.job_name = target.$t('team.job.vice_captain')
        break
      case 3:
        who.job_name = target.$t('team.job.team_member')
    }
  }
  var leave_team_handle = (that) => {
    that.$http.patch('/api/teams/users/' + that.user_authority.id, {
      type: 3
    })
    .then((res) => {
      if (res.data.success) {
        let login_data = getStorage('isUserLogin', 'object')
        login_data.team.has_team = false
        login_data.team.data = {}
        setStorage('isUserLogin', login_data)
        that.$notify.success({
          title: that.$t('dialog_list.tips'),
          message: that.$t('team.leave.success'),
        })
        // that.$message({
        //   message: this.$t('team.leave.success'),
        //   type: 'success'
        // });
        setTimeout(() => {
          that.$router.push({path: '/team/list'})
        }, 800)
      }
    })
    .catch((err) => {
      that.$router.push({path: '/team/list'})
    })
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/common/stylus/mixin.styl'
  #homepage
    margin: 0 auto;
    padding-top: 20px;

    #leftnav
      width: 300px
      padding: 30px 16px 20px
      float: left
      edge-angle()
      card_style()

      #tops
        margin-bottom: 40px

      #notice
        width: 100%
        height: 300px

      #team_detail
        margin-top: 30px;

    .list_btn
      float: right
      set_bg('button/list_btn.png')
      font-size: 16px
      font-weight: bold
      color: white

    .home_wrap
      margin-top: 10px

      .list_table
        width: calc(100% - 350px)
        float: right
        padding: 20px
        position: relative;
        edge-angle()
        card_style()

        .member
          .table_wrap
            margin-top: 20px

          .join_btn
            text-align: right;
            margin-bottom: 15px;

            .content_btn
              cursor: pointer;
              position: relative;

              .apply_count
                position: absolute;
                right: -6px;
                top: -6px;
                background: #f00;
                color: white;
                width: 20px;
                height: 20px;
                border-radius 50%;
                font-size: 12px;
                line-height: 20px;

        .apply
          .member_btn
            text-align: left

            .content_btn
              cursor: pointer;

          .table_wrap
            margin-top: 20px

  @media (max-width: 1300px)
    #homepage
      width: 1200px;

      .list_btn
        width: 150px;
        height: 40px;
        line-height: 40px;

      .md_blue_btn
        width: 100px;
        height: 32px;
        line-height: 32px;

      #leftnav
        height: 570px

        #team_detail
          confirm-btn-md()

      .home_wrap
        .list_table
          height: 570px

  @media (min-width: 1300px) and (max-width: 1600px)
    #homepage
      width: 1300px;

      .list_btn
        width: 150px;
        height: 40px;
        line-height: 40px;

      .md_blue_btn
        width: 100px;
        height: 32px;
        line-height: 32px;

      #leftnav
        height: 570px

        #team_detail
          confirm-btn-md()

      .home_wrap
        .list_table
          height: 570px

  @media (min-width: 1600px) and (max-width: 1920px)
    #homepage
      width: 1450px;

      .list_btn
        width: 175px;
        height: 45px;
        line-height: 45px;

      .md_blue_btn
        width: 117px;
        height: 36px;
        line-height: 36px;

      #leftnav
        height: 680px

        #team_detail
          confirm-btn-lg()

      .home_wrap
        .list_table
          height: 680px

  @media (min-width: 1920px)
    #homepage
      width: 1600px;

      .list_btn
        width: 175px;
        height: 45px;
        line-height: 45px;

      .md_blue_btn
        width: 117px;
        height: 36px;
        line-height: 36px;

      #leftnav
        height: 700px

        #team_detail
          confirm-btn-lg()

      .home_wrap
        .list_table
          height: 700px

</style>
<style lang="stylus" rel="stylesheet/stylus">
  #homepage {
    .md_blue_btn {
      background: url('~@/assets/img/button/list_btn.png') no-repeat;
      border: none;
      background-size: 100% 100%;
      text-align: center;
      color: white;
      cursor: pointer;
      margin-left: 20px;
      margin-left: 20px;
    }

    .teamer_handle {
      position: absolute;
      bottom: 15px;
      right: 20px;
    }

    .disabled_row {
      cursor: not-allowed !important;
    }

    .disabled_row .cell {
      color: gray !important;
    }

    .activerow {
      background: #0080ff !important;
    }

    .activerow td .cell {
      color: white !important;
    }

    .task_group {
      text-align: left;
      padding: 0 50px;

    }

    .el-dialog__body {
      padding-bottom: 0;
    }

    #leftnav {
      .team_info {
        color: white;
        text-align: center;

        #team_logo {
          display: inline-block;
          border: 1px solid #0082ff;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
        }
        #team_logo:hover{
          border: 2px solid #0082ff;
        }
      }

      .notice {
        width: 100%;
        border: 1px solid #034987;
        border-radius: 6px;
        background: #102947;
        position: relative;

        .notice_title {
          color: #0281ff;
          font-weight: bold;
          font-size: 16px;
          background: url(/static/adw/web/img/team/notice.jpg) no-repeat center bottom;
          background-size: 100% auto;
          text-align: center;
        }

        .notice_content {
          color: #fff;
          line-height: 28px;
          position: relative;

          .notcie_box {
            display: inline-block;
            overflow: hidden;
          }

          #write_notice {
            width: 100%;
            position: absolute;
            left: -2px;
            top: 13px;

            textarea {
              outline none;
              width: 100%;
              background: #0d1927;
              border: none;
              border-radius: 5px;
              resize: none;
              color: white;
            }
          }

          .edit_notice {
            padding: 4px 8px;
            border: 1px solid #007fff;
            border-radius: 4px;
            color: #007fff;
            text-align: center;
            cursor: pointer;
            position: absolute;
          }
        }
      }
    }

    .handle_btn {
      set_bg('button/list_btn.png');
      padding: 4px 12px;
      color: white;
      margin-right: 5px;
      vertical-align: middle;
      border: none;
      cursor: pointer;
    }

    .look_message {
      color: lightblue;
      cursor: pointer;
      text-decoration: underline;
    }

    .el-form-item--medium .el-form-item__label {
      color: #45779a;
    }
  }

  #write_passto {
    position: absolute;
    left: 0;
    top: -150px;
    width: 100%;
    height: 0;
    opacity: 0;
  }

  .modal_table .el-table {
    padding: 0 12px !important;
  }

  .modal_table .el-table--border td {
    border-right: none !important;
    border-left: none !important;
  }

  .modal_table .el-table th {
    padding: 2px 0 !important;
    background: rgba(0, 0, 0, 0) !important;
    color: white !important;
    text-align: center !important;
  }

  .modal_table .el-table tr:not(.disabled_row):hover {
    cursor: pointer;
    background-image: none !important;

    td {
      background-color: #0080ff !important;
      color: white !important;
    }
  }

  .modal_table .el-table .disabled_row:hover {
    background-image: none !important;
  }

  .modal_table .el-table td {
    padding: 6px 0 !important;
    color: white !important;
    text-align: center !important;
  }

  .disabled_hover .el-table tr:hover {
    background-image: none !important;
    cursor: default !important;

    td {
      background-color: none !important;
    }
  }

  .team_logo {
    width: 30px;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, .3);
    display: inline-block;
    border-radius 50%;
    vertical-align middle;
  }

  @media (max-width: 1300px) {
    #homepage {
      #team_logo {
        width: 135px;
        height: 100px;
        margin-bottom: 8px;
      }

      .notice {
        height: 260px;
        padding: 5px 12px 0;

        .notice_title {
          padding: 6px 0;
        }

        .notice_content {
          height: 220px;
          padding: 8px 0;
          padding-bottom: 50px;
          font-size: 14px;

          .notcie_box {
            height: 172px;
            line-height: 24px;
          }

          #write_notice {
            textarea {
              height: 170px;
              padding: 6px;
              font-size: 14px;
            }
          }

          .edit_notice {
            padding: 0 6px;
            right: 0;
            bottom: 10px;
          }
        }
      }
    }
  }

  @media (min-width: 1300px) and (max-width: 1600px) {
    #homepage {
      #team_logo {
        width: 135px;
        height: 100px;
        margin-bottom: 8px;
      }

      .notice {
        height: 260px;
        padding: 5px 12px 0;

        .notice_title {
          padding: 6px 0;
        }

        .notice_content {
          height: 220px;
          padding: 8px 0;
          padding-bottom: 50px;
          font-size: 14px;

          .notcie_box {
            height: 172px;
            line-height: 24px;
          }

          #write_notice {
            textarea {
              height: 170px;
              padding: 6px;
              font-size: 14px;
            }
          }

          .edit_notice {
            padding: 0 6px;
            right: 0;
            bottom: 10px;
          }
        }
      }
    }
  }

  @media (min-width: 1600px) and (max-width: 1920px) {
    #homepage {
      #team_logo {
        width: 170px;
        height: 130px;
        margin-bottom: 15px;
      }

      .notice {
        height: 325px;
        padding: 15px 15px 0;

        .notice_title {
          padding: 12px 0;
        }

        .notice_content {
          height: 260px;
          padding: 15px 0;
          padding-bottom: 55px;
          font-size: 16px;

          .notcie_box {
            height: 190px;
          }

          #write_notice {
            textarea {
              height: 190px;
              padding: 8px;
              font-size: 16px;
            }
          }

          .edit_notice {
            padding: 4px 8px;
            right: 5px;
            bottom: 10px;
          }
        }
      }
    }
  }

  @media (min-width: 1920px) {
    #homepage {
      #team_logo {
        width: 170px;
        height: 130px;
        margin-bottom: 20px;
        cursor :pointer;
      }


      .notice {
        height: 325px;
        padding: 15px 15px 0;

        .notice_title {
          padding: 12px 0;
        }

        .notice_content {
          height: 260px;
          padding: 15px 0;
          padding-bottom: 55px;
          font-size: 16px;

          .notcie_box {
            height: 190px;
          }

          #write_notice {
            textarea {
              height: 190px;
              padding: 8px;
              font-size: 16px;
            }
          }

          .edit_notice {
            padding: 4px 8px;
            right: 5px;
            bottom: 10px;
          }
        }
      }
    }
  }
</style>
<style>
  .imcode .img_validate .el-input {
    width: 220px !important;
  }

  .imcode .img_validate img {
    height: 30px;
    margin-left: 16px !important;
  }

  .imcode .img_validate label {
    color: #45779a !important;
    height: 30px;
    line-height: 30px;
    margin-left: -3px !important;
  }

  .imcode .el-input__inner {
    height: 36px;
    line-height: 36px;
  }

  .imcode .imphone {
    margin-left: 10px;
  }
</style>
