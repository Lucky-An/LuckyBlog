<template>
  <div class="match_box">
    <!-- 没有题目时显示图片 -->
    <div v-if="subAry.length == 0" class="no_sub">
      <img src="@/assets/jad/context_gif.gif" alt>
    </div>

    <!--答题tab begin-->
    <div v-if="subAry.length > 0" class="listcon">
      <!-- 调用倒计时 -->
      <PlayerInfo />
      <ul class="nav_tabs">
        <li
          v-for="(tab, index) in subAry"
          :key="index"
          :class="[index == active ? 'active' : '', 'tab_item fcenter']"
          @click="handleTab(index)"
        >
          <span class="sun_type font_ellipsis fs26 specialFont">{{
            tab.name
          }}</span>
          <span class="hint-ss fs14">{{ tab.trues }}/{{ tab.length }}</span>
        </li>
        <!--申请按钮盒子 begin-->
        <div class="btn_box">
          <span @click="applyChallenge">{{ $t("ad5.want_challenge") }}</span>
          <span @click="cancelChallenged">{{
            $t("ad5.cancel_challenge")
          }}</span>
          <span @click="showChallengeList">{{
            $t("ad5.look_challenge_list")
          }}</span>
        </div>
      </ul>

      <!--答题tab end-->
      <div v-if="subAry.length > 0">
        <!-- 判断题目列表长度是否引用列表组件 -->
        <card
          :task_ul="subAry[active].msg"
          :match-info="matchInfo"
          hide_some="true"
          @successAnswer="getSubList(true)"
        />
      </div>
    </div>

    <el-dialog
      class="my-dialog challenge_diglog"
      :title="challengeTitle"
      :visible.sync="applyChallengedlg"
    >
      <div
        v-if="challengeTitle == $t('ad5.to_apply')"
        style="margin-bottom: 40px"
      >
        <div v-if="$i18n.locale == 'zh'">
          <span style="color: #00eaff; font-weight: bold">挑战次数：</span>申请成功并登台展示完成为1次挑战结束。 本队可用申请挑战次数还有
          <i style="color: #00eaff; font-weight: bold">{{ remaining_time }}</i>
          次.
        </div>
        <div v-else>
          <span
            style="color: #00eaff; font-weight: bold"
          >Challenge times：</span>Application Success and Exhibition Completion as a Challenge End. The
          team has
          <i style="color: #00eaff; font-weight: bold">{{ remaining_time }}</i>
          more challenges to apply for.
        </div>
      </div>
      <div v-if="challengeTitle == $t('ad5.change_apply')" class="rule">
        <div v-if="$i18n.locale == 'zh'">
          <p style="color: #00eaff; font-weight: bold">重要提示：</p>
          <p>1. 变更申请仅允许在战队未登台展示之前进行操作。</p>
          <p>
            2.
            未登台展示前如选择变更申请操作，系统将删除您在【申请挑战】中已选择的挑战题目和已获得的挑战序号的记录。
          </p>
          <p>
            3.
            变更申请提交表示您已经同意重新排队并会获取到排位较后的挑战名次序号
            ，请慎重考虑。
          </p>
        </div>
        <div v-else>
          <p style="color: #00eaff; font-weight: bold">Important hints：</p>
          <p>
            1. Change requests are only allowed before the team is on stage.
          </p>
          <p>
            2. If you choose to change the application operation before you go
            on stage, the system will delete the record of the challenge title
            you have selected and the challenge number you have obtained in the
            Application Challenge.
          </p>
          <p>
            3. Change application submission indicates that you have agreed to
            re-queue and will get the next challenge number. Please consider
            carefully.
          </p>
        </div>
      </div>
      <el-table
        ref="singleTable"
        border
        max-height="500px"
        :data="challengeSubAry"
        highlight-current-row
        :class="
          challengeTitle == $t('ad5.to_apply') ? 'click_sty1' : 'click_sty2'
        "
        :row-class-name="tableRowClassName"
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          type="index"
          :label="$t('ad5.challenge_task_handle')"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            <span class="chose_bg" />
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          :label="$t('ad5.challenge_task_index')"
          width="100"
          align="center"
        />
        <el-table-column
          property="title"
          :label="$t('ad5.challenge_task_name')"
          align="center"
        />
        <el-table-column
          :label="$t('ad5.challenge_task_status')"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.has_solved ? $t("ad5.is_solved") : $t("ad5.is_not_solved")
          }}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="choseSub[0].id == chooseAry.id || !chooseAry.id"
          @click="submitApply"
        >{{ $t("question.submit") }}</el-button>
        <el-button type="primary" @click="applyChallengedlg = false">{{
          $t("el.datepicker.cancel")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="my-dialog cancel_diglog"
      :title="$t('ad5.cancel_challenge')"
      :visible.sync="cancelChallenge"
    >
      <el-table
        ref="cancelTable"
        border
        max-height="500px"
        :data="cancelSubAry"
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :label="$t('ad5.challenge_task_handle')"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            <span class="chose_bg" />
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          :label="$t('ad5.challenge_task_index')"
          width="100"
          align="center"
        />
        <el-table-column
          property="title"
          :label="$t('ad5.challenge_task_name')"
          align="center"
        />
        <el-table-column
          :label="$t('ad5.challenge_task_status')"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.has_solved ? $t("ad5.is_solved") : $t("ad5.is_not_solved")
          }}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCancel">{{
          $t("ad5.cancel_to_challenge")
        }}</el-button>
        <!--          <el-button @click="cancelChallenge = false">取 消</el-button>-->
      </span>
    </el-dialog>
    <!--取消申请挑战表格弹窗 end-->

    <!--挑战排队列表弹窗 begin-->
    <el-dialog
      class="my-dialog challengt_list"
      :title="$t('ad5.challenged_table')"
      :visible.sync="ChallengListdlg"
    >
      <el-table
        ref="challengList"
        border
        :data="ChallengList"
        max-height="490"
        :row-class-name="queueInfo"
        style="width: 100%"
      >
        <el-table-column
          :label="$t('ad5.challenge_task_index')"
          type="index"
          align="center"
          width="60"
        />
        <el-table-column
          property="team_name"
          align="center"
          :label="$t('ad5.challenged_team_name')"
        >
          <template slot-scope="scope">
            <div style="text-align: left">
              <span>
                <img
                  style="width: 30px; height: 30px; border-radius: 50px"
                  :src="scope.row.team_logo"
                  alt
                >
              </span>
              <span style="display: inline-block; line-height: 30px">{{
                scope.row.team_name
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          property="event_task_name"
          :label="$t('ad5.challenged_task')"
          align="center"
        />
        <el-table-column
          property="staus"
          align="center"
          :label="$t('ad5.challenged_status')"
        >
          <template slot-scope="scope">
            <span v-if="scope.$index == 0">{{ $t("ad5.is_challenged") }}</span>
            <span v-else-if="scope.$index == 1">{{
              $t("ad5.coming_challenged")
            }}</span>
            <span v-else>{{ $t("ad5.wait_for_challenged") }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ChallengListdlg = false">{{
          $t("ad5.closed")
        }}</el-button>
      </span>
    </el-dialog>
    <!--挑战排队列表弹窗 end-->
    <!-- <ClickHere /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClickHere from '@/components/ClickHere'
import card from './card'
import {
  rwMatchInfo,
  getChallenges,
  getReplaChallenges,
  getApplyTask_api,
  cancelApply_api,
  changeApply_api,
  lookApply_api,
  submitApply_api
} from '@/api/rw'
import PlayerInfo from '@/components/PlayerInfo'
export default {
  name: 'QuestionBoard',
  components: {
    ClickHere,
    card,
    PlayerInfo
  },
  data() {
    return {
      challengeTitle: '',
      sureText: '',
      files: '',
      cancelSubAry: [],
      challengeSubAry: [], // 申请挑战题目列表
      choseSub: [1], // 上次选择的题目
      chooseAry: [], // 这次选择的题目
      ChallengList: [], // 挑战派对列表弹窗
      cancelChallenge: false,
      replyApply: false, // 点击的是否是重新挑战按钮
      applyChallengedlg: false, // 申请挑战弹窗
      ChallengListdlg: false, // 挑战派对列表弹窗
      isCN: this.$i18n.locale == 'zh',
      matchInfo: '',
      active: 0, // 被点击的tab
      subAry: [], // 数据
      writeUpVisible: false, // 是否展示上传writeUp弹框
      cliData: { file: [] }, // 被单击的数据
      hasWriteup: false,
      writeFile: '', // 获取到的write文件
      token: null,
      hash: this.$route.query.hash, // 竞赛hash,
      listQuery: {
        offset: 1,
        limit: 10
      }
    }
  },
  watch: {
    tips_notice(val, old) {
      // 监听获取到的公共的题目公告。
      setTimeout(() => {
        this.getSubList(true)
      }, 1000)
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  created() {
    this.getMatchInfo()
  },
  methods: {
    // 获取赛事详情
    getMatchInfo() {
      // 因为存储vuex是异步的,不知道什么时候请求完成，所以现在这个页面请求一次。
      rwMatchInfo(this.hash).then((res) => {
        const { data } = res
        this.matchInfo = data
        this.getSubList()
      })
    },
    // 切换tab
    handleTab(index) {
      this.active = index
    },
    // 获取题目列表
    getSubList(answer) {
      let get_request = getChallenges // 非复盘列表
      if (this.matchInfo.is_replay) {
        get_request = getReplaChallenges
      } // 复盘列表
      get_request({
        evt: this.matchInfo.hash
      }).then((res) => {
        if (answer) {
          this.subAry = []
        }
        const { data } = res
        for (const key in data.rows[0]) {
          this.subAry.push({ name: key, msg: data.rows[0][key] })
        }
        this.subAry.map((sub) => {
          sub.length = sub.msg.length
          sub.trues = sub.msg.filter((s) => {
            return s.has_solved ? s : void 0
          }).length
          return sub
        })
      })
    },
    hasWriteupChange() {
      this.hasWriteup = true
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.has_solved) {
        return 'has_solved'
      }
      // 给被选中行添加class的方法。
      if (row.is_selected && !row.has_solved) {
        return 'choosed_row'
      }
    },
    handleCurrentChange(val) {
      this.chooseAry = val || []
    },
    queueInfo({ row, rowIndex }) {
      // 使查看排队信息的第一条和自己那条高亮
      if (rowIndex == 0) {
        return 'choosed_row'
      }
      if (row.is_current_team) {
        return 'choosed_row'
      }
    },
    applyChallenge(text, reply) {
      // 申请挑战
      getApplyTask_api(this.$route.query.hash).then((res) => {
        this.challengeSubAry = res.data.task
        this.remaining_time = res.data.remaining_time
        this.applyChallengedlg = true

        // 设置已经申请挑战默认打开弹窗显示已经被点击的行数。
        let row = []
        row = this.challengeSubAry.filter((item) => {
          if (item.is_selected) return item
        })
        if (row.length == 0) {
          this.challengeTitle = this.$t('ad5.to_apply')
          this.sureText = this.$t('ad5.confirm_to_apply')
          row = [this.challengeSubAry[0]]
        } else {
          this.choseSub = row
          this.challengeTitle = this.$t('ad5.change_apply')
          this.sureText = this.$t('ad5.confirm_replay_to_apply')
        }
        // setTimeout(() => {
        //   this.$refs.singleTable.setCurrentRow(row[0])
        // }, 10)
      })
    },
    submitApply() {
      // 提交挑战申请
      this.$confirm(this.sureText, this.$t('dialog_list.tips'), {
        confirmButtonText: this.$t('modal.confirm'),
        cancelButtonText: this.$t('modal.cancel'),
        customClass:
          'el-dialog el-dialog--center public-dialog public_confirm_450',
        type: 'warning'
      })
        .then(() => {
          const data = {
            event_task_id: this.chooseAry.id
          }

          submitApply_api(this.hash, data).then((res) => {
            if (res.data.success) {
              this.$notify({
                title: this.$t('dialog_list.tips'),
                message: this.$t('api_message.operation_success')
              })
              this.applyChallengedlg = false
            }
          })
        })
        .catch(() => {
          this.$notify.info({
            title: this.$t('dialog_list.tips'),
            message: this.$t('ad5.is_cancel_handle')
          })
        })
    },
    cancelChallenged() {
      let message_str = ''
      cancelApply_api(this.hash).then((res) => {
        console.log('res: ', res)
        if (!res.data.message) {
          if (res.data.length) {
            this.cancelSubAry = res.data
            this.cancelChallenge = true
          } else {
            message_str = this.$t('ad5.no_applyedChallenge')
            this.$confirm(message_str, this.$t('dialog_list.tips'), {
              confirmButtonText: this.$t('modal.confirm'),
              type: 'warning',
              customClass:
                'el-dialog el-dialog--center public-dialog public_confirm_450',
              showCancelButton: false
            }).then(() => {})
          }
        }
      })
    },
    submitCancel() {
      this.$confirm(
        this.$t('ad5.confirm_cancel_challenge_apply'),
        this.$t('dialog_list.tips'),
        {
          confirmButtonText: this.$t('modal.confirm'),
          cancelButtonText: this.$t('modal.cancel'),
          customClass:
            'el-dialog el-dialog--center public-dialog public_confirm_450',
          type: 'warning'
        }
      )
        .then(() => {
          const data = {
            event_task_id: this.cancelSubAry[0].id
          }
          changeApply_api(this.hash, data).then((res) => {
            if (res.data.success) {
              this.$notify.info({
                title: this.$t('dialog_list.tips'),
                message: this.$t('ad5.cancel_success')
              })
              this.cancelChallenge = false
            } else {
              this.$notify.info({
                title: this.$t('dialog_list.tips'),
                message: this.$t('api_message.' + res.data.message)
              })
            }
          })
        })
        .catch(() => {
          this.$notify.info({
            title: this.$t('dialog_list.tips'),
            message: this.$t('ad5.is_cancel_handle')
          })
        })
    },
    showChallengeList() {
      // 挑战排队查询
      lookApply_api(this.hash).then((res) => {
        this.ChallengList = res.data
        this.ChallengListdlg = true
        this.getChoosed()
      })
    },
    getChoosed() {
      // 获取自己队伍使其高亮
      // 设置自己的队伍高亮。
      const row = this.ChallengList.filter((item) => {
        if (item.is_current_team) return item
      })
      setTimeout(() => {
        this.$refs.challengList.setCurrentRow(row[0])
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.match_box {
  width: 80%;
  min-width: 1366px;
  margin: 0 auto;
}
.success_icon {
  font-size: 40px;
  margin-right: 20px;
  color: successcolor;
  vertical-align: middle;
}
.nav_tabs {
  position: relative;
  padding: 0;
  li {
    list-style: none;
    color: #fff;
    display: flex;
    justify-content: center;
  }
  align-items: center;
  height: 48px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0;
  .tab_item {
    position: relative;
    color: #fff;
    max-width: 16.66%;
    flex: 1;
    margin-right: 10px;
    cursor: pointer;
    margin-bottom: -2px;

    .sun_type {
      width: 130px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      text-align: center;
    }
    .hint-ss {
      padding: 1px 6px;
      position: absolute;
      border-radius: 12px;
      background: #f95d5e;
      right: 12px;
      top: 5px;
      color: #fff;
    }
  }
  .active {
    color: #fff;
    background: none;
    border-radius: 0;
    border-bottom: 4px solid #0080ff;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
}
.no_sub {
  text-align: center;
  margin-top: 5%;
}
.listcon {
  margin-top: 20px;
}
#submitWriteup-text {
  margin-top: -20px;
  margin-bottom: 20px;
  color: #fff;
}
.btn {
  cursor: pointer;
  padding: 7px 15px;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  font-style: normal;
  color: #fff;
  background-blend-mode: normal, normal;
  background: #0080ff;
  border-radius: 5px;
  border: none;
  margin: 0 10px;
}

.btn_box {
  position: absolute;
  right: 0px;
  top: 0px;
  span {
    cursor: pointer;
    margin-right: 18px;
    display: inline-block;
    color: #fff;
    font-weight: bold;
    background: url("~@/assets/rw/btn_bg.png");
    background-size: 100% 100%;
    font-size: 16px;
    padding: 10px 16px 8px;

    &:last-child {
      margin-right: 0;
    }

    &:before {
      width: 24px;
      height: 24px;
      content: "";
      display: inline-block;
      clear: both;
      vertical-align: -6px;
      margin-right: 4px;
    }

    &:nth-child(1):before {
      background: url("~@/assets/rw/challenge.png") no-repeat;
      background-size: 100% 100%;
    }

    &:nth-child(2):before {
      background: url("~@/assets/rw/close.png") no-repeat;
      background-size: 100% 100%;
    }

    &:nth-child(3):before {
      background: url("~@/assets/rw/look.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
.el-table .chose_bg {
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url("~@/assets/rw/no_chose.png") no-repeat;
}

.el-table .current-row .chose_bg {
  display: inline-block;
  position: absolute;
  top: 8px;
  left: 17px;
  width: 22px;
  height: 22px;
  background: url("~@/assets/rw/chosed.png") no-repeat;
}

.el-table .choosed_row,
.el-table .choosed_row:hover {
  background: #0190ff;
}

.el-table .choosed_row .chose_bg {
  display: inline-block;
  position: absolute;
  top: 8px;
  left: 17px;
  width: 22px;
  height: 22px;
  background: url("~@/assets/rw/last.png") no-repeat;
}

.el-table th,
.el-table tr {
  background: #00174a;
  color: #fff;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #003c81;
}

.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid #003c81;
}

.el-table--border,
.el-table--group {
  border: 2px solid #0190ff;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: none;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #3d6981;
}
.el-table__body tr.hover-row > td {
  background-color: #003c81;
}

// 弹窗 end
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row > td {
  background-color: #00174a;
}

.click_sty1
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped.current-row
  td,
.click_sty1 .el-table__body tr.current-row > td,
.click_sty1 .el-table__body tr.hover-row.current-row > td,
.click_sty1
  .el-table__body
  tr.hover-row.el-table__row--striped.current-row
  > td,
.click_sty1 .el-table__body tr.hover-row.el-table__row--striped > td,
.click_sty1 .el-table__body tr.hover-row > td {
  background-color: #003c81;
}

.click_sty2
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped.current-row
  td,
.click_sty2 .el-table__body tr.current-row > td,
.click_sty2 .el-table__body tr.hover-row.current-row > td,
.click_sty2
  .el-table__body
  tr.hover-row.el-table__row--striped.current-row
  > td,
.click_sty2 .el-table__body tr.hover-row.el-table__row--striped > td,
.click_sty2 .el-table__body tr.hover-row > td {
  background-color: #003c81;
}
.el-table .current-row {
  background-color: #003c81;
}
.el-table__body tr.current-row > td {
  background-color: none;
}
.el-table__body {
  .current-row {
    td {
      background-color: #003c81;
    }
  }
}
</style>
<style lang="scss">
.challenge_diglog .el-table .has_solved {
  cursor: not-allowed;
  color: #00fcff;
  .chose_bg {
    background: url("~@/assets/rw/no_chose.png") no-repeat;
    position: unset;
    width: 15px;
    height: 15px;
  }
}
</style>
