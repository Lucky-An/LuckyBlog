<template>
    <div class="guide_wrap" style="padding-left:0;padding-right:0;">
      <!--上传wreteUp-->
      <div id="submitWriteup" v-if="matchInfo.can_submit_writeup" class="submitWriteup">
        <p  id="submitWriteup-text">
          <span v-if="hasWriteup">{{$t('question.uploadWriteup')}}</span>
          <span v-else>{{$t('question.writeup_hurry')}}</span>
          <span class="btn" @click="showSubmitWriteUp">{{$t('question.clickMe')}}</span>
          <span v-if="hasWriteup">{{$t('question.ReUpload')}}</span>
          <span v-else>{{$t('question.upload_writeup')}}</span>
        </p>
      </div>

      <div class="task_tabs">
        <el-tabs type="border-card">
          <el-tab-pane :label="item.challenge_name" :key="index" v-for="(item,index) in task_body">
            <div class="info_some_text clearfix">
              <div class="infos">
                {{item.description}}
              </div>
              <div class="devops_host_info">
                <div class="line">
                  <span>运维主机信息:</span>
                  <span>{{item.devops_host.host}}</span>
                </div>
                <div class="line">
                  <span>登录用户名:</span>
                  <span>{{item.devops_host.userName}}</span>
                </div>
                <div class="line">
                  <span>登录密码:</span>
                  <span>{{item.devops_host.password}}</span>
                </div>
              </div>
            </div>
            <div class="choice_question">
              <button class="choice_list" @click="task_modal_show" v-for="task in item.choice_question">
                {{task.title}}
              </button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="attack_info">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="grid-content bg-purple attack_view_list"  >
              <panelBox :title="$t('attack.question_board.score_log')">
                <ul slot="content_begin" class="view_list">
                  <li v-for="item in attack_data" >
                    {{$t('attack.question_board.user')}} <span class="blues">{{item.attacker}}</span> {{$t('attack.question_board.attack')}} <span class="blues">{{item.attackee}}</span> <time class="blues" style="float:right;">{{item.time}}</time>
                  </li>
                </ul>
              </panelBox>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--选择题弹框-->
      <el-dialog class="my-dialog choice_task_modal"
                 width="800px"
                 :title="choice_task.title"
                 :visible.sync="taskVisible" @close="closeDia">
        <div class="task_miaoshu">
          {{choice_task.content}}
        </div>
        <div class="radio_list">
          <el-radio v-model="radio" :label="choice.id" :key="index" v-for="(choice,index) in choice_task.list">{{choice.content}}</el-radio>
        </div>
        <div class="submit_handle" >
          <button class="confirm_btn">{{$t('modal.confirm')}}</button>
          <button class="cancel_btn">{{$t('modal.cancel')}}</button>
        </div>
      </el-dialog>
      <!--上传writeUp 弹窗 begin-->
      <el-dialog class="my-dialog" :title="$t('question.upload_writeup2')" width="650px" :visible.sync="writeUpVisible">
        <div class="fcenter" style="padding-bottom:20px;border:none;"><input type="file" ref="writeup">
          <span class="btn" @click="submitFile" >{{$t('question.submit')}}</span>
        </div>
        <div v-if="isCN" style="padding-left:110px;color:#a4a8b3 ">只能上传 <span v-for="item in matchInfo.file_type">{{item}} </span>格式文件，且不超过{{matchInfo.file_size}}M</div>

        <div v-else style="padding-left:110px;color:#a4a8b3 ">Only upload <span v-for="item in matchInfo.file_type">{{item}} </span> files, and no more than {{matchInfo.file_size}}M</div>
      </el-dialog>
      <!--上传writeUp 弹窗 end-->
    </div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
  import {
    events,
    writeups,
    uploadWriteup,
    get_challenges,
    get_score
  } from '@/api/competitionMode/devopsMode'
  const {mapState} = createNamespacedHelpers('match')
  import panelBox from '@/components/match/common/small_part/panelBox.vue'
  import menuNav from '@/components/match/common/small_part/challenge_menu.vue'
  export default {
    name: 'question_board',
    components: {
      panelBox,
      menuNav
    },
    data () {
      return {
        taskVisible:false,
        writeUpVisible:false,
        hasWriteup:false,
        matchInfo:{},
        radio:'20',
        attack_data:[
          {
            attacker:'admin',
            attackee:'admin2',
            time:'2019/10/20 10:05:20'
          },{
            attacker:'admin',
            attackee:'admin2',
            time:'2019/10/20 10:05:20'
          },
        ],
        task_body:[
          // {
          //   id:1,
          //   title:'题目11',
          //   content:'用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理，用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理',
          //   devops_host:{
          //     host:'10.99.99.018',
          //     userName:'Root112',
          //     password:'10.99.99.51'
          //   },
          //   choice_question:[
          //     {
          //       id:12,
          //       title:'选择题一',
          //     },
          //     {
          //       id:13,
          //       title:'选择题二',
          //     }
          //   ]
          // },
          // {
          //   id:1,
          //   title:'题目22',
          //   content:'22222用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理，用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理用户管理',
          //   devops_host:{
          //     host:'10.99.99.01',
          //     userName:'Root112',
          //     password:'10.99.99.01'
          //   },
          //   choice_question:[
          //     {
          //       id:12,
          //       title:'999999',
          //     },
          //     {
          //       id:13,
          //       title:'666666',
          //     }
          //   ]
          // }
        ],
        choice_task:{
          id:15,
          title:'选择题1',
          content:'近些年来，恶意代码依赖一些特殊的函数和内核系统函数进行感染、传播、影藏的这种趋势愈加明显代码',
          list:[
            {
              id:'20',
              content:'函数和内核系统函数进行感染1'
            },
            {
              id:'21',
              content:'函数和内核系统函数进行感染2'
            },
            {
              id:'22',
              content:'函数和内核系统函数进行感染3'
            },
            {
              id:'23',
              content:'函数和内核系统函数进行感染4'
            }
          ]
        }
      }
    },
    created () {
      this.get_task();
      this.get_score_log();
    },
    methods:{
      get_task(){
        get_challenges({
          event_id:this.$route.query.event
        }).then(res=>{
          this.task_body = res.data;
          console.log(this.task_body,52)
        })
      },
      get_score_log(){
        get_score({
          event_id:this.$route.query.event
        }).then(res=>{
          this.attack_data = res.data;
        })
      },
      task_modal_show(){
        this.taskVisible = true;
      },
      showSubmitWriteUp () { //点击展示writeUp
        this.writeUpVisible = true
      },
      submitFile () {//上传文件
        // 创建一个form表单
        let formData = new FormData()
        let files = this.$refs.writeup.files
        if (files.length == 0) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('validateform.file'),
          });
          return
        }
        let isJPG=false;

        this.matchInfo.file_type.forEach(item=>{
          if(files[0].name.endsWith(item))isJPG=true
        })
        if (!isJPG) {
          this.$notify.error({
            customClass: 'error_notify',
            title: this.$t('public.error'),
            message: this.$t('validateImg.file_err'),
          })
          return false
        }
        if (files[0].size / 1024 / 1024 > this.matchInfo.file_size) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('validateImg.big_size'),
          });
          return
        }
        formData.append('writeup', files[0])
        formData.append('evt', this.$route.query.event)
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
        }, 2000)
        this.api.uploadWriteup(formData).then(res =>{
          loading.close()
          this.$refs.writeup.value = ''
          this.hasWriteup = true
          this.$notify.success({
            title:this.$t('dialog_list.tips'),
            message:this.$t('task.writeup.upload_success'),
          });
          this.writeUpVisible = false
        }).catch(error => {

        })
      },
      getWriteup () {//获取writeup
        this.api.writeups({
          evt: this.$route.query.event
        }).then((res)=>{
          if (res.data.has_writeup == 0) this.hasWriteup = false
        }).catch(error => {

        })
      },
      getMatchInfo () {//因为存储vuex是异步的,不知道什么时候请求完成，所以现在这个页面请求一次。
        events(this.event_id).then((res) => {
          let {data} = res
          this.matchInfo = data
          if (data.can_submit_writeup) this.getWriteup()
        })
          .catch(error => {

          })
      },
    },
    watch: {
    },
    computed: {
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
