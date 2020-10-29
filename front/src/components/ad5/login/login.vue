<template>
    <div id="ad_login">
      <!--切换语言选项-->
      <div style="position:fixed;top: 20px;right: 30px;z-index:1882">
        <switchLanguage></switchLanguage>
      </div>
      <!--后台上传的背景图-->
      <div class="sys_bg" :style="{backgroundImage: 'url(' + system_config.background_logo + ')'}" v-if="system_config.background_logo"></div>
      <!--视频为默认背景图，如果后台没有上传背景图就显示视频背景-->
      <span v-if="!system_config.background_logo">
          <span v-if="!isIe">
            <video autoplay loop="loop"
                     style="width:100%; height:100%; object-fit: fill;position:absolute;left:0;top:0;z-index:0">
              <source src="../../../../static/media/59.mp4">
            </video>
            <span class="video_bg" v-if="!system_config.background_logo"></span>
          </span>
          <span class="sys_bg png_bg"  v-else></span>
      </span>
      <!--顶部logo展示，必填-->
      <div class="ad5_head" style="position:relative;z-index:1;">
        <span class="center_logo" >
          <img :src="system_config.login_logo" v-if="system_config.login_logo" alt=""  style="width:410px;height:90px;">
        </span>
      </div>
      <!--中间banner图片和表单框-->
      <div class="login_main">
        <div class="clearfix" :class="{'middleY':!system_config.banner_logo}" >
          <!--banner图片，可选-->
          <img :src="system_config.banner_logo" alt="" class="banner_logo" v-if="system_config.banner_logo">
          <!--表单填写框-->
          <div class="main_box is_ad_main">
            <div class="from_group">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="loginForm">
                <el-form-item prop="username">
                  <el-input v-model="ruleForm.username"
                            :placeholder="$t('login.userName')">
                            <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_user"
                                ></i>
                            </span>

                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input :placeholder="$t('login.passPlace')" type="password" v-model="ruleForm.password"
                            autocomplete="off">
                            <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_lock "
                                ></i>
                            </span>
                  </el-input>
                </el-form-item>
                <el-form-item  prop="image_code">
                  <el-input style="float: left;" class="change_width" v-model="ruleForm.image_code"
                            :placeholder="$t('login.codePlace')">
                            <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_code"
                                ></i>
                            </span>
                  </el-input>
                  <span class="code_box">
                    <imgCode @changeCode="changeCode" ref="imgCode" project="ad5"></imgCode>
                </span>
                </el-form-item>
                <el-form-item>
                  <div class="submitBtn fs18" style="background:blue" @click="submitForm">{{
                    $t('login.now')}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!--底部公司Logo展示位置，可选-->
      <img :src="system_config.support_company_logo" alt="" class="gongsi_wei" v-if="system_config.support_company_logo">
      <span style="position:absolute;right:15px;bottom:15px;color:gray;"
        v-if="isIe"
      >温馨提示：为了您有更好的体验，请使用非IE内核浏览器</span>
      <!--<div class="ad5_foot">-->
        <!--<span class="banben">{{system_config.login_company}}</span>-->
        <!--<span class="banben">{{system_config.login_description}}</span>-->
      <!--</div>-->
    </div>
</template>

<script>
  import {setStorage,getStorage} from '@/utils/storage'
  import imgCode from '@/components/common_components/img_code'
  import {createNamespacedHelpers} from 'vuex'
  const {mapMutations} = createNamespacedHelpers('match')
  import switchLanguage from '@/components/common_components/switchLanguage'
  import {prefix_url} from '@/api/urlPrefix'
  import {setCsrf} from '@/common/js/common'
  import {
    ad5_login_post
  } from '@/api/common'
  export default {
    name: 'login',
    components:{
      imgCode,
      switchLanguage
    },
    data(){
      return{
        bannerUrl:'/static/img/g2.jpg',
        api:{
          ad5_login_post
        },
        ruleForm: {
          username: '',
          password: '',
          image_code: '',
          image_code_id: '',
        },
        rules: {
          username: [
            {required: true, message: this.$t('login.userName'), trigger: 'blur'},
          ],
          password: [
            {required: true, message: this.$t('login.passPlace'), trigger: 'blur'},
          ],
          image_code: [
            {required: true, message: this.$t('login.codePlace'), trigger: 'blur'},
          ],
        },
        system_config:{},
        isIe:false,
      }
    },
    created(){
      let that = this;
      var getExplorer = (function () {
        var explorer = window.navigator.userAgent,
          compare = function (s) { return (explorer.indexOf(s) >= 0); },
          ie11 = (function () { return ("ActiveXObject" in window) })();
        if (compare("MSIE") || ie11) { return 'ie'; }
        else if (compare("Firefox") && !ie11) { return 'Firefox'; }
        else if (compare("Chrome") && !ie11) {
          if (explorer.indexOf("Edge") > -1) {
            return 'Edge';
          } else {
            return 'Chrome';
          }
        }
        else if (compare("Opera") && !ie11) { return 'Opera'; }
        else if (compare("Safari") && !ie11) { return 'Safari'; }

      })()

      if (getExplorer == 'ie') {
        that.isIe = true;
      }
      if (getExplorer == 'Edge') {
        that.isIe = true;
      }
      this.$http.get(prefix_url + 'auth/login')//为了获取csrf
        .then((res) => {
          setStorage('system_config',res.data);
          this.system_config = res.data;
          this.$http.interceptors.request.use(
            config => {
              setCsrf(config)
              return config
            }
          )
        })
      document.onkeydown = (e)=> {
        var key = window.event.keyCode;
        if (key == 13) {
          this.submitForm();
        }
      }
    },
    methods:{
      ...mapMutations(['setData']),
      changeCode (val) {//切换验证码
        this.ruleForm.image_code_id = val.img_auth_code
      },
      submitForm (formName) {
        this.$refs.imgCode.initUUid();
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.api.ad5_login_post(this.ruleForm,{loading:true}).then(res => {
              if (res.data.success) {
                setStorage('isUserLogin', res.data.user_data)
                setStorage('show_all_evt', res.data.show_all_evt)
                // setStorage('only_event_id', 93)
                // setStorage('only_event_hash', '4a51ba39-49ef-4c91-b0d9-c31a1540d1e0.event')
                this.setData({show_now_task: true})
                //setStorage('isUserLogin',user_data)
                setTimeout(()=>{
                  this.$router.push({
                    path: '/competition',//跳竞赛列表页
                  })
                },500)
              }
            })

          } else {
            return false
          }
        })
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .gongsi_wei{
    position:absolute;
    left:50%;
    bottom:0;
    transform:translateX(-50%);
    z-index:6;
  }

  .code_box{
    .el-input{
      display:none;
    }
  }
  .is_ad_main input{
    background:#fff!important;
    color:#333;
  }
  @media (max-width:1550px){
    .is_ad_main .el-input__prefix{
      top:0;
    }
  }
  @media (min-width:1550px){
    .is_ad_main .el-input__prefix{
      top:4px;
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .code_write{
    float:left;
  }
  #ad_login{
    width:100%;
    height:100%;
    min-width:1200px;
    min-height:600px;
    background-size:100% 100%;
    position:relative;
    overflow-x:hidden;
    .sys_bg{
      width:100%;
      height:100%;
      background-size:100% 100%;
      background-repeat:no-repeat;
      background-attachment fixed;
      background-position:left top;
      position:absolute;
      left:0;
      top:0;
    }
    .png_bg{
      background-image:url('~@/assets/img/ad5/ie.png');
    }
    .video_bg{
      width:100%;
      height:100%;
      background:rgba(34,4,93,.3);
      position:absolute;
      left:0;
      top:0;
    }
    .ad5_head{
      width:100%;
      height:100px;
      background:url('~@/assets/img/ad5/login/dlt2.png') no-repeat;
      background-size:100% 100%;
      .center_logo{
        width:600px;
        height:99px;
        background:url('~@/assets/img/ad5/login/dlt11.png') no-repeat;
        display:inline-block;
        margin:0 auto;
      }
    }
    .login_main{
      width:1200px;
      height:100%;
      position:absolute;
      left:0;
      right:0;
      top:0;
      bottom:0;
      margin:auto;
      .middleY{
        position:absolute;
        left:0;
        right:0;
        top:50%;
        transform translateY(-50%);
      }
      .main_box{
        background:rgba(0,0,0,.2);
        border-bottom-left-radius 5px;
        border-bottom-right-radius 5px;
        margin:0 auto;
        border-top:3px solid lightblue;
        border-top:3px solid lightblue;
        *{
          color:#fff;
        }
        .loginForm{
          padding-top:px;
        }
        .head{
          font-weight:bold;
          border-bottom:1px solid rgba(255,255,255,.1);
        }
        .login_user,.login_lock,.login_code {
          display inline-block
          color:#2f375c;
        }
        .login_user{
          background:url('~@/assets/img/ad5/login/user_icon.png');
          background-size:100% 100%;
        }
        .login_lock{
          background:url('~@/assets/img/ad5/login/lock_icon.png');
          background-size:100% 100%;
        }
        .login_code{
          background:url('~@/assets/img/ad5/login/code_icon.png') no-repeat;
          background-size:100% auto;
        }
        .code_box {
          float: right
          display inline-block
          text-align left
          position relative
        }
        .submitBtn{
          background:#3074fd!important;
          border-radius:5px;
          cursor:pointer;
          font-weight:bold;
        }
      }
    }
    .ad5_foot{
      width:100%;
      min-width:1300px;
      height:80px;
      position:absolute;
      left:0;
      .wh{
        color:#fff;
      }
      .company{
        font-size:14px;
        margin-right:50px;
        display:inline-block;
        color:#fff;
      }
      .banben{
        color:#8e91a4;
        vertical-align middle;
        width:100%;
        display:inline-block;
        line-height:26px;
      }
    }
  }
  @media (max-width:1300px){
    .huangheImg{
      width:450px;
    }
    .login_main{
      padding:100px 0 130px;
    }
    .banner_logo{
      height:205px;
    }
    .gongsi_wei{
      height:85px;
    }
    .ad5_foot{
      bottom:15px;
    }
    .wh{
      font-size:26px;
      margin-bottom:15px;
    }
    .code_write{
      width:280px;
    }
    .main_box{
      width:380px;
      height:216px;
      padding:12px 20px;
      .loginForm{
        .el-form-item{
          margin-bottom:15px;
        }
      }
      .head{
        line-height:65px;
        height:55px;
        font-size:18px;
      }
      .login_user,.login_lock,.login_code {
        width: 18px
        height: 18px
      }
      .login_code{
        vertical-align -2px;
      }
      .code_box {
        width: 95px
        height: 34px
        margin-right: 10px
        img {
          width: 145px
          height: 34px
        }
      }
      .submitBtn{
        margin-top:5px;
      }
    }
  }
  @media (min-width:1300px) and (max-width:1550px){
    .huangheImg{
      width:450px;
    }
    .login_main{
      padding:100px 0 130px;
    }
    .banner_logo{
      height:248px;
    }
    .gongsi_wei{
      height:114px;
    }
    .ad5_foot{
      bottom:15px;
    }
    .wh{
      font-size:26px;
      margin-bottom:15px;
    }
    .code_write{
      width:280px;
    }
    .main_box{
      width:420px;
      height:230px;
      padding:18px 25px;
      .loginForm{
        .el-form-item{
          margin-bottom:15px;
        }
      }
      .head{
        line-height:65px;
        height:55px;
        font-size:18px;
      }
      .login_user,.login_lock,.login_code {
        width: 18px
        height: 18px
      }
      .login_code{
        vertical-align -2px;
      }
      .code_box {
        width: 95px
        height: 34px
        margin-right: 10px
        img {
          width: 145px
          height: 34px
        }
      }
      .submitBtn{
        margin-top:5px;
      }
    }
  }
  @media (min-width:1550px){
    .code_box{
      width:110px;
      height:40px;
    }
    .huangheImg{
      width:645px;
    }
    .login_main{
      padding:100px 0 180px;
    }
    .banner_logo{
      height:300px;
    }
    .gongsi_wei{
      height:160px;
    }
    .ad5_foot{
      bottom:30px;
    }
    .wh{
      font-size:32px;
      margin-bottom:20px;
    }
    .code_write{
      width:310px;
    }
    .main_box{
      width:508px;
      height:280px;
      padding:32px;
      .loginForm{
        .el-form-item{
          margin-bottom:16px;
        }
      }
      .head{
        line-height:65px;
        height:55px;
        font-size:18px;
      }
      .login_user,.login_lock,.login_code {
        width: 18px
        height: 18px
      }
      .login_code{
        vertical-align -2px;
      }
      .code_box {
        width: 110px
        height: 40px
        margin-right: 10px
        img {
          width: 153px
          height: 40px
        }
      }
      .submitBtn{
        margin-top:8px;
      }
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus">
  @media (max-width:1300px){
    .loginForm{
      .el-input__inner{
        height:34px!important;
        line-height 34px!important;
      }
      .el-form-item__content{
        line-height 34px!important;
      }
      .code_box img{
        margin-left:10!important;
        height:34px!important;
      }
    }
    .change_width{
      width:230px!important;
    }
  }
  @media (min-width:1300px) and (max-width:1550px){
    .loginForm{
      .el-input__inner{
        height:34px!important;
        line-height 34px!important;
      }
      .el-form-item__content{
        line-height 34px!important;
      }
      .code_box img{
        margin-left:10!important;
        height:34px!important;
      }
    }
    .change_width{
      width:260px!important;
    }
  }
  @media (min-width:1550px){
    .loginForm{
      .el-input__inner{
        height:40px!important;
        line-height 40px!important;
      }
      .el-form-item__content{
        line-height 40px!important;
      }
      .code_box img{
        margin-left:10px!important;
      }
    }
    .change_width{
      width:310px!important;
    }
  }

</style>

