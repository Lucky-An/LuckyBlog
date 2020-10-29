<template>
  <div class="app-container addEntity">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="设备组名称" prop="name">
        <el-input v-model.trim="ruleForm.name" placeholder="请输入设备组名称"/>
      </el-form-item>

      <el-form-item label="设备组描述" prop="content">
        <el-input :rows="8" v-model="ruleForm.content" type="textarea" placeholder="请输入设备组描述"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button type="warning" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addEntityGroup, entityGroupInfo, editEntityGroup
} from '@/api/image'

export default {
  data() {
    return {
      id: this.$route.query.id,
      ruleForm: {
        name: '',
        content: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入设备组名称', trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入设备组描述', trigger: 'blur' },
          { min: 1, max: 256, message: '长度在 2 到 256个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.id) {
      this.entityInfo()
    }
  },
  methods: {
    // 回显
    entityInfo() {
      entityGroupInfo(this.id).then(res => {
        const { data } = res.data
        for (const k in this.ruleForm) {
          this.ruleForm[k] = data[k]
        }
      })
    },
    goBack() {
      history.back()
    },
    submitForm(formName) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.id) {
            // 编辑
            editEntityGroup(this.id, this.ruleForm).then(res => {
              if (res.data.success) {
                this.$router.push('/image/entity')
              }
            })
          } else {
            // 新增
            addEntityGroup(this.ruleForm).then(res => {
              if (res.data.success) {
                this.$router.push('/image/entity')
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
<style lang="scss">
  .addEntity{
    width: 90%;
  }

  .mac_box{
    float: left;
    width: 70%;
    margin-bottom: 10px;
    .el-input{
      width: 30%;
      margin-right: 10px;
    }
  }

  .img_table .el-table__header-wrapper {
    th:first-child {
      div.cell {
        display: none;
      }
    }
  }
</style>
