<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.status"
        class="filter-item"
        clearable
        size="mini"
        placeholder="请选择账户状态"
      >
        <!-- <el-option :value="3" label="到期"/> -->
        <el-option
          :value="2"
          label="禁用"
        />
        <el-option
          :value="1"
          label="正常"
        />
      </el-select>
      <el-input
        v-model.trim="listQuery.search"
        placeholder="请输入账号或名称"
        style="width: 200px;"
        size="mini"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList(1)"
      >搜索
      </el-button>
    </div>

    <div class="filter-container">
      <el-button
        type="success"
        size="mini"
        @click="addTopic"
      > 新增</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="removeSub"
      > 删除</el-button>
      <el-button
        type="success"
        size="mini"
        @click="blackUser(1)"
      > 恢复</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="blackUser(2)"
      > 禁用</el-button>
      <!--<el-button type="primary" size="mini" @click="unlock"> 解锁</el-button>-->

      <div class="fr">
        <el-button
          type="danger"
          size="mini"
          @click="allPassword"
        > 批量重置密码</el-button>
        <el-button
          type="success"
          size="mini"
          @click="uploadDia=true"
        > 批量导入</el-button>
        &nbsp;
        <a
          href="/api/v1/common/admin/users/uploads"
          download
        >
          <el-button
            type="warning"
            size="mini"
          > 下载模板</el-button>
        </a>
      </div>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        @selection-change="checkTable"
      >

        <el-table-column
          align="center"
          type="selection"
        />

        <el-table-column
          align="center"
          prop="name"
          label="序号"
          width="50"
        >
          <template slot-scope="scope">
            <span>{{ indexMethod(listQuery.offset,listQuery.limit,scope.$index) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="username"
          label="账号"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="昵称"
        />

        <el-table-column
          align="center"
          prop="role_name"
          label="角色"
        />

        <el-table-column
          align="center"
          prop="sex"
          label="账号状态"
        >
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.status==3">到期</span> -->
            <span v-if="scope.row.status==1">正常</span>
            <span v-if="scope.row.status==2">禁用</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="180px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="editPassword(scope.row)"
            >重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--重置密码 begin-->
    <el-dialog
      :visible.sync="passwordDia"
      class="addsub"
      title="重置密码"
      width="900px"
      @close="clearPassword"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="密码"
          prop="password1"
        >
          <el-input
            v-model.trim="ruleForm.password1"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="password2"
        >
          <el-input
            v-model.trim="ruleForm.password2"
            type="password"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-waves
          type="primary"
          @click="submitPassword"
        >保存</el-button>
        <el-button
          v-waves
          @click="passwordDia=false"
        >取消</el-button>
      </span>
    </el-dialog>
    <!--重置密码  end-->

    <!--批量重置密码 begin-->
    <el-dialog
      :visible.sync="isAllPassword"
      class="addsub"
      title="批量重置密码"
      width="900px"
      @close="clearPassword"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="密码"
          prop="password1"
        >
          <el-input
            v-model.trim="ruleForm.password1"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="password2"
        >
          <el-input
            v-model.trim="ruleForm.password2"
            type="password"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-waves
          type="primary"
          @click="submitAllPassword"
        >保存</el-button>
        <el-button
          v-waves
          @click="isAllPassword=false"
        >取消</el-button>
      </span>
    </el-dialog>
    <!--批量重置密码  end-->

    <!--导入excel begin-->
    <el-dialog
      :visible.sync="uploadDia"
      class="addsub"
      title="批量导入"
      width="400px"
      @close="closeUpload"
    >
      <div>
        <el-upload
          ref="upload"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadSectionFile"
          :file-list="fileList"
          class="upload-demo"
          action=""
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >选取文件</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >只能上传excel文件，且不超过2MB</div>
        </el-upload>
        <div>
          <p
            v-for="i in errList"
            style="color: red;margin: 5px;"
          >{{ i }}</p>
        </div>
      </div>
    </el-dialog>
    <!--导入excel  end-->

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  fetchUserList,
  deleteUser,
  changeUserStatus,
  fetchUserRole,
  editPassword,
  editAllPassword
} from '@/api/account'
import Cookies from 'js-cookie'
import { indexMethod } from '@/utils'

export default {
  name: 'UserCneter',
  directives: { waves },
  components: {
    Pagination
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
      indexMethod,
      passwordDia: false,
      uploadDia: false,
      groupDig: false,
      userId: '',
      ruleForm: {
        password1: '',
        password2: ''
      },
      fileList: [],
      roleList: [],
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        status: '', // 所有账户状态
        usergroup_id: '', // 用户分组id
        search: '' // 用户昵称
      },
      headers: { 'X-CSRF-Token': Cookies.get('X-CSRF-Token') },
      rules: {
        password1: [
          { required: true, validator: validatePass, trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 10 个字，支持大小写英文字母、数字、符号',
            trigger: 'blur'
          }
        ],
        password2: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 10 个字，支持大小写英文字母、数字、符号',
            trigger: 'blur'
          }
        ]
      },
      errList: [], // 导入错误列表
      isAllPassword: false
    }
  },
  created() {
    this.getList()
    this.getGroups()
  },
  methods: {
    // 弹窗关闭清空表单
    clearPassword() {
      this.ruleForm.password1 = ''
      this.ruleForm.password2 = ''
      this.$refs.ruleForm.clearValidate()
    },
    allPassword() {
      if (this.ids.length === 0) {
        return
      }
      this.isAllPassword = true
    },
    uploadSectionFile(param) {
      var fileObj = param.file
      // 接收上传文件的后台地址
      var FileController = '/api/v1/common/admin/users/uploads'
      // FormData 对象
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      this.axios({
        url: FileController,
        method: 'post',
        data: form,
        headers: this.headers
      }).then(res => {
        if (res.data.success) {
          this.$message.success('上传成功')
          this.uploadDia = false
          this.getList()
        } else {
          this.errList = res.data.message_zh
          // this.$message.error(res.data.message_zh)
        }
      })
    },

    editPassword(row) {
      this.userId = row.id
      this.passwordDia = true
    },
    submitPassword() {
      // 提交密码
      editPassword(this.userId, this.ruleForm).then(res => {
        if (res.data.success) {
          this.getList()
          this.passwordDia = false
          this.$message.success('操作成功')
        }
      })
    },
    submitAllPassword() {
      // 提交密码
      const data = JSON.parse(JSON.stringify(this.ruleForm))
      data.user_ids = this.ids
      editAllPassword(data).then(res => {
        if (res.data.success) {
          this.getList()
          this.isAllPassword = false
          this.$message.success('操作成功')
        }
      })
    },
    closeUpload() {
      this.fileList = []
      this.errList = []
    },
    beforeAvatarUpload(file) {
      const fileType = file.name.substr(file.name.lastIndexOf('.'))
      const isExcel = fileType.includes('xls')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isExcel) {
        this.$message.error('文件只能是excel格式')
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 2MB!')
      }
      return isExcel && isLt2M
    },
    showTalking(content) {
      this.talkDia = true
      this.introduction = content
    },
    getGroups() {
      fetchUserRole().then(res => {
        this.roleList = res.data
      })
    },
    removeSub() {
      // 删除用户
      const params = {}
      params.ids = this.ids
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(params).then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList(1)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    blackUser(num) {
      // 禁用 恢复禁用
      const params = {}
      params.ids = this.ids
      params.status = num
      changeUserStatus(params).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    addTopic() {
      // 新增用户
      this.$router.push({
        path: '/account/user/addUser'
      })
    },
    editTopic(id) {
      // 编辑用户
      this.$router.push({
        path: '/account/user/editUser',
        query: {
          user_id: id
        }
      })
    },
    getList(page) {
      if (page === 1) this.listPage = page
      this.listQuery.offset = this.listPage
      fetchUserList(this.listQuery).then(res => {
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    }
  }
}
</script>

<style scoped>
.addsub .pagination-container {
  padding: 0;
}

.dict-secong-trans {
  text-decoration: underline;
  color: #4395ff;
}

.bm {
  padding-bottom: 20px;
  border-bottom: 1px solid #bbb;
}

.fcenter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style>
.el-icon-close {
  color: red;
}
</style>
