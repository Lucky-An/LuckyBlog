<template>
    <div class="login_wrap" :style="'background:url('+styles.login_bg+') 0% 0% / 100% 100%;'"
    >
        <div style="position:fixed;top: 60px;right: 110px;">
            <switchLanguage></switchLanguage>
        </div>
        <div>

            <img class="login_logo" :src="styles.login_logo" alt="">
            <div v-if="!showSended" class="loginForm_box" :style="'border-top:3px solid ' +styles.login_kuang_border+';background:'+styles.login_kuang_bg">
                <p class="fs28  mb40" :style="'color:'+styles.login_title_color">{{$t('login.reset')}}</p>
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

                    <el-form-item>
                        <div class="submitBtn col-f fs18" :style="'background:'+styles.submit_bg+';color:'+styles.submit_color" @click="submitForm('ruleForm')">{{$t('login.update')}}</div>
                    </el-form-item>
                </el-form>

            </div>
            <div v-else class="loginForm_box" :style="'border-top:3px solid ' +styles.login_kuang_border+';background:'+styles.login_kuang_bg">
                <p class="fs24 mb40" :style="'color:'+styles.login_title_color">
                    {{$t('login.sentEmail')}}
                    <br><br>{{$t('login.accept')}}
                </p>
            </div>
        </div>

    </div>
</template>

<script>
  import switchLanguage from '@/components/common_components/switchLanguage'

  export default {
    components: {
      switchLanguage
    },
    data () {
      return {
        styles:{
          login_bg: require('@/assets/img/login_bg.png'),
          login_logo: require('@/assets/img/login_logo.png'),
          email_icon: require('@/assets/img/email_icon.png'),
          login_kuang_border: '#0096ff',
          login_kuang_bg: '#102439',
          submit_bg: ' #0096ff;',
          submit_color: '#fff',
          login_title_color: '#fff',
        },
        ruleForm: {
          email: '',
        },
        showSended:false,//显示发送成功提示
        rules: {
          email: [
            {required: true, message: this.$t('login.email'), trigger: 'blur'},
          ],
        }
      }
    },
    created () {

      this.getStyle();
    },
    methods: {
      getStyle(){
        this.$http.get('/api/auth/login?client_id=xctf')//为了获取csrf
        .then((res)=>{
          for(let k in this.styles){
            if(res.data[k])this.styles[k]=res.data[k]
          }

        })
      },
      changeCode () {//切换验证码
        alert()
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/api/auth/reset_password',this.ruleForm,{loading:true})
            .then((res) => {
              if (res.data.success) {
                this.showSended=true;
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .mb40 {
        margin-bottom: 40px
    }

    .login_wrap {
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
            padding-top: 53px;
            padding-bottom: 33px;
            margin: 40px auto 0;

            .loginForm {
                width: 590px;
                margin: 0 auto;

                .icon_box {
                    display inline-block
                    width: 34px
                    padding-top: 1px
                }

                .login_user {
                    display inline-block
                    width: 18px
                    height: 18px
                }

                .login_email {
                    display: inline-block;
                    width: 19px
                    height: 12px
                }

                .login_lock {
                    display inline-block
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
                    margin-top: 20px
                    width: 100%;
                    border-radius: 6px;
                    cursor: pointer;
                    border: none;
                    line-height 40px
                }
            }

            .describe {
                text-align: center;

                .go_register {
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
    }
</style>
<style lang="stylus" rel="stylesheet/stylus">
    .login_wrap {


        .loginForm_box .el-input__inner {
            width: 100%;
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
