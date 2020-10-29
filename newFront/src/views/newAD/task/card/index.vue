<template>
  <div class="guide_wrap" style="padding:0">
    <div class="task_list">
      <!--小于6个题目的展示-->
      <ul v-if="task_data.length<=6" class="clearfix">
        <li
          v-for="(item,ind) in task_data"
          :key="item.challenge_name + ind"
          :class="{
            'liStatus1':item.status==1,
            'liStatus2':item.status==2,
            'liStatus3':item.status==3,
            'liStatus4':item.status==4,
            'liStatus5':item.status==5,
          }"
        >
          <div class="title">{{ item.challenge_name }}</div>
          <slot name="task_body" :now_item="item" />
        </li>
        <li
          v-for="(other_item,ind) in (6-task_data.length)"
          :key="ind"
          class="liStatus1"
          style="text-align:center"
        >
          <img
            src="@/assets/attack/nosome.png"
            alt
            style="margin-top:30%;width:55%;margin-bottom:20px;"
          >
          <span
            style="color:#5f648e;width:100%;display:inline-block;font-size:14px;"
          >{{ $t('attack.question_board.no_more_question') }}</span>
        </li>
      </ul>
      <!--大于6个题目的展示-->
      <div v-else>
        <span class="prev_btn" :class="{'dis_prev':this.list_number>=0}" @click="prev_handle" />
        <div class="min_7">
          <ul class="one_line">
            <li
              v-for="(item,index) in task_data"
              :id="'hahahah'+index"
              :key="index"
              :class="{

                'liStatus1':item.status==3,
                'liStatus2':item.status==2,
                'liStatus3':item.status==1||item.status==4||item.status==5,
              }"
            >
              <div class="title">{{ item.challenge_name }}</div>
              <slot name="task_body" :now_item="item" />
            </li>
          </ul>
        </div>
        <span
          class="next_btn"
          :class="{'dis_next':Math.abs(this.list_number)==n}"
          @click="next_handle"
        />
      </div>
    </div>
    <div class="attack_info">
      <el-row>
        <!-- 比赛信息 -->
        <el-col :span="15">
          <div class="grid-content bg-purple attack_match_info">
            <div class="title">
              {{ $t('attack.question_board.match_info') }}
              <span
                class="download_task_info"
                @click="downloadFile"
              >
                <span style="vertical-align: middle" />
                <span>{{ $t('attack.question_board.download_info') }}</span>
              </span>
            </div>

            <div slot="content_begin" class="table_wraps">
              <div
                v-if="JSON.stringify(flag_data)=='{}'"
                style="color:#fff;"
              >{{ $t('el.table.emptyText') }}</div>
              <div v-else>
                <div class="tables">
                  <div>
                    <span>{{ $t('attack.question_board.name') }}</span>
                    <span>{{ flag_data.name }}</span>
                  </div>
                  <div>
                    <span>Token</span>
                    <span>{{ flag_data.token }}</span>
                  </div>
                  <div>
                    <span>{{ $t('attack.question_board.url') }}</span>
                    <span>{{ flag_data.submit_url }}</span>
                  </div>
                  <div>
                    <span>{{ $t('attack.question_board.type') }}</span>
                    <span>{{ flag_data.method }}</span>
                  </div>
                  <div>
                    <span>{{ $t('attack.question_board.mode') }}</span>
                    <span>{{ flag_data.format }}</span>
                  </div>
                </div>
                <div class="write_flags clearfix">
                  <input
                    v-model="is_flag"
                    type="text"
                    :placeholder="$t('attack.question_board.enter_flag')"
                  >
                  <button class="submit_Flag" @click="send_the_flag">{{ $t('modal.submit') }}</button>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 被攻击列表 -->
        <el-col :span="9">
          <div class="grid-content bg-purple attack_view_list attack_view_list_right">
            <div class="title">{{ $t('attack.question_board.attacked_list') }}</div>
            <ul v-if="attack_data.length" class="view_list">
              <li v-for="(item,index) in attack_data" :key="index">
                {{ $t('attack.question_board.user') }}
                <span class="blues">{{ item.attack_name }}</span>
                {{ $t('attack.question_board.attack') }}
                <span
                  class="blues"
                >{{ item.challenge_name }}</span>
                <time class="blues" style="float:right;">{{ item.time }}</time>
              </li>
            </ul>
            <div v-else class="view_list">
              <div class="tscon">{{ $t('el.table.emptyText') }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  attackedData,
  competitionData,
  download_task_info,
  navData,
  challenge_data,
  submit_flag
} from '@/api/newAD'
import $ from 'jquery'
import { downloadFile } from '@/api/common'
import { checkFileAvailable } from '@/utils/download'

export default {
  name: 'AttackQuestionBoard',
  components: {},

  data() {
    return {
      flag_data: [], // 比赛信息
      task_data: [], // 题目列表
      attack_data: [], // 被攻击列表
      list_number: 0,
      list_width: 0,
      n: 0,
      marginR: 0,
      is_flag: '', // flag
      id: this.$route.query.id
    }
  },
  watch: {
    task_data(val, old) {
      if (val.length > 6) {
        this.$nextTick(() => {
          this.line_width()
        })
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.getDataTimer)
  },
  created() {
    this.getAttackedList()
    this.getTaskData()
    this.competitionlist()
    this.getDataTimer = setInterval(() => {
      this.getAttackedList()
      this.getTaskData()
    }, 30000)
  },
  mounted() {
    if (this.task_data.length > 6) {
      this.line_width()
      this.listwidth()
    }
    window.onresize = () => {
      this.listwidth()
      if (this.task_data.length > 6) {
        this.line_width()
        this.change_left()
      }
    }
  },
  methods: {
    // 题目列表
    getTaskData() {
      challenge_data({
        event_id: this.$route.query.id
      })
        .then((res) => {
          if (!res.data.message) {
            this.task_data = res.data
          }
          this.$nextTick(() => {
            this.listwidth()
          })
        })

        .catch((res) => {})
    },
    // 被攻击列表
    getAttackedList() {
      attackedData({
        event_id: this.$route.query.id
      })
        .then((res) => {
          this.attack_data = res.data
        })
        .catch((res) => {})
    },
    // 比赛信息
    competitionlist() {
      competitionData({
        event_id: this.$route.query.id
      }).then((res) => {
        this.flag_data = res.data
      })
    },
    // 查看比赛信息
    hrefun() {
      this.$router.push({
        path: '/newAttack/environment',
        query: {
          id: this.$route.query.id,
          hash: this.$route.query.hash,
          type: this.$route.query.type
        }
      })
    },
    // 提交flag
    send_the_flag() {
      if (this.is_flag == '') {
        this.$notify.error({
          customClass: 'error_notify',
          title: this.$t('public.error'),
          message: this.$t('selfHelp_competition.fell_flag')
        })
      } else {
        submit_flag('event_id=' + this.$route.query.id, {
          flag: this.is_flag,
          token:
            this.flag_data.token ||
            'GuHHMJct6tNtukSSYgRjtsD27b55Cg3nQStsFgcAwR9w6'
        }).then((res) => {
          if (res.data.success) {
            this.$notify.success({
              title: this.$t('dialog_list.tips'),
              message: this.$t('api_message.submit_success')
            })
          }
        })
      }
    },
    prev_handle() {
      if (this.list_number < 0) {
        this.list_number++
      }
      this.change_left()
    },
    next_handle() {
      if (Math.abs(this.list_number) < this.n) {
        this.list_number--
      }
      this.change_left()
    },
    change_left() {
      $('.one_line').css(
        'left',
        this.list_number * (this.list_width + Number(this.marginR)) + 'px'
      )
    },
    line_width() {
      this.marginR = $('.task_list li').eq(0).css('marginRight').split('px')[0]
      const p = 6
      this.n = this.task_data.length - p
      this.list_width = $('.task_list li').width()
      const w =
        this.list_width * this.task_data.length +
        this.marginR * (this.task_data.length - 1) +
        'px'
      $('.one_line').eq(0).width(w)
    },
    listwidth() {
      const wid = ($('.guide_wrap').width() - 150) / 6
      $('.guide_wrap .task_list ul li').css('width', wid + 'px')
    },
    // 下载题目附件
    downloadFile(params, name) {
      downloadFile('/api/v1/jad/web/api/download_message/', { event_id: this.id }).then((res) => {
        checkFileAvailable(res)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.download_task_info {
  cursor: pointer;
}
.task_list {
  position: relative;
  ul {
    padding: 0;
    font-size: 0;
    li {
      width: 220px;
      margin-right: 30px;
      padding-bottom: 30px;
      height: 288px;
      &.liStatus1 {
        background: #181c35;
        .title {
          background: #272a49;
        }
        .now_score {
          background: #272a49;
        }
      }
      &.liStatus2,
      &.liStatus3,
      &.liStatus4,
      &.liStatus5 {
        background: #262a57;
        .title {
          background: #323981;
        }
        .now_score {
          background: #2a3064;
        }
      }
      &.liStatus4 {
        .now_score {
          color: #0080ff;
        }
        .status_info {
          color: #ff4d50;
        }
      }
      border-radius: 5px;
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      &:last-child {
        margin-right: 0;
      }
      .title {
        height: 48px;
        line-height: 48px;
        text-align: center;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        font-size: 16px;
        color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .status {
        width: 100%;
        text-align: center;
        display: inline-block;
        .status_info {
          width: 100%;
          display: inline-block;
          margin-top: 12px;
          margin-bottom: 30px;
        }
        .now_score {
          width: 150px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin: 0 auto;
          border-radius: 20px;
          text-align: center;
          font-size: 30px;
          font-family: myfont;
        }
        .path_button {
          width: 75%;
          height: 36px;
          border-radius: 5px;
          text-align: center;
          line-height: 36px;
          margin: 0 auto;
          margin-top: 20px;
        }
        .cando {
          color: #fff;
          background: #0080ff;
          cursor: pointer;
        }
        .notdo {
          color: #a7aeb6;
          background: #232a47;
          cursor: not-allowed;
        }
        .look_something {
          margin-top: 15px;
          text-decoration: underline;
          font-size: 14px;
          line-height: 20px;
          .fanga {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      .status1 {
        .status_info {
          color: #474b64;
        }
        .now_score {
          color: #626588;
          background: #272b48;
        }
        .look_something * {
          color: #434868;
        }
      }
      .status2 {
        .status_info {
          color: #0080ff;
        }
        .now_score {
          color: #0080ff;
          background: #2c3060;
        }
        .look_something * {
          color: #0080ff;
        }
      }
      .status3 {
        .status_info {
          color: #cd8749;
        }
        .now_score {
          color: #0080ff;
          background: #272b48;
        }
        .look_something * {
          color: #0080ff;
        }
      }
      .status4 {
        .status_info {
          color: #e76148;
        }
        .now_score {
          color: #0080ff;
          background: #272b48;
        }
        .look_something * {
          color: #434868;
        }
      }
      .status5 {
        .status_info {
          color: #c12d2d;
        }
        .now_score {
          color: #0080ff;
          background: #272b48;
        }
        .look_something * {
          color: #434868;
        }
      }
    }
  }
  .min_7 {
    width: 100%;
    position: relative;
    overflow: hidden;
    height: 280px;
    .one_line {
      font-size: 0;
      position: absolute;
      left: 0;
      top: 0;
      transition: 0.4s;
      text-align: left;
    }
  }
  .prev_btn,
  .next_btn {
    width: 44px;
    height: 44px;
    position: absolute;
    background-size: 100% 100%;
    top: 35%;
    cursor: pointer;
    z-index: 5000;
  }
  .prev_btn {
    left: -55px;
    background: url("~@/assets/attack/def2.png");
  }
  .next_btn {
    background: url("~@/assets/attack/def.png");
    right: -55px;
  }
  .dis_next {
    background: url("~@/assets/attack/dis_def.png");
    cursor: not-allowed;
  }
  .dis_prev {
    background: url("~@/assets/attack/dis_def2.png");
    cursor: not-allowed;
  }
}
.attack_info {
  margin-top: 30px;
  .attack_match_info,
  .attack_view_list {
    .title {
      .download_task_info {
        font-size: 14px;
        color: #fff;
        width: 140px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #555dae;
        border-radius: 5px;
        float: right;
        margin-right: 10px;
        padding: 0;
        margin-top: 10px;
        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  .attack_match_info {
    .table_wraps {
      padding: 2%;
      .tables {
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        text-align: left;
        margin-bottom: 12px;
        div {
          line-height: 30px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          &:last-child {
            border-bottom: none;
          }
          span {
            max-width: 75%;
            height: 100%;
            display: inline-block;
            padding: 0 18px;
            word-break: break-all;
            font-size: 14px;
            &:first-child {
              width: 150px;
            }
            &:last-child {
              border-left: 1px solid rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
      .write_flags {
        text-align: left;
        input {
          width: calc(100% - 130px);
          height: 40px;
          border: none;
          background: #14162b;
          border-radius: 5px;
          color: #565a75;
          padding: 0 20px;
          float: left;
          &:focus {
            outline: none;
          }
        }
        .submit_Flag {
          width: 110px;
          line-height: 38px;
          background: #0080ff;
          color: #fff;
          text-align: center;
          border: none;
          border-radius: 5px;
          float: right;
          cursor: pointer;
        }
      }
    }
  }
  .attack_view_list {
    .view_list {
      padding: 0 8px;
      overflow: hidden;
      li {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        text-align: left;
        padding: 0 15px;
        .blues {
          color: #0080ff;
        }
      }
    }
  }
}
.title {
  width: 100%;
  line-height: 48px;
  background: #272a49;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: #fff;
  text-align: left;
  padding-left: 25px;
  font-size: 16px;
}
.el-col {
  padding: 0;
  border-radius: 5px;
}
.grid-content {
  background: #1b1f3c;
  margin-right: 20px;
}

.view_list {
  height: 250px;
}
.tscon {
  color: rgb(255, 255, 255);
  margin: 30px;
  text-align: center;
}
.attack_view_list_right {
  margin-right: 0;
}
</style>
