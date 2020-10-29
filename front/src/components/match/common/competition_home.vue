<template>
  <!--此组件为竞赛页面公用部分（导航、公用弹框等）-->
  <div>
    <div style="position:relative;" class="header_wraps">
      <v-header show_lang="true"
                :logo="logo"
                :personalUrl="api.personal_url"
                :hide_handle="!is_login"
                logoCenter="1">
        <div slot="nav_content">
          <div class="tab-item" v-for="(nav_tab,index) in nav" :class="{
          'mar_space_right':mar_right==index+1,
          'mar_space_left':mar_left==index+1,
          'big_space_right':mar_right==index+1&&nav.length<3,
          'big_space_left':mar_left==index+1&&nav.length<3,
          }" >
            <router-link :to="{path:nav_tab.path,query:nav_tab.query}">{{nav_tab.name}}</router-link>
          </div>
          <div class="tab-item" v-if="nav.length%2!==0" style="position:relative;z-index:-50;">
            <a href="" style="width:78px;opacity: 0;cursor:default!important"></a>
          </div>
        </div>
        <!--<div slot="house_link" class="house_link">-->
          <!--<router-link to="/" >-->
            <!--<span class="myHouse">{{$t('dialog_list.comebackMatch')}}</span>-->
          <!--</router-link>-->
        <!--</div>-->
        <div slot="call" class="is_call">
          <slot name="crazy_call"></slot>
        </div>
        <div slot="other_select">
          <li class="myHouse">
            <router-link to="/">{{$t('dialog_list.comebackMatch')}}</router-link>
          </li>
        </div>
      </v-header>
    </div>
    <slot name="nav_menu"></slot>
    <router-view v-wechat-title="$t($route.meta.title)"></router-view>
    <el-dialog
      :title="$t('dialog_list.tips')"
      :visible.sync="dialogVisibles"
      width="600px"
      center
      custom-class="public-dialog"
    >
          <span>
            <span class="el-icon-warning success_icon"></span>
            <span class="font16">{{$t('guide.match_end')}}</span>
          </span>
      <!--<div class="mrg20T" style="font-size:14px;" v-if="user.is_temp">-->
        <!--{{$t('selfHelp_competition.account_warning')}}-->
      <!--</div>-->
    </el-dialog>
    <slot name="other_wrap"></slot>
  </div>
</template>

<script>
  import {
    personal_url
  } from '@/api/common'
  import header from '@/components/common_components/header'
  import menuNav from '@/components/match/common/small_part/challenge_menu'

  export default {
    components:{
      'v-header':header,
      menuNav
    },
    name: 'competition_home',
    inject:['reload'],
    props:['logo','nav','format_time','match_status','match_all_data','dialogVisible'],
    data(){
      return{
        team_data:{},
        api:{
          personal_url
        },
        score_timer:null,
        dialogVisibles:false,
        mar_right:null,
        mar_left:null,
        is_login:localStorage.isUserLogin
      }
    },
    created(){
      this.dialogVisibles = this.dialogVisible
      let n = this.nav.length%2;
      this.mar_right = n==0 ? this.nav.length/2 : Math.ceil(this.nav.length/2);
      this.mar_left = this.mar_right+1;
      //对未登录用户做展示处理
      if(!this.is_login){
        this.nav = [];
      }
    },
    methods:{

    },
    watch:{
      dialogVisible(val,old){
        this.dialogVisibles = this.dialogVisible
      },
    }
  }
  //加载ad5比赛样式
  if(window.location.pathname.split('/')[1]=='ad5'){
    require('@/common/css/match_theme_color/common.styl');
    require('@/common/css/match_theme_color/ad5_attack.styl');
    require('@/common/css/match_theme_color/ad5_jad_#14162b.styl');
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .match_top
    position:relative;
    margin-bottom: 15px;
    margin-top: 25px;
    position: relative;
    z-index: 20;
    .match_title
      margin:0 auto;
      color:white;
      font-size:24px;
      padding:35px 0 20px;
      border-bottom:1px solid borderColor;
      .first_title
        margin-bottom:10px;

    .timer
      color:white;
      padding:8px 26px;
      background:#434343;
      border-radius:50px;
      position:absolute;
      right:0;
      top:30px;
      font-size:16px;
  .success_icon
    font-size:40px;
    margin-right:20px;
    color:#1affd1;
    vertical-align:middle;
  .changeName
    match-confirmbtn-sm()
    padding:0;
  .cancelchangeName
    match-cancelbtn-sm()
    padding:0;
  .house_link
    position:absolute;
    cursor:pointer!important;
    *
      color:#fff;
  .myHouse a:before
    content:'';
    clear:both;
    display:inline-block;
    width:15px;
    height:15px;
    vertical-align -2px;
    margin-right:8px;
    color:#fff;
    background:url('~@/assets/img/ad5/house.png') no-repeat;
    background-size:100% 100%;
    background-position:center center;
    display:inline-block;

</style>
<style lang="stylus" rel="stylesheet/stylus">
    @media (max-width:1300px)
      .house_link
        left:65px;
        top:10px;
        width:105px;
        height:30px;
        font-size:14px;

    @media (min-width:1300px) and (max-width:1600px)
      .house_link
        left:65px;
        top:10px;
        width:105px;
        height:30px;
        font-size:14px;

    @media (min-width:1600px)
      .house_link
        left:65px;
        top:20px;
        width:105px;
        height:30px;
        font-size:14px;
  .label_white
    .el-form-item__label
      color:white!important;
</style>
