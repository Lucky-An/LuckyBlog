<template>
  <div
    class="guide_wrap"
    style="padding:0;"
  >
    <div
      class="no_sub"
      v-if="!only_task.length"
    >
      <img
        src="@/assets/img/context_gif.gif"
        alt
      />
    </div>
    <div
      v-else
      class="task_content clearfix"
    >
      <el-button
        type="primary"
        size="medium"
        slot="theory_btn"
        v-if="match_data.process==0&&!init_task_list.is_submit"
        @click="tosubmitPaper"
        class="theory_btn"
      >{{$t('ad5.theory.jiaojuan')}}</el-button>
      <div class="task_list">
        <panelBox
          :title="oneTaskType.task_type"
          :small_title="true"
          style="margin-bottom:20px;"
          v-for="(oneTaskType,listIndex) in only_task"
        >
          <div
            slot="other_button"
            class="label_legend"
            v-if="listIndex==0"
          >
            <span
              class="right_legend"
              v-if="match_data.process==2&&match_data.is_review_shows"
            >{{$t('ad5.theory.right')}}</span>
            <span
              class="error_legend"
              v-if="match_data.process==2&&match_data.is_review_shows"
            >{{$t('ad5.theory.error')}}</span>
            <span class="now_legend">{{$t('ad5.theory.now')}}</span>
            <span
              class="do_legend"
              v-if="!(match_data.process==2&&match_data.is_review_shows)"
            >{{$t('ad5.theory.do')}}</span>
            <span class="notDo_legend">{{$t('ad5.theory.notDo')}}</span>
          </div>
          <div slot="content_begin">
            <div class="task_box_wrap">
              <span
                class="taskItem"
                :class="{
                      'is_choice':item.user_answer&&item.user_answer.length,
                      'is_right':item.status==1,
                      'is_error':item.status==2,
                      'is_checked':item.id==now_todo_task.id,
                    }"
                @click="showItemTask(item,listIndex,index)"
                v-for="(item,index) in oneTaskType.task"
              >
                {{index+1<10 ? '0'+(index+1) : index+1}}
              </span>
            </div>
          </div>
        </panelBox>
      </div>
      <div class="task_choice">
        <panelBox
          :title="init_task_list.choice_type[now_todo_task.type_id]"
          :small_title="true"
        >
          <div
            slot="content_begin"
            class="choice_inner"
          >
            <span class="index_txt">(<span class="highlightBlue">{{task_index+1}}</span>/{{init_task_list.task[now_todo_task.type_id].length}})</span>
            <div class="choice_main">
              <div class="task_trunk">
                <span class="trunk_text"><span v-html="now_todo_task.content_html"></span></span>
                <a
                  :href="now_todo_task.file"
                  class="task_attachment"
                  v-if="now_todo_task.file"
                >{{$t('attack.question_board.download_file')}}</a>
              </div>
              <div class="task_choice_list">
                <span v-if="now_todo_task.type_id==1||now_todo_task.type_id==3">
                  <el-radio
                    v-model="now_todo_task.user_answer[0]"
                    :label="key"
                    @change="submit_answer(now_todo_task)"
                    v-for="(value,key) in (now_todo_task.option_html)"
                    :disabled="init_task_list.is_submit"
                    :class="{
                          'panduan':now_todo_task.type_id==3,
                          'answer-is-right':match_data.process==2&&now_todo_task.user_answer[0]==key&&now_todo_task.status==1,
                          'answer-is-error':match_data.process==2&&now_todo_task.user_answer[0]==key&&now_todo_task.status==2
                         }"
                  ><span
                      v-if="now_todo_task.type_id==1"
                      class="inline_style1"
                    >{{key + '、'}}</span><span
                      v-html="value"
                      class="inline_style"
                    ></span>
                  </el-radio>
                </span>
                <el-checkbox-group
                  v-model="now_todo_task.user_answer"
                  @change="submit_answer(now_todo_task)"
                  v-if="now_todo_task.type_id==2"
                >
                  <el-checkbox
                    :label="key"
                    v-for="(value,key) in (now_todo_task.option_html)"
                    :disabled="init_task_list.is_submit"
                    :class="{
                          'answer-is-right':match_data.process==2&&now_todo_task.user_answer.includes(key)&&now_todo_task.status==1,
                          'answer-is-error':match_data.process==2&&now_todo_task.user_answer.includes(key)&&now_todo_task.status==2
                         }"
                  >
                    <span class="inline_style1">{{key + '、'}}</span><span
                      v-html="value"
                      class="inline_style"
                    ></span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="choice_handle_main">
              <div
                class="answer_content"
                v-if="match_data.process==2&&match_data.is_review_shows&&now_todo_task.answer"
              >
                {{$t('ad5.theory.rightAnswer')}}
                <span v-if="now_todo_task.type_id==3">{{now_todo_task.option_html[now_todo_task.answer[0]].replace(/<[^>]+>/g,"")}}</span>
                <span v-else>{{now_todo_task.answer.join()}}</span>
              </div>
              <div class="change_task">
                <el-button
                  type="primary"
                  size="medium"
                  class="prev_task"
                  v-if="!(li_index==0&&task_index==0)"
                  @click="changeTask(1)"
                >{{$t('ad5.theory.prev_task')}}</el-button>
                <el-button
                  type="primary"
                  size="medium"
                  class="next_task"
                  @click="changeTask(0)"
                  v-if="!(li_index==only_task.length-1&&task_index==only_task[li_index].task.length-1)"
                >{{$t('ad5.theory.next_task')}}</el-button>
              </div>
            </div>
          </div>
        </panelBox>
      </div>
    </div>
    <!--手动交卷前提示弹框 -->
    <el-dialog
      class="my-dialog"
      width="600px"
      :title="$t('ad5.theory.confirm_submit')"
      :visible.sync="submit_tip_visible"
    >
      <div class="tips_info">
        <span v-if="$i18n.locale=='CN'">
          您好 <span class="user">{{userInformation.nickname}}</span>，<span v-if="task_number!==0">您还有<span> {{task_number}} </span>道题目未答，</span>确定现在交卷吗？
        </span>
        <span v-else>
          Hello <span class="user">{{userInformation.nickname}}</span>，<span v-if="task_number!==0">you have <span> {{task_number}} </span>questions to answer.</span> Are you sure you want to hand in the paper now?
        </span>
      </div>
      <div class="submit_tips">
        <button
          class="confirm_btn"
          @click="manual_submit"
        >{{$t('modal.confirm')}}</button>
        <button
          class="cancel_btn"
          @click="submit_tip_visible=false"
        >{{$t('ad5.theory.continue_todo')}}</button>
      </div>
    </el-dialog>
    <!--交卷成功提示弹框 -->
    <el-dialog
      class="my-dialog"
      width="600px"
      :title="manual ? $t('ad5.theory.jiaojuan_success') : $t('ad5.theory.theory_over')"
      :visible.sync="submit_success_visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="tips_info">
        <!--手动提交显示信息-->
        <span v-if="manual">
          <span class="tips_inner">
            <span v-if="$i18n.locale=='CN'">
              您好，<span class="user">{{userInformation.nickname}}</span>，您的理论考试交卷成功！
            </span>
            <span v-else>
              Hello，<span class="user">{{userInformation.nickname}}</span>，your theory test has been handed in successfully！
            </span>
          </span>
          <span
            class="show_grade"
            v-if="match_data.is_show_score"
          >
            {{$t('ad5.theory.yourScore')}}<span style="font-size:30px;">{{user_score}}{{$t('ad5.theory.score')}}</span>
          </span>
        </span>
        <!--自动提交显示信息-->
        <span v-else>
          <span class="tips_inner">
            <span v-if="$i18n.locale=='CN'">
              您好，<span class="user">{{userInformation.nickname}}</span>，考试时间结束已为您自动交卷成功！
            </span>
            <span v-else>
              Hello，<span class="user">{{userInformation.nickname}}</span>，the examination time has ended and the paper has been handed in automatically for you.
            </span>
          </span>

          <div
            style="margin-top:6px;"
            v-if="user_notdo!==0"
          >
            <span v-if="$i18n.locale=='CN'">
              您当前有 {{user_notdo}} 道题目漏答
            </span>
            <span v-else>
              You have {{user_notdo}} questions left unanswered
            </span>
          </div>
          <span
            class="show_grade"
            v-if="match_data.is_show_score"
          >
            {{$t('ad5.theory.yourScore')}}<span style="font-size:30px;">{{user_score}}{{$t('ad5.theory.score')}}</span>
          </span>
        </span>
      </div>
      <div class="submit_tips">
        <button class="confirm_btn">
          <router-link
            to="/competition"
            style="color:#fff;"
          >{{$t('modal.confirm')}}</router-link>
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import panelBox from "../../common/small_part/panelBox";
const { mapState, mapMutations } = createNamespacedHelpers("match");
import {
  matchStatus,
  challenge_data,
  pushAnswer,
  submitPaper,
  task_num
} from "@/api/competitionMode/theoryMode";

export default {
  name: "question_board",
  components: {
    panelBox
  },
  data() {
    return {
      matchInfo: {},
      event_id: this.$route.query.hash,
      // event_id:'93ef6dc8-becc-40a3-9a05-d8dc93a50811.event',
      submit_success_visible: false,
      submit_tip_visible: false,
      user_current_answer: [],
      init_task_list: {
        is_submit: true
      }, //初始化请求题目数据
      now_todo_task: {},
      only_task: [],
      li_index: 0,
      task_index: 0,
      task_number: 0, //没做题目数量
      manual: false, //记录是否是手动交卷
      user_score: 0,
      user_notdo: 0
    };
  },
  created() {
    this.getTask();
    //this.getMatchInfo();
  },
  computed: {
    ...mapState(["match_data", "userInformation"])
  },
  watch: {
    match_data(newVal, old) {
      if (newVal.process == 2 && !this.init_task_list.is_submit) {
        this.confirm_submit();
      }
    }
  },
  methods: {
    ...mapMutations(["setData"]),
    getTask() {
      //初始化获取所有题目数据
      challenge_data(this.event_id).then(res => {
        this.init_task_list = res.data;
        //默认显示第一道题目
        for (var attr in this.init_task_list.task) {
          this.init_task_list.task[attr].forEach((item, index) => {
            //每个题目中添加一个题目类型type_id
            item.type_id = attr;
            // console.log(img_group,'dddd')
            //let img_group = $('.trunk_text .tui-editor-contents').find('img');
            // if(img_group.length){
            //   console.log(img_group,';;;;')
            //   img_group.each((index,item)=>{
            //     let url = $(item).attr('src');
            //     console.log(url,'url')
            //     $(item).replaceWith(`
            //           <el-image
            //             style="width: 100px; height: 100px"
            //             src="${url}"
            //             preview-src-list="${url}">
            //           </el-image>
            //     `)
            //   })
            // }
            // let img_group = item.content_html.replace(/<img/g, "<el-image")
            // console.log(img_group,'fff')
            item.content_html = index + 1 + ". " + item.content_html;
          });
          this.only_task.push({
            //生成自己想要的格式
            type_id: attr,
            task_type: this.init_task_list.choice_type[attr],
            task: this.init_task_list.task[attr]
          });
        }
        //默认显示第一个题目为当前正在做题目
        this.change_doing_task(
          this.only_task[0].task[0],
          this.only_task[0].task[0].user_answer
        );
      });
    },
    changeTask(n) {
      //点击上一题、下一题
      let taskLength = this.only_task[this.li_index].task.length - 1;
      if (n) {
        //上一题
        if (this.task_index) {
          this.task_index--;
        } else {
          this.li_index--;
          this.task_index = this.only_task[this.li_index].task.length - 1;
        }
      } else {
        //下一题
        if (this.task_index == taskLength) {
          this.li_index++;
          this.task_index = 0;
        } else {
          this.task_index++;
        }
      }
      this.change_doing_task(
        this.only_task[this.li_index].task[this.task_index],
        this.now_todo_task.user_answer
      );
    },
    change_doing_task(targetTask, targetAnswer) {
      //更新正在做的题目数据，并且把更新后的答案存起来以后做对比
      this.now_todo_task = targetTask; //切换当前做的题目
      this.user_current_answer = JSON.parse(JSON.stringify(targetAnswer)); //获取当前答案，提交时候做对比
      setTimeout(() => {
        this.insertNode();
      }, 0);
    },
    submit_answer(item) {
      //提交当前题目答案
      pushAnswer(this.event_id, {
        task_id: item.id,
        answer: JSON.stringify(item.user_answer)
      }).then(res => {});
    },
    showItemTask(item, pIndex, index) {
      //点击左侧题目
      this.change_doing_task(item, item.user_answer); //当前做的题目数据赋值为点击题目的数据。
      this.li_index = pIndex; //获取当前题目在only_task的一层索引；
      this.task_index = index; //获取当前题目在only_task中的task里面的索引。
    },
    no_answer_number() {
      //获取未做题目数量
      task_num({
        hash: this.event_id
      }).then(res => {
        this.task_number = res.data.message.undo_num;
        this.submit_tip_visible = true;
      });
    },
    tosubmitPaper() {
      //点击交卷按钮
      this.no_answer_number();
    },
    manual_submit() {
      //手动点击确定按钮交卷
      this.manual = true;
      this.confirm_submit();
    },
    confirm_submit() {
      //交卷事件
      submitPaper({
        hash: this.event_id
      }).then(res => {
        if (res.data.success) {
          this.init_task_list.is_submit = true;
          this.user_notdo = res.data.message.undo_num;
          this.user_score = res.data.message.data;
          this.submit_success_visible = true;
          setTimeout(() => {
            this.$router.push({
              path: "/competition" //跳竞赛列表页
            });
          }, 3000);
        }
      });
    },
    getMatchInfo() {
      //请求比赛信息接口
      //因为存储vuex是异步的,不知道什么时候请求完成，所以现在这个页面请求一次。
      matchStatus(this.event_id)
        .then(res => {
          let { data } = res;
          this.matchInfo = data;
        })
        .catch(error => {});
    },
    insertNode() {
      if ($(".trunk_text .tui-editor-contents").find(".highlight").length) {
        return;
      }
      let nodes = $(".trunk_text .tui-editor-contents")
        .children()
        .eq($(".trunk_text .tui-editor-contents").children().length - 1);
      if (nodes[0].tagName.toLowerCase() == "img") {
        $(".trunk_text .tui-editor-contents").append(
          `<span class="highlight" style="margin-left:0!important">(${this.$t(
            "ad5.theory.score2"
          )}：${this.now_todo_task.point}${this.$t("ad5.theory.score")})</span>`
        );
      } else {
        nodes.append(
          `<span class="highlight">(${this.$t("ad5.theory.score2")}：${
            this.now_todo_task.point
          } ${this.$t("ad5.theory.score")})</span>`
        );
      }
    }
  },
  mounted() {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
rightColor = #67c33e
errorColor = #f66c6c
.el-radio, .el-checkbox
  white-space: normal !important
.label_legend
  width: calc(100% - 70px)
  float: right
  text-align: right
  .right_legend, .error_legend, .now_legend, .do_legend, .notDo_legend
    font-size: 14px
    margin-right: 10px
    &:before
      content: ''
      display: inline-block
      clear: both
      width: 14px
      height: 14px
      vertical-align: -2px
      margin-right: 4px
  .right_legend
    color: rightColor
    &:before
      border-radius: 2px
      background: rightColor
  .error_legend
    color: errorColor
    &:before
      border-radius: 2px
      background: errorColor
  .now_legend
    color: lightblue
    &:before
      border-radius: 2px
      background: url('~@/assets/img/ad5/theory/now.png') no-repeat
      background-size: 100% 100%
  .do_legend
    color: lightblue
    &:before
      border-radius: 2px
      background: lightblue
  .notDo_legend
    color: #575b80
    &:before
      border-radius: 2px
      background: #575b80
@import '~@/common/stylus/mixin.styl'
.task_content
  position: relative
  .theory_btn
    position: absolute
    right: 25px
    z-index: 1856
  .task_list
    width: 410px
    float: left
    .task_box_wrap
      padding: 10px
      text-align: left
      .taskItem
        width: 30px
        height: 30px
        display: inline-block
        color: #bdbcca
        border-radius: 3px
        line-height: 30px
        text-align: center
        margin-right: 10px
        margin-bottom: 10px
        background: #272a49
        font-weight: bold
        cursor: pointer
        font-size: 16px
        position: relative
        user-select: none
        &:nth-child(10n)
          margin-right: 0
      .is_choice
        background: lightblue
        color: #fff
      .is_checked
        &:before
          content: ''
          position: absolute
          clear: both
          width: 38px
          height: 38px
          left: -4px
          top: -4px
          background: url('~@/assets/img/ad5/theory/now.png') no-repeat
          background-size: 100% 100%
          color: #fff
      .is_right
        background: rightColor
        color: #fff
      .is_error
        background: errorColor
        color: #fff
  .task_choice
    width: calc(100% - 430px)
    float: right
    border-radius: 4px
    text-align: left
    position: relative
    .choice_inner
      padding: 40px
      position: relative
      .index_txt
        color: #fff
        font-size: 16px
        position: absolute
        left: 65px
        top: -26px
      .choice_main
        width: 100%
        height: calc(100% - 80px)
        overflow-y: auto
        .task_trunk
          color: #fff
          span
            font-size: 16px !important
          .task_attachment
            color: lightblue
            text-decoration: underline
            font-size: 16px
            font-style: italic
            margin-left: 14px
            margin-top: 6px
            display: inline-block
      .choice_handle_main
        width: 100%
        height: 36px
        padding: 0 40px
        position: absolute
        bottom: 40px
        left: 0
        .answer_content
          width: 200px
          background: #272a49
          font-size: 16px
          border-radius: 4px
          color: #67C23A
          line-height: 36px
          padding-left: 13px
        .change_task
          position: absolute
          right: 40px
          bottom: 0
          .prev_task, .next_task
            width: 100px
            height: 36px
            border-radius: 4px
          .prev_task
            background: #272a49 !important
            color: #a8afb9 !important
            border-color: #272a49 !important
.tips_info
  font-size: 16px
  padding: 20px 0 45px
  text-align: center
  .tips_inner
    width: 100%
    display: inline-block
  .user
    color: lightblue
  .show_grade
    padding: 10px 30px
    background: lightblue
    border-radius: 30px
    display: inline-block
    margin-top: 20px
    span
      vertical-align: -5px
      font-style: italic
@media (max-width: 1300px)
  .theory_btn
    top: -72px
  .choice_inner
    height: 484px
  .task_trunk
    margin-bottom: 20px
@media (min-width: 1300px) and (max-width: 1600px)
  .theory_btn
    top: -58px
  .choice_inner
    height: 544px
  .task_trunk
    margin-bottom: 25px
@media (min-width: 1600px)
  .theory_btn
    top: -72px
  .choice_inner
    height: 614px
  .task_trunk
    margin-bottom: 30px
</style>
<style lang="stylus" rel="stylesheet/stylus" >
.highlightBlue
  color: lightblue !important
.panduan
  .el-radio__label
    vertical-align: 1px
.trunk_text .tui-editor-contents .highlight
  color: lightblue !important
  display: inline-block !important
  margin-left: 10px !important
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner, .el-radio__input.is-disabled.is-checked .el-radio__inner
  background-color: lightblue
  border-color: lightblue
.el-checkbox__input.is-disabled.is-checked+span.el-checkbox__label, .el-radio__input.is-disabled.is-checked+span.el-radio__label
  color: lightblue
.el-radio__input.is-checked+.el-radio__label
  color: lightblue
.task_choice_list .is-checked .el-radio__label .tui-editor-contents *, .task_choice_list .is-checked .el-checkbox__label .tui-editor-contents *
  color: lightblue !important
.task_trunk
  .tui-editor-contents
    display: inline-block !important
    width: calc(100% - 40px)
    vertical-align: top
    margin-top: -4px
    *, p
      color: #fff
      margin: 0
    img
      max-width: 400px
      max-height: 200px
.task_choice_list
  .el-radio, .el-checkbox
    display: block
    color: #fff
    .tui-editor-contents
      display: inline-block !important
      *, p
        font-size: 16px
        color: #fff
        margin: 0
      img
        max-width: 180px
        max-height: 80px
    .el-radio__inner, .el-checkbox__inner
      width: 20px
      height: 20px
      background-color: rgba(0, 0, 0, 0)
      border-color: #585d85
      vertical-align: 3px
    .el-radio__inner
      &:after
        width: 8px
        height: 8px
    .el-checkbox__inner
      &:after
        width: 6px
        height: 10px
    .el-radio__label, .el-checkbox__label
      *
        font-size: 16px !important
  .is-checked
    .el-radio__inner, .el-checkbox__inner
      background-color: lightblue
      border-color: lightblue
.submit_tips
  text-align: center
  .confirm_btn, .cancel_btn
    width: 92px !important
    height: 40px !important
    font-size: 18px
  .cancel_btn
    background: #272a49 !important
    border-color: #272a49 !important
    color: #fff !important
@media (max-width: 1300px)
  .task_choice_list
    .el-radio, .el-checkbox
      margin-bottom: 20px
  .task_trunk
    .tui-editor-contents
      *, p
        font-size: 16px
@media (min-width: 1300px) and (max-width: 1600px)
  .task_choice_list
    .el-radio, .el-checkbox
      margin-bottom: 20px
  .task_trunk
    .tui-editor-contents
      *, p
        font-size: 16px
@media (min-width: 1600px)
  .task_choice_list
    .el-radio, .el-checkbox
      margin-bottom: 24px
  .task_trunk
    .tui-editor-contents
      *, p
        font-size: 16px
</style>
<style lang="stylus" rel="stylesheet/stylus">
rightColor = #67c33e
errorColor = #f66c6c
.answer-is-right.is-checked
  .el-radio__inner, .el-checkbox__inner
    background-color: rightColor !important
    border-color: rightColor !important
  .el-radio__inner
    &:after
      background-color: #fff !important
  .el-checkbox__inner
    &:after
      border-width: 2px !important
      border-color: #fff !important
  .el-radio__label, .el-checkbox__label
    color: rightColor !important
    .tui-editor-contents *
      color: rightColor !important
.answer-is-error.is-checked
  .el-radio__inner, .el-checkbox__inner
    background-color: errorColor !important
    border-color: errorColor !important
  .el-radio__inner
    &:after
      background-color: #fff !important
  .el-checkbox__inner
    &:after
      border-width: 2px !important
      border-color: #fff !important
  .el-radio__label, .el-checkbox__label
    color: errorColor !important
    .tui-editor-contents *
      color: errorColor !important
.el-checkbox__label
  font-size: 16px
  padding-left: 14px
  width: calc(100% - 45px)
  display: inline-block
.el-checkbox__input.is-disabled+span.el-checkbox__label, .el-radio__input.is-disabled+span.el-radio__label
  color: #fff
.el-radio__label
  padding-left: 14px
  width: calc(100% - 45px)
  display: inline-block
.task_choice_list .tui-editor-contents
  width: 100%
  line-height: 22px
  p
    word-break: break-all
    white-space: pre-wrap
.inline_style
  display: inline-block
  width: calc(100% - 45px)
  vertical-align: middle
.inline_style1
  vertical-align: 0
  display: inline-block
  line-height: 26px
</style>
