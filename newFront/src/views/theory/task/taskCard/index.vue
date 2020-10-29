<template>
  <div
    id="taskCardMain"
    class="taskCardContainer"
  >
    <div v-if="allQuesitionList.length>0">
      <div v-if="!disableflag" class="clearfix">
        <!-- 交卷按钮 -->
        <el-button
          style="float:right;margin-bottom: 10px;"
          type="primary"
          size="mini"
          @click="handInPapers"
        >{{ $t('ad5.theory.jiaojuan') }}
        </el-button>
      </div>
      <!-- 左侧题目列表 -->
      <div class="task_list">
        <!-- 单选 -->
        <div
          v-if="questionData.singleChoice.length"
          class="singleChoice common"
        >
          <div class="header">
            <!-- 题目类型 单选题-->
            <div class="title">{{ $t('question.single') }}</div>
            <!-- 已解出 -->
            <div
              v-if="match.process != 2"
              class="answered"
            >
              <div class="num" />
              <div class="status">
                {{ $t('ad5.is_solved') }}
              </div>
            </div>
            <!-- 未解出 -->
            <div
              v-if="match.process != 2"
              class="unanswered"
            >
              <div class="num" />
              <div class="status">{{ $t('ad5.is_not_solved') }}
              </div>
            </div>
            <!-- 回答正确 -->
            <div
              v-if="match.process == 2"
              class="answereRight"
            >
              <div class="num" />
              <div class="status">
                正确
              </div>
            </div>
            <!-- 回答错误 -->
            <div
              v-if="match.process == 2"
              class="answereError"
            >
              <div class="num" />
              <div class="status">
                错误
              </div>
            </div>
            <!-- 未作答 -->
            <div
              v-if="match.process == 2"
              class="noanswere"
            >
              <div class="num" />
              <div class="status">
                未作答
              </div>
            </div>

          </div>
          <div class="content">
            <div
              v-for="(item,index) in questionData.singleChoice"
              :key="item.id"
              class="questionNumber"
              :class="{isAnswer:item.user_answer.length,
                       right:item.status == 1 && match.process == 2,
                       unright:item.status == 0 && match.process == 2,
                       noanswer:item.status == 2 && match.process == 2,
                       isChoice:isChoiceId == item.id}"
              @click="handlerChoice(item)"
            >
              {{ item.num }}
            </div>
          </div>
        </div>
        <!-- 多选 -->
        <div
          v-if="questionData.moreChoice.length"
          class="multipleChoice common"
        >
          <div class="header">
            <!-- 题目类型 多选题-->
            <div class="title">{{ $t('question.multiple') }}</div>
            <!-- 已解出 -->
            <div
              v-if="match.process != 2"
              class="answered"
            >
              <div class="num" />
              <div class="status">
                {{ $t('ad5.is_solved') }}
              </div>
            </div>
            <!-- 未解出 -->
            <div
              v-if="match.process != 2"
              class="unanswered"
            >
              <div class="num" />
              <div class="status">{{ $t('ad5.is_not_solved') }}
              </div>
            </div>
            <!-- 回答正确 -->
            <div
              v-if="match.process == 2"
              class="answereRight"
            >
              <div class="num" />
              <div class="status">
                正确
              </div>
            </div>
            <!-- 回答错误 -->
            <div
              v-if="match.process == 2"
              class="answereError"
            >
              <div class="num" />
              <div class="status">
                错误
              </div>
            </div>
            <!-- 未作答 -->
            <div
              v-if="match.process == 2"
              class="noanswere"
            >
              <div class="num" />
              <div class="status">
                未作答
              </div>
            </div>
          </div>
          <div class="content">
            <div
              v-for="(item,index) in questionData.moreChoice"
              :key="item.id"
              class="questionNumber"
              :class="{isAnswer:item.user_answer.length,
                       right:item.status == 1 && match.process == 2,
                       unright:item.status == 0 && match.process == 2,
                       noanswer:item.status == 2 && match.process == 2,
                       isChoice:isChoiceId == item.id}"
              @click="handlerChoice(item)"
            >
              {{ item.num }}
            </div>
          </div>
        </div>
        <!-- 判断 -->
        <div
          v-if="questionData.judge.length"
          class="judge common"
        >
          <div class="header">
            <!-- 题目类型 判断题-->
            <div class="title">{{ $t('question.judge') }}</div>
            <!-- 已解出 -->
            <div
              v-if="match.process != 2"
              class="answered "
            >
              <div class="num" />
              <div class="status">{{ $t('ad5.is_solved') }}</div>
            </div>
            <!-- 未解出 -->

            <div
              v-if="match.process != 2"
              class="unanswered "
            >
              <div class="num" />
              <div class="status">{{ $t('ad5.is_not_solved') }}</div>
            </div>
            <!-- 回答正确 -->
            <div
              v-if="match.process == 2"
              class="answereRight"
            >
              <div class="num" />
              <div class="status">
                正确
              </div>
            </div>
            <!-- 回答错误 -->
            <div
              v-if="match.process == 2"
              class="answereError"
            >
              <div class="num" />
              <div class="status">
                错误
              </div>
            </div>
            <!-- 未作答 -->
            <div
              v-if="match.process == 2"
              class="noanswere"
            >
              <div class="num" />
              <div class="status">
                未作答
              </div>
            </div>
          </div>
          <div class="content">
            <div
              v-for="(item,index) in questionData.judge"
              :key="item.id"
              class="questionNumber"
              :class="{isAnswer:item.user_answer.length,
                       right:item.status == 1 && match.process == 2,
                       unright:item.status == 0 && match.process == 2,
                       noanswer:item.status == 2 && match.process == 2,
                       isChoice:isChoiceId == item.id}"
              @click="handlerChoice(item)"
            >
              {{ item.num }}
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧题目详情 -->
      <div class="task_detial">
        <div class="header">
          <span>{{ questionDetial.type }}</span>
          <span>(</span>
          <span style="color:#0080ff">{{ questionDetial.index+1 }}</span>
          <span>/</span>
          <span>{{ questionDetial.length }}</span>
          <span>)</span>
        </div>
        <div class="content">
          <!-- 题干 -->
          <div>
            <span>{{ questionDetial.index+1 }}</span>
            <span>.</span>
            <span class="ql-container ql-snow">
                <span class="ql-editor" v-html="questionDetial.content_html" />
            </span>
            <span style="color:#0080ff">(分值：{{ questionDetial.point }}分)</span>
          </div>
          <div
            v-if="questionDetial.id"
            class="question_option"
          >
            <el-radio-group
              v-if="questionDetial.type !='多选题' && questionDetial.type !='Multiple choice'"
              v-model="questionDetial.user_answer[0]"
              size="medium"
              @change="handlerChange"
            >

              <el-radio
                v-for="(v,k,i) in questionDetial.option_html"
                :key="k+i"
                style="display:block;margin-bottom: 10px;"
                :label="k"
                :disabled="disableflag"
                :class="{
                  'answer-is-right':match.process==2&&questionDetial.user_answer.includes(k)&&questionDetial.status==1,
                  'answer-is-error':match.process==2&&questionDetial.user_answer.includes(k)&&questionDetial.status==0
                }"
              >
                <span>{{ k }}、</span>
                  <span class="ql-container ql-snow">
                    <span class="ql-editor" v-html="v" />
                  </span>
              </el-radio>

            <!--&lt;!&ndash; <el-radio-group v-model="choice_user_answer"> &ndash;&gt;-->
            <!--<el-radio-->
            <!--v-if="questionDetial.option_html.A"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="A"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>A、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.A" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-radio>-->
            <!--<el-radio-->
            <!--v-if="questionDetial.option_html.B"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="B"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>B、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.B" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-radio>-->
            <!--<el-radio-->
            <!--v-if="questionDetial.option_html.C"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="C"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>C、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.C" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-radio>-->
            <!--<el-radio-->
            <!--v-if="questionDetial.option_html.D"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="D"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>D、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.D" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-radio>-->
            <!--<el-radio-->
            <!--v-if="questionDetial.option_html.E"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="E"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>E、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.E" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-radio>-->
            <!--<el-radio-->
            <!--v-if="questionDetial.option_html.F"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="F"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>F、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.F" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-radio>-->
            </el-radio-group>

            <el-checkbox-group
              v-if="questionDetial.type =='多选题' || questionDetial.type =='Multiple choice'"
              v-model="questionDetial.user_answer"
              size="medium"
              @change="handlerChange"
            >
              <el-checkbox
                v-for="(v,k,i) in questionDetial.option_html"
                :key="k+i"
                style="display:block;margin-bottom: 10px;"
                :label="k"
                :disabled="disableflag"
                :class="{
                  'answer-is-right':match.process==2&&questionDetial.user_answer.includes(k)&&questionDetial.status==1,
                  'answer-is-error':match.process==2&&questionDetial.user_answer.includes(k)&&questionDetial.status==0
                }"
              >
                <span>{{ k }}、</span>
                <span>
                  <div class="ql-container ql-snow">
                    <div class="ql-editor" v-html="v" />
                  </div>
                </span>
              </el-checkbox>

            <!--<el-checkbox-->
            <!--v-if="questionDetial.option_html.A"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="A"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>A、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.A" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-checkbox>-->

            <!--<el-checkbox-->
            <!--v-if="questionDetial.option_html.B"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="B"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>B、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.B" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-checkbox>-->
            <!--<el-checkbox-->
            <!--v-if="questionDetial.option_html.C"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="C"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>C、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.C" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-checkbox>-->
            <!--<el-checkbox-->
            <!--v-if="questionDetial.option_html.D"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="D"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>D、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.D" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-checkbox>-->
            <!--<el-checkbox-->
            <!--v-if="questionDetial.option_html.E"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="E"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>E、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.E" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-checkbox>-->
            <!--<el-checkbox-->
            <!--v-if="questionDetial.option_html.F"-->
            <!--style="display:block;margin-bottom: 10px;"-->
            <!--label="F"-->
            <!--:disabled="disableflag"-->
            <!--&gt;-->
            <!--<span>F、</span>-->
            <!--<span>-->
            <!--<div class="ql-container ql-snow">-->
            <!--<div class="ql-editor" v-html="questionDetial.option_html.F" />-->
            <!--</div>-->
            <!--</span>-->
            <!--</el-checkbox>-->
            </el-checkbox-group>
            <div class="topicSwitching">
              <!-- 上一题 -->
              <el-button
                v-if="proBtnShow"
                type="primary"
                size="mini"
                @click="topicSwitching(1)"
              >{{ $t('ad5.theory.prev_task') }}
              </el-button>
              <!-- 下一题 -->
              <el-button
                v-if="nextBtnShow"
                type="primary"
                size="mini"
                @click="topicSwitching(2)"
              >{{ $t('ad5.theory.next_task') }}
              </el-button>
            </div>
            <div
              v-if="disableflag&&match.is_review_shows"
              class="rightKey"
            >
              正确答案：{{ questionDetial.rightKey }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有题目时显示图片 -->
    <div v-else style="text-align: center;margin-top: 20px;">
      <img src="@/assets/jad/context_gif.gif" alt>
    </div>

    <!-- 手动交卷提示弹框 -->
    <el-dialog
      class="my-dialog"
      width="600px"
      :title="$t('ad5.theory.confirm_submit')"
      :visible.sync="showPushPaper"
    >
      <div class="tips_info">
        <span v-if="language=='zh'">
          您好 <span class="user">{{ user.nickname }}</span>，
          <span v-if="undo_num!==0">您还有<span> {{ undo_num }} </span>道题目未答，</span>确定现在交卷吗？
        </span>

        <span v-else>
          Hello <span class="user">{{ user.nickname }}</span>，
          <span v-if="undo_num!==0">you have <span> {{ undo_num }} </span>questions to answer.</span> Are you sure you want to hand in the paper now?
        </span>
      </div>
      <div class="submit_tips">
        <!--确定-->
        <el-button
          class="confirm_btn"
          type="primary"
          @click="manual_submit"
        >{{ $t('modal.confirm') }}
        </el-button>
        <!--继续答题-->
        <el-button
          type="primary"
          @click="showPushPaper = false"
        >{{ $t('ad5.theory.continue_todo') }}
        </el-button>
      </div>
    </el-dialog>
    <!--交卷成功提示弹框 -->
    <el-dialog
      class="my-dialog"
      width="600px"
      :title="examinationEnd ? $t('ad5.theory.jiaojuan_success') : $t('ad5.theory.theory_over')"
      :visible.sync="submit_success_visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="tips_info">

        <!--手动提交显示信息-->
        <span v-if="examinationEnd">
          <span class="tips_inner">
            <span v-if="language=='zh'">
              您的理论考试交卷成功！
            </span>
            <span v-else>
              your theory test has been handed in successfully！
            </span>
          </span>
          <!--您的成绩为xx分-->
          <span
            v-if="user_score>=0&&match.is_show_score"
            class="show_grade"
          >
            {{ $t('ad5.theory.yourScore') }}<span
              style="font-size:30px;"
            >{{ user_score }}{{ $t('ad5.theory.score') }}</span>
          </span>
        </span>

        <!--自动提交显示信息-->
        <span v-else>
          <span class="tips_inner">
            <span v-if="language=='zh'">
              考试时间结束已为您自动交卷成功！
            </span>
            <span v-else>
              the examination time has ended and the paper has been handed in automatically for you.
            </span>
          </span>

          <!-- <div
            style="margin-top:6px;"
            v-if="user_notdo!==0"
          >
            <span v-if="$i18n.locale=='CN'">
              您当前有 {{user_notdo}} 道题目漏答
            </span>
            <span v-else>
              You have {{user_notdo}} questions left unanswered
            </span>
          </div> -->
          <span
            v-if="user_score>=0&&match.is_show_score"
            class="show_grade"
          >
            {{ $t('ad5.theory.yourScore') }}<span
              style="font-size:30px;"
            >{{ user_score }}{{ $t('ad5.theory.score') }}</span>
          </span>
        </span>
      </div>
      <div class="submit_tips">
        <router-link
          to="/match/taskList"
          style="color:#fff;"
        >
          <el-button type="primary">
            {{ $t('modal.confirm') }}
          </el-button>
        </router-link>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  challenge_data,
  pushAnswer,
  task_num,
  submitPaper
} from '@/api/theory'
import { mapGetters } from 'vuex'

export default {
  name: 'TaskCard',
  components: {},
  data() {
    return {
      queryList: {
        id: this.$route.query.id,
        hash: this.$route.query.hash,
        type: this.$route.query.type
      },
      questionData: {
        is_submit: false,
        // {1: "单选题", 2: "多选题", 3: "判断题"}
        choice_type: {},
        // 单选题数据
        singleChoice: [],
        // 多选题数据
        moreChoice: [],
        // 判断题数据
        judge: []
      },
      questionDetial: {},
      // 选中选项题目id
      isChoiceId: '',
      choice_user_answer: '',
      proBtnShow: false,
      nextBtnShow: true,
      // 未解答题目数量
      undo_num: '',
      showPushPaper: false,
      language: localStorage.getItem('lang'),
      user_score: 0, // 选手得分
      submit_success_visible: false,
      examinationEnd: false, // 自动交卷
      allQuesitionList: [],
      disableflag: false // 回顾时置灰按钮
    }
  },
  computed: {
    ...mapGetters(['match', 'user', 'team'])
  },
  watch: {
    questionDetial: {
      handler: function() {
        // let loop = 0;
        for (let index = 0; index < this.allQuesitionList.length; index++) {
          if (this.allQuesitionList[index].id == this.questionDetial.id) {
            if (index == 0) {
              this.proBtnShow = false
              this.nextBtnShow = true
            } else if (index == this.allQuesitionList.length - 1) {
              this.proBtnShow = true
              this.nextBtnShow = false
            } else {
              this.proBtnShow = true
              this.nextBtnShow = true
            }
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.getTask()
  },
  methods: {
    // 请求理论赛 赛题数据 并将之设置未想要的格式
    getTask() {
      challenge_data(this.queryList.hash).then(res => {
        this.questionData.choice_type = res.data.choice_type
        this.questionData.is_submit = res.data.is_submit
        if (res.data.task[1]) {
          this.questionData.singleChoice = res.data.task[1]
          for (
            let index = 0;
            index < this.questionData.singleChoice.length;
            index++
          ) {
            this.questionData.singleChoice[
              index
            ].length = this.questionData.singleChoice.length
            this.questionData.singleChoice[index].index = index
            if (this.language == 'en') {
              this.questionData.singleChoice[index].type = 'Single choice'
            } else {
              this.questionData.singleChoice[index].type = '单选题'
            }

            let num = index + 1
            if (num < 10) {
              num = '0' + num
            }
            this.questionData.singleChoice[index].num = num
            this.questionData.singleChoice[index].rightKey = JSON.stringify(
              this.questionData.singleChoice[index].answer
            )
          }
        }
        if (res.data.task[2]) {
          this.questionData.moreChoice = res.data.task[2]
          for (
            let index = 0;
            index < this.questionData.moreChoice.length;
            index++
          ) {
            this.questionData.moreChoice[
              index
            ].length = this.questionData.moreChoice.length
            this.questionData.moreChoice[index].index = index
            if (this.language == 'en') {
              this.questionData.moreChoice[index].type = 'Multiple choice'
            } else {
              this.questionData.moreChoice[index].type = '多选题'
            }
            let num = index + 1
            if (num < 10) {
              num = '0' + num
            }
            this.questionData.moreChoice[index].num = num
            this.questionData.moreChoice[index].rightKey = JSON.stringify(
              this.questionData.moreChoice[index].answer
            )
          }
        }
        if (res.data.task[3]) {
          this.questionData.judge = res.data.task[3]
          for (let index = 0; index < this.questionData.judge.length; index++) {
            this.questionData.judge[
              index
            ].length = this.questionData.judge.length
            this.questionData.judge[index].index = index
            if (this.language == 'en') {
              this.questionData.judge[index].type = 'Judge questions'
            } else {
              this.questionData.judge[index].type = '判断题'
            }
            let num = index + 1
            if (num < 10) {
              num = '0' + num
            }
            this.questionData.judge[index].num = num
            this.questionData.judge[index].rightKey = JSON.stringify(
              this.questionData.judge[index].answer
            )
          }
        }
        this.init_quesition_detial()
        if (this.match.process == 2) {
          this.disableflag = true
        } else {
          this.$EventBus.$on('IntervalTimeOut', () => {
            this.submitPaperPost(2)
          })
        }
      })
    },
    // 赛题左侧点击事件
    handlerChoice(val) {
      // 切换选中状态
      this.isChoiceId = val.id
      this.questionDetial = val
      // this.topicSwitching(3);
    },
    // 初始赛题详情处理 总体数据处理
    init_quesition_detial() {
      if (this.questionData.singleChoice.length) {
        this.allQuesitionList = this.allQuesitionList.concat(
          this.questionData.singleChoice
        )
      }
      if (this.questionData.moreChoice.length) {
        this.allQuesitionList = this.allQuesitionList.concat(
          this.questionData.moreChoice
        )
      }
      if (this.questionData.judge.length) {
        this.allQuesitionList = this.allQuesitionList.concat(
          this.questionData.judge
        )
      }
      this.handlerChoice(this.allQuesitionList[0])
    },
    // 选项切换事件
    handlerChange() {
      this.pushOneQuesitionAnswer()
    },
    // 提交单个题目的答案
    pushOneQuesitionAnswer() {
      pushAnswer(this.queryList.hash, {
        task_id: this.questionDetial.id,
        answer: JSON.stringify(this.questionDetial.user_answer)
      }).then(res => {
      })
    },
    // 题目切换（点击上一题,下一题,上一题为1下一题为2）
    topicSwitching(val) {
      let loop = 0
      for (let index = 0; index < this.allQuesitionList.length; index++) {
        if (this.allQuesitionList[index].id == this.questionDetial.id) {
          loop = index
        }
      }

      if (val === 1) {
        this.handlerChoice(this.allQuesitionList[loop - 1])
      } else {
        // 点击了下一题
        this.handlerChoice(this.allQuesitionList[loop + 1])
      }
    },
    // 点击交卷按钮
    handInPapers() {
      this.no_answer_number()
    },
    // 未答题目数量
    no_answer_number() {
      task_num({ evt: this.queryList.hash }).then(res => {
        this.showPushPaper = true
        this.undo_num = res.data.message.undo_num
      })
    },
    // 手动点击确定按钮交卷
    manual_submit() {
      this.submitPaperPost(1)
    },
    // 交卷事件
    submitPaperPost(val) {
      if (val == 1) {
        // 手动交卷
        this.examinationEnd = true
        submitPaper({ hash: this.queryList.hash }).then(res => {
          this.user_score = res.data.message.data
          this.submit_success_visible = true
          setTimeout(() => {
            this.$router.push({
              path: '/match/taskList' // 跳竞赛列表页
            })
          }, 3000)
        })
      } else {
        // 自动交卷;
        this.examinationEnd = false
        submitPaper({ hash: this.queryList.hash }).then(res => {
          this.user_score = res.data.message.data
          this.submit_success_visible = true
          setTimeout(() => {
            this.$router.push({
              path: '/match/taskList' // 跳竞赛列表页
            })
          }, 3000)
        })
      }
    }
  }
}
</script>

<style lang="scss" scope>
  .tui-editor-contents {
    display: inline;

    p {
      word-wrap: break-word;
      word-break: break-all;
      display: inline;
    }
  }

  #taskCardMain {
    height: 100%;

    .task_list {
      .common {
        .content {
          .isAnswer {
            background: #0080ff;
            color: #fff;
          }

          .right {
            background: #67c33e;
            color: #fff;
          }

          .unright {
            background: #f66c6c;
            color: #fff;
          }

          .noanswer {
            background: rgb(87, 91, 128);
            color: #fff;
          }

          .isChoice:before {
            content: "";
            position: absolute;
            clear: both;
            width: 38px;
            height: 38px;
            left: -4px;
            top: -4px;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABZUlEQVRYhe2Yu07DMBhGTy7dKvUFeAUuXniYdutM1YHsFZ2zRDB3Kw/DYqm8AuwgsYUAcvUbTMLiKiSp5LMksZX4xPljyV90cf2OMAWWgAJG/OYROKu1HcoOOK3dWwIaKHSe3JuGWDpugS1w+YdUF4xk7K3KKuOCmbGpSH0AN8AGeKvJvAKfLQlGwKTWNgbmwEoma5bK50Ok1o3HtI95wRf7VJ0nyPVaZZX1WMZSU8hM9Y11ULFTU08DEHuW4yhudPWIzpPvOh6UmIsrFjV6eySVxXNI7H3SFlf0VtB5svc5ihobFEHMlyDmSxDzJYj5EsR8CWK+BDFfBiuWSpZgOG9xt30wKqt2VswGHBN3h9yTVGR9wr7Sl0GLlXI+bvR2jMqqExmxjCXJQ/KpvrEO2vyVhQR3K2ncdJ38yEzNHYfCZrAmXrxq3PHDf2ewLnc6Txa2+BcmXgQenJrrEjOmGXtmpAC+AIoDTJHiGsDRAAAAAElFTkSuQmCC) no-repeat;
            background-size: 100% 100%;
            color: #fff;
          }
        }
      }
    }
  }

  .taskCardContainer {
    width: 100%;
    margin: 0 auto;

    .ql-container, .ql-editor {
      display: inline;

      p {
        display: inline;
      }
    }

    .task_list {
      float: left;
      width: 25%;
      color: #fff;

      .singleChoice {
        .header {
          width: 100%;
          height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgb(39, 42, 73);

          .title {
            font-size: 16px;
            height: 25px;
            line-height: 25px;
            padding: 0 4px;
            color: #fff;
          }

          .answered {
            color: #fff;
            font-size: 14px;

            .num {
              float: left;
              width: 15px;
              height: 18px;
              border: 1px solid rgb(0, 128, 255);
              background: rgb(0, 128, 255);
            }

            .status {
              float: right;
              border: 1px solid rgb(0, 128, 255);
              padding: 0 8px;
            }
          }

          .unanswered {
            font-size: 14px;
            color: #fff;

            .num {
              float: left;
              width: 15px;
              height: 18px;
              border: 1px solid rgb(87, 91, 128);
              background: rgb(87, 91, 128);
            }

            .status {
              float: right;
              border: 1px solid rgb(87, 91, 128);
              padding: 0 8px;
            }
          }
        }

        .content {
          padding: 10px;
          background: rgb(27, 31, 60);
        }
      }

      .multipleChoice {
        margin-top: 30px;

        .header {
          width: 100%;
          height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgb(39, 42, 73);

          .title {
            font-size: 16px;
            height: 25px;
            line-height: 25px;
            padding: 0 4px;
            color: #fff;
          }

          .answered {
            color: #fff;
            font-size: 14px;

            .num {
              float: left;
              width: 15px;
              height: 18px;
              border: 1px solid rgb(0, 128, 255);
              background: rgb(0, 128, 255);
            }

            .status {
              float: right;
              border: 1px solid rgb(0, 128, 255);
              padding: 0 8px;
            }
          }

          .unanswered {
            font-size: 14px;
            color: #fff;

            .num {
              float: left;
              width: 15px;
              height: 18px;
              border: 1px solid rgb(87, 91, 128);
              background: rgb(87, 91, 128);
            }

            .status {
              float: right;
              border: 1px solid rgb(87, 91, 128);
              padding: 0 8px;
            }
          }
        }

        .content {
          padding: 10px;
          background: rgb(27, 31, 60);
        }
      }

      .judge {
        margin-top: 30px;

        .header {
          width: 100%;
          height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgb(39, 42, 73);

          .title {
            font-size: 16px;
            height: 25px;
            line-height: 25px;
            padding: 0 4px;
            color: #fff;
          }

          .answered {
            color: #fff;
            font-size: 14px;

            .num {
              float: left;
              width: 15px;
              height: 18px;
              border: 1px solid rgb(0, 128, 255);
              background: rgb(0, 128, 255);
            }

            .status {
              float: right;
              border: 1px solid rgb(0, 128, 255);
              padding: 0 8px;
            }
          }

          .unanswered {
            font-size: 14px;
            color: #fff;

            .num {
              float: left;
              width: 15px;
              height: 18px;
              border: 1px solid rgb(87, 91, 128);
              background: rgb(87, 91, 128);
            }

            .status {
              float: right;
              border: 1px solid rgb(87, 91, 128);
              padding: 0 8px;
            }
          }
        }

        .content {
          padding: 10px;
          background: rgb(27, 31, 60);
        }
      }

      .common {
        .questionNumber {
          height: 30px;
          width: 30px;
          line-height: 30px;
          background: #272a49;
          color: #bdbcca;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 10px;
          border-radius: 3px;
          position: relative;
        }
      }
    }

    .task_detial {
      float: right;
      width: 73%;
      height: 100%;
      color: #fff;

      .header {
        width: 100%;
        height: 36px;
        line-height: 36px;
        background: rgb(39, 42, 73);
        font-size: 16px;
        color: #fff;
        padding-left: 11px;
        border-radius: 4px;
      }

      .content {
        position: relative;
        width: 100%;
        min-height: 60vh;
        margin-bottom: 20px;
        overflow-y: auto;
        padding: 40px;
        background: rgb(27, 31, 60);

        .question_option {
          margin-top: 30px;
        }

        .topicSwitching {
          position: absolute;
          bottom: 10px;
          right: 5px;
          float: right;
        }

        .rightKey {
          padding: 5px 10px;
          background: #272a49;
          font-size: 16px;
          border-radius: 4px;
          color: #67c23a;
          line-height: 36px;
          padding-left: 13px;
          position: absolute;
          bottom: 50px;
          left: 30px;
        }
      }
    }
  }

  .tips_info {
    font-size: 16px;
    padding: 20px 0 45px;
    text-align: center;

    .tips_inner {
      width: 100%;
      display: inline-block;

      .user {
        color: lightblue;

        .show_grade {
          padding: 10px 30px;
          background: lightblue;
          border-radius: 30px;
          display: inline-block;
          margin-top: 20px;

          span {
            vertical-align: -5px;
            font-style: italic;
          }
        }
      }
    }
  }

  .submit_tips {
    text-align: center;
  }

  .answereRight {
    font-size: 14px;
    color: #fff;

    .num {
      float: left;
      width: 15px;
      height: 18px;
      border: 1px solid #67c33e;
      background: #67c33e;
    }

    .status {
      float: right;
      border: 1px solid rgb(87, 91, 128);
      padding: 0 8px;
    }
  }

  .answereError {
    font-size: 14px;
    color: #fff;

    .num {
      float: left;
      width: 15px;
      height: 18px;
      border: 1px solid #f66c6c;
      background: #f66c6c;
    }

    .status {
      float: right;
      border: 1px solid rgb(87, 91, 128);
      padding: 0 8px;
    }
  }

  .noanswere {
    font-size: 14px;
    color: #fff;

    .num {
      float: left;
      width: 15px;
      height: 18px;
      border: 1px solid rgb(87, 91, 128);
      background: rgb(87, 91, 128);
    }

    .status {
      float: right;
      border: 1px solid rgb(87, 91, 128);
      padding: 0 8px;
    }
  }
</style>
<style lang="scss">
#taskCardMain{
  .answer-is-right.is-checked {
    .el-radio__inner, .el-checkbox__inner {
      background-color: #67c33e;
      border-color: #67c33e;
    }

    .el-radio__inner {
      &:after {
        background-color: #fff;
      }
    }

    .el-checkbox__inner {
      &:after {
        border-width: 2px;
        border-color: #fff;
      }
    }
    .el-radio__label, .el-checkbox__label,.ql-editor{
      color: #67c33e;
    }
  }
  .answer-is-error.is-checked{
    .el-radio__inner, .el-checkbox__inner{
      background-color: #f66c6c ;
      border-color: #f66c6c ;
    }
    .el-radio__inner{
      &:after{
        background-color: #fff ;
      }
    }
    .el-checkbox__inner{
      &:after{
        border-width: 2px ;
        border-color: #fff ;
      }
    }
    .el-radio__label, .el-checkbox__label,.ql-editor{
      color: #f66c6c;
    }
  }
}

</style>
