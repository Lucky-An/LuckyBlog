<template>
  <div class="personal_box">
    <!--信息展示begin-->
    <div v-if="!to_personal_edit">
      <div class="look clearfix">
        <el-button v-if="personform.role!=='Admin'" class="fr" type="primary" @click="to_personal_edit=true">编辑</el-button>
      </div>
      <div class="content">
        <div class="left">
          <div class="img_box">
            <img :src="personform.logo" alt="">
          </div>
        </div>
        <div class="right">
          <p>
            <span class="label_left">{{ $t('ad5.personal.account') }}：</span>
            <span>{{ personform.username?personform.username:$t('task.none') }}</span>
          </p>
          <p>
            <span class="label_left">{{ $t('ad5.personal.role') }}：</span>
            <span>{{ personform.role?personform.role:$t('task.none') }}</span>
          </p>

          <!--<p>-->
          <!--<span class="label_left">{{ $t('ad5.personal.group') }}：</span>-->
          <!--<span>{{ personform.usergroup_name?personform.usergroup_name:$t('task.none') }}</span>-->
          <!--</p>-->

          <!--<p>-->
          <!--<span class="label_left">{{ $t('ad5.personal.term') }}：</span>-->
          <!--<span>{{ personform.expire_time?personform.expire_time:$t('task.none') }}</span>-->
          <!--</p>-->
          <p>
            <span class="label_left">{{ $t('ad5.personal.nikeName') }}：</span>
            <span>{{ personform.nickname?personform.nickname:$t('task.none') }}</span>
          </p>
          <p>
            <span class="label_left">{{ $t('ad5.personal.phone') }}：</span>
            <span>{{ personform.phone?personform.phone:$t('task.none') }}</span>
          </p>
          <p>
            <span class="label_left">{{ $t('ad5.personal.idNumber') }}：</span>
            <span>{{ personform.identity_number?personform.identity_number:$t('task.none') }}</span>
          </p>
          <p>
            <span class="label_left">{{ $t('ad5.personal.email') }}：</span>
            <span>{{ personform.email?personform.email:$t('task.none') }}</span>
          </p>
          <p>
            <span class="label_left">{{ $t('ad5.personal.short_introduce') }}：</span>
            <span>{{ personform.introduction?personform.introduction:$t('task.none') }}</span>
          </p>
        </div>
      </div>
    </div>
    <!--信息展示end-->
    <!--编辑信息begin-->
    <div v-else class="content">
      <div class="left">
        <div class="img_box fcenter " @click="logoVisible=true">
          <img :src="personform.logo" alt="">
          <span>{{ $t('ad5.personal.changeLogo') }}</span>
        </div>
        <el-button style="margin: 10px auto;" type="primary" @click="passWordVisible = true">{{
          $t('personal.changePassword') }}
        </el-button>
      </div>
      <div class="right">
        <el-form ref="ruleForm" :rules="rules" :model="edit_personform" label-width="180px">
          <el-form-item :label="$t('ad5.personal.account')+'：'">
            <el-input v-model="edit_personform.username" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('ad5.personal.role')+'：'">
            <el-input v-model="edit_personform.role" :disabled="true" />
          </el-form-item>
          <!--<el-form-item :label="$t('ad5.personal.group')+'：'">-->
          <!--<el-input v-model="edit_personform.usergroup_name" :disabled="true" />-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="$t('ad5.personal.term')+'：'">-->
          <!--<el-input v-model="edit_personform.expire_time" :disabled="true" />-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('ad5.personal.nikeName')+'：'">
            <el-input v-model="edit_personform.nickname" />
          </el-form-item>
          <el-form-item :label="$t('ad5.personal.phone')+'：'">
            <el-input v-model="edit_personform.phone" />
          </el-form-item>
          <el-form-item :label="$t('ad5.personal.idNumber')+'：'">
            <el-input v-model="edit_personform.identity_number" />
          </el-form-item>
          <el-form-item :label="$t('ad5.personal.email')+'：'">
            <el-input v-model="edit_personform.email" />
          </el-form-item>
          <el-form-item :label="$t('ad5.personal.short_introduce')+'：'">
            <el-input v-model="edit_personform.introduction" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('modal.submit') }}</el-button>
            <el-button class="cancel_btn" @click="cancel_edit()">{{ $t('modal.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--编辑信息end-->

    <!--上传头像begin-->
    <el-dialog
      class="my-dialog"
      :title="$t('ad5.personal.changeLogo')"
      width="650px"
      :visible.sync="logoVisible"
    >
      <el-upload
        ref="upload"
        action="customize"
        class="avatar-uploader"
        :http-request="uploadLogo"
        :on-change="changefile"
        accept="image/jpeg,image/png"
        :multiple="false"
        :file-list="fileList"
        :auto-upload="false"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <div style="text-align:center;color:#a4a8b3 ">
        {{ $t('ad5.personal.logo_accept') }}，{{ $t('validateImg.md_size') }}
      </div>
      <div class="submit_handle" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload()">{{ $t('question.submit') }}</el-button>
        <el-button class="cancel_btn" @click="cancel_change_logo()">{{ $t('modal.cancel') }}</el-button>
      </span>
    </el-dialog>
    <!--上传头像end-->
    <!--修改用户密码begin-->
    <el-dialog
      class="my-dialog changePass"
      :title="$t('ad5.personal.changePass')"
      width="650px"
      :visible.sync="passWordVisible"
    >
      <el-form
        ref="passWordForm"
        :model="passWordForm"
        status-icon
        :rules="passWordrules"
        label-width="190px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('ad5.personal.oldPass')+'：'" prop="password">
          <el-input v-model="passWordForm.password" type="password" />
        </el-form-item>
        <el-form-item :label="$t('ad5.personal.newPass')+'：'" prop="password1">
          <el-input v-model="passWordForm.password1" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('ad5.personal.againPass')+'：'" prop="password2">
          <el-input v-model="passWordForm.password2" type="password" autocomplete="off" />
        </el-form-item>
        <span style="margin-left:180px;color: #fff">{{ $t('ad5.personal.pass_info') }}</span>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPassWordForm('passWordForm')">{{ $t('question.submit') }}</el-button>
        <el-button class="cancel_btn" @click="passWordVisible=false">{{ $t('modal.cancel') }}</el-button>
      </span>
    </el-dialog>
    <!--修改用户密码end-->
  </div>
</template>

<script>
import {
  personalCenter,
  editPersonal,
  changePersonalLogo,
  changePersonalPass
} from '@/api/match'

export default {
  name: 'Index',
  inject: ['reload'],
  data() {
    var checkOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (this.passWordForm.password1.length < 6 || this.passWordForm.password1.length > 20) {
        callback(new Error('密码长度在6-20之间'))
      } else {
        if (this.passWordForm.password2 !== '') {
          this.$refs.passWordForm.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.passWordForm.password2.length < 6 || this.passWordForm.password2.length > 20) {
        callback(new Error('密码长度在6-20之间'))
      } else if (value !== this.passWordForm.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passWordForm: {
        password1: '',
        password2: '',
        password: ''
      },
      passWordrules: {
        password1: [
          { validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        password: [
          { validator: checkOldPass, trigger: 'blur' }
        ]
      },
      personform: {
        email: null,
        expire_time: '',
        identity_number: '',
        introduction: '',
        logo: '',
        nickname: '',
        phone: '',
        role: '',
        usergroup_id: '',
        usergroup_name: '',
        username: ''
      },
      edit_personform: {}, // 编辑时的信息，需要和旧的信息做对比，只发送有改动的数据给后端
      rules: {
        nickname: [
          { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' }
        ],
        short_introduce: [
          { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' }
        ]
      },
      fileList: [], // 文件列表
      to_personal_edit: false, // 是否是编辑模式
      logoVisible: false, // 是否上传头像
      passWordVisible: false, // 是否修改密码
      imageUrl: ''
    }
  },
  created() {
    this.personalCenter()
  },
  methods: {
    // 取消上传头像
    cancel_change_logo() {
      this.logoVisible = false
      this.fileList = []
    },
    // 选择文件
    changefile(file, fileList) {
      this.$refs.upload.uploadFiles = [this.$refs.upload.uploadFiles[this.$refs.upload.uploadFiles.length - 1]]
      var _this = this
      var event = event || window.event
      var file = event.target.files[0]
      var reader = new FileReader()
      // 转base64
      reader.onload = function(e) {
        _this.imageUrl = e.target.result // 将图片路径赋值给src
      }
      reader.readAsDataURL(file)
    },
    // 上传
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 自定义文件上传
    uploadLogo: function(param) {
      var fileObj = param.file
      // FormData 对象
      var form = new FormData()
      // 文件对象
      form.append('logo', fileObj)
      // XMLHttpRequest 对象
      changePersonalLogo(form).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: this.$t('dialog_list.tips'),
            message: this.$t('select_address.success')
          })
          this.logoVisible = false
          this.fileList = []
          this.personform.logo = res.data.logo
          this.imageUrl = res.data.logo
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      var isJPG = false
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        isJPG = true
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$notify.error({
          customClass: 'error_notify',
          title: this.$t('public.error'),
          message: this.$t('ad5.personal.logo_accept')
        })
        // this.$message.error(this.$t('validateImg.logo_require'));
      }
      if (!isLt2M) {
        this.$notify.error({
          customClass: 'error_notify',
          title: this.$t('public.error'),
          message: this.$t('validateImg.size')
        })
        // this.$message.error(this.$t('validateImg.size'));
      }
      return isJPG && isLt2M
    },
    // 取消编辑
    cancel_edit() {
      this.to_personal_edit = false
      this.edit_personform = JSON.parse(JSON.stringify(this.personform))
    },
    // 比较数据
    diffDevinfo() {
      const diffData = {}
      for (const k in this.personform) {
        if (this.personform[k] != this.edit_personform[k]) {
          diffData[k] = this.edit_personform[k]
        }
      }
      return diffData
    },
    // 提交编辑的用户信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const new_params = this.diffDevinfo()
          const formData = new FormData()
          for (var attr in new_params) {
            formData.append(attr, new_params[attr])
          }
          editPersonal(formData).then(res => {
            if (res.data.success) {
              this.to_personal_edit = true
              this.personform = JSON.parse(JSON.stringify(this.edit_personform))
              this.$notify.success({
                title: this.$t('dialog_list.tips'),
                message: this.$t('select_address.success')
              })
              this.reload()
            }
          })
        } else {
          return false
        }
      })
    },
    // 提交修改用户密码
    submitPassWordForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePersonalPass(this.passWordForm).then(res => {
            if (res.data.success) {
              this.$notify.success({
                title: this.$t('dialog_list.tips'),
                message: this.$t('select_address.success')
              })
              this.passWordVisible = false
              this.$router.push({
                path: '/login'// 跳转到登录页重新登录
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取用户信息
    personalCenter() {
      personalCenter().then(res => {
        for (const k in this.personform) {
          this.personform[k] = res.data[k]
        }
        this.edit_personform = JSON.parse(JSON.stringify(res.data))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .personal_box {
    margin: 56px 200px;
    color: #fff;
    background: #1b1f3c;
    padding: 40px;
    min-height: calc(100vh - 250px);

    .content {
      display: flex;

      .left {
        width: 220px;
        display: flex;
        flex-direction: column;

        .fcenter {
          cursor: pointer;
        }

        .img_box {
          position: relative;
          width: 140px;
          height: 140px;
          border: 2px solid #3074fd;
          border-radius: 4px;
          margin: 0 auto;

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

        }
      }

      .right {
        flex: 1;

        p {
          margin-bottom: 40px;

          .label_left {
            display: inline-block;
            width: 180px;
            text-align: right;
          }
        }
      }

    }
  }

  .cancel_btn {
    color: #ACAEAE;
    background: none;
  }
</style>
<style lang="scss">
  .avatar-uploader {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    margin-bottom: 10px;
    .el-upload {
      width: 100%;
      height: 100%;
      border: 1px dashed #0080ff;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
