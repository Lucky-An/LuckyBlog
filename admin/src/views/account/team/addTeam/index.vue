<template>
  <div class="app-container create_match">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        :rules="{
          required: true,
          message: '战队名称不能为空',
          trigger: 'blur',
        }"
        label="战队名称"
        prop="name"
      >
        <el-input v-model.trim="ruleForm.name" />
      </el-form-item>
      <el-form-item label="战队Logo">
        <UploadFile
          :file.sync="ruleForm.logo"
          :list-type="'picture-card'"
          :file-size="2 * 1024 * 1024"
          :file-type="['png', 'jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过2M）
      </el-form-item>

      <el-form-item label="战队介绍">
        <el-input v-model="ruleForm.brief_introduction" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button v-waves type="primary" @click="submitForm">保存</el-button>
        <el-button v-waves type="warning" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { addTeam, editTeam, teamInfo } from '@/api/account'
import UploadFile from '@/components/UploadFile'

export default {
  name: 'Index',
  directives: { waves },
  components: {
    UploadFile
  },
  data() {
    return {
      team_id: this.$route.query.team_id,
      ruleForm: {
        name: '',
        logo: '',
        brief_introduction: ''
      },
      imgUrl: {
        logo: '',
        cover: '',
        competition_company_url: ''
      }
    }
  },
  created() {
    if (this.team_id) this.getInfo()
  },
  methods: {
    goBack() {
      this.$router.push('/account/team/index')
    },
    getInfo() {
      // 获取比赛信息回显
      teamInfo(this.team_id).then((res) => {
        for (var key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const fm = new FormData()

          for (const key in this.ruleForm) {
            fm.append(key, this.ruleForm[key])
          }
          if (this.team_id) {
            editTeam(this.team_id, fm).then((res) => {
              if (res.data.success) {
                this.$router.push('/account/team/index')
              }
            })
          } else {
            addTeam(fm).then((res) => {
              if (res.data.success) {
                this.$router.push('/account/team/index')
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
