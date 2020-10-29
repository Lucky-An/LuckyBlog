<template>
  <div class="subject_box">
    <!--答题题目 begin-->
    <ul class="sub_content">
      <li v-for="sub in task_ul"
          class="sub_item">
        <div class="sub_card" :class="{'wrap-solved': sub.has_solved}"
             @click="showSubmitTaskModal(sub)">
          <span class="top_line"></span>
          <img class="fit" src="@/assets/img/contest_right2.png" alt="" v-if="sub.has_solved">
          <img class="msg" v-if="sub.notice.length>0&&!sub.has_solved"
               src="@/assets/img/contest_tips.png" alt="">
          <p class="title-wrap">
            <span class="fs24 title specialFont"  v-if="getStrNumber(sub.title,18,14)">{{sub.title}}</span>
            <span class="fs24 title marquee specialFont" v-else>{{sub.title}}&nbsp;&nbsp;&nbsp;{{sub.title}}&nbsp;&nbsp;&nbsp;{{sub.title}}&nbsp;&nbsp;&nbsp;{{sub.title}}&nbsp;&nbsp;&nbsp;</span>
          </p>
          <p class="score-wrap fs16">solved：{{sub.solved_count}}</p>
          <!--排名盒子-->
          <div class="score-content fjus_center">
            <div class="score_box" v-if="!matchInfo.is_replay">
              <!--判断计分方式-->
              <span v-if="sub.top_solved">
                <p class="score fs28 specialFont">
                {{matchInfo.integral_mode==1?sub.score:sub.dynamic_score}}pt</p>
                <!--<p class="score_title fs28 specialFont">pt</p>-->
              </span>
              <span v-else>
                <p class="score fs28 specialFont">
                {{matchInfo.integral_mode==1?sub.score:sub.dynamic_score}}pt</p>
              </span>
            </div>

            <!--排名-->
            <div class="repr_box" v-if="sub.top_solved">
              <ul>`
                <li v-for="(name,i) in sub.top_solved">
                  <div class="img_box fcenter">
                      <span :class="{'top_1_class':i==0,'top_2_class':i==1,'top_3_class':i==2,}">
                      </span>
                  </div>
                  <span class="repr_name fs16"
                        v-if="getStrNumber(name.repr_name,14,7)">{{name.repr_name}}</span>
                  <!--字数大于8则添加滚动-->
                  <span class="repr_name fs16" v-else>
                     <span class="marquee">{{name.repr_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{name.repr_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{name.repr_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{name.repr_name}} &nbsp;&nbsp;&nbsp;&nbsp;</span>
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
    <el-dialog class="my-dialog env_table_wrap" :title="cliData.title" :visible.sync="dialogVisible" @opened="openDialog"
               :close-on-click-modal="is_onOff"
               :close-on-press-escape="is_onOff"
               @closed="closeDialog">
      <div class="markdown-wrapper" v-html="$i18n.locale=='CN' ? cliData.content_html : cliData.content_en_html"></div>
      <!--下载附件-->
      <div class="downLoad_box" v-if="cliData.file.length">{{$t('question.attDescription')}}：
        <span v-for="(item,index) in cliData.file">
                        <a download :href="item" class="btn">{{$t('question.attachment')}} {{index+1}}</a></span>
      </div>
      <div class="clearfix" v-if="!is_rw && cliData.is_dynamic_env">
        <!--启动场景-->
        <sence ref="sence"
               :task_hash="cliData.hash"
               :url_front="api.sence_url"
               @i_have_scene="modal_auth"
               @get_occupy_list="getSenceList"
               class="fl"
               v-if="!is_rw && cliData.is_dynamic_env"></sence>
        <div style="width:400px;float:right;" v-if="matchInfo.mode==2&&cliData.is_dynamic_env">
          <div style="text-align:center;margin-bottom:12px;">
            <span style="font-size:16px;margin-bottom:6px;display:inline-block;">{{$t('ad5.env_list')}}</span><br/>
            <span v-if="$i18n.locale=='CN'" class="highlightBlue">(每队可启动场景上限为{{matchInfo.max_env_count}}个)</span>
            <span v-else class="highlightBlue">(Each team can start up to {{matchInfo.max_env_count}} scenes)</span>
          </div>
          <el-table
            :data="senceData"
            border
            class="env_table"
            style="width: 100%">
            <el-table-column
              label="#"
              width="50">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="task_name"
              :label="$t('ad5.challenge_task_name')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="username"
              :label="$t('selfHelp_competition.user')">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--输入flag-->
      <!--比赛答对时  process为结束时  不显示flag输入框，为复盘时，即使比赛已结束也展示输入框-->
      <div v-if="!is_rw">
        <div
          style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:30px;"
          v-if="!cliData.has_solved&&(matchInfo.process==0||matchInfo.is_replay)&&matchInfo.status==1">
          flag: <input type="text" class="flag" v-model="flagString">
          <span class="btn" @click="submitFlag(cliData.id)">{{$t('question.submit')}}</span>
        </div>
      </div>

      <div class="pause" v-if="matchInfo.status==2">{{$t('api_message.event_suspended')}}</div>

      <div class="new-hint-b" v-for="not in cliData.notice">
        <img src="@/assets/img/contest_tips.png" alt=""><span>{{not.notice}}</span>
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
      :modal-append-to-body='false'
    >
        <span>
          <span style="font-size:30px;vertical-align: middle;margin-right:15px;"
                :class="{'el-icon-warning':icon_status==0,'el-icon-success':icon_status==1,'el-icon-error':icon_status==2}"></span>
          <span>{{tipInfo}}</span>
        </span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogtip = false">{{$t('modal.confirm')}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import sence from '@/components/common_components/sence'
  import {createNamespacedHelpers} from 'vuex'
  const {mapState} = createNamespacedHelpers('match')
  import {getStrNumber} from '@/common/js/common'

  export default {
    name: 'jieti_question_board',
    components:{
      sence
    },
    props:['task_ul','matchInfo','api','hide_some'],
    data(){
      return{
        senceData: [],
        getStrNumber,
        flagString: '',//用户输入的flag
        dialogtip:false,
        dialogVisible:false,
        tipInfo:'',
        is_rw:false,
        is_onOff:true,//控制题板弹框点击空白侧关闭开关
        cliData: {file:[]},//被单击的数据
        icon_status:0,//0警告1成功2失败
        sence_timer:null
      }
    },
    beforeDestroy () {
      if(!this.is_rw&&this.$refs.sence)this.$refs.sence.initTimer();
      if(this.matchInfo.mode==2&&this.cliData.is_dynamic_env){//如果这个题目有环境并且这个比赛是组队赛，请求已开启题目列表接口
        clearInterval(this.sence_timer);
      }
    },
    created(){
      this.is_rw = this.hide_some;
    },
    methods:{
      showSubmitTaskModal (data) {//点击题目展示答题框
        this.dialogVisible = true
        this.cliData = data
        this.is_onOff = !data.is_dynamic_env;//控制点击空白处关闭答题弹框
        this.addlogs(data.id);
        if(this.matchInfo.mode==2&&data.is_dynamic_env){//如果这个题目有环境并且这个比赛是组队赛，请求已开启题目列表接口
          this.getSenceList(data.hash);
          this.sence_timer = setInterval(()=>{
            this.getSenceList(data.hash);
          },60000)
        }
      },
      getSenceList(hash){
        this.api.team_env(hash)
          .then(res=>{
            this.senceData = res.data.rows;
          })
      },
      addlogs (id) {//添加点击题目日志
        this.api.addLogs({event_task: id})
          .then(res=>{

          })
      },
      openDialog () {//监听打开弹窗
        if(!this.is_rw&&this.cliData.is_dynamic_env){
          this.$refs.sence.runSence_get();
        }
      },
      //监听关闭答题弹框
      closeDialog () {
        this.flagString = ''
        if(!this.is_rw&&this.cliData.is_dynamic_env){
          this.$refs.sence.initTimer();
        }
        if(this.matchInfo.mode==2&&this.cliData.is_dynamic_env){//如果这个题目有环境并且这个比赛是组队赛，请求已开启题目列表接口
          clearInterval(this.sence_timer);
        }
      },
      modal_auth(val){
        this.is_onOff = val;
      },
      submitFlag (id) {//提交falg
        //判断是否填写falg
        if (!this.flagString) {
          this.dialogtip = true
          this.tipInfo = this.$t('question.falgtip')
          this.icon_status = 0
          return
        }
        let submit_event=this.api.submitFlags;//非复盘
        if(this.matchInfo.is_replay)submit_event=this.api.submitReplayFlags;//复盘提交
        submit_event({
          event_task: id,
          answer: this.flagString
        }).then((res)=>{
          let {data} = res
          if (data.is_solved) {
            this.icon_status = 1
            this.dialogtip = true
            this.tipInfo = this.$t('question.flagSuccess')
            this.dialogVisible = false
            this.$emit('successAnswer')
          } else {
            this.icon_status = 2
            this.dialogtip = true
            this.tipInfo = this.$t('question.flagErr')
          }
        }).catch(error => {

        })
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/common/stylus/mixin.styl'
  //答题卡 begin
  .el-icon-warning {
    color: #ffe45f;
  }

  .el-icon-error {
    color: #F56C6C;
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

    .sub_item {
      padding: 15px
      width: 25%
    }

    .sub_card:hover {
      edge-angle();
      background-color: subHover;
    }

    .sub_card {
      background #0d1927
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
        height: 40px
        text-align: center;
        overflow: hidden;
        line-height: 38px;
        span {
          color: titleColor;
          font-weight: bold;
          white-space: nowrap;
        }
      }

      .score-wrap {
        text-align: center;
        height: 22px
        color: titleColor;
      }

      .score-content {
        height: 143px
      }

      .score_box {
        width: 36%;
        height: 100%

        .score {
          font-weight: normal;
          color: scoreColor;
          height: 70px;
          line-height: 156px;
        }

        .score_title {
          color: scoreTitleColor;
          height: 70px;

        }
      }

      .repr_box {
        width: 62%;
        margin-left:2%;

        li {
          width: 100%
          border-bottom: 1px solid tableBorer;
          margin: 10px 0px;
          padding-bottom: 2px
          display: flex;
          align-items center
          .top_1_class{
            width:30px;
            height:30px;
            display:inline-block;
            background:url('~@/assets/img/1.png') no-repeat;
            background-size: auto auto;
          }
          .top_2_class{
            width:30px;
            height:30px;
            display:inline-block;
            background:url('~@/assets/img/2.png') no-repeat;
            background-size: auto auto;
          }
          .top_3_class{
            width:30px;
            height:30px;
            display:inline-block;
            background:url('~@/assets/img/3.png') no-repeat;
            background-size: auto auto;
          }
        }
        .img_box {
          width: 30px
        }

        .repr_name {
          display: inline-block;
          color: fontColor-f;
          width: calc(100% - 30px) ;
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
      box-shadow:rgb(11, 234, 235) 0px 0px 14px inset!important;
      &:before{
        content:'';
        clear:both;
        display:inline-block;
        position:absolute;
        left:0;
        top:0;
        width:40px;
        height:40px;
        background:url('~@/assets/img/ad5/jad/jie.png');
        z-index:10;
      }
    }

    //答对题目的状态end

  }

  //答题卡 end

</style>
<style lang="stylus" rel="stylesheet/stylus">
  .subject_box {
  .markdown-wrapper {
    line-height: 20px;

  p {
    margin-bottom: 10px
  }

  a {
    color: acolor;
    text-decoration: underline;
  }
  }

  .downLoad_box {
    margin: 10px 0 15px 0;
  }

  .pause{
    margin-top: 10px
  }
  .btn {
    margin: 0 10px;
    cursor: pointer;
    padding: 10px 40px
    display: inline-block;
    text-align: center;
    text-decoration: none !important;
    font-style: normal;
    color: white !important;
    background-image: linear-gradient(0deg, rgba(0, 96, 255, 0.27) 0%, #000000 100%), linear-gradient(#030000, #030000);
    background-blend-mode: normal,
    normal;
    border-style: solid;
    border-width: 2px;
    border-image-source: linear-gradient(0deg,
    #0078ff 0%,
    #8bc7ff 100%);
    border-image-slice: 1;
  }

  .flag {
    padding-left: 10px
    margin: 0 30px 0 5px;
    width: 460px;
    border: 1px solid rgba(255, 255, 255, .4) !important;
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

  //弹窗 end
  }
    /*
  .env_table{
    background:none;
    border-color:rgba(255,255,255,.1)!important;
    *{
      border-color:rgba(255,255,255,.1)!important;
      text-align:center;
      color:#fff;
    }
    tr{
      background:rgba(0,0,0,0);
      &:hover{
        td{
          background:none!important;
        }
      }
    }
    td,th{
      background:none;
      padding:6px 0;
    }
    &:after,&:before{
      display none;
    }
  }
  */
  .env_table_wrap{
    .el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
      border-color: rgba(50,54,83,1)!important;
    }
    .el-table--border::after, .el-table--group::after, .el-table::before{
      background-color: rgba(50,54,83,1)!important;
    }
    .el-table th, .el-table tr,.el-table td{
       background-color: #1b1f3c!important;
      color:#fff!important;
      text-align:center!important;
    }
    .el-table__empty-block{
      background:#1b1f3c!important;
    }
  }
</style>
