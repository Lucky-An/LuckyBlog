<template>
<div class="solving_type">
  <div class="tab border-1px">
    <div style="height:82px;position:relative;">
      <v-header show_lang="true" :logo="ad_logo" :personalUrl="api.personal_url">
        <div slot="nav_content" v-if="!person_auth">
          <div class="tab-item">
            <router-link to="/competition">{{$t("header.competition.competition")}}</router-link>
          </div>
          <div class="tab-item" v-if="sys_config.is_tool">
          <router-link to="/tools">{{$t("header.tools")}}</router-link>
          </div>
          <div class="tab-item" v-if="sys_config.is_personal">
          <router-link to="/personal">{{$t("header.personal.home")}}</router-link>
          </div>
        </div>
      </v-header>
    </div>
    <router-view v-wechat-title="$t($route.meta.title)"></router-view>
  </div>
</div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
  import header from '@/components/common_components/header'
  import selectAddress from '@/components/common_components/selectAddress'
  import {setStorage,getStorage} from '@/utils/storage'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import {
    personal_url
  } from '@/api/common'
  export default {
    components: {
      'v-header': header,
    },
    data(){
      return{
        api:{
          personal_url
        },
        ad_logo:{
          url:'/',
          add_link:true,
          logo:getStorage('system_config','object').home_page_logo
        },
        sys_config:getStorage('system_config','object'),
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
    name: 'ad5_home',
    inject:['reload'],
    created(){
      this.show_message = localStorage.isUserLogin ? true : false;
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
    },
    beforeDestroy(){
      clearInterval(this.timer);
    },
    methods:{
      ...mapMutations(['setData']),
    },
    computed:{
      ...mapState(['show_now_task'])
    },
    mounted(){
    },
    watch:{

    },
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  /*ad5公用样式*/
  @import '~@/common/css/match_theme_color/common.styl'



</style>
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
