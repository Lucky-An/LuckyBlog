<template>
  <div class="login-container">

    <div v-if="isPermit" class="login_box">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left">

        <div class="title-container">
          <h3 class="title">后台管理登录</h3>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input
            v-model.trim="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :type="passwordType"
            v-model.trim="loginForm.password"
            :placeholder="$t('login.password')"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>

        <el-form-item class="code" prop="image_code">
          <span class="svg-container">
            <svg-icon icon-class="icon"/>
          </span>
          <el-input
            v-model.trim="loginForm.image_code"
            placeholder="验证码"
            name="username"
            type="text"
            auto-complete="on"
          />

        </el-form-item>
        <imgCode ref="imgCode" class="code_box" @changeCode="changeCode"/>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin:50px 0 30px 0;"
          @click.native.prevent="handleLogin">立即登录
        </el-button>

      </el-form>
    </div>

    <div v-if="isPermit===false" class="permit">
      <h3 class="per_title">
        产品许可导入
      </h3>
      <p>
        检测到当前许可为不可用状态，请使用下列申请码申请许可，获取平台使用权限
      </p>
      <p>
        产品名称：赛宁网络安全攻防实战平台
      </p>
      <div class="btn_box">
        <a :href="'/api/v1/download/license/?auth_secret_key='+params.auth_secret_key" style="margin-right: 20px;" download>
          <el-button type="primary">下载申请码</el-button>
        </a>
        <el-button type="primary" @click="showDialog=true">上传许可</el-button>
      </div>

    </div>

    <el-dialog :close-on-click-modal="false" :visible.sync="showDialog" title="上传许可" class="upladPermit" center @close="closePermit">
      <p v-if="filename" class="filename">已选文件名称：{{ filename }}</p>
      <div slot="footer" class="dialog-footer">
        <span class="upload_box">
          <input ref="permit" type="file" @change="changeFile">
          <el-button type="primary">选择许可文件</el-button>
        </span>
        <el-button type="success" @click="uploadPermit">上传到服务器</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import imgCode from '@/components/imgCode'
import SocialSign from './socialsignin'
import { loginByUsername, fetchToken, getPermit, uploadPermit, updatePermit } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign, imgCode },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const image_code = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        image_code_id: '',
        image_code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        image_code: [{ required: true, trigger: 'blur', validator: image_code }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,

      isPermit: null, // 是否许可
      params: {
        auth_secret_key: ''
      }, // 许可序列码
      filename: ''// 选择的文件名称
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    fetchToken()
    // window.addEventListener('hashchange', this.afterQRScan)

    document.onkeydown = (e) => {
      var key = window.event.keyCode
      if (key == 13) {
        this.handleLogin()
      }
    }
    this.getPermit()
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    closePermit() { // 关闭上传许可的弹窗
      this.$refs['permit'].value = ''
      this.filename = ''
    },
    changeFile() {
      const permit = this.$refs['permit'].files
      if (permit.length > 0) {
        this.filename = permit[0].name
      } else {
        this.filename = ''
      }
    },
    getPermit() {
      getPermit().then(res => {
        const { data } = res
        this.isPermit = data.success
        this.params.auth_secret_key = data.auth_secret_key
        // this.params.auth_secret_key='6w4daw213w5r4wetweeAWAD541'
      })
    },
    uploadPermit() {
      const permit = this.$refs['permit'].files

      if (permit.length === 0) {
        this.$message.error('请选择文件')
        return
      }

      if (permit[0].size > 10 * 1024 * 1024) {
        this.$message.error('许可文件大小不能超过10M')
        return
      }

      const fm = new FormData()
      fm.append('authed_license_zip', permit[0])

      uploadPermit(fm, this.params).then(res => {
        if (res.data.success) {
          this.updatePermit()
        }
      })
    },
    updatePermit() {
      updatePermit(this.params).then(res => {
        if (res.data.success) {
          this.isPermit = true
          this.showDialog = false
          this.$message.success('授权成功')
        }
      })
    },
    changeCode(val) { // 切换验证码
      this.loginForm.image_code_id = val.img_auth_code
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.imgCode.initUUid()
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' || this.redirect })
          }).catch((err) => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;

      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    position: relative;

    .el-input {
      display: inline-block;
      height: 40px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 40px;
        caret-color: $cursor;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #283a4d;
      border-radius: 5px;
      color: #454545;
    }

    .code {
      width: 60%;
      float: left;

      .el-input {
        width: 80%;
      }
    }

    .code_box {
      border-radius: 5px;
      width: 35%;
      height: 100%;
      float: right;
    }

    .permit {
      color: #fff;
      font-size: 14px;
      padding: 0 20px;
      border: 1px solid #0096ff;
      position: absolute;
      background: #102439;
      left: 50%;
      top: 50%;
      margin: -150px 0 0 -400px;
      width: 800px;
      height: 300px;

      .per_title {
        color: yellow;
        font-size: 18px;
        text-align: center;

      }

      .btn_box {
        width: 100%;
        height: 80px;
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {

    min-height: 100%;
    width: 100%;
    background: url(~@/assets/img/loginBg.jpg);
    background-size: 100% 100%;
    overflow: hidden;

    .login_box {
      float: right;
      margin-right: 10vw;
      width: 410px;
      height: 100vh;
      display: flex;
      align-items: center;
    }

    .login-form {
      background: #102439;
      position: relative;
      border-top: 4px solid #0096ff;
      width: 410px;
      padding: 48px 34px 0;
      float: right;
      overflow: hidden;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
<style>
  .upladPermit .el-dialog {
    background: #102439;
    border: 1px solid #0096ff;
  }
  .upladPermit .el-dialog__title{
    color: #fff;
    font-weight: bold;
  }
  .upladPermit .filename{
    color: #Fff;
    font-size: 16px;
  }
  .upladPermit .upload_box{
    position: relative;
    margin-right: 10px;
    overflow: hidden;
  }
  .upladPermit .upload_box input{
    opacity: 0;
    width: 130px;
    height: 40px;
    position: absolute;
  }
</style>
