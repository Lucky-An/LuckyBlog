<template>
  <div class="app-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane key="sub" label="升级包升级方式" name="sub">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
          <el-form-item label="更新包升级" prop="email">
            <el-button @click="goBack">上传</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      activeName: 'sub',

      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {

  }

}
</script>

<style scoped>
  .create_match {
    width: 90%;
    min-width: 600px;
  }

</style>
