<template>
  <div class="app-container create_match scene_info_wrapper">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="场景名称" prop="scene_name">
        <el-input v-model.trim="ruleForm.scene_name" placeholder="请输入场景名称" />
      </el-form-item>

      <el-form-item label="场景规模">
        <el-select v-model="ruleForm.scene_type" placeholder="请选择场景规模">
          <el-option
            v-for="item in sceneTypeMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="场景介绍" prop="scene_description">
        <quill-editor v-model="ruleForm.scene_description_html" holder="请输入场景介绍"/>
      </el-form-item>
    </el-form>
    <div class="btn_box">
      <el-button type="primary" @click="backStep">上一步</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button :disabled="step" type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import { fetchSceneInfo, editSceneInfo } from '@/api/match/penetration'

export default {
  components: {
    QuillEditor
  },

  data() {
    const sceneTypeMap = [
      {
        label: '二层网络渗透赛',
        value: 1
      },
      {
        label: '三层网络渗透赛',
        value: 2
      },
      {
        label: '企业网络渗透赛',
        value: 3
      }
    ]
    return {
      step: true, // 是否可以点击一下步，必须保存成功才行
      ruleForm: {
        scene_name: '',
        scene_type: '',
        scene_description: '',
        scene_description_html: ''
      },
      rules: {
        scene_name: [
          { required: true, message: '请输入场景名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字', trigger: 'blur' }
        ],
        scene_type: [
          { required: true, message: '请选择场景规模', trigger: 'change' }
        ]
      },
      id: this.$route.query.id,
      sceneTypeMap
    }
  },

  created() {
    if (this.id) {
      this.getInfo()
    }
  },

  methods: {
    nextStep() {
      if (this.ruleForm.scene_name == '') {
        this.$message.error('请输入场景名称')
      } else {
        this.$emit('nextStep')
      }
    },

    getInfo() {
      // 获取比赛详情
      fetchSceneInfo(this.id).then((res) => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
          if (this.ruleForm.scene_name != '') {
            this.step = false
          }
        }
      })
    },
    onSubmit() {
      this.ruleForm.scene_description = this.ruleForm.scene_description_html
      editSceneInfo(this.id, this.ruleForm).then((res) => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })

          this.nextStep()
        }
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$message.error('输入信息有误')
          return false
        }
      })
    },

    backStep() {
      this.$emit('backStep')
    }
  }
}
</script>

<style lang="scss" >
.scene_info_wrapper {
  position: relative;
  width: 80%;
  min-width: 600px;
  text-align: center;
  .demo-ruleForm {
    text-align: left;
  }
}
</style>
