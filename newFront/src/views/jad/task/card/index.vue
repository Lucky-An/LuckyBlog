<template>
  <div class="subject_box">
    <!--答题题目 begin-->
    <ul class="sub_content">
      <li v-for="(sub,index1) in task_ul" :key="index1" class="sub_item">
        <div
          class="sub_card"
          :class="{'wrap-solved': sub.has_solved}"
          @click="showSubmitTaskModal(sub)"
        >
          <span class="top_line" />
          <img v-if="sub.has_solved" class="fit" src="@/assets/jad/contest_right2.png" alt>
          <img
            v-if="sub.notice.length>0&&!sub.has_solved"
            class="msg"
            src="@/assets/jad/contest_tips.png"
          >
          <p class="title-wrap">
            <span
              v-if="getStrNumber(sub.title,18,14)"
              class="fs24 title specialFont"
            >{{ sub.title }}</span>
            <span
              v-else
              class="fs24 title marquee specialFont"
            >{{ sub.title }}&nbsp;&nbsp;&nbsp;{{ sub.title }}&nbsp;&nbsp;&nbsp;{{ sub.title }}&nbsp;&nbsp;&nbsp;{{ sub.title }}&nbsp;&nbsp;&nbsp;</span>
          </p>
          <p class="score-wrap fs16">solved：{{ sub.solved_count }}</p>
          <!--排名盒子-->
          <div class="score-content fjus_center">
            <div
              v-if="!matchInfo.is_replay"
              :class="sub.top_solved ?'score_box score_box1':'score_box'"
            >
              <!--判断计分方式-->
              <p
                class="score fs28 specialFont"
              >{{ matchInfo.integral_mode==1?sub.score:sub.dynamic_score }}pt</p>
            </div>

            <!--排名-->
            <!-- 判断是否有排名 -->
            <div v-if="sub.top_solved" class="repr_box">
              <ul>
                <li v-for="(name,i) in sub.top_solved" :key="i">
                  <div class="img_box fcenter">
                    <span :class="{'top_1_class':i==0,'top_2_class':i==1,'top_3_class':i==2,}" />
                  </div>
                  <span
                    v-if="getStrNumber(name.repr_name,14,7)"
                    class="repr_name fs16"
                  >{{ name.repr_name }}</span>
                  <!-- 字数大于8则添加滚动 -->
                  <span v-else class="repr_name fs16">
                    <span
                      class="marquee"
                    >{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!--答题题目 end-->
    <!--答题弹窗 begin-->
    <!-- <el-dialog
      class="my-dialog env_table_wrap"
      :title="cliData.title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="is_onOff"
      :close-on-press-escape="is_onOff"
      @opened="openDialog"
      @closed="closeDialog"
    > -->
    <el-dialog
      class="my-dialog env_table_wrap"
      width="750px"
      :title="cliData.title"
      :visible.sync="dialogVisible"
      @opened="openDialog"
      @closed="closeDialog"
    >
      <div
        class="markdown-wrapper"
        v-html="$i18n.locale=='zh' ? cliData.content_html : cliData.content_en_html"
      />
      <!--下载附件-->
      <div v-if="cliData.file.length" class="downLoad_box">
        <!-- 题目附件 -->
        {{ $t('question.attDescription') }}：
        <span v-for="(item,index) in cliData.file" :key="index">
          <a download :href="item" class="btn">{{ $t('question.attachment') }} {{ index+1 }}</a>
        </span>
      </div>
      <!-- 判断是否有场景 -->
      <div v-if="cliData.is_dynamic_env" class="clearfix">
        <!--启动场景-->
        <sence
          v-if="cliData.is_dynamic_env"
          ref="sence"
          :task_hash="cliData.hash"
          class="fl"
          @i_have_scene="modal_auth"
          @get_occupy_list="getSenceList"
        />
        <div v-if="matchInfo.mode==2&&cliData.is_dynamic_env" style="width:400px;float:right;">
          <div style="text-align:center;margin-bottom:12px;">
            <span
              style="font-size:16px;margin-bottom:6px;display:inline-block;"
            >{{ $t('ad5.env_list') }}</span>
            <br>
            <span
              v-if="$i18n.locale=='zh'"
              class="highlightBlue"
            >(每队可启动场景上限为{{ matchInfo.max_env_count }}个)</span>
            <span
              v-else
              class="highlightBlue"
            >(Each team can start up to {{ matchInfo.max_env_count }} scenes)</span>
          </div>
          <el-table :data="senceData" border class="env_table" style="width: 100%">
            <el-table-column label="#" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="task_name" :label="$t('ad5.challenge_task_name')" width="180" />
            <el-table-column prop="username" :label="$t('selfHelp_competition.user')" />
          </el-table>
        </div>
      </div>
      <!--输入flag-->
      <!--比赛答对时  process为结束时  不显示flag输入框，为复盘时，即使比赛已结束也展示输入框-->
      <div>
        <div
          v-if="!cliData.has_solved&&(matchInfo.process==0||matchInfo.is_replay)&&matchInfo.status==1"
          style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:30px;"
        >
          flag:
          <input v-model="flagString" type="text" class="flag">
          <span class="btn" @click="submitFlag(cliData.id)">{{ $t('question.submit') }}</span>
        </div>
      </div>

      <div v-if="matchInfo.status==2" class="pause">{{ $t('api_message.event_suspended') }}</div>

      <div v-for="(not,index2) in cliData.notice" :key="index2" class="new-hint-b">
        <img src="@/assets/jad/contest_tips.png" alt>
        <span>{{ not.notice }}</span>
      </div>
    </el-dialog>

    <!--答题弹窗 end-->
    <!--提交答案时提示弹框-->
    <el-dialog
      :title="$t('dialog_list.tips')"
      :visible.sync="dialogtip"
      width="30%"
      center
      custom-class="public-dialog"
      :modal-append-to-body="false"
    >
      <span>
        <span
          style="font-size:30px;vertical-align: middle;margin-right:15px;"
          :class="{'el-icon-warning':icon_status==0,'el-icon-success':icon_status==1,'el-icon-error':icon_status==2}"
        />
        <span>{{ tipInfo }}</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogtip = false">{{ $t('modal.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import sence from './sence'
import { getStrNumber } from '@/utils'
import { mapGetters } from 'vuex'
import { teamEnv, addLogs, submitFlags, submitReplayFlags } from '@/api/jad'
export default {
  components: {
    sence
  },
  props: ['task_ul', 'matchInfo', 'hide_some'],
  data() {
    return {
      getStrNumber,
      senceData: [],
      flagString: '', // 用户输入的flag
      dialogtip: false,
      dialogVisible: false,
      tipInfo: '',
      is_onOff: true, // 控制题板弹框点击空白侧关闭开关
      cliData: { file: [] }, // 被单击的数据
      icon_status: 0, // 0警告1成功2失败
      sence_timer: null
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  beforeDestroy() {
    if (this.matchInfo.mode == 2 && this.cliData.is_dynamic_env) {
      // 如果这个题目有环境并且这个比赛是组队赛，请求已开启题目列表接口
      clearInterval(this.sence_timer)
    }
  },
  created() {
  },

  methods: {
    // 点击题目展示答题框
    showSubmitTaskModal(data) {
      this.dialogVisible = true
      this.cliData = data
      // this.is_onOff = !data.is_dynamic_env // 控制点击空白处关闭答题弹框
      this.addlogs(data.id, this.$route.query.hash)
      if (this.matchInfo.mode == 2 && data.is_dynamic_env) {
        // 如果这个题目有环境并且这个比赛是组队赛，请求已开启题目列表接口
        this.getSenceList(data.hash)
        this.sence_timer = setInterval(() => {
          this.getSenceList(data.hash)
        }, 60000)
      }
    },
    getSenceList(hash) {
      teamEnv(hash).then((res) => {
        this.senceData = res.data.rows
      })
    },
    addlogs(id, hash) {
      // 添加点击题目日志
      addLogs({ event_task: id }, hash).then((res) => {})
    },
    openDialog() {
      // 监听打开弹窗
      if (this.cliData.is_dynamic_env) {
        this.$refs.sence.runSence_get()
      }
    },
    // 监听关闭答题弹框
    closeDialog() {
      this.flagString = ''
      if (this.cliData.is_dynamic_env) {
        this.$refs.sence.initTimer()
      }
      if (this.matchInfo.mode == 2 && this.cliData.is_dynamic_env) {
        // 如果这个题目有环境并且这个比赛是组队赛，请求已开启题目列表接口
        clearInterval(this.sence_timer)
      }
    },
    modal_auth(val) {
      this.is_onOff = val
    },
    submitFlag(id) {
      // 提交falg
      // 判断是否填写falg
      if (!this.flagString) {
        this.dialogtip = true
        this.tipInfo = this.$t('question.falgtip')
        this.icon_status = 0
        return
      }
      let submit_event = submitFlags // 非复盘
      if (this.matchInfo.is_replay) submit_event = submitReplayFlags // 复盘提交
      submit_event({
        event_task: id,
        answer: this.flagString
      }, this.$route.query.hash).then((res) => {
        const { data } = res
        if (data.is_solved === true) {
          this.icon_status = 1
          this.dialogtip = true
          this.tipInfo = this.$t('question.flagSuccess')
          this.dialogVisible = false
          this.$emit('successAnswer')
        } else if (data.is_solved === false) {
          this.icon_status = 2
          this.dialogtip = true
          this.tipInfo = this.$t('question.flagErr')
        }
      })
    }
  }
}
</script>

<style lang="scss"  scoped>
//答题卡 begin
.el-icon-warning {
  color: #ffe45f;
}

.el-icon-error {
  color: #f56c6c;
}

.el-icon-success {
  color: #0080ff;
}

.sub_content {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  // margin-left: -55px;
  padding: 0;

  .sub_item {
    padding: 15px;
    width: 25%;
    list-style: none;
  }
  .sub_card {
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    background: #181b44;
    cursor: pointer;
    padding: 15px;
    height: 235px;
    position: relative;
    .fit {
      width: 28px;
      height: 24px;
      position: absolute;
      top: 48px;
      right: 21px;
    }
    .top_line {
      position: absolute;
      left: 0;
      top: 80px;
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
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
      line-height: 38px;
      span {
        color: #fff;
        font-weight: bold;
        white-space: nowrap;
        font-size: 24px;
      }
    }

    .score-wrap {
      text-align: center;
      height: 22px;
      color: #a4a8b3;
    }

    .score-content {
      height: 143px;
    }

    .score_box {
      width: 100%;
      text-align: center;
      height: 85px;
      font-size: 28px;
      .score {
        font-weight: normal;
        color: #0080ff;
        height: 70px;
        margin-top: 60px;
      }

      .score_title {
        color: scoreTitleColor;
        height: 70px;
      }
    }
    .score_box1 {
      font-size: 28px;
      text-align: center;
      width: 40%;
      float: left;
    }
    .repr_box {
      width: 58%;
      margin-left: 2%;
      float: left;
      margin-top: 5px;
      ul {
        padding: 0;
      }
      li {
        width: 100%;
        border-bottom: 1px solid tableBorer;
        margin: 10px 0px;
        padding-bottom: 2px;
        display: flex;
      }
      .top_1_class {
        width: 30px;
        height: 30px;
        display: inline-block;
        background: url("~@/assets/jad/1.png") no-repeat;
        background-size: auto auto;
      }
      .top_2_class {
        width: 30px;
        height: 30px;
        display: inline-block;
        background: url("~@/assets/jad/2.png") no-repeat;
        background-size: auto auto;
      }
      .top_3_class {
        width: 30px;
        height: 30px;
        display: inline-block;
        background: url("~@/assets/jad/3.png") no-repeat;
        background-size: auto auto;
      }
      .img_box {
        width: 30px;
      }
      .repr_name {
        display: inline-block;
        color: #fff;
        width: calc(100% - 30px);
        overflow: hidden;
        white-space: nowrap;
        height: 30px;
        line-height: 30px;
      }
    }
  }

  //答对题目的状态begin

  .wrap-solved {
    border: solid 2px wrapSolvedborder;
    box-shadow: rgb(11, 234, 235) 0px 0px 14px inset !important;
    &:before {
      content: "";
      clear: both;
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 40px;
      // background:url('~@/assets/img/ad5/jad/jie.png');
      z-index: 10;
    }
  }
}

//答题卡 end
</style>
<style lang="scss">
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
    cursor: pointer;
    padding: 10px 40px;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    font-style: normal;
    color: #fff;
    background-blend-mode: normal, normal;
    background: #0080ff;
    border-radius: 5px;
    border: none;
    margin: 0;
  }

  .flag {
    padding-left: 10px;
    margin: 0 30px 0 5px;
    width: 534px;
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
    content: " ";
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
.env_table_wrap {
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: rgba(50, 54, 83, 1) !important;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: rgba(50, 54, 83, 1) !important;
  }
  .el-table th,
  .el-table tr,
  .el-table td {
    background-color: #1b1f3c !important;
    color: #fff !important;
    text-align: center !important;
  }
  .el-table__empty-block {
    background: #1b1f3c !important;
  }
}
/*横向滚动的动画*/
.marquee {
  animation: marquees 5s infinite;
  animation-timing-function: linear;
  display: inline-block;

  position: relative;
  overflow: hidden;
  white-space: nowrap;
  height: 32px;
  line-height: 32px;
}
@keyframes marquees {
  0% {
    transform: translate(0);
  }
  100% {
    transform: translate(-25%);
  }
}
/*横向滚动的动画*/
.marquee {
  animation: marquees 5s infinite;
  animation-timing-function: linear;
  display: inline-block;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  height: 32px;
  line-height: 32px;
}
.el-dialog__body {
    color: #fff;
}
</style>
