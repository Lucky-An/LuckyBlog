<template>
  <div class="app-container create_match">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model.trim="ruleForm.username" :disabled="Boolean(user_id)" placeholder="请输入账号"/>
      </el-form-item>

      <el-form-item v-if="!user_id" label="密码" prop="password1">
        <el-input v-model.trim="ruleForm.password1" type="password" placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item v-if="!user_id" label="确认密码" prop="password2">
        <el-input v-model.trim="ruleForm.password2" type="password" placeholder="请再次输入密码"/>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model.trim="ruleForm.nickname" placeholder="请输入昵称"/>
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select v-model="ruleForm.role" :disabled="ruleForm.role===1" class="filter-item" placeholder="请选择角色">
          <el-option v-if="user_id&&ruleForm.role==1" :value="1" label="admin"/>
          <el-option v-for="(item,index) in roleList" v-if="item.id!==1" :key="index" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="ruleForm.role==3" label="关联赛事">
        <el-select v-model="ruleForm.event_id" class="filter-item" placeholder="请选择赛事名称">
          <el-option v-for="(item,index) in matchList" :key="index" :label="item.name_zh" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="战队">
        <el-select v-model="ruleForm.team_id" class="filter-item" placeholder="请选择战队">
          <el-option v-for="(item,index) in teamList" :key="index" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model.trim="ruleForm.phone" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model.trim="ruleForm.identity_number" placeholder="请输入身份证"/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model.trim="ruleForm.email" placeholder="请输入邮箱"/>
      </el-form-item>

      <!--<el-form-item label="有效期">-->
      <!--<el-date-picker-->
      <!--v-model="ruleForm.expire_time"-->
      <!--value-format="yyyy-MM-dd HH:mm:ss"-->
      <!--type="datetime"-->
      <!--placeholder="选择开始日期"-->
      <!--/>-->
      <!--</el-form-item>-->
      <el-form-item label="用户头像">

        <UploadFile :file.sync="ruleForm.logo" :list-type="'picture-card'" :file-size="2*1024*1024" :file-type="['png','jpg']"/>
        （请上传PNG、JPG格式文件，大小不超过2M）
      </el-form-item>

      <el-form-item>

        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button type="warning" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { addUser, showUserInfo, fetchUserRole, fetchTeamList, editUser, deleteUserLogo } from '@/api/account'
import { fetchList } from '@/api/match/realWord'
import UploadFile from '@/components/UploadFile'

export default {
  name: 'Index',
  directives: { waves },
  components: {
    UploadFile
  },
  data() {
    const reg = /^[a-z0-9]+$/i
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!reg.test(value)) {
        callback(new Error('密码只能包含大小写字母和数字'))
      } else {
        if (this.ruleForm.password2 !== '') {
          this.$refs.ruleForm.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (!reg.test(value)) {
        callback(new Error('密码只能包含大小写字母和数字'))
      } else if (value !== this.ruleForm.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      matchList: [], // 竞赛列表
      roleList: [],
      teamList: [],
      user_id: this.$route.query.user_id,
      ruleForm: {
        username: '', // 账号
        password1: '',
        password2: '',
        nickname: '', // 昵称
        role: '', // 角色
        event_id: '', // 竞赛ID
        team_id: '', // 战队
        phone: '',
        identity_number: '', // 身份证号
        email: '', // 邮箱
        expire_time: '', // 有效期
        logo: ''// 头像

      },
      rules: {
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        usergroup_id: [
          { required: true, message: '请选择用户分组', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }
        ],
        password1: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 10 个字，支持大小写英文字母、数字', trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 10 个字，支持大小写英文字母、数字', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }
        ]

      },
      imgUrl: {
        logo: ''
      }

    }
  },
  created() {
    this.getInfo()
    this.getMatch()

    if (this.user_id) this.getUserInfo()
  },
  methods: {
    deleteImg(ref) { // 删除服务器的图片
      this.$confirm('此操作会删除服务器中的图片，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserLogo({ field: ref, user_id: this.user_id }).then(res => {
          if (res.data.success) {
            this.$message.success('删除成功')
            this.ruleForm[ref] = ''
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    clearImg(ref) { // 删除预览图
      this.imgUrl[ref] = ''
      this.$refs[ref].value = ''
    },
    handleImage(ref) { // input 选择文件
      const file = this.$refs[ref].files[0]
      if (file) {
        // 转成base64完成预览。
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          this.imgUrl[ref] = reader.result
        }
      } else {
        this.imgUrl[ref] = ''
      }
    },
    getMatch() {
      fetchList().then(res => {
        this.matchList = res.data.rows
      })
    },
    getUserInfo() {
      showUserInfo(this.user_id).then(res => {
        for (const k in this.ruleForm) {
          this.ruleForm[k] = res.data[k]
        }
      })
    },

    goBack() {
      this.$router.push('/account/user/index')
    },
    getInfo() { // 初始信息
      fetchUserRole().then(res => {
        this.roleList = res.data
      })
      fetchTeamList().then(res => {
        this.teamList = res.data.rows
      })
    },
    submitForm() {
      const fm = new FormData()
      const formData = this.ruleForm
      if (this.user_id) {
        delete formData.password1
        delete formData.password2
      }
      for (const key in formData) {
        fm.append(key, formData[key])
      }

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.user_id) {
            editUser(this.user_id, fm).then(res => {
              if (res.data.success) {
                this.$router.push('/account/user/index')
              }
            })
          } else {
            addUser(fm).then(res => {
              if (res.data.success) {
                this.$router.push('/account/user/index')
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }

}
</script>

<style scoped>
  .create_match {
    width: 90%;
    min-width: 600px;
  }

</style>
