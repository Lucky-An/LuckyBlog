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
                    >{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;{{ name.repr_name }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!--答题题目 end-->
    <el-dialog
      class="my-dialog env_table_wrap"
      :title="cliData.title"
      :visible.sync="dialogVisible"
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
    </el-dialog>
  </div>
</template>

<script>
import { getStrNumber } from '@/utils'
import { mapGetters } from 'vuex'
import { teamEnv, addLogs } from '@/api/rw'
export default {
  props: ['task_ul', 'matchInfo', 'hide_some'],
  data() {
    return {
      getStrNumber,
      dialogVisible: false,
      cliData: { file: [] } // 被单击的数据
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  methods: {
    // 点击题目展示答题框
    showSubmitTaskModal(data) {
      this.dialogVisible = true
      this.cliData = data
      this.addlogs(data.id, this.$route.query.hash)
      if (this.matchInfo.mode == 2 && data.is_dynamic_env) {
      }
    },
    addlogs(id, hash) {
      // 添加点击题目日志
      addLogs({ event_task: id }, hash).then((res) => {})
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
  padding-top: 0;
  margin: 0 -15px 0 -15px;
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

