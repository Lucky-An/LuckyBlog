<template>
  <div class="solving_type" style="min-height:100%;">

    <competitionHome :logo="header_logo"
                     :nav="nav"
                     :format_time="format_time"
                    :match_status="match_status"
                     :match_all_data="match_all_data"
                     :dialogVisible="dialogVisible"
    >
      <div slot="nav_menu" class="guide_wrap"
           style="padding:0;margin-top:25px;"
         v-if="is_login && $route.path.indexOf('guide')==-1 && $route.path.indexOf('trend')==-1 && $route.path.indexOf('ranking')==-1"
           >
        <menuNav
          @the_begin="begining"
          @the_end="ending"
          :team_data="team_data"
          :api="api.matchStatus"
          :arg="arg"
          v-if="userInformation.team&&team_data&&match_all_time">
        </menuNav>
      </div>
      <div slot="other_wrap" v-if="isAdw && is_login">
        <el-dialog
          :title="$t('dialog_list.tips')"
          :visible.sync="changName"
          width="700px"
          center
          custom-class="public-dialog label_white"
        >
          <div class="text-left pad20L">
            <div v-if="team.has_team&&user.is_head">
              <div class="mrg30B mrg20L" >
                <span>{{$t('selfHelp_competition.default_team_name')}}:</span>
                <span>{{def_team_name}}</span>
              </div>
              <el-form :model="headNameForm" :rules="headNameRules" ref="headNameForm" label-width="120px" style="padding:0 150px 0 0">
                <el-form-item :label="$t('selfHelp_competition.edit_team_name')" prop="teamName" >
                  <el-input v-model="headNameForm.teamName" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('selfHelp_competition.change_nickname')" prop="userName">
                  <el-input v-model="headNameForm.userName"></el-input>
                </el-form-item>
                <el-form-item class="text-center">
                  <el-button type="primary" class="cancelchangeName mrg30R" @click="changName = false">{{$t('el.messagebox.cancel')}}</el-button>
                  <el-button type="primary" class="changeName" @click="changNameHandle('headNameForm')">{{$t('el.messagebox.confirm')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-else>
              <div class="mrg30B mrg20L" v-if="team.has_team">
                <span>{{$t('selfHelp_competition.team_name')}}:</span>
                <span>{{def_team_name}}</span>
              </div>
              <el-form :model="headNameForm" :rules="teamerNameRules" ref="headNameForm" label-width="180px" style="padding:0 150px 0 0">
                <el-form-item :label="$t('selfHelp_competition.change_nickname')" prop="userName">
                  <el-input v-model="headNameForm.userName"></el-input>
                </el-form-item>
                <el-form-item class="text-center">
                  <el-button type="primary" class="cancelchangeName mrg30R" @click="changName = false">{{$t('el.messagebox.cancel')}}</el-button>
                  <el-button type="primary" class="changeName" @click="changNameHandle('headNameForm')">{{$t('el.messagebox.confirm')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-dialog>
      </div>
    </competitionHome>
  </div>
</template>

<script>
  import {
    matchStatus,
    notices,
    task_notices,
    nav_datas
  } from '@/api/competitionMode/layeredMode'
  import competitionHome from '../../common/competition_home'
  import {createNamespacedHelpers} from 'vuex'
  import {setStorage,getStorage} from '@/utils/storage'
  import {dateformat} from '@/utils/dateformat'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import menuNav from '@/components/match/common/small_part/challenge_menu.vue'

  export default {
    components:{
      competitionHome,
      menuNav
    },
    data(){
      return{
        arg:this.$route.query.hash,
        team_data:{
        },
        isAdw:false,
        header_logo:{
          logo:'',
          add_link:true,
          url:'/'
        },
        nav:[
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/layered/guide',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.guide")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/layered/notice',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.notice")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/layered/contest_challenge',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.questionBoard")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/layered/ranking',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.ranking")
          },
          {
            path:'/'+window.location.pathname.split('/')[1]+'/match/layered/trend',
            query:{event:this.$route.query.event,hash:this.$route.query.hash},
            name:this.$t("header.match.trend")
          },
        ],
        api:{//接口数据
          matchStatus:matchStatus,
          notices:notices,
          task_notices:task_notices,
        },
        distance_match_time:0,
        match_all_time:0,
        format_time:'',
        match_status:-1,
        dialogVisible:false,
        match_id:'',
        match_all_data:'',
        is_login:localStorage.isUserLogin,
        user:localStorage.isUserLogin ? JSON.parse(localStorage.isUserLogin).user:'',
        team:{},
        notice_timer:null,
        notice_max_id:0,
        tips_max_id:0,
        changName:false,
        headNameForm:{},
        def_team_name:null,
        headNameRules:{
          teamName:[
            { required: true, message: this.$t('team.createTeamPlaceholder'), trigger: 'blur' },
            { min: 3, max: 12, message: this.$t('selfHelp_competition.leng3_12'), trigger: 'blur' }
          ],
          userName:[
            { required: true, message: this.$t('login.nickname'), trigger: 'blur' },
            { min: 3, max: 12, message:  this.$t('selfHelp_competition.leng3_12'), trigger: 'blur' }
          ]
        },
        teamerNameRules:{
          userName:[
            { required: true, message: this.$t('login.nickname'), trigger: 'blur' },
            { min: 3, max: 12, message:  this.$t('selfHelp_competition.leng3_12'), trigger: 'blur' }
          ]
        },
        nav_timer:null
      }
    },
    name: "home",
    created(){
      if(!this.is_login) return;
      this.getNav();
      this.nav_timer = setInterval(()=>{
        this.getNav()
      },60000)//60秒
      this.isAdw = this.$route.path.indexOf('adw')!= -1;
      if(this.isAdw){
        this.team = JSON.parse(localStorage.isUserLogin).team
        this.headNameForm.teamName = getStorage('isUserLogin','object').team.data.name
        this.headNameForm.userName = getStorage('isUserLogin','object').user.nickname
        this.def_team_name = getStorage('isUserLogin','object').team.data.name
      }else{
        this.team = this.userInformation.team
      }
      if(!this.user.is_used&&this.user.is_temp){
        this.changName = true;
      }
      this.match_id = this.$route.query.event;
      let sys_n = this.match_id+'noticeMaxId';
      if(localStorage[sys_n]){
        this.notice_max_id = getStorage(this.match_id+'noticeMaxId','number')
      }
      let that = this;
      var param = this.$route.query;
      this.header_logo.logo = this.match_data.logo;
      this.$route.fullPath.indexOf('ranking')!=-1 ? this.rank_active = true : this.rank_active = false
      let d = this.match_data;
      this.match_all_data = d;//赛事详细信息
      this.setData({match_data:d});
      this.match_status = d.process;//比赛状态
      this.match_all_time = parseInt(d.all_seconds)*1000;//比赛总时间
      this.distance_match_time = parseInt(d.remain_seconds)*1000;//距离比赛时间/剩余时间
      if(d.process==2){//比赛结束
        if(!d.is_replay){
          this.dialogVisible = true;//弹框
        }
      }else{//比赛未结束进行的事情
        this.dialogVisible = false;//弹框
        this.notice_timer = setInterval(()=>{
          this.get_notice()
        },60000)//每1分钟轮询消息
        this.format_time = dateformat(this.distance_match_time)
      }
      this.get_notice()
      setStorage(this.headNameForm.userName+'notfirstLanding',true);
    },
    beforeDestroy () {
      clearInterval(this.notice_timer);
      clearInterval(this.nav_timer);
    },
    methods:{
      getNav(){
        nav_datas(this.$route.query.hash)
          .then(res=>{
            this.team_data = res.data;
            this.setData({team_data:res.data});
          })
          .catch(res=>{

          })
      },
      ...mapMutations(['setData']),
      begining(){
        this.reload();
      },
      ending(){
        this.dialogVisible = true;
      },
      get_notice(){
        let that = this;
        this.api.notices({
          evt:this.match_id,
          id:this.notice_max_id
        }).then((res)=>{//平台公告消息
          let notice_list = res.data;
          let filters = [];
          let sys_list = [];
          filters = notice_list.filter((item,i)=>{//拿到答出题目三血消息
            return item.is_task == 1;
          })
          sys_list = notice_list.filter((item,i)=>{//拿到平台消息
            return item.is_task==0
          })
          this.setData({system_notice:sys_list});
          if(this.match_status == 0){//只有在比赛进行中的时候才去弹出右侧的三血答出提示复盘不显示
            if(filters.length){
              let id_list = [];
              filters.forEach((item,i)=>{
                id_list.push(item.id);
                this.blood_tips(this.$t('dialog_list.tips'),this.$i18n.locale=='EN' ? item.notice_en : item.notice)//出来右上角提示
              })
              let max_num
              max_num = Math.max.apply(null,id_list)//把实例最大id更新了;
              this.notice_max_id = max_num//把实例最大id更新了;
              setStorage(this.match_id+'noticeMaxId',max_num)//把最大id存到storage;
            }
          }
        })
          .catch((err)=>{

          })
        this.api.task_notices({//题目提示消息接口
          evt:this.match_id,
        }).then((ress)=>{
          let tips_notice = ress.data;
          this.setData({tips_notice:tips_notices});
        })
          .catch((err)=>{

          })
      },
      blood_tips(title,content) {
        const h = this.$createElement;
        setTimeout(()=>{
          this.$notify({
            title: this.$t('dialog_list.tips'),
            message: h('i', {style: 'color: #fff'}, content),
            type: 'success',
          });
        },500)
      },
      changNameHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.api.editProfile({//临时战队/队员编辑战队昵称
            //   user_name:this.headNameForm.userName,
            //   team_name:this.headNameForm.teamName
            // }).then((res)=>{
            //   if(res.data.success){
            //     this.$notify.success({
            //       title:this.$t('dialog_list.tips'),
            //       message:this.$t('team.handle_success'),
            //     });
            //     this.changName = false;
            //     this.reload()
            //   }
            // })
          } else {
            return false;
          }
        });
      },
    },
    computed:{
      ...mapState(['match_data','userInformation']),
    }
  }
</script>

