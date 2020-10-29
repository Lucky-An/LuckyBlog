<template>
    <div class="sence_box clearfix"
         :class="senceStatus!=0?'sence_bg':''"
    >
        <div class="sence_title fl">
            {{$t('question.sceneTitle')}}：
        </div>
        <div class="fl" style="width:80%;">
            <span v-show="senceStatus==0">
              <span class="btn_dis" v-if="senceDisabled">{{$t('question.attscene')}}</span>
              <span v-else>
                <span class="btn" @click="runSence_psot"
                      v-if="senceStatus!=2&&senceStatus!=1">{{$t('question.attscene')}}</span>
              </span>
            </span>
            <span class="mtl10 lheight38" v-if="progress">
                <img style="width: 24px;height: 25px;margin-right: 5px;margin-top: 6px;" src="@/assets/img/diannao.png" alt="">
                <a style="color: #fff" v-if="protocol==1||env_request_method=='http'" :href="'http://'+progress" target="_blank">{{'http://'+progress}}</a>
                <span v-else>{{progress}}</span>
            </span>
            <div class="delbtn notTimer" v-if="!env_times" v-show="senceStatus==2&&(!is_share||user_auth.classes==-1)" @click="deleteSence(task_hash)">
              {{$t('question.Delete_scene')}}
            </div>
            <div class="mtl10 fitem_center" v-show="senceStatus!=0" v-if="env_times">
                <div class=" progress_bg"><p class="progress_content" :style="'width:'+progressPer+'%'"></p>
                </div>
                <div class="delbtn" v-show="senceStatus==2&&(!is_share||user_auth.classes==-1)" @click="deleteSence(task_hash)">
                    {{$t('question.Delete_scene')}}
                </div>
            </div>
            <div v-show="senceStatus==2&&!is_share" class="show_time mtl10 fitem_center" v-if="env_times">
                {{$t('question.Countdown')}}：{{senceTime}}<span></span>
                <span class="btn" @click="delayTime" >{{$t('question.time_delay')}}</span>
            </div>
        </div>

        <el-dialog
                :title="$t('dialog_list.tips')"
                :visible.sync="sencedig"
                width="30%"
                center
                custom-class="public-dialog"
                :modal-append-to-body='false'
        >
          <span>
            <span class="el-icon-warning success_icon"></span>
            <span>{{$t('question.senceTip')}}</span>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="deleteSence(otherHash)">{{$t('modal.confirm')}}</el-button>
            <el-button type="primary" @click="sencedig = false">{{$t('modal.cancel')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
  import {getStorage} from '@/utils/storage'
  import {createNamespacedHelpers} from 'vuex'
  const {mapState} = createNamespacedHelpers('match')
  export default {
    name: 'sence',
    data () {
      return {
        senceDisabled:true,
        timer: null,//轮询场景定时器
        timeNum: 1,//轮询请求的次数，不能超过50
        senceHash: '',//正在创建的场景的hash
        progressPer: 0,//进度条长度
        progress: '',//创建场景的进度
        senceStatus: 0,//创建场景的状态
        senceTime: '00:00:00',//场景剩余时间
        countdownTimer: null,//倒计时的定时器
        event_id: this.$route.query.event,//竞赛id
        sencedig: false,//重复场景提示弹框
        otherHash:'',//重复场景的hash
        remaining_time:0,//场景剩余时间
        all_time:60*60,
        is_share:false,
        env_times:false,
        protocol:2,//2为nc 1为http
        env_request_method:'nc',//2为nc 1为http
        user_auth:(getStorage('isUserLogin','object')).user,
      }
    },
    props: {
      task_hash: String,
      url_front: String
    },
    created(){

    },
    beforeDestroy () {
      clearInterval(this.timer)
      clearInterval(this.countdownTimer)
    },
    destroyed() {
      //清除定时器
      clearInterval(this.timer)
      clearInterval(this.countdownTimer)
    },
    computed: {
      ...mapState(["match_data"])
    },
    methods: {
      delayTime(){//延时
        this.$http({
          method: 'post',
          url: this.url_front + 'delay/' + this.task_hash,
        }).then(res => {
          if (res.data.status == 2) {
            this.remaining_time=res.data.remaining_time;
            this.all_time=res.data.all_time;
            this.showSence(res.data)
          }
        }).catch(error => {
          // 如果没启动场景，接口会返回403，所以只好在catch里面操作
          if (error.response.status == 403) {

            // this.$message.error(error.response.data.message);
          }
        })
      },
      initTimer (info) {//关闭弹框清除定时器
        if(info){//轮询超过50次时提醒
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message: info,
          });
          this.$emit('i_have_scene',true)
        }
        clearInterval(this.timer)
        clearInterval(this.countdownTimer)
        this.timer = null;
        this.countdownTimer = null;
        this.progress = '';
        this.progressPer = 0;
        this.timeNum = 1
        this.senceStatus = 0
      },
      showSence (data) {//已有场景，显示场景状态
        //清除轮询开启场景的定时器
        clearInterval(this.timer)
        this.remaining_time=data.remaining_time;
        this.all_time=data.all_time;

        //初始化场景地址是http还是nc
        this.protocol=data.protocol;
        this.env_request_method=data.env_request_method;
        this.env_times = data.env_times;

        //将状态改为场景已经开启状态。
        this.senceStatus = 2
        this.$emit('i_have_scene',false)
        // this.progress=''+data['remark']+''+data['ip']+':'+data['port'];
        //将进度条上的文字更改为后台返回的ip和端口 192.168.10.100:5000
        this.progress = '' + data['ip'] + ':' + data['port']
        //换算倒计时进度条
        this.progressPer = parseInt(this.remaining_time / this.all_time * 100)
        //展示倒计时 调用转换时间戳为 时:分:秒 的格式
        this.senceTime = this.formatDuring(this.remaining_time)
        //是否展示倒计时
        //is_share代表是共享模式，共享模式不需要展示倒计时。是否展示倒计时
        this.is_share = data.is_share;
        if(data.is_share){//如果是共享模式，进度条的值永远是100.
          this.progressPer=100
          return;
        }
        //设置一个定时器，使进度条和时间逐渐缩减。
        this.countdownTimer = setInterval(() => {
          this.remaining_time = this.remaining_time - 1
          this.progressPer = parseInt(this.remaining_time / this.all_time * 100)
          this.senceTime = this.formatDuring(this.remaining_time)
          if (this.remaining_time <= 0) {
            clearInterval(this.countdownTimer)
            this.senceTime = '00:00:00'
            this.deleteSence(data.task_hash[0],1)
          }
        }, 1000)
      },
      runSence_get () {//第一次进入场景题查询场景
        this.$http({
          method: 'get',
          url: this.url_front + this.task_hash,
        }).then(res => {
          //关闭【点击开启场景】按钮
          this.senceDisabled = false;
          //status等于2时表示已有场景，调用展示场景的方法。
          if (res.data.status == 2) {
            //展示场景
            this.showSence(res.data)
            // 初始化场景的剩余时间和总时间，用来显示进度条。
            this.remaining_time=res.data.remaining_time
            this.all_time=res.data.all_time
          }else{
            this.$emit('i_have_scene',true)
          }
        }).catch(error => {
          // 如果没启动场景，接口会返回403，所以只好在catch里面操作
          if (error.response.status == 403) {
            this.senceStatus = 0
          }
        })
      },

      runSence_psot () {//点击开启场景按钮，发起请求准备创建场景，并开启轮询
        this.$emit('i_have_scene',false)
        this.$http({
          method: 'post',
          url: this.url_front + this.task_hash,
          data: {task_hash: this.task_hash},
          loading:true,
        }).then(res => {
          let {data} = res
          //如果status等于1表示可以开启场景，打开轮询
          if (data.status == 1) {
            //初始化进度条
            this.progress = '0%'
            //将场景状态改为1，即轮询中
            this.senceStatus = 1
            //设置轮询hash
            this.senceHash = data.message.env_hash
            // 定时器开启轮询
            this.timer = setInterval(() => {
              this.timeNum++
              this.runSence_polling()
              //最多轮询50秒，大于50秒提示失败
              if (this.timeNum >= 50) this.initTimer(this.$t('task.initSceneFailed'));
            }, 3000)
          } else if (data.status == 0) {//场景重复 //status等于0表示场景重复，删除上一个场景
            if(data.message=='max_env_count'){//表示这个字段说明是场景达上限
              if(this.match_data.mode==2){//组队赛，status为0表示场景达上限了，提示。
                let env_str_zh = '本次竞赛限制队伍内可启动的题目环境上限为'+this.match_data.max_env_count+'个，您的队伍已达到系统上限值。您可以同环境使用者沟通来关闭闲置的题目环境，从而获取可用资源。'
                let env_str_en = 'The maximum number of questions that can be started in this competition is '+this.match_data.max_env_count+'. Your team has reached the maximum value of the system. You can communicate with the users of the environment to shut down the idle topic environment and obtain the available resources.'
                let mess = this.$i18n.locale=='CN' ? env_str_zh : env_str_en;
                this.$confirm(mess, this.$t('dialog_list.tips'), {
                  confirmButtonText: this.$t('modal.confirm'),
                  showCancelButton:false,
                  customClass:'public_confirm public_confirm_sm',
                  type: 'warning'
                }).then(() => {

                }).catch(res=>{})
              }else{//个人赛 直接删除另一个已开启环境
                this.deleteSence(data.task_hash[0],1);
              }
            }else{//其他情况提示出来
              this.$notify.error({
                customClass: "error_notify",
                title: this.$t("public.error"),
                message: this.$t("api_message."+data.message)
              });
            }
          }
        }).catch(error => {
          // 如果出现错误，接口会返回403，所以只好在catch里面操作

        })

      },
      formatDuring (mss) {//转换时间
        let hours = parseInt(mss / 3600) + ''
        let minutes = parseInt((mss - hours * 3600) / 60) + ''
        let seconds = parseInt(mss - hours * 3600 - minutes * 60) + '';
        if (hours.length < 2) {
          hours = '0' + hours
        }
        if (minutes.length < 2) {
          minutes = '0' + minutes
        }
        if (seconds.length < 2) {
          seconds = '0' + seconds
        }
        return hours + ':' + minutes + ':' + seconds
      },
      runSence_polling () {//轮询请求查询场景打开状态
        this.progress = parseInt(this.timeNum / 5 * 100) + '%'
        this.progressPer = parseInt(this.timeNum / 50 * 100);
        //如果进度大于99还没有打开场景，则进度卡在99%
        if(this.progressPer>99)this.progressPer=99;
        if(this.progress>99)this.progress=99 + '%';
        this.$http({
          method: 'get',
          url: this.url_front + this.task_hash,
        }).then(res => {
          let {data} = res
          // status==2表示开启场景成功
          if (data.status == 2) {
            if(this.match_data.mode==2){
              this.$emit('get_occupy_list',this.task_hash)
            }
            this.showSence(data)
            clearInterval(this.timer)
            this.timer = null;
          }
        }).catch(error => {
          // 如果出现错误，接口会返回403，所以只好在catch里面操作
          if (error.response.status == 403) {
            this.initTimer();
            // this.$notify.error({
            //   customClass:'error_notify',
            //   title:this.$t('public.error'),
            //   message: error.response.data.message,
            // });
            // this.$message.error(error.response.data.message);
          }
        })

      },
      deleteSence (hash,repeat) {//删除场景,repeat参数用于删除上一个场景，请求新的场景，请求传1，不请求可不传此参数
        //调用此函数说明要删除场景或者个人赛场景数量达到上限。
        //repeat存在表示处于场景重复的情况，这是后弹框的提示信息是是否删除上一个场景，
        // 如果没有repeat，弹框内容是是否确认删除。
        let mess = repeat ? this.$t('question.del_replay_scene') : this.$t('question.del_tips');
        this.$confirm(mess, this.$t('dialog_list.tips'), {
          confirmButtonText: this.$t('modal.confirm'),
          cancelButtonText: this.$t('modal.cancel'),
          customClass:'public_confirm public_confirm_sm',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'delete',
            url: this.url_front + hash,
            loading:true,
          }).then(res => {
            if (res.data.status == 1) {
              //删除成功，初始化
              if(repeat)this.runSence_psot();
              this.initTimer();
              this.otherHash='';
              this.sencedig=false;
              this.senceDisabled = true;
              this.protocol = 2;
              this.env_request_method = 'nc';
              clearInterval(this.timer)
              clearInterval(this.countdownTimer)
              this.timer = null;
              this.countdownTimer = null;
              setTimeout(()=>{
                this.senceDisabled = false;
              },3000)
              this.$emit('i_del_scene',true)
              if(this.match_data.mode==2){
                this.$emit('get_occupy_list',this.task_hash)
              }
            }else{
              this.$notify.error({
                customClass:'error_notify',
                title:this.$t('public.error'),
                message: res.data.message,
              });
              // this.$message.error(res.data.message);
            }
          })

        }).catch(res=>{})

      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .notTimer{
      text-align:center;
      display:inline-block;
      line-height:24px;
      float:right;
      margin-top:4px;
    }
    .sence_bg {
        background: rgba(0,0,0,.3);
    }

    .sence_box {
        margin: 0 0 10px -10px;
        padding: 10px
        width: 50%;

        .noDrap {
            cursor: no-drop;
        }

        .sence_title {
            line-height: 38px;
        }

        .mtl10 {
            margin: 10px 0 0 10px
        }

        .lheight38 {
            line-height: 38px;
        }

        .progress_bg {
            width: 244px;
            height: 12px;
            background: progressBg;
            border-radius: 10px;
        }

        .progress_content {
            width: 0%
            height: 12px;
            background: progressContentBg;
            border-radius: 10px;
        }

        .delbtn {
            font-size: 14px;
            border-radius: 2px;
            cursor: pointer;
            padding: 2px 8px;
            color: #fff;
            background-color: delBtn;
            border: 1px solid delBtn;
            margin-left: 20px
        }

        .show_time .btn {
            padding: 5px 15px;
        }

      .btn {
        border-radius :0;
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
      .btn_dis {
        border-radius :0;
        margin: 0 10px;
        cursor: not-allowed;
        padding: 10px 40px
        display: inline-block;
        text-align: center;
        text-decoration: none !important;
        font-style: normal;
        color: white !important;
        background-image: linear-gradient(0deg, rgba(124, 124, 124, 0.27) 0%, #000000 100%), linear-gradient(#030000, #030000);
        background-blend-mode: normal,
          normal;
        border-style: solid;
        border-width: 2px;
        border-image-source: linear-gradient(0deg,
        #bfbfbf 0%,
        #7c7c7c 100%);
        border-image-slice: 1;
      }
    }



</style>
