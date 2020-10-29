<template>
    <div class="login_wrap" :style="'background:url('+styles.login_bg+') 0% 0% / 100% 100%;'"
    >
        <div style="position:fixed;top: 60px;right: 110px;">
            <switchLanguage></switchLanguage>
        </div>
        <div>
            <img class="login_logo" :src="styles.login_logo" alt="">
            <div class="loginForm_box" :style="'border-top:3px solid ' +styles.login_kuang_border+';background:'+styles.login_kuang_bg">

                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="loginForm">

                    <el-form-item prop="username">
                        <el-input v-model="ruleForm.username"
                                  :placeholder="$t('login.userPlace')">
                            <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_user"
                                   :style="'background:url('+styles.login_user_icon+');background-size:100% 100%;'"></i>
                            </span>

                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input :placeholder="$t('login.passPlace')" type="password" v-model="ruleForm.password"
                                  autocomplete="off">
                            <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_lock "
                                   :style="'background:url('+styles.login_lock_icon+');background-size:100% 100%;'"></i>
                            </span>
                        </el-input>
                    </el-form-item>
                    <el-form-item  prop="image_code">
                        <el-input style="width: 420px;float: left;" v-model="ruleForm.image_code"
                                  :placeholder="$t('login.codePlace')">
                            <span slot="prefix" class="el-input__icon  icon_box">
                                <i class="login_code"
                                   :style="'background:url('+styles.login_code_icon+');background-size:100% 100%;'"></i>
                            </span>
                        </el-input>
                        <span class="code_box">
                            <imgCode @changeCode="changeCode" ref="imgCode"></imgCode>
                            <router-link to="/resetPassword" class="forget col-f" :style="'color:'+styles.forget">{{ $t('login.forgetPass')}}</router-link>
                        </span>
                    </el-form-item>

                    <el-form-item>
                        <div class="submitBtn fs18" :style="'background:'+styles.submit_bg+';color:'+styles.submit_color" @click="submitForm">{{
                            $t('login.now')}}
                        </div>
                    </el-form-item>
                    <p class="describe" :style="'color:'+styles.describe_color">
                        {{ $t('login.noAccount')}}
                        <router-link to="/register" class="go_register" :style="'color:'+styles.go_register_color">{{
                            $t('login.RegisterAccount')}}
                        </router-link>
                    </p>
                </el-form>

            </div>

        </div>

    </div>
</template>

<script>
  import {setStorage} from '@/utils/storage'
  import switchLanguage from '@/components/common_components/switchLanguage'
  import {createNamespacedHelpers} from 'vuex'
  import imgCode from '@/components/common_components/img_code'

  const {mapMutations} = createNamespacedHelpers('match')

  export default {
    components: {
      switchLanguage,
      imgCode
    },
    data () {
      return {
        new_img_code: '',
        styles:{
          login_bg: require('@/assets/img/login_bg.png'),
          login_logo: require('@/assets/img/login_logo.png'),
          login_user_icon: require('@/assets/img/user_icon.png'),
          email_icon: require('@/assets/img/email_icon.png'),
          login_qz_icon: require('@/assets/img/qz_icon.png'),
          login_lock_icon: require('@/assets/img/lock_icon.png'),
          login_code_icon: require('@/assets/img/code_icon.png'),
          login_kuang_border: '#0096ff',
          login_kuang_bg: '#102439',
          placeholder_color: '#878f95',
          submit_bg: ' #0096ff;',
          describe_color: '#999798;',
          forget: '#999798;',
          go_register_color: '#0096ff',
          submit_color: '#fff',
        },
        ruleForm: {
          username: '',
          password: '',
          image_code: '',
          image_code_id: '',
        },
        rules: {
          username: [
            {required: true, message: this.$t('login.userPlace'), trigger: 'blur'},
          ],
          password: [
            {required: true, message: this.$t('login.passPlace'), trigger: 'blur'},
          ],
          image_code: [
            {required: true, message: this.$t('login.codePlace'), trigger: 'blur'},
          ],
        }
      }
    },
    created(){
      this.getStyle();


      document.onkeydown = (e)=> {
        var key = window.event.keyCode;
        if (key == 13) {
          this.submitForm();
        }
      }
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
      ...mapMutations(['setData']),
      changeCode (val) {//切换验证码
        this.ruleForm.image_code_id = val.img_auth_code
      },
      submitForm (formName) {
        // this.$refs.imgCode.initUUid();
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/auth/login', this.ruleForm,{loading:true}).then(res => {
              if (res.data.success) {
                setStorage('isUserLogin', res.data.user_data)
                setStorage('only_event_id', 93)
                setStorage('only_event_hash', '4a51ba39-49ef-4c91-b0d9-c31a1540d1e0.event')
                this.setData({show_now_task: true})
                //setStorage('isUserLogin',user_data)
                setTimeout(()=>{
                  if(res.data.user_data.user.is_temp){
                    this.$router.push({
                      path: '/common/detail', query: {id: res.data.user_data.user.event}//跳攻防世界
                      // path: '/match/guide', query:{event:'1'}//跳竞赛
                    })
                  }else{
                    this.$router.push({
                      path: '/personal', query: {userid: this.ruleForm.name}//跳攻防世界
                      // path: '/match/guide', query:{event:'1'}//跳竞赛
                    })
                  }
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
                    padding-top: 3px
                }

                .login_user {
                    display inline-block
                    width: 18px
                    height: 18px
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
                    margin-right: 10px
                    img {
                        width: 153px
                        height: 40px
                    }
                }

                .forget {
                    cursor pointer
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

        .code_box {
            .el-input {
                display none;
            }
            img{
                width: 100%
            }
        }

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
