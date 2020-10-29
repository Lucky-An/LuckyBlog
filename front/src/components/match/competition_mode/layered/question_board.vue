<template>
  <div class="match_box" id="layered">
    <div class="no_sub" v-if="level_content.length==0">
      <img src="@/assets/img/context_gif.gif" alt />
    </div>
    <upload-writeup
      v-else
      :matchInfo="matchInfo"
      competition="lay"
      :hasWriteup="hasWriteup"
      @hasWriteupChange="hasWriteupChange"
    >
      <!--&lt;!&ndash;答题弹窗 begin&ndash;&gt;-->
      <el-dialog
        class="my-dialog"
        :title="cliData.title"
        :visible.sync="dialogVisible"
        @opened="openDialog"
        :close-on-click-modal="is_onOff"
        :close-on-press-escape="is_onOff"
        @closed="closeDialog"
      >
        <div
          class="markdown-wrapper"
          v-html="$i18n.locale=='CN' ? cliData.content_html : cliData.content_en_html"
        ></div>
        <!--下载附件-->
        <div class="downLoad_box" v-if="cliData.file.length">
          {{$t('question.attDescription')}}：
          <span v-for="(item,index) in cliData.file">
            <a download :href="item" class="btn">{{$t('question.attachment')}} {{index+1}}</a>
          </span>
        </div>
        <!--启动场景-->
        <sence
          ref="sence"
          :task_hash="cliData.hash"
          :url_front="api.sence_url"
          @i_have_scene="modal_auth"
          v-if="cliData.is_dynamic_env"
        ></sence>

        <!--输入flag-->
        <!--比赛答对时  process为结束时  不显示flag输入框，为复盘时，即使比赛已结束也展示输入框-->
        <div
          v-if="!cliData.has_solved&&(matchInfo.process==0||matchInfo.is_replay)&&matchInfo.status==1"
        >
          flag:
          <input type="text" class="flag" v-model="flagString" />
          <span class="btn" @click="submitFlag(cliData.id)">{{$t('question.submit')}}</span>
        </div>

        <div class="pause" v-if="matchInfo.status==2">{{$t('api_message.event_suspended')}}</div>

        <div class="new-hint-b" v-for="not in cliData.notice">
          <img src="@/assets/img/contest_tips.png" alt />
          <span>{{not.notice}}</span>
        </div>
      </el-dialog>
      <!--&lt;!&ndash;答题弹窗 end&ndash;&gt;-->
    </upload-writeup>
    <!--&lt;!&ndash;题目列表开始;&gt;-->
    <div class="clearfix posRelative">
      <ul class="level_bg">
        <li v-for="t in level_title"></li>
      </ul>
      <ul class="level_title">
        <li v-for="t in level_title">
          <div class="title_wrap">
            <span>{{t}}</span>
          </div>
        </li>
      </ul>
      <div class="content_main">
        <ul class="main_wrapper">
          <li v-for="taskList in level_content">
            <div
              class="box_wrap"
              :class="{'disabled_bos_wrap':item.disabled}"
              v-for="(item,index) in taskList"
            >
              <div class="box_title ellipsis_txt">{{item.category_name}}</div>
              <div class="box_content">
                <div class="list_wrap">
                  <div class="task_wrap" v-if="!item.disabled">
                    <div class="task_item" v-for="oneTask in item.task">
                      <div
                        class="task_body"
                        @click="showSubmitTaskModal(oneTask)"
                        :class="{'task_success_body':oneTask.has_solved}"
                      >
                        <div class="task_name ellipsis_txt">{{oneTask.title}}</div>
                        <div class="hover_popover">
                          <div class="hover_topicmain clearfix">
                            <div class="hover_topicleft left_width">
                              <div>
                                <div
                                  class="score"
                                  style="font-size:22px;padding-top:15px;"
                                >{{oneTask.score}}PT</div>
                              </div>
                              <div class="title">Solved:{{oneTask.solved_count}}</div>
                            </div>
                            <div class="top_three" v-if="oneTask.top_solved">
                              <div
                                class="tops ellipsis_txt"
                                v-for="(name,i) in 3"
                              >{{oneTask.top_solved[i] ? oneTask.top_solved[i].repr_name: '------'}}</div>
                            </div>
                            <div class="top_three" v-else>
                              <div class="tops">------</div>
                              <div class="tops">------</div>
                              <div class="tops">------</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="task_disabled_body" v-else>
                    <div style="color:#fff;">{{$t('ad5.no_task_authority')}}</div>
                  </div>
                </div>
              </div>
              <div class="lianjie" :class="{'lianjie_active':!item.disabled}"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--&lt;!&ndash;题目列表结束;&gt;-->
    <el-dialog
      :title="$t('dialog_list.tips')"
      :visible.sync="dialogtip"
      width="30%"
      center
      custom-class="public-dialog"
      :modal-append-to-body="false"
    >
      <span>
        <span class="el-icon-warning success_icon"></span>
        <span>{{tipInfo}}</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogtip = false">{{$t('modal.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import sence from "../../../common_components/sence";
import { getStrNumber } from "@/common/js/common";
import {
  getMatchInfos,
  writeups,
  submitFlags,
  submitReplayFlags,
  get_challenges,
  get_replay_challenges,
  downLoad_file,
  sence_url,
  addLogs
} from "@/api/competitionMode/layeredMode";
import UploadWriteup from "@/components/match/common/small_part/uploadWriteup";

const { mapState } = createNamespacedHelpers("match");
export default {
  name: "question_board",
  components: {
    sence,
    UploadWriteup
  },
  data() {
    return {
      isCN: this.$i18n.locale=='CN',
      is_onOff: true, //控制题板弹框点击空白侧关闭开关
      getStrNumber,
      matchInfo: "",
      active: 0, //被点击的tab
      subAry: [], //数据
      dialogtip: false, //提示弹框
      dialogVisible: false, //是否展示答题弹框
      writeUpVisible: false, //是否展示上传writeUp弹框
      cliData: { file: [] }, //被单击的数据
      flagString: "", //用户输入的flag
      tipInfo: "", //提示框提示的信息
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
      },
      level_title: [],
      level_content: []
    };
  },
  created() {
    this.getMatchInfo();
  },
  beforeDestroy() {
    if (this.$refs.sence) this.$refs.sence.initTimer();
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
    modal_auth(val) {
      this.is_onOff = val;
    },
    getMatchInfo() {
      //因为存储vuex是异步的,不知道什么时候请求完成，所以现在这个页面请求一次。
      this.api
        .getMatchInfos(this.event_id)
        .then(res => {
          let { data } = res;
          this.matchInfo = data;
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
    //监听关闭答题弹框
    closeDialog() {
      this.flagString = "";
      if (this.cliData.is_dynamic_env) {
        this.$refs.sence.initTimer();
      }
    },

    submitFlag(id) {
      //提交falg
      //判断是否填写falg
      if (!this.flagString) {
        this.dialogtip = true;
        this.tipInfo = this.$t("question.falgtip");
        return;
      }
      let submit_event = this.api.submitFlags; //非复盘
      if (this.matchInfo.is_replay) submit_event = this.api.submitReplayFlags; //复盘提交
      submit_event({
        event_task: id,
        answer: this.flagString
      })
        .then(res => {
          let { data } = res;
          if (data.is_solved) {
            this.dialogtip = true;
            this.tipInfo = this.$t("question.flagSuccess");
            this.dialogVisible = false;
            this.getSubList(true);
          } else {
            this.dialogtip = true;
            this.tipInfo = this.$t("question.flagErr");
          }
        })
        .catch(error => {});
    },
    openDialog() {
      //监听打开弹窗
      if (this.cliData.is_dynamic_env) {
        this.$refs.sence.runSence_get();
      }
    },
    showSubmitTaskModal(data) {
      //点击题目展示答题框
      this.dialogVisible = true;
      this.cliData = data;
      this.is_onOff = !data.is_dynamic_env; //控制点击空白处关闭答题弹框
      this.addlogs(data.id);
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
          let { data } = res;
          let new_obj = {};
          this.level_title = [];
          this.level_content = [];
          for (var i = 0; i < data.length; i++) {
            //改成自己想要的格式，题目列表信息
            for (var key in data[i]) {
              this.level_title.push(key);
              for (var taskKey in data[i][key]) {
                if (!new_obj[taskKey]) {
                  new_obj[taskKey] = [];
                }
                new_obj[taskKey].push(data[i][key][taskKey]);
              }
            }
          }
          for (var attr in new_obj) {
            this.level_content.push(new_obj[attr]);
          }
          this.changeHeight();
        })
        .catch(error => {});
    },
    addlogs(id) {
      //添加点击题目日志
      this.api.addLogs({ event_task: id }).then(res => {});
    },
    downLoad(ind) {
      this.api.downLoad_file(
        this.matchInfo.hash + "/" + this.cliData.hash + "/" + ind
      );
    },
    changeHeight() {
      let arr = [];
      this.level_content.forEach((item, i) => {
        arr.push(Number(item.length));
      });
      arr.sort(function(a, b) {
        return a - b;
      });
      this.$nextTick(() => {
        let h =
          Number($(".level_bg li").height()) +
          parseInt($(".level_bg li").css("marginBottom"));
        $(".content_main").height(h * arr[arr.length - 1] + "px");
      });
      window.addEventListener("resize", function() {
        let h =
          Number($(".level_bg li").height()) +
          parseInt($(".level_bg li").css("marginBottom"));
        $(".content_main").height(h * arr[arr.length - 1] + "px");
      });
    },
    hasWriteupChange() {
      this.hasWriteup = true;
    }
  },
  mounted() {}
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
        width: 78px;
      }

      .hint-ss {
        padding: 2px 10px;
        position: absolute;
        right: 0;
        top: 11px;
        border-radius: 12px !important;
        background: tabHintColot;
      }
    }
  }

  // tab end

  // 答题卡 begin
  .sub_content {
    padding-top: 0;
    margin: 0 -15px 0 -15px;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;

    .sub_item {
      padding: 15px;
      width: 25%;
    }

    .sub_card:hover {
      edge-angle();
      background-color: subHover;
    }

    .sub_card {
      background: #0d1927;
      cursor: pointer;
      padding: 15px;
      height: 235px;
      border: solid 1px subCardBorder;
      position: relative;

      .fit {
        width: 28px;
        height: 24px;
        position: absolute;
        top: 50px;
        right: 21px;
      }

      .msg {
        width: 30px;
        height: 30px;
        position: absolute;
        top: 50px;
        right: 21px;
      }

      .title-wrap {
        height: 40px;
        text-align: center;
        overflow: hidden;

        span {
          color: titleColor;
          font-weight: bold;
          white-space: nowrap;
        }
      }

      .score-wrap {
        text-align: center;
        height: 22px;
        color: titleColor;
      }

      .score-content {
        height: 143px;
      }

      .score_box {
        width: 36%;
        height: 100%;

        .score {
          font-weight: bold;
          color: scoreColor;
          height: 70px;
          line-height: 70px;
          font-family: myfont;
        }

        .score_title {
          color: scoreTitleColor;
          height: 70px;
        }
      }

      .repr_box {
        width: 64%;

        li {
          width: 100%;
          border-bottom: 1px solid tableBorer;
          margin: 10px 0px;
          padding-bottom: 2px;
          display: flex;
          align-items: center;

          .top_1_class {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url('~@/assets/img/1.png') no-repeat;
            background-size: auto auto;
          }

          .top_2_class {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url('~@/assets/img/2.png') no-repeat;
            background-size: auto auto;
          }

          .top_3_class {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url('~@/assets/img/3.png') no-repeat;
            background-size: auto auto;
          }
        }

        .img_box {
          width: 30px;
        }

        .repr_name {
          display: inline-block;
          color: fontColor-f;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }

    // 答对题目的状态begin
    .wrap-solved {
      border: solid 2px wrapSolvedborder;
      box-shadow: rgb(11, 234, 235) 0px 0px 14px inset !important;

      &:before {
        content: '';
        clear: both;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
        width: 40px;
        height: 40px;
        background: url('~@/assets/img/ad5/jad/jie.png');
        z-index: 10;
      }
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.content_main {
  width: calc(100% - 70px) !important;

  .main_wrapper {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;

    li {
      display: inline-block;
    }
  }
}

.box_wrap {
  width: 100%;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  .box_title {
    padding: 0 5px;
    background: url('~@/assets/img/ad5/layered/t1.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    color: #fff;
    font-weight: bold;
  }

  .box_content {
    width: 100%;
    background: url('~@/assets/img/ad5/layered/k1.png') no-repeat;
    background-size: 100% 100%;

    .list_wrap {
      display: table-cell;
      vertical-align: middle;

      .task_disabled_body {
        cursor: not-allowed;

        &:before {
          content: '';
          display: inline-block;
          clear-after: both;
          display: inline-block;
          background: url('~@/assets/img/ad5/layered/3.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

  &:last-child {
    .lianjie {
      display: none;
    }
  }
}

.lianjie {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  background: url('~@/assets/img/ad5/layered/jt1.png') no-repeat;
  background-size: 100% 100%;
}

.lianjie_active {
  background: url('~@/assets/img/ad5/layered/jt.png') no-repeat;
  background-size: 100% 100%;
}

.disabled_bos_wrap {
  cursor: not-allowed;

  .box_title {
    background: url('~@/assets/img/ad5/layered/t2.png') no-repeat;
    background-size: 100% 100%;
  }

  .box_content {
    background: url('~@/assets/img/ad5/layered/k2.png') no-repeat;
    background-size: 100% 100%;
  }
}

.task_item {
  display: inline-block;
  vertical-align: middle;

  .task_body, .task_success_body {
    &:before {
      content: '';
      display: inline-block;
      clear-after: both;
      display: inline-block;
    }

    .task_name {
      width: 100%;
      color: #fff;
      text-align: center;
    }
  }

  .task_body {
    cursor: pointer;
    position: relative;

    &:hover {
      .hover_popover {
        display: block;
      }
    }

    .hover_popover {
      display: none;
      position: absolute;
      background: #232a7a;
      border: 2px solid #3a4297;
      border-radius: 4px;
      z-index: 6;

      &:before {
        content: '';
        clear-after: both;
        position: absolute;
        width: 16px;
        height: 23px;
        background: url('~@/assets/img/ad5/layered/jiao.png') no-repeat;
        background-size: 100% 100%;
      }

      .hover_topicmain {
        width: 100%;
        height: 100%;
        background: #232a7a;
        padding: 6px;
        border-radius: 6px;
      }

      .hover_topicleft {
        float: left;
        height: 100%;
        padding-top: 8px;
      }

      .left_width {
        width: 42%;
      }

      .full_width {
        width: 100%;
      }

      .top_three {
        width: 58%;
        height: 100%;
        float: right;
        color: #fff;
        font-size: 14px;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
      }

      .tops {
        line-height: 26px;
        width: 100%;
        text-align: left;
        padding: 3px 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
      }

      .tops:before {
        content: '';
        display: inline-block;
        clear: both;
        width: 24px;
        height: 28px;
        vertical-align: middle;
        margin-right: 5px;
        vertical-align: -10px;
      }

      .tops:nth-child(1):before {
        background: url('~@/assets/img/ad5/jad/1r.png');
        background-size: 100% 100%;
      }

      .tops:nth-child(2):before {
        background: url('~@/assets/img/ad5/jad/2r.png');
        background-size: 100% 100%;
      }

      .tops:nth-child(3):before {
        background: url('~@/assets/img/ad5/jad/3r.png');
        background-size: 100% 100%;
      }

      .hover_topicleft .score {
        color: #3074fd;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        margin-top: 5px;
        margin-bottom: 10px;
      }

      .hover_topicleft .title {
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
    }

    &:before {
      background: url('~@/assets/img/ad5/layered/2.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  .task_success_body {
    cursor: pointer;

    &:before {
      background: url('~@/assets/img/ad5/layered/1.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}

.task_wrap {
  .task_item {
    &:nth-child(1) {
      margin-left: 0;
    }

    &:nth-child(4n) {
      margin-left: 0;
    }

    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}

.level_title {
  width: 60px;
  float: left;
  position: relative;
  z-index: 2;
}

.level_bg {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1;

  li {
    width: 100%;
    background: rgba(24, 27, 68, 0.6);
  }
}

.content_main {
  float: left;
  position: relative;
  z-index: 3;
}

.level_title li {
  width: 60px;
  background: #1b2362;
  list-style: none;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  .title_wrap {
    display: table-cell;
    vertical-align: middle;
  }

  span {
    color: #fff;
    text-align: center;
  }
}

@media (max-width: 1300px) {
  .task_wrap {
    padding-top: 25px;
  }

  .content_main {
    .main_wrapper {
      bottom: 26px;

      li {
        width: 322px;
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }

  .box_wrap {
    height: 250px;
    margin-bottom: 30px;

    .box_title {
      width: 160px;
      height: 38px;
      line-height: 38px;
      font-size: 16px;
    }

    .box_content {
      height: 210px;
      padding: 0 20px 0;
      margin-top: -23px;

      .list_wrap {
        width: 340px;
        height: 210px;

        .task_disabled_body {
          &:before {
            width: 55px;
            height: 50px;
          }
        }
      }
    }
  }

  .lianjie {
    width: 52px;
    height: 25px;
    bottom: -16px;
  }

  .hover_popover {
    width: 318px;
    height: 120px;
    left: -318px;
    top: -15px;

    &:before {
      right: -16px;
      top: 30px;
    }
  }

  .main_wrapper {
    li:nth-child(1) {
      .box_wrap {
        .hover_popover {
          left: auto;
          right: -310px;
          top: -15px;

          &:before {
            left: -16px;
            top: 30px;
            transform: rotate(180deg);
          }
        }
      }
    }
  }

  .level_title li {
    width: 60px;
    height: 250px;
    padding: 0 20px;
    margin-bottom: 25px;

    .title_wrap {
      width: 15px;
      height: 250px;
    }

    span {
      width: 15px;
      display: inline-block;
      line-height: 24px;
      font-size: 16px;
    }
  }

  .task_item {
    width: 72px;
    height: 80px;
    margin: 0 10px;
    margin-bottom: 5px;

    .task_body, .task_success_body {
      &:before {
        width: 60px;
        height: 50px;
      }

      .task_name {
        line-height: 22px;
        font-size: 12px;
      }
    }
  }

  .level_bg {
    li {
      height: 250px;
      margin-bottom: 35px;
    }
  }
}

@media (min-width: 1300px) and (max-width: 1650px) {
  .task_wrap {
    padding-top: 25px;
  }

  .content_main {
    .main_wrapper {
      bottom: 26px;

      li {
        width: 322px;
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }

  .box_wrap {
    height: 250px;
    margin-bottom: 30px;

    .box_title {
      width: 160px;
      height: 38px;
      line-height: 38px;
      font-size: 16px;
    }

    .box_content {
      height: 210px;
      padding: 0 20px 0;
      margin-top: -23px;

      .list_wrap {
        width: 340px;
        height: 210px;

        .task_disabled_body {
          &:before {
            width: 55px;
            height: 50px;
          }
        }
      }
    }
  }

  .lianjie {
    width: 52px;
    height: 25px;
    bottom: -16px;
  }

  .hover_popover {
    width: 318px;
    height: 120px;
    left: -318px;
    top: -15px;

    &:before {
      right: -16px;
      top: 30px;
    }
  }

  .main_wrapper {
    li:nth-child(1) {
      .box_wrap {
        .hover_popover {
          left: auto;
          right: -310px;
          top: -15px;

          &:before {
            left: -16px;
            top: 30px;
            transform: rotate(180deg);
          }
        }
      }
    }
  }

  .level_title li {
    width: 60px;
    height: 250px;
    padding: 0 20px;
    margin-bottom: 25px;

    .title_wrap {
      width: 15px;
      height: 250px;
    }

    span {
      width: 15px;
      display: inline-block;
      line-height: 24px;
      font-size: 16px;
    }
  }

  .task_item {
    width: 72px;
    height: 80px;
    margin: 0 10px;
    margin-bottom: 5px;

    .task_body, .task_success_body {
      &:before {
        width: 60px;
        height: 50px;
      }

      .task_name {
        line-height: 22px;
        font-size: 12px;
      }
    }
  }

  .level_bg {
    li {
      height: 250px;
      margin-bottom: 35px;
    }
  }
}

@media (min-width: 1650px) {
  .content_main {
    .main_wrapper {
      bottom: 62px;

      li {
        width: 370px;
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }

  .box_wrap {
    height: 270px;
    margin-bottom: 88px;

    .box_title {
      width: 190px;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
    }

    .box_content {
      height: 250px;
      padding: 8px 35px 0;
      margin-top: -23px;

      .list_wrap {
        width: 370px;
        height: 266px;

        .task_disabled_body {
          &:before {
            width: 75px;
            height: 66px;
          }
        }
      }
    }
  }

  .lianjie {
    width: 60px;
    height: 30px;
    bottom: -60px;
  }

  .hover_popover {
    width: 318px;
    height: 120px;
    left: -318px;
    top: -15px;

    &:before {
      right: -15px;
      top: 30px;
    }
  }

  .level_title li {
    width: 60px;
    height: 310px;
    padding: 0 20px;
    margin-bottom: 45px;

    .title_wrap {
      width: 15px;
      height: 290px;
    }

    span {
      width: 15px;
      display: inline-block;
      line-height: 24px;
      font-size: 18px;
    }
  }

  .task_item {
    width: 76px;
    height: 92px;
    margin: 0 15px;
    margin-bottom: 5px;

    .task_body, .task_success_body {
      &:before {
        width: 75px;
        height: 66px;
      }

      .task_name {
        line-height: 24px;
        font-size: 14px;
      }
    }
  }

  .level_bg {
    li {
      height: 310px;
      margin-bottom: 45px;
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
.subject_box {
  .markdown-wrapper {
    line-height: 20px;

    p {
      margin-bottom: 10px;
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
    background-image: linear-gradient(0deg, rgba(0, 96, 255, 0.27) 0%, #000000 100%), linear-gradient(#030000, #030000);
    background-blend-mode: normal, normal;
    border-style: solid;
    border-width: 2px;
    border-image-source: linear-gradient(
      0deg,
      #0078ff 0%,
      #8bc7ff 100%
    );
    border-image-slice: 1;
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
}

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
