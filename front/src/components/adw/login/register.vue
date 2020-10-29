<template>
  <div class="register_wrap" :style="'background:url('+styles.login_bg+') 0% 0% / 100% 100%;'"
  >
    <div style="position:fixed;top: 60px;right: 110px;">
      <switchLanguage></switchLanguage>
    </div>

    <div>
      <img class="login_logo" :src="styles.login_logo" alt="">
      <div v-if="!$route.query.used">
        <div v-if="!showSended" class="loginForm_box"
             :style="'border-top:3px solid ' +styles.login_kuang_border+';background:'+styles.login_kuang_bg">
          <p class="describe" :style="'color:'+styles.describe_color">
            {{$t('login.haveAccount')}}
            <router-link to="/login" class="go_register" :style="'color:'+styles.go_register_color">
              {{$t('login.now')}}
            </router-link>
          </p>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="loginForm">
            <el-form-item prop="email">
              <el-input v-model="ruleForm.email"
                        :placeholder="$t('login.email')"
              >
                            <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_email"
                                   :style="'background:url('+styles.email_icon+');background-size:100% 100%;'"></i>
                            </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username"
                        :placeholder="$t('login.userName')"
              >
                             <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_user"
                                   :style="'background:url('+styles.login_user_icon+');background-size:100% 100%;'"></i>
                            </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="nickname">
              <el-input v-model="ruleForm.nickname"
                        :placeholder="$t('login.nickname')"
              >
                             <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_nick"
                                   :style="'background:url('+styles.login_nick_icon+');background-size:100% 100%;'"></i>
                            </span>
              </el-input>
            </el-form-item>

            <el-form-item class="address" prop="country_id">

              <i class="login_qz"
                 :style="'background:url('+styles.login_qz_icon+');background-size:100% 100%;'"></i>
              <selectAddress @changed="getAddress"></selectAddress>
            </el-form-item>

            <!--密码1-->
            <el-form-item prop="password">
              <el-input :placeholder="$t('login.passPlace')" type="password" v-model="ruleForm.password"
                        autocomplete="off">
                             <span slot="prefix" class="el-input__icon  icon_box">
                                    <i class="login_lock"
                                       :style="'background:url('+styles.login_lock_icon+');background-size:100% 100%;'"></i>
                                </span>
              </el-input>
            </el-form-item>

            <!--密码2-->
            <el-form-item prop="password2">
              <el-input :placeholder="$t('login.passPlaceAgain')" type="password" v-model="ruleForm.password2"
                        autocomplete="off">
                             <span slot="prefix" class="el-input__icon  icon_box">
                                    <i class="login_lock"
                                       :style="'background:url('+styles.login_lock_icon+');background-size:100% 100%;'"></i>
                                </span>
              </el-input>
            </el-form-item>

            <el-form-item prop="image_code">
              <el-input style="width: 420px;float: left;" v-model="ruleForm.image_code"
                        :placeholder="$t('login.codePlace')">
                            <span slot="prefix" class="el-input__icon  icon_box">
                                    <i class="login_code"
                                       :style="'background:url('+styles.login_code_icon+');background-size:100% 100%;'"></i>
                                </span>
              </el-input>
              <span class="code_box">
                            <imgCode @changeCode="changeCode" ref="imgCode"></imgCode>

                        </span>
            </el-form-item>

            <el-form-item>
              <div class="submitBtn fs18"
                   :style="'background:'+styles.submit_bg+';color:'+styles.submit_color"
                   @click="submitForm">
                {{$t('login.RegisterAccount')}}
              </div>
            </el-form-item>
            <p class="tip" :style="'color:'+styles.go_register_color">{{$t('login.tip')}}</p>
          </el-form>

        </div>
        <div v-else class="loginForm_box"
             :style="'border-top:3px solid ' +styles.login_kuang_border+';background:'+styles.login_kuang_bg">
          <p class="fs24 mb40" :style="'color:'+styles.login_title_color">
            {{$t('login.sentEmail')}}
            <br><br>{{$t('login.activate')}}
          </p>
        </div>
      </div>
      <div v-else class="loginForm_box"
           :style="'border-top:3px solid ' +styles.login_kuang_border+';background:'+styles.login_kuang_bg">
        <div class="fs24 loginForm mb40" :style="'color:'+styles.login_title_color">
          {{$t('login.activeSucc')}}
          <br><br>
          <router-link to="/login">
            <div class="submitBtn col-f fs18"
                 :style="'background:'+styles.submit_bg+';color:'+styles.submit_color">
              {{$t('login.now')}}
            </div>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import switchLanguage from '@/components/common_components/switchLanguage'
  import imgCode from '@/components/common_components/img_code'
  import selectAddress from '@/components/common_components/selectAddress'

  export default {
    components: {
      switchLanguage,
      selectAddress,
      imgCode
    },
    data () {
      return {
        styles: {
          login_bg: require('@/assets/img/login_bg.png'),
          login_logo: require('@/assets/img/login_logo.png'),
          login_user_icon: require('@/assets/img/user_icon.png'),
          login_nick_icon: require('@/assets/img/loginNcikname.png'),
          email_icon: require('@/assets/img/email_icon.png'),
          login_qz_icon: require('@/assets/img/qz_icon.png'),
          login_lock_icon: require('@/assets/img/lock_icon.png'),
          login_code_icon: require('@/assets/img/code_icon.png'),
          login_kuang_border: '#0096ff',
          login_kuang_bg: '#102439',
          submit_bg: ' #0096ff;',
          describe_color: '#999798;',
          forget: '#999798;',
          go_register_color: '#0096ff',
          submit_color: '#fff',
          login_title_color: '#fff',
        },
        showSended: false,
        countrys: [],//国家列表
        options: [],
        country: [],
        city: [],
        ruleForm: {
          email: '',//
          username: '',
          password: '',
          password2: '',
          image_code: '',
          image_code_id: '',
          state_id: '',
          city_id: 0,
          country_id: '',
          nickname: ''
        },
        rules: {
          username: [
            {required: true, message: this.$t('login.userName'), trigger: 'blur'},
          ],
          nickname: [
            {required: true, message: this.$t('login.nickname'), trigger: 'blur'},
          ],
          password: [
            {required: true, message: this.$t('login.passPlace'), trigger: 'blur'},
          ],
          password2: [
            {required: true, message: this.$t('login.passPlaceAgain'), trigger: 'blur'},
          ],
          image_code: [
            {required: true, message: this.$t('login.codePlace'), trigger: 'blur'},
          ],
          email: [
            {required: true, message: this.$t('login.email'), trigger: 'blur'},
          ],
          country_id: [
            {required: true, message: this.$t('login.country'), trigger: 'change'},
          ],
        }
      }
    },
    created () {
      this.getStyle()

      document.onkeydown = (e)=> {
        var key = window.event.keyCode;
        if (key == 13) {
          this.submitForm();
        }
      }
    },
    methods: {
      getStyle () {
        this.$http.get('/api/auth/login?client_id=xctf')//为了获取csrf
        .then((res) => {
          for (let k in this.styles) {
            if (res.data[k]) this.styles[k] = res.data[k]
          }

        })
      },
      getAddress (val) {
        this.ruleForm.country_id = val[0]
        this.ruleForm.state_id = val[1]
        if (val[2]) this.ruleForm.city_id = val[2]
      },
      changeCode (val) {//切换验证码
        this.ruleForm.image_code_id = val.img_auth_code
      },
      submitForm (formName) {
        this.$refs.imgCode.initUUid()
        this.$refs['ruleForm'].validate((valid) => {

          if (valid) {
            this.$http.post('/api/auth/register', this.ruleForm, {loading: true})
            .then((res) => {
              if (res.data.success) {
                this.showSended = true
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .mb40 {
    margin-bottom: 40px
  }

  .register_wrap {
    width: 100%;
    height: 100%;
    min-height: 900px;
    display: flex;
    align-items: center;
    justify-content: center;

    .login_logo {
      width: 380px
      height: 95px
      margin-top: -80px
    }

    .loginForm_box {
      width: 780px;
      padding-top: 15px;
      padding-bottom: 33px;
      margin: 40px auto 0;

      .loginForm {
        width: 590px;
        margin: 30px auto 0;

        .country_box {
          position: relative;

          .icon_box {
            position: absolute;
            left: 5px;
            z-index: 9;
          }
        }

        .icon_box {
          display inline-block
          width: 34px
          padding-top: 1px
        }

        .login_qz {
          display inline-block
          width: 15px
          height: 18px
          margin-top: 10px
        }

        .login_email {
          display: inline-block;
          width: 19px
          height: 12px
        }

        .login_user {
          display inline-block
          margin-top: 10px
          width: 18px
          height: 18px
        }

        .login_nick {
          display inline-block
          margin-top: 10px
          width: 17px
          height: 18px
        }

        .login_lock {
          display inline-block
          margin-top: 8px
          width: 18px
          height: 20px
        }

        .login_code {
          display inline-block
          width: 21px
          height: 15px
        }

        .code_box {
          float: right
          display inline-block
          width: 153px
          height: 40px
          text-align left
          position relative
          margin-right: 10px

          img {
            width: 153px
            height: 40px
          }
        }

        .forget {
          position absolute
          color: #999798;
          right: 0;
          bottom: -38px
        }

        .submitBtn {
          margin: 20px auto 0;
          width: 50%;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          line-height 40px
        }
      }

      .describe {
        text-align: right;
        padding-right: 17px;

        .go_register {
          text-decoration: underline;
          cursor: pointer;
        }
      }

      .tip {
        margin-top: 70px
        text-align left
        line-height 20px
      }
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .register_wrap {
    .address {
      position: relative;

      .login_qz {
        position: absolute;
        z-index: 9;
        left: 15px

      }
    }

    .el-cascader__label {
      padding-left: 40px
    }

    .select_add {
      display: inline-block;
      width: 100%

      .el-cascader {
        width: 100%
      }
    }

    .code_box {
      .el-input {
        display none;
      }

      img {
        width: 100%
      }
    }

    .el-form-item__label {
      color: #ffffff
    }

    .province {
      color #fff;
      text-align right
    }

    .el-form-item__label:before {
      display none
    }

    .el-cascader__label {
      color #fff
    }

    .el-cascader__label span {
      color #fff;
    }

    .loginForm_box .el-input__inner {
      width: 100%
      height: 40px;
      border: none;
      margin: 0 auto;
      padding-left: 40px
      background-color: #263747;
      border-radius 4px
      font-weight normal
    }

    .el-input__inner::-webkit-input-placeholder {

      font-weight: normal;
    }
  }
</style>
