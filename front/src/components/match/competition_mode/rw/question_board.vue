<template>
  <div class="match_box">
    <div class="no_sub" v-if="subAry.length==0">
      <img src="@/assets/img/context_gif.gif" alt />
    </div>

    <upload-writeup
      v-else
      :matchInfo="matchInfo"
      competition="rw"
      :hasWriteup="hasWriteup"
      @hasWriteupChange="hasWriteupChange"
    >
      <!--答题tab begin-->
      <ul class="nav_tabs">
        <li
          v-for="(tab,index) in subAry"
          :class="[index==active?'active':'','tab_item fcenter'] "
          @click="handleTab(index)"
        >
          <span class="sun_type font_ellipsis fs26 specialFont">{{tab.name}}</span>

          <span class="hint-ss fs14">{{tab.trues}}/{{tab.length}}</span>
        </li>
      </ul>
      <!--答题tab end-->
      <task_card
        :task_ul="subAry[active].val"
        :matchInfo="matchInfo"
        :api="api"
        hide_some="true"
        @successAnswer="getSubList(true)"
      ></task_card>
      <!--申请按钮盒子 begin-->
      <div class="btn_box">
        <span @click="applyChallenge">{{$t('ad5.want_challenge')}}</span>
        <span @click="cancelChallenged">{{$t('ad5.cancel_challenge')}}</span>
        <span @click="showChallengeList">{{$t('ad5.look_challenge_list')}}</span>
      </div>
      <!--申请按钮盒子 end-->
      <!--申请挑战表格弹窗 begin-->
      <el-dialog
        class="my-dialog challenge_diglog"
        :title="challengeTitle"
        :visible.sync="applyChallengedlg"
      >
        <div v-if="challengeTitle==$t('ad5.to_apply')" style="margin-bottom: 40px;">
          <div v-if="$i18n.locale=='CN'">
            <span style="color: #00eaff;font-weight: bold;">挑战次数：</span>申请成功并登台展示完成为1次挑战结束。
            本队可用申请挑战次数还有
            <i
              style="color: #00eaff;font-weight: bold;"
            >{{remaining_time}}</i> 次.
          </div>
          <div v-else>
            <span style="color: #00eaff;font-weight: bold;">Challenge times：</span>Application Success and Exhibition Completion as a Challenge End.
            The team has
            <i
              style="color: #00eaff;font-weight: bold;"
            >{{remaining_time}}</i> more challenges to apply for.
          </div>
        </div>
        <div class="rule" v-if="challengeTitle==$t('ad5.change_apply')">
          <div v-if="$i18n.locale=='CN'">
            <p style="color: #00eaff;font-weight: bold;">重要提示：</p>
            <p>1. 变更申请仅允许在战队未登台展示之前进行操作。</p>
            <p>2. 未登台展示前如选择变更申请操作，系统将删除您在【申请挑战】中已选择的挑战题目和已获得的挑战序号的记录。</p>
            <p>3. 变更申请提交表示您已经同意重新排队并会获取到排位较后的挑战名次序号 ，请慎重考虑。</p>
          </div>
          <div v-else>
            <p style="color: #00eaff;font-weight: bold;">Important hints：</p>
            <p>1. Change requests are only allowed before the team is on stage.</p>
            <p>2. If you choose to change the application operation before you go on stage, the system will delete the record of the challenge title you have selected and the challenge number you have obtained in the Application Challenge.</p>
            <p>3. Change application submission indicates that you have agreed to re-queue and will get the next challenge number. Please consider carefully.</p>
          </div>
        </div>
        <el-table
          border
          ref="singleTable"
          :data="challengeSubAry"
          highlight-current-row
          :class="challengeTitle==$t('ad5.to_apply')?'click_sty1':'click_sty2'"
          @current-change="handleCurrentChange"
          :row-class-name="tableRowClassName"
          style="width: 100%"
        >
          <!--<el-table-column-->
          <!--type="index"-->
          <!--width="50">-->
          <!--</el-table-column>-->

          <el-table-column
            type="index"
            :label="$t('ad5.challenge_task_handle')"
            width="50"
            align="center"
          >
            <template slot-scope="scope">
              <span class="chose_bg"></span>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            :label="$t('ad5.challenge_task_index')"
            width="100"
            align="center"
          />
          <el-table-column property="title" :label="$t('ad5.challenge_task_name')" align="center"></el-table-column>
          <el-table-column :label="$t('ad5.challenge_task_status')" align="center">
            <template
              slot-scope="scope"
            >{{scope.row.has_solved?$t('ad5.is_solved'):$t('ad5.is_not_solved')}}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :disabled="choseSub[0].id==chooseAry.id||!chooseAry.id"
            @click="submitApply"
          >{{$t('question.submit')}}</el-button>
          <el-button
            type="primary"
            @click="applyChallengedlg = false"
          >{{$t('el.datepicker.cancel')}}</el-button>
        </span>
      </el-dialog>
      <!--申请挑战表格弹窗 end-->
      <!--取消申请挑战表格弹窗 begin-->
      <el-dialog
        class="my-dialog cancel_diglog"
        :title="$t('ad5.cancel_challenge')"
        :visible.sync="cancelChallenge"
      >
        <el-table
          border
          ref="cancelTable"
          max-height="500px"
          :data="cancelSubAry"
          :row-class-name="tableRowClassName"
          style="width: 100%"
        >
          <!--<el-table-column-->
          <!--type="index"-->
          <!--width="50">-->
          <!--</el-table-column>-->

          <el-table-column
            type="index"
            :label="$t('ad5.challenge_task_handle')"
            width="50"
            align="center"
          >
            <template slot-scope="scope">
              <span class="chose_bg"></span>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            :label="$t('ad5.challenge_task_index')"
            width="100"
            align="center"
          />
          <el-table-column property="title" :label="$t('ad5.challenge_task_name')" align="center"></el-table-column>
          <el-table-column :label="$t('ad5.challenge_task_status')" align="center">
            <template
              slot-scope="scope"
            >{{scope.row.has_solved?$t('ad5.is_solved'):$t('ad5.is_not_solved')}}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitCancel">{{$t('ad5.cancel_to_challenge')}}</el-button>
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
          border
          ref="challengList"
          :data="ChallengList"
          max-height="490"
          :row-class-name="queueInfo"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('ad5.challenge_task_index')"
            type="index"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            property="team_name"
            align="center"
            :label="$t('ad5.challenged_team_name')"
          >
            <template slot-scope="scope">
              <div style="text-align: left">
                <span>
                  <img
                    style="width: 30px;height: 30px;border-radius: 50px"
                    :src="scope.row.team_logo"
                    alt
                  />
                </span>
                <span style="display:inline-block;line-height: 30px">{{scope.row.team_name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            property="event_task_name"
            :label="$t('ad5.challenged_task')"
            align="center"
          ></el-table-column>
          <el-table-column property="staus" align="center" :label="$t('ad5.challenged_status')">
            <template slot-scope="scope">
              <span v-if="scope.$index==0">{{$t('ad5.is_challenged')}}</span>
              <span v-else-if="scope.$index==1">{{$t('ad5.coming_challenged')}}</span>
              <span v-else>{{$t('ad5.wait_for_challenged')}}</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ChallengListdlg = false">{{$t('ad5.closed')}}</el-button>
        </span>
      </el-dialog>
      <!--挑战排队列表弹窗 end-->
    </upload-writeup>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import task_card from "../../common/jieti_question_board";
import {
  getMatchInfos,
  writeups,
  submitFlags,
  submitReplayFlags,
  get_challenges,
  get_replay_challenges,
  downLoad_file,
  sence_url,
  addLogs,
  submitApply_api,
  lookApply_api,
  cancelApply_api,
  getApplyTask_api,
  changeApply_api
} from "@/api/competitionMode/rwMode";
import UploadWriteup from "@/components/match/common/small_part/uploadWriteup";

const { mapState } = createNamespacedHelpers("match");

export default {
  name: "question_board",
  components: {
    task_card,
    UploadWriteup
  },
  data() {
    return {
      cancelSubAry: [],
      cancelChallenge: false,
      remaining_time: 0,
      challengeSubAry: [], //申请挑战题目列表
      challengeTitle: "",
      sureText: "",
      choseSub: [1], //上次选择的题目
      chooseAry: [], //这次选择的题目
      replyApply: false, //点击的是否是重新挑战按钮
      applyChallengedlg: false, //申请挑战弹窗
      ChallengListdlg: false, //挑战派对列表弹窗
      ChallengList: [], //挑战派对列表弹窗
      event_task_id: 0, //申请挑战选中的题目的id,挑战数据结束
      hash: this.$route.query.hash, //竞赛id
      isCN: this.$i18n.locale=='CN',
      matchInfo: "",
      active: 0, //被点击的tab
      subAry: [], //数据
      writeUpVisible: false, //是否展示上传writeUp弹框
      cliData: { file: [] }, //被单击的数据
      hasWriteup: false,
      writeFile: "", //获取到的write文件
      token: null,
      event_id: this.$route.query.hash, //竞赛id,
      api: {
        getMatchInfos,
        writeups,
        submitFlags,
        submitReplayFlags,
        get_challenges,
        get_replay_challenges,
        downLoad_file,
        sence_url,
        addLogs
      }
    };
  },
  created() {
    this.getMatchInfo();
  },
  watch: {
    tips_notice(val, old) {
      //监听获取到的公共的题目公告。
      setTimeout(() => {
        this.getSubList(true);
      }, 1000);
    }
  },
  computed: {
    ...mapState(["match_data", "tips_notice"])
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      //给被选中行添加class的方法。
      if (row.is_selected) {
        return "choosed_row";
      }
      if (row.has_solved) {
        return "has_solved";
      }
    },
    queueInfo({ row, rowIndex }) {
      //使查看排队信息的第一条和自己那条高亮
      if (rowIndex == 0) {
        return "choosed_row";
      }
      if (row.is_current_team) {
        return "choosed_row";
      }
    },
    submitApply() {
      //提交挑战申请
      this.$confirm(this.sureText, this.$t("dialog_list.tips"), {
        confirmButtonText: this.$t("modal.confirm"),
        cancelButtonText: this.$t("modal.cancel"),
        customClass:
          "el-dialog el-dialog--center public-dialog public_confirm_450",
        type: "warning"
      })
        .then(() => {
          let data = {
            event_task_id: this.chooseAry.id
          };
          submitApply_api(this.hash, data).then(res => {
            if (res.data.success) {
              this.$notify({
                title: this.$t("dialog_list.tips"),
                message: this.$t("api_message.operation_success")
              });
              this.applyChallengedlg = false;
            }
          });
        })
        .catch(() => {
          this.$notify.info({
            title: this.$t("dialog_list.tips"),
            message: this.$t("ad5.is_cancel_handle")
          });
        });
    },
    submitCancel() {
      this.$confirm(
        this.$t("ad5.confirm_cancel_challenge_apply"),
        this.$t("dialog_list.tips"),
        {
          confirmButtonText: this.$t("modal.confirm"),
          cancelButtonText: this.$t("modal.cancel"),
          customClass:
            "el-dialog el-dialog--center public-dialog public_confirm_450",
          type: "warning"
        }
      )
        .then(() => {
          let data = {
            event_task_id: this.cancelSubAry[0].id
          };
          changeApply_api(this.hash, data).then(res => {
            if (res.data.success) {
              this.$notify.info({
                title: this.$t("dialog_list.tips"),
                message: this.$t("ad5.cancel_success")
              });
              this.cancelChallenge = false;
            } else {
              this.$notify.info({
                title: this.$t("dialog_list.tips"),
                message: this.$t("api_message." + res.data.message)
              });
            }
          });
        })
        .catch(() => {
          this.$notify.info({
            title: this.$t("dialog_list.tips"),
            message: this.$t("ad5.is_cancel_handle")
          });
        });
    },
    handleCurrentChange(val) {
      this.chooseAry = val || [];
    },
    showChallengeList() {
      //挑战排队查询
      lookApply_api(this.hash).then(res => {
        this.ChallengList = res.data;
        this.ChallengListdlg = true;
        this.getChoosed();
      });
    },
    getChoosed() {
      //获取自己队伍使其高亮
      //设置自己的队伍高亮。
      let row = this.ChallengList.filter(item => {
        if (item.is_current_team) return item;
      });
      setTimeout(() => {
        this.$refs.challengList.setCurrentRow(row[0]);
      }, 10);
    },
    cancelChallenged() {
      let message_str = "";
      cancelApply_api(this.hash).then(res => {
        if (!res.data.message) {
          if (res.data.length) {
            this.cancelSubAry = res.data;
            this.cancelChallenge = true;
          } else {
            message_str = this.$t("ad5.no_applyedChallenge");
            this.$confirm(message_str, this.$t("dialog_list.tips"), {
              confirmButtonText: this.$t("modal.confirm"),
              type: "warning",
              customClass:
                "el-dialog el-dialog--center public-dialog public_confirm_450",
              showCancelButton: false
            }).then(() => {});
          }
        }
      });
    },
    applyChallenge(text, reply) {
      //申请挑战
      getApplyTask_api(this.hash).then(res => {
        this.challengeSubAry = res.data.task;
        this.remaining_time = res.data.remaining_time;
        this.applyChallengedlg = true;

        //设置已经申请挑战默认打开弹窗显示已经被点击的行数。
        let row = [];
        row = this.challengeSubAry.filter(item => {
          if (item.is_selected) return item;
        });
        if (row.length == 0) {
          this.challengeTitle = this.$t("ad5.to_apply");
          this.sureText = this.$t("ad5.confirm_to_apply");
          row = [this.challengeSubAry[0]];
        } else {
          this.choseSub = row;
          this.challengeTitle = this.$t("ad5.change_apply");
          this.sureText = this.$t("ad5.confirm_replay_to_apply");
        }
        // setTimeout(() => {
        //   this.$refs.singleTable.setCurrentRow(row[0])
        // }, 10)
      });
    },
    getMatchInfo() {
      //因为存储vuex是异步的,不知道什么时候请求完成，所以现在这个页面请求一次。
      this.api
        .getMatchInfos(this.event_id)
        .then(res => {
          let { data } = res;
          this.matchInfo = data;
          this.matchInfo.file_type = this.matchInfo.file_type.split(',')
          this.getSubList();
          if (data.can_submit_writeup) this.getWriteup();
        })
        .catch(error => {});
    },
    getWriteup() {
      //获取writeup
      this.api
        .writeups({
          evt: this.$route.query.event
        })
        .then(res => {
          if (res.data.has_writeup == 0){
            this.hasWriteup = false;
          }else{
            this.hasWriteup = true;
          }
        })
        .catch(error => {});
    },
    //切换tab
    handleTab(index) {
      this.active = index;
    },


    getSubList(answer) {
      //获取题目列表
      let get_request = this.api.get_challenges;
      if (this.matchInfo.is_replay)
        get_request = this.api.get_replay_challenges;
      get_request({
        evt: this.matchInfo.hash
      })
        .then(res => {
          if (answer) {
            this.subAry = [];
          }
          let { data } = res;
          for (let key in data.rows[0]) {
            this.subAry.push({ name: key, val: data.rows[0][key] });
          }
          this.subAry.map(sub => {
            sub.length = sub.val.length;
            sub.trues = sub.val.filter(s => {
              return s.has_solved ? s : void 0;
            }).length;
            return sub;
          });
        })
        .catch(error => {});
    },
    hasWriteupChange() {
      this.hasWriteup = true;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/common/stylus/mixin.styl';

.match_box {
  min-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.success_icon {
  font-size: 40px;
  margin-right: 20px;
  color: successcolor;
  vertical-align: middle;
}

.subject_box {
  position: relative;

  .submitWriteup {
    color: fontColor-f;
    position: absolute;
    background: tableBg;
    border: 1px solid tableBorer;
    line-height: 24px;
    max-width: 440px;
    padding: 10px 20px;
    z-index: 1920;

    .btn {
      padding: 2px 10px;
    }
  }

  .token {
    transform: translate(0, -35px);
    width: 400px;
    margin: 0 auto -5px;
    background: url('~@/assets/img/token2.png') no-repeat center center;
    background-size: 100% 100%;
    color: fontColor-f;
    line-height: 45px;
    height: 60px;
    transition: 2s;
  }

  // tab begin
  .nav_tabs {
    align-items: center;
    height: 48px;
    border-top: 2px solid tableBorer;
    border-bottom: 2px solid tableBorer;
    display: flex;

    .active, .tab_item:hover {
    }

    .tab_item {
      position: relative;
      height: 60px;
      color: fontColor-f;
      max-width: 16.66%;
      flex: 1;
      margin-right: 10px;
      cursor: pointer;

      .sun_type {
        width: 130px;
        height: 40px;
        line-height: 40px;
      }

      .hint-ss {
        padding: 1px 6px;
        position: absolute;
        right: 0;
        top: 11px;
        border-radius: 12px !important;
        background: tabHintColot;
      }
    }
  }
}

.btn_box {
  position: absolute;
  right: 0;
  top: 0;

  span {
    cursor: pointer;
    margin-right: 18px;
    display: inline-block;
    color: #fff;
    font-weight: bold;
    background: url('~@/assets/img/btn_bg.png');
    background-size: 100% 100%;
    font-size: 16px;
    padding: 10px 16px 8px;

    &:last-child {
      margin-right: 0;
    }

    &:before {
      width: 24px;
      height: 24px;
      content: '';
      display: inline-block;
      clear: both;
      vertical-align: -6px;
      margin-right: 4px;
    }

    &:nth-child(1):before {
      background: url('~@/assets/img/ad5/challenge.png') no-repeat;
      background-size: 100% 100%;
    }

    &:nth-child(2):before {
      background: url('~@/assets/img/ad5/close.png') no-repeat;
      background-size: 100% 100%;
    }

    &:nth-child(3):before {
      background: url('~@/assets/img/ad5/look.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
@media (max-width: 1300px) {
  .match_box {
    width: 1200px;
  }

  .submitWriteup {
    top: -138px;
  }
}

@media (min-width: 1300px) and (max-width: 1650px) {
  .match_box {
    width: 1200px;
  }

  .submitWriteup {
    top: -118px;
  }
}

@media (min-width: 1650px) {
  .match_box {
    width: 1400px;
  }

  .submitWriteup {
    top: -144px;
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
.public_confirm_450 {
  width: 450px !important;
}

.challenge_diglog .rule p {
  margin-bottom: 10px;
}

.tip_notop .el-dialog__title {
  color: rgba(0, 0, 0, 0);
  opacity: 0;
}

.subject_box {
  .markdown-wrapper {
    line-height: 20px;

    p {
      margin-bottom: 10px;
      word-wrap: break-word;
    }

    a {
      color: acolor;
      text-decoration: underline;
    }
  }

  .downLoad_box {
    margin: 10px 0 15px 0;
  }

  .pause {
    margin-top: 10px;
  }

  .btn {
    margin: 0 10px;
    cursor: pointer;
    padding: 10px 40px;
    display: inline-block;
    text-align: center;
    text-decoration: none !important;
    font-style: normal;
    color: white !important;
    background: #3073fc;
  }

  .flag {
    padding-left: 10px;
    margin: 0 30px 0 5px;
    width: 460px;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background: none;
    height: 32px;
    color: white;
  }

  .new-hint-b {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }

  .new-hint-b span:before {
    border: solid transparent;
    border-right-color: newHintborder;
    content: ' ';
    position: absolute;
    border-width: 8px;
    top: 5px;
    left: -16px;
  }

  .new-hint-b span {
    position: relative;
    margin: 6px 20px;
    padding: 6px;
    border-radius: 6px;
    border: 1px solid newHintborder;
  }

  // 弹窗 end
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row > td, .el-table__body tr.hover-row.current-row > td, .el-table__body tr.hover-row.el-table__row--striped.current-row > td, .el-table__body tr.hover-row.el-table__row--striped > td, .el-table__body tr.hover-row > td {
    background-color: #00174a;
  }

  .click_sty1 .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .click_sty1 .el-table__body tr.current-row > td, .click_sty1 .el-table__body tr.hover-row.current-row > td, .click_sty1 .el-table__body tr.hover-row.el-table__row--striped.current-row > td, .click_sty1 .el-table__body tr.hover-row.el-table__row--striped > td, .click_sty1 .el-table__body tr.hover-row > td {
    background-color: #003c81;
  }

  .click_sty2 .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .click_sty2 .el-table__body tr.current-row > td, .click_sty2 .el-table__body tr.hover-row.current-row > td, .click_sty2 .el-table__body tr.hover-row.el-table__row--striped.current-row > td, .click_sty2 .el-table__body tr.hover-row.el-table__row--striped > td, .click_sty2 .el-table__body tr.hover-row > td {
    background-color: #003c81;
  }

  .el-table .chose_bg {
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url('~@/assets/img/no_chose.png') no-repeat;
  }

  .el-table .current-row .chose_bg {
    display: inline-block;
    position: absolute;
    top: 8px;
    left: 17px;
    width: 22px;
    height: 22px;
    background: url('~@/assets/img/chosed.png') no-repeat;
  }

  .el-table .choosed_row, .el-table .choosed_row:hover {
    background: #0190ff;
  }

  .el-table .has_solved {
    color: #00fcff;
  }

  .el-table .choosed_row .chose_bg {
    display: inline-block;
    position: absolute;
    top: 8px;
    left: 17px;
    width: 22px;
    height: 22px;
    background: url('~@/assets/img/last.png') no-repeat;
  }

  .el-table th, .el-table tr {
    background: #00174a;
    color: #fff;
  }

  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #003c81;
  }

  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-right: 1px solid #003c81;
  }

  .el-table--border, .el-table--group {
    border: 2px solid #0190ff;
  }

  .el-table--border::after, .el-table--group::after, .el-table::before {
    content: none;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #3D6981;
  }

  .el-button {
    background: #0e2d71;
    border: none;
  }

  .el-button:hover {
    background: #0e2d71;
  }

  .el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover {
    background: #0e2d71;
    color: #606266;
  }

  .el-button--primary {
    color: #fff;
    background: #3073fc;
  }

  .el-table__empty-block {
    background: #00174a;
  }

  .el-button--primary:hover {
    background: #3073fc;
  }

  .el-message-box {
    background: #00174a;
    color: #fff;
  }

  .el-message-box__title {
    color: #fff;
  }

  .el-message-box__content {
    color: #fff;
  }
}
</style>
