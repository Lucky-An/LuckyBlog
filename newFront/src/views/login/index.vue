<template>
  <div id="ad_login">
    <!--切换语言选项-->
    <div style="position: fixed; top: 20px; right: 30px; z-index: 1882">
      <switchLanguage />
    </div>
    <!--后台上传的背景图-->
    <div
      v-if="system_config.background_logo"
      class="sys_bg"
      :style="{backgroundImage: 'url(' + system_config.background_logo + ')'}"
    />

    <!-- <div
      v-if="system_config.background_logo"
      class="sys_logo"
      :style="{
        backgroundImage:
          'url(' +
          'http://10.10.40.135/media/logo/2ee9f140-23d7-4bcb-adb1-365a718ad476.png' +
          ')',
      }"
    /> -->

    <!--视频为默认背景图，如果后台没有上传背景图就显示视频背景-->
    <span v-if="!system_config.background_logo">
      <span v-if="!isIe">
        <video
          autoplay
          muted
          loop="loop"
          style="
            width: 100%;
            height: 100%;
            object-fit: fill;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
          "
        >
          <source src="@/assets/media/59.mp4">
        </video>
        <span
          v-if="!system_config.background_logo"
          class="video_bg"
        />
      </span>
      <span
        v-else
        class="sys_bg png_bg"
      />
    </span>

    <!--顶部logo展示，必填-->
    <div
      class="ad5_head"
      style="position: relative; z-index: 1"
    >
      <span class="center_logo">
        <img
          v-if="system_config.login_logo"
          :src="system_config.login_logo"
          alt=""
          style="max-width: 410px; max-height: 90px"
        >
      </span>
    </div>

    <!--中间banner图片和表单框-->
    <div class="login_main">
      <div
        class="clearfix"
        style="text-align: center"
        :class="{ middleY: !system_config.banner_logo }"
      >
        <!--banner图片，可选-->
        <img
          v-if="system_config.banner_logo"
          :src="system_config.banner_logo"
          alt=""
          class="banner_logo"
        >
        <!--表单填写框-->
        <div class="main_box is_ad_main">
          <div class="from_group">
            <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              class="loginForm"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="ruleForm.username"
                  :placeholder="$t('login.userName')"
                >
                  <span
                    slot="prefix"
                    class="el-input__icon icon_box"
                  >
                    <i class="login_user" />
                  </span>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  :placeholder="$t('login.passPlace')"
                  type="password"
                  autocomplete="off"
                >
                  <span
                    slot="prefix"
                    class="el-input__icon icon_box"
                  >
                    <i class="login_lock" />
                  </span>
                </el-input>
              </el-form-item>
              <el-form-item prop="image_code">
                <el-input
                  v-model="ruleForm.image_code"
                  style="float: left"
                  class="change_width"
                  :placeholder="$t('login.codePlace')"
                >
                  <span
                    slot="prefix"
                    class="el-input__icon icon_box"
                  >
                    <i class="login_code" />
                  </span>
                </el-input>
                <div class="code_box">
                  <imgCode
                    ref="imgCode"
                    v-model="ruleForm.image_code_id"
                  />
                </div>
              </el-form-item>
              <el-form-item>
                <!--立即登录-->
                <div
                  class="submitBtn fs18 tcenter"
                  @click="submitForm"
                >
                  {{ $t("login.now") }}
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div
            v-if="system_config.download_file"
            class="download fr ellipsis"
            style="color: #3074fd"
          >
            <a
              :href="system_config.download_file"
              :title=" system_config.link_description"
              download
            >
              {{
                system_config.link_description ||
                  "建议下载最新版谷歌浏览器登录本系统"
              }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!--底部支撑单位图片展示位置，可选-->
    <img
      v-if="system_config.support_company_logo"
      :src="system_config.support_company_logo"
      alt=""
      class="gongsi_wei"
    >
    <span
      v-if="isIe"
      style="position: absolute; right: 15px; bottom: 15px; color: gray"
    >温馨提示：为了您有更好的体验，请使用非IE内核浏览器</span>
    <div class="ad5_foot">
      <!--<span class="banben">{{ system_config.login_company }}</span>-->
      <span class="banben">{{ system_config.login_description }}</span>
    </div>
  </div>
</template>

<script>
import { getLogin, login } from '@/api/login'
import imgCode from '@/components/imgCode'
import switchLanguage from '@/components/switchLanguage'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  components: {
    imgCode,
    switchLanguage
  },
  data() {
    return {
      bannerUrl: '/static/img/g2.jpg',
      ruleForm: {
        username: '',
        password: '',
        image_code: '',
        image_code_id: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('login.userName'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.passPlace'),
            trigger: 'blur'
          }
        ],
        image_code: [
          {
            required: true,
            message: this.$t('login.codePlace'),
            trigger: 'blur'
          }
        ]
      },
      system_config: {},
      isIe: false
    }
  },
  created() {
    this.getLogin()
    this.isIE()

    document.onkeydown = e => {
      var key = window.event.keyCode
      if (key == 13) {
        this.submitForm()
      }
    }
  },
  methods: {
    // 获取登录页信息，banner等，存储xctf-token
    getLogin() {
      this.$store.dispatch('config/getLogin').then(res => {
        this.system_config = res
      })
    },
    submitForm(formName) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$store.dispatch('user/login', this.ruleForm).then(res => {
            if (res.data.success) {
              const { username } = res.data.user_data.user
              console.log('username: ', username)
              Cookies.set('xid', username, { expires: 365 })

              this.$router.push({
                path: '/' // 跳竞赛列表页
              })
            }
            this.$refs.imgCode.initUUid()
          })
        } else {
          return false
        }
      })
    },
    // 判断是否是IE浏览器
    isIE() {
      const that = this
      var getExplorer = (function() {
        var explorer = window.navigator.userAgent
        var compare = function(s) {
          return explorer.indexOf(s) >= 0
        }
        var ie11 = (function() {
          return 'ActiveXObject' in window
        })()
        if (compare('MSIE') || ie11) {
          return 'ie'
        } else if (compare('Firefox') && !ie11) {
          return 'Firefox'
        } else if (compare('Chrome') && !ie11) {
          if (explorer.indexOf('Edge') > -1) {
            return 'Edge'
          } else {
            return 'Chrome'
          }
        } else if (compare('Opera') && !ie11) {
          return 'Opera'
        } else if (compare('Safari') && !ie11) {
          return 'Safari'
        }
      })()

      if (getExplorer == 'ie') {
        that.isIe = true
      }
      if (getExplorer == 'Edge') {
        that.isIe = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.banner_logo {
  display: block;
  height: 80px;
  width: 400px;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
}
.gongsi_wei {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 6;
}

.icon_box {
  vertical-align: sub;
}

.is_ad_main input {
  background: #fff;
  color: #333;
}
</style>
<style lang="scss" scoped>
.code_write {
  float: left;
}

#ad_login {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 600px;
  background-size: 100% 100%;
  position: relative;
  overflow-x: hidden;

  .sys_bg {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: left top;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sys_logo {
    width: 400px;
    height: 80px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: left top;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20%;
  }

  .png_bg {
    background-image: url("~@/assets/login/ie.png");
  }

  .video_bg {
    width: 100%;
    height: 100%;
    background: rgba(34, 4, 93, 0.3);
    position: absolute;
    left: 0;
    top: 0;
  }

  .ad5_head {
    width: 100%;
    height: 100px;
    background: url("~@/assets/login/dlt2.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .center_logo {
      width: 600px;
      height: 99px;
      background: url("~@/assets/login/dlt11.png") no-repeat;
      margin: 0 auto;
      display: flex;
      justify-content: center;
    }
  }

  .login_main {
    width: 1200px;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

    .middleY {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    .main_box {
      background: rgba(0, 0, 0, 0.2);
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      margin: 0 auto;
      border-top: 3px solid #0080ff;
      border-top: 3px solid #0080ff;
      position: relative;
      * {
        color: #fff;
      }

      .loginForm {
        padding-top: 0px;
      }

      .head {
        font-weight: bold;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .login_user,
      .login_lock,
      .login_code {
        display: inline-block;
        color: #2f375c;
      }

      .login_user {
        background: url("~@/assets/login/user_icon.png");
        background-size: 100% 100%;
      }

      .login_lock {
        background: url("~@/assets/login/lock_icon.png");
        background-size: 100% 100%;
      }

      .login_code {
        background: url("~@/assets/login/code_icon.png") no-repeat;
        background-size: 100% auto;
      }

      .code_box {
        float: right;
        display: inline-block;
        text-align: left;
        position: relative;
      }

      .submitBtn {
        background: #3074fd;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
      }
      /*首页下载文件*/
      .download {
        position: relative;
        width: 100%;
        bottom: 5px;
        a {
          text-align: right;
          color: #3074fd;
          font-size: 12px;
          text-decoration: underline;
        }
      }
    }
  }

  .ad5_foot {
    width: 100%;
    min-width: 1300px;
    height: 80px;
    position: absolute;
    left: 0;

    .wh {
      color: #fff;
    }

    .company {
      font-size: 14px;
      margin-right: 50px;
      display: inline-block;
      color: #fff;
    }

    .banben {
      color: #fff;
      vertical-align: middle;
      width: 100%;
      display: inline-block;
      line-height: 26px;
      text-align: center;
    }
  }
}

@media (max-width: 1300px) {
  .huangheImg {
    width: 450px;
  }
  .login_main {
    padding: 100px 0 130px;
  }
  .gongsi_wei {
    height: 85px;
  }
  .ad5_foot {
    bottom: 15px;
  }
  .wh {
    font-size: 26px;
    margin-bottom: 15px;
  }
  .code_write {
    width: 280px;
  }
  .main_box {
    width: 380px;
    padding: 12px 20px;

    .head {
      line-height: 65px;
      height: 55px;
      font-size: 18px;
    }

    .login_user,
    .login_lock,
    .login_code {
      width: 18px;
      height: 18px;
    }

    .login_code {
      vertical-align: -2px;
    }

    .code_box {
      width: 95px;
      height: 40px;

      img {
        width: 145px;
        height: 34px;
      }
    }

    .submitBtn {
      margin-top: 5px;
    }
  }
}

@media (min-width: 1300px) and (max-width: 1550px) {
  .huangheImg {
    width: 450px;
  }
  .login_main {
    padding: 100px 0 130px;
  }
  .gongsi_wei {
    height: 114px;
  }
  .ad5_foot {
    bottom: 15px;
  }
  .wh {
    font-size: 26px;
    margin-bottom: 15px;
  }
  .code_write {
    width: 280px;
  }
  .main_box {
    width: 420px;
    padding: 18px 25px;

    .head {
      line-height: 65px;
      height: 55px;
      font-size: 18px;
    }

    .login_user,
    .login_lock,
    .login_code {
      width: 18px;
      height: 18px;
    }

    .login_code {
      vertical-align: -2px;
    }

    .code_box {
      width: 95px;
      height: 40px;

      img {
        width: 145px;
        height: 34px;
      }
    }

    .submitBtn {
      margin-top: 5px;
    }
  }
}

@media (min-width: 1550px) {
  .code_box {
    width: 110px;
    height: 40px;
  }
  .huangheImg {
    width: 645px;
  }
  .login_main {
    padding: 100px 0 180px;
  }
  .gongsi_wei {
    height: 160px;
  }
  .ad5_foot {
    bottom: 0px;
  }
  .wh {
    font-size: 32px;
    margin-bottom: 20px;
  }
  .code_write {
    width: 310px;
  }
  .main_box {
    width: 508px;
    padding: 32px;

    .head {
      line-height: 65px;
      height: 55px;
      font-size: 18px;
    }

    .login_user,
    .login_lock,
    .login_code {
      width: 18px;
      height: 18px;
    }

    .login_code {
      vertical-align: -2px;
    }

    .code_box {
      width: 110px;
      height: 40px;

      img {
        width: 153px;
        height: 40px;
      }
    }

    .submitBtn {
      margin-top: 8px;
    }
  }
}
</style>
<style lang="scss" scoped>
@media (max-width: 1550px) {
  .is_ad_main .el-input__prefix {
    top: 0;
  }
}

@media (min-width: 1550px) {
  .is_ad_main .el-input__prefix {
    top: 4px;
  }
}

@media (max-width: 1300px) {
  .loginForm {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }

    .el-form-item__content {
      line-height: 34px;
    }
  }
  .change_width {
    width: 230px;
  }
}

@media (min-width: 1300px) and (max-width: 1550px) {
  .loginForm {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }

    .el-form-item__content {
      line-height: 34px;
    }
  }
  .change_width {
    width: 260px;
  }
}

@media (min-width: 1550px) {
  .loginForm {
    .el-input__inner {
      height: 40px;
      line-height: 40px;
    }

    .el-form-item__content {
      line-height: 40px;
    }
  }
  .change_width {
    width: 310px;
  }
}
</style>

