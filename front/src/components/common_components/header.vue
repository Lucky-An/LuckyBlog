<template>
    <div class="header" v-if="!logoCenter">
      <router-link :to="logo.url" class="ad_logo"  v-if="logo.add_link">
        <img :src="logo.logo" alt=""  style="max-width:258px;max-height:53px;">
      </router-link>
      <span class="ad_logo" v-else>
        <img :src="logo.logo" alt="" width="240" height="53">
      </span>
      <div class="tab_list">
        <slot name="nav_content"></slot>
      </div>
      <span class="auth_logout" @click="clearUser" v-if="person_auth">{{$t('header.logout')}}</span>
      <div class="user_handle" v-if="!hide_handle">
        <slot name="house_link"></slot>
        <switchLanguage v-show="show_lang"></switchLanguage>
        <slot name="message_tips"></slot>
        <div class="user_info"
             @mouseover="showHandle"
             @mouseout="hidelist"
             v-if="show_user"
        >
          <div class="user_detail clearfix" v-if="userInformation||userInformation!==''">
            <span class="user_logo"
                  :style="{backgroundImage: 'url('+ userInformation.logo +')',backgroundSize:'cover' }"></span>
            <span class="user_name">{{userInformation.nickname}}</span>
          </div>
          <div class="handle_box" v-show="show_list">
            <ul>
              <li v-if="sys_config.is_personal&&user.role!=='Admin'&&!person_auth" class="changePerson">
                <router-link to="/personal"><i class="el-icon-edit" style="color:#fff;font-size:16px;margin-right:5px;"></i>{{$t('header.changePerson')}}</router-link>
              </li>
              <li>
                <span id="signout" @click="clearUser">{{$t('header.logout')}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <slot name="call"></slot>
    </div>
    <div class="logoIsCenter" v-else>
      <div class="header logoCenter" >
        <span class="ad_logo"  v-if="logo.add_link">
          <img :src="logo.logo" alt=""  style="max-width:258px;max-height:53px;">
        </span>
        <span class="ad_logo" v-else>
          <img :src="logo.logo" alt="" width="240" height="53">
        </span>
        <div class="tab_list" :class="{'mrg30L':$i18n.locale=='CN'}">
          <slot name="nav_content"></slot>
        </div>
        <span class="auth_logout" @click="clearUser" v-if="person_auth">{{$t('header.logout')}}</span>
        <slot name="house_link"></slot>
        <div class="user_handle" v-if="!hide_handle">
          <switchLanguage v-show="show_lang"></switchLanguage>
          <slot name="message_tips"></slot>
          <div class="user_info"
               @mouseover="showHandle"
               @mouseout="hidelist"
               v-if="show_user"
          >
            <div class="user_detail clearfix" v-if="userInformation||userInformation!==''">
              <span class="user_logo"
                    :style="{backgroundImage: 'url('+ userInformation.logo +')',backgroundSize:'cover' }"></span>
              <span class="user_name">{{userInformation.nickname}}</span>
            </div>
            <div class="handle_box" v-show="show_list">
              <ul>
                <li v-if="sys_config.is_personal&&user.role!=='Admin'&&!person_auth">
                  <router-link to="/personal"><i class="el-icon-edit" style="color:#fff;font-size:16px;margin-right:5px;"></i>{{$t('header.changePerson')}}</router-link>
                </li>
                <slot name="other_select"></slot>
                <li>
                  <span id="signout" @click="clearUser">{{$t('header.logout')}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <slot name="call"></slot>
      </div>
    </div>
</template>

<script>
  import {setStorage,getStorage} from '@/utils/storage'
  import {createNamespacedHelpers} from 'vuex'
  import switchLanguage from './switchLanguage'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import {
    ad5_logout
  } from '@/api/common'
export default {
  components:{
    switchLanguage
  },
  inject:['reload'],
  data(){
    return{
      sys_config:getStorage('system_config','object'),
      user_data:{},
      show_list:false,
      show_user:false,
      person_auth:false,
      ad5_logout,
      user:getStorage('isUserLogin','object').user,
    }
  },
  props: ['show_lang','logo','personalUrl','logoCenter','hide_handle'],
  created(){
    if(getStorage('isUserLogin','object')){
      this.person_auth = getStorage('isUserLogin','object').user.is_temp
      if(!this.person_auth){
        this.$http.get(this.personalUrl + 'personal/user')
          .then((res)=>{
            if(res.data.success){
              this.setData({userInformation:res.data.message.user});
            }
          })
          .catch((err)=>{

          })
      }
    }

    this.show_user = localStorage.isUserLogin&&!this.person_auth ? true : false;
  },
  methods:{
    ...mapMutations(['setData']),
    clearUser(){
      this.ad5_logout()
        .then((res)=>{
          if(res.data.success){
            localStorage.removeItem('isUserLogin');
            this.setData({show_now_task:false});
            this.setData({userInformation:''});
            this.$router.push({
              path: '/login'
            })
            this.reload();
          }
        })
    },
    showHandle(){
      this.show_list = true;
    },
    hidelist(){
      this.show_list = false;
    },
  },
  computed:{
    ...mapState(['show_now_task','userInformation'])
  },
  mounted() {

  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/common/stylus/mixin.styl'
  #signout:before{
    content:'';
    clear:both;
    display:inline-block;
    width:15px;
    height:15px;
    vertical-align -2px;
    margin-right:8px;
    color:#fff;
    background:url('~@/assets/img/close.png') no-repeat;
    background-size:100% 100%;
    background-position:center center;
    display:inline-block;
  }

  .header
    background:black;
    height:80px;
    border-bottom:1px solid darkblue;
    .ad_logo
      width:258px;
      height:53px;
      float:left;
      margin:12px 60px 0 0;
    .tab_list
      .tab-item
        float:left;
        height:80px;
        line-height:80px;
        background: url('~@/assets/img/fen.png') no-repeat right;
        .tab-active
          set_bg('header4.png')
        .rank_nav
          width:100%;
          position:absolute;
          left:0;
          top:55px;
          z-index: 5;
          li
            width:100%;
            height:36px;
            line-height: 36px;
            background:cornflowerblue;
            border-bottom:1px solid black;
            a
              width:100%;
              height:100%;
              display:inline-block;
        .rank_list
          position:relative


    .user_handle
      float:right
      margin-top:17px
      .change_lang
        margin-top:12px;
        display:inline-block;
        cursor:pointer;
        .active
          color:lightblue;
      .user_info
        float:left;
        position:relative;
        .user_detail
          cursor:pointer;
          .user_logo
            background-position:center center;
            width: 40px;
            height: 40px;
            border-radius: 24px;
            border: 1px solid white;
            float: left;
            margin-right: 7px;
          .user_name
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            float: left;
            height:40px;
            line-height:40px;
            color: white;
            text-align: left;
        .handle_box
          width: 134px;
          position:absolute;
          left:-16px;
          top:48px;
          z-index:20;
          ul
            width:100%;
            li
              width: 100%;
              height: 36px;
              line-height: 36px;
              text-align: center;
              display: inline-block;
              background: #09182b;
              background-size: 100% 100%;
              color: #02ceff;
              border-bottom: 1px solid black;
              &:hover
                set_bg('lan.png')
                cursor:pointer;
              a,span
                width:100%;
                height:100%;
                display:inline-block;
                text-decoration: none;
                color:white
                text-align:left;
                padding:0 12px;

  .auth_logout
    float:right;
    margin-top:33px;
    color:#fff;
    text-decoration:underline;
    cursor:pointer;
    margin-left:40px;
  @media (max-width:1300px)
    .header
      padding:0 50px;
      .tab-item
        width:105px;
  @media (min-width:1300px) and (max-width:1600px)
    .header
      padding:0 50px;
      .tab-item
        width:110px;
  @media (min-width:1600px) and (max-width:1920px)
    .header
      padding:0 110px;
      .tab-item
        width:120px;
  @media (min-width:1920px)
    .header
      padding:0 110px;
      .tab-item
        width:120px;
.tab-item a,.tab-item .teamHeader,.rank_list .rank_title
  cursor:pointer;
  width:100%;
  height:84px;
  display:inline-block;
  font-size:16px;
  color:contentColor;


</style>
