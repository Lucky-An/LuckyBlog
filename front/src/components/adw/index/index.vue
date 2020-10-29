<template>
  <div class="tab border-1px">
      <v-header show_lang="true" :logo="ad_logo" personalUrl="/api/">
        <div slot="nav_content" v-if="!person_auth">
          <div class="tab-item">
          <router-link to="/task">{{$t("header.task.answer")}}</router-link>
          </div>
          <div class="tab-item">
          <router-link to="/competition">{{$t("header.competition.competition")}}</router-link>
          </div>
          <div class="tab-item select_nav">
          <div class="rank_list">
          <span class="rank_title"  :class="{'tab-active':rank_active}" @click.stop="showlist">{{$t("header.ranking.rank")}} <i class="el-icon-arrow-down"></i></span>
          <ul class="rank_nav"  v-show="rank_show" >
            <div id='scoreboard_nav' @click="showlist">
              <div id='firstDiv'>
                <span></span>
                <div>
                  <router-link to="/ranking/ctfrank" >{{$t("header.ranking.ctf")}}</router-link>
                  <div>
                    <router-link to="/ranking/specialrank" >{{$t("header.ranking.special")}}</router-link>
                    <div id='lastdiv'>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ul>
          </div>
          </div>
          <div class="tab-item" @click="getTeamStatus">
            <router-link to="/team">{{$t("header.team.teamHomepage")}}</router-link>
          </div>
          <!--<div class="tab-item">-->
          <!--<router-link to="/discussion">{{$t("header.discussion.discussion")}}</router-link>-->
          <!--</div>-->
        </div>
        <div slot="message_tips"  style="float:left;">
          <router-link to="/message" class="message" v-if="show_message&&!person_auth" >
            <span class="message_ico"></span>
            <span v-if="message_num" class="message_num">{{message_num}}</span>
          </router-link>
        </div>
      </v-header>
      <router-view v-wechat-title="$t($route.meta.title)"></router-view>
      <el-dialog
        :title="$t('select_address.changeAdd')"
        :visible.sync="dialogVisible"
        width="650px"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        custom-class="ad_public_modal nofoot" >
        <div style="text-align:left;padding:0 40px 15px 40px;">
          <div style="text-align: left;" class="mrg30B">
            {{$t('select_address.address_tips')}}
          </div>
          <span>{{$t('select_address.select_place')}}:</span>
          <selectAddress @changed="getAddress"></selectAddress>
        </div>
        <div slot="footer" class="dialog-footer" style="padding-bottom:20px!important;">
          <el-button type="primary" @click="commitAdd">{{$t('modal.submit')}}</el-button>
        </div>
      </el-dialog>
      <div class="beingAnswered" v-if="show_now_task && show_answer_tips &&!person_auth">
        <div style="width:100%;">
          <div class="cursor_btn" @click="displayBox">
            <span class="count">1</span>
          </div>
        </div>
        <div class="tips_box" v-if="show_question">
          <div>{{$t('task.doing')}}</div>
          <h3>
            <span style="display: inline-block">{{now_question.category}}：</span>
            <span style="width:170px;display:inline-block;">
              <span class="ellipsis_txt">{{now_question.title}}</span>
            </span>
          </h3>
          <div class="btn_group">
            <span class="to_hide" @click="hidetips">{{$t('task.hide')}}</span>
            <span @click="hidetips">
              <router-link  :to="{path:'/task/answer',query: {type: isAnswered.task_type,number:isAnswered.type_number,grade:isAnswered.grade,id:isAnswered.id}}" class="to_answer">{{$t('task.go')}}</router-link>
            </span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
import header from '@/components/common_components/header'
import selectAddress from '@/components/common_components/selectAddress'
import {setStorage,getStorage} from '@/utils/storage'
const { mapState,mapMutations } = createNamespacedHelpers('match');

export default {
  components: {
    'v-header': header,
    'selectAddress':selectAddress
  },
  data(){
    return{
      ad_logo:{
        url:'/',
        add_link:true,
        logo:'../../../static/img/world.png'
      },
      show_question:false,
      show_answer_tips:false,
      show_message:false,
      show_ranklist:true,
      rank_active:false,
      rank_show:false,
      dialogVisible:false,
      selectedOptions: [],
      timer:null,
      message_num:0,//消息提示数量
      now_question:{},
      isAnswered:{
        task_type:'',
        type_number:'',
        grade:'',
        id:''
      },
      personal_data:getStorage('isUserLogin','object'),
      person_auth:false,
      queryList:{
        language:localStorage.lang=='EN'?'en':'zh'
      },
    }
  },
  name: 'index',
  inject:['reload'],
  created(){
    this.show_message = localStorage.isUserLogin ? true : false;
    if(this.show_message){
      this.person_auth = this.personal_data.user.is_temp;
      if(!this.person_auth){
        this.timer=setInterval(()=>{
          this.getMessage_num();
        },15000)
        this.$http.get('/api/personal/task_info')
          .then((res)=>{
            if(res.data!=='{}'){
              this.now_question = res.data;
              this.isAnswered.task_type = res.data.category.toLowerCase();
              this.isAnswered.type_number = res.data.category_id;
              this.isAnswered.grade = res.data.weight;
              this.isAnswered.id = res.data.id;
              this.show_answer_tips = true;
            }else{
              this.show_answer_tips = false;
            }
          })
          .catch((err)=>{

          })
      }
    }
    if(localStorage.lang){
      if(localStorage.lang=='CN'){//看浏览器是否有语言缓存，有则取，无则默认中文
        this.lang_statu = true
        this.$i18n.locale = 'CN'
      }else{
        this.lang_statu = false
        this.$i18n.locale = 'EN'
      }
    }else{
      this.lang_statu = true
    }
    if(localStorage.isUserLogin){
      if(!this.personal_data.user.has_country&&!this.person_auth){
        this.dialogVisible  = true;
        let params=this.queryList
        this.$http.get('/api/personal/countrys',{params})
          .then((res)=>{
            this.options2 = res.data.rows;
            this.options2.forEach((item,index)=>{
              this.$set(this.options2[index], 'cities', [])
            })
          })
          .catch((err)=>{

          })
      }
    }
  },
  beforeDestroy(){
    clearInterval(this.timer);
  },
  methods:{
    ...mapMutations(['setData']),
    getTeamStatus(){
      this.$http.get('/api/personal/reload_profile')
        .then((res)=>{
          if(res.data.success){
            setStorage('isUserLogin', res.data.user_data)
            if(res.data.user_data.team.has_team){
              this.$router.push({path:'/team/homepage'})
            }else{
              this.$router.push({path:'/team/list'})
            }
          }
        })
    },
    getMessage_num(){//获取消息提示的数字。
      this.$http.get('/api/users/unread_message')
      .then((res)=>{
        this.message_num = res.data.unread_count;

      })
      .catch((err)=>{

      })
    },
    showlist(){
      //导航下拉菜单
      var oWrap=document.getElementById("scoreboard_nav");
      let nav = document.getElementsByClassName('rank_nav')[0];
      var aDiv=oWrap.getElementsByTagName("div");
      var iDelay=200;
      var oTimer=null;
      var i=0;
      let that = this;
      if(oTimer){
        return;
      }
      if(this.show_ranklist){
        i=0;
        oTimer=setInterval(function(){
          that.rank_show = true;
          aDiv[i].className="show";
          i++;
          if(i==aDiv.length)
          {
            clearInterval(oTimer);
            oTimer=null;
            that.show_ranklist = false;
          }
        },iDelay);
      }else{
        i=aDiv.length-1;
        oTimer=setInterval(function(){
          aDiv[i].className="hide";
          i--;
          if(i<0)
          {
            clearInterval(oTimer);
            oTimer=null;
            that.show_ranklist = true;
            that.rank_show = false;
            for(var j=0;j<aDiv.length;j++){
              aDiv[j].className = '';
            }
          }
        },iDelay);
      }
    },
    getAddress(val){
      this.selectedOptions = val;
    },
    commitAdd(){
      if(this.selectedOptions.length>=2){
        this.$http.patch('/api/personal/prompt',{
          country_id:this.selectedOptions[0],
          state_id:this.selectedOptions[1],
          city_id:this.selectedOptions[2]||null,
        })
          .then((res)=>{
            if(res.data.success){
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message:this.$t('select_address.success'),
              });
              // this.$message({
              //   message: this.$t('select_address.success'),
              //   type: 'success'
              // });
              let loginData = getStorage('isUserLogin','object')
              loginData.user.has_country = true;
              setStorage('isUserLogin',loginData);
              this.dialogVisible = false;
            }
          })
          .catch((err)=>{

          })
      }else{
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message:this.$t('select_address.failed'),
        });
        // this.$message.error(this.$t('select_address.failed'));
      }
    },
    hidetips(){
      this.show_answer_tips = false;
      this.setData({show_now_task:false});
    },
    displayBox(){
      this.show_question = !this.show_question;
    }
  },
  computed:{
    ...mapState(['show_now_task'])
  },
  mounted(){
    let _this = this;
    document.addEventListener('click', function (e) {
      if(_this.$route.fullPath.indexOf('match')==-1){
        _this.show_ranklist = false
        _this.showlist();
      }
    })
  },
  watch:{
    $route(to,from){
      if(this.$route.fullPath.indexOf('ranking')!=-1){
        this.rank_active = true
      }else{
        this.rank_active = false
      }
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tab
  width:100%;
  height:100%;
  .message
    width:30px
    height:26px
    position:relative
    float:left;
    margin-right:35px;
    margin-top:12px;
    cursor:pointer;
    .message_ico
      width: 100%
      height:100%
      set_bg('sx.png')
      display:inline-block
    .message_num
      width: 20px;
      height: 20px;
      background: red;
      color: white;
      font-size: 10px;
      border-radius: 10px;
      position: absolute;
      right: -10px;
      top: -8px;
      line-height: 20px;
      text-align: center;

  .beingAnswered
    position:fixed;
    right:40px;
    bottom:30px;
    text-align:right;
    z-index 9999
    .cursor_btn
      width:100px;
      height:105px;
      set_bg('dalao.png');
      position:relative;
      display:inline-block;
      cursor:pointer;
      .count
        position:absolute;
        right:3px;
        top:15px;
        width:25px;
        height:25px;
        background:color-fen;
        border-radius:50%;
        color:white;
        line-height:25px;
        text-align:center;
        font-size:18px;

    .tips_box
      display:inline-block;
      color:white;
      font-size:16px;
      text-align:left;
      width:300px;
      height:130px;
      background:#0d1927;
      border:1px solid lightblue;
      border-radius:5px;
      padding:12px;
      h3
        color:lightblue;
        font-size:18px;
        margin:15px 0 15px;
        span
          font-weight:bold;
      .btn_group
        text-align:center;
        .to_hide,.to_answer
          width:100px;
          height:30px;
          line-height:30px;
          text-align:center;
          color:white;
          display:inline-block;
          border-radius:5px;
          cursor:pointer;
        .to_hide
          background:#042a40;
          margin-right:10px;
        .to_answer
          background:lightblue;
</style>
<style>
  /*导航栏积分榜*/
  @keyframes open{
    0%
    {
      -webkit-transform:rotateX(-120deg);
    }
    25%
    {
      -webkit-transform:rotateX(30deg);
    }
    50%
    {
      -webkit-transform:rotateX(-15deg);
    }
    75%
    {
      -webkit-transform:rotateX(8deg);
    }
    100%
    {
      -webkit-transform:rotateX(0deg);
    }
  }
  @keyframes clos{
    0%
    {
      -webkit-transform:rotateX(0deg);
    }
    100%
    {
      -webkit-transform:rotateX(-120deg);
    }
  }
  .hider{
    display: none;
  }
  .rank_list .rank_nav{
    top:60px!important;
  }
  #scoreboard_nav{ position:relative; -webkit-perspective:800px;cursor:pointer;}
  #scoreboard_nav h2{ height:84px; color:#fff; text-align:center;margin:0; position:relative;z-index:10;}
  #scoreboard_nav div{ position:absolute; width:100%;left:0; -webkit-transform-style:preserve-3d; -webkit-transform-origin:top;-webkit-transform:rotateX(-120deg);z-index:12;}
  #scoreboard_nav a,#scoreboard_nav span{ display:block;height:30px;background:#09182b; color:#02ceff; text-align:center; box-shadow:inset 0 0 0 20px rgba(0,0,0,.3); border-bottom:1px solid black;line-height:30px;}
  /*#scoreboard_nav a:hover{*/
    /*background:url(../../assets/img/button/lan.png)no-repeat;*/
    /*background-size:100% 100%;*/
    /*text-decoration:none;*/
    /*color:white;*/
  /*}*/
  #scoreboard_nav a{
    font-size:14px;
  }
  #scoreboard_nav>div{top:60px;}
  #scoreboard_nav .show{-webkit-animation:2s open;-webkit-transform:rotateX(0deg);}
  #scoreboard_nav .hide{-webkit-animation:0.8s clos;-webkit-transform:rotateX(-120deg);}
  #scoreboard_nav .show>a{ box-shadow:inset 0 0 0 20px rgba(0,0,0,0);}
  #scoreboard_nav .tab-active{
    background:url('~@/assets/img/button/lan.png')no-repeat;
    background-size:100% 100%;
    text-decoration:none;
    color:white;
  }
  #boardnav_bg{
    padding-top:20px;
  }
  #firstDiv{
    top:0!important;
  }
  #firstDiv>span{
    background:url('~@/assets/img/jianb.png')no-repeat;
    background-size:100% 100%;
    height:20px;
  }
  #scoreboard_nav #lastdiv{
    top:28px;
    z-index:-1;
  }
  #scoreboard_nav #lastdiv span{
    background:url('~@/assets/img/jianb2.png')no-repeat;
    background-size:100% 100%;
    border-bottom:none;
  }
</style>
