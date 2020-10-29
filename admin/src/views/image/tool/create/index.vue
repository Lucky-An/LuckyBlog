<template>
  <div class="app-container create_match">
    <div class="container_bg" style="padding-top: 50px;">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        style="width: 1030px; margin: 0 auto;"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="应用名称" prop="name">
          <el-input
            v-model.trim="ruleForm.name"
            class="pad_r_45"
            maxlength="50"
            show-word-limit
            placeholder="请填写应用名称，只能包含汉字、数字、字母、下划线"
          />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input
            v-model.trim="ruleForm.version"
            class="pad_r_45"
            maxlength="10"
            show-word-limit
            placeholder="请填写版本号"
          />
        </el-form-item>

        <el-form-item label="应用描述" required prop="desc">
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            placeholder="请输入描述"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="应用图标" prop="iconname">
          <UploadFile
            :file.sync="file"
            :file-type="['png','jpg']"
            :list-type="'picture-card'"
            :file-size="2*1024*1024"
          />
          (请上传PNG、JPG格式文件，大小不超过2M)
        </el-form-item>

        <el-form-item label="用途分类" required prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox-button
              v-for="items in typelist"
              :label="items.value"
              :key="items.value"
            >{{ items.name }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="margin-top: 60px;" class="from_submit_btn">
          <el-button type="info" @click="backView">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button v-show="id" type="info" @click="nextStep">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { applyadd, getAppInfo, modifyApp } from '@/api/match/property'
import UploadFile from '@/components/UploadFile'

export default {
  components: {
    UploadFile
  },
  data() {
    return {
      file: null,
      typelist: [
        { name: '数据分析', value: '1' },
        { name: '应用框架', value: '2' },
        { name: '应用中间件', value: '3' },
        { name: '应用服务', value: '4' },
        { name: '数据库', value: '5' },
        { name: 'devops工具', value: '6' },
        { name: '消息服务', value: '7' },
        { name: '安全工具', value: '8' },
        { name: '网络工具', value: '9' }
      ],
      ruleForm: {
        name: '', // 应用名称
        type: [], // 应用类型
        version: '', // 版本号
        desc: '' // 描述
      },
      rules: {
        name: [
          { required: true, message: '请填写应用名称', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: '应用名称只能包含汉字、数字、字母、下划线'
          }
        ],
        version: [{ required: true, message: '请填写版本号', trigger: 'blur' }],
        desc: [{ required: true, message: '请填写应用描述', trigger: 'blur' }],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个用途分类',
            trigger: 'change'
          }
        ]
      },
      id: this.$route.query.id
    }
  },

  created() {
    if (this.id) this.handleGetAllResource()
  },

  methods: {
    handleGetAllResource() {
      getAppInfo(this.id).then((res) => {
        const { data } = res
        if (data.success) {
          for (const key in this.ruleForm) {
            if (key === 'type') {
              const {
                information: { type }
              } = data
              this.ruleForm[key] = type.split(',').filter((el) => el)
            } else {
              this.ruleForm[key] = data.information[key]
            }
          }
          this.file = data.information.icon
        }
      })
    },

    // 取消
    backView() {
      this.$router.push({
        path: '/image/tool/list'
      })
    },
    // 提交
    onSubmit(form) {
      if (this.id) {
        modifyApp(this.id, form).then((res) => {
          const { data } = res
          if (data.success) {
            this.nextStep()
          }
        })
      } else {
        applyadd(form).then((res) => {
          const { data } = res
          if (data.success) {
            this.id = data.message.uuid
            this.nextStep()
          }
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const form = new FormData()
          if (this.file) {
            form.append('iconname', this.file)
          }
          // 其他参数
          for (const key in this.ruleForm) {
            form.append(key, this.ruleForm[key])
          }
          this.onSubmit(form)
        } else {
          return false
        }
      })
    },

    nextStep() {
      this.$router.push({
        path: '/image/tool/editnext',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>

<style scoped>
.colorFul .el-checkbox__label {
  color: #606266 !important;
}
.create_match {
  position: relative;
  width: 100%;
  min-width: 600px;
}

.create_match .el-form-item .imgBox {
  background: #a5a5a5;
  width: 200px;
  position: relative;
  line-height: 0;
}

.create_match .el-form-item .imgBox .svg-icon {
  width: 25px;
  height: 25px;
  position: absolute;
  right: -13px;
  top: -13px;
  cursor: pointer;
}

.create_match .te-switch-button {
  vertical-align: top;
}

.el-picker-panel__footer .el-button--text {
  display: none;
}

.upload_box {
  position: relative;
  margin-right: 10px;
  overflow: hidden;
  cursor: pointer;
}

.des_box p {
  margin: 5px 0 0 0;
  line-height: 20px;
}

.upload_box input {
  opacity: 0;
  width: 80px;
  height: 32px;
  position: absolute;
  cursor: pointer;
  top: -7px;
}
.avatar-uploader-icon {
  font-size: 48px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
/deep/.el-upload--picture {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-checkbox-button {
  margin-right: 20px;
  margin-bottom: 15px;
}
/deep/.el-checkbox-button__inner {
  border-radius: 4px !important;
}
.from_submit_btn .el-form-item__content {
  margin-left: -150px;
  text-align: left;
}
/deep/.el-upload__tip1 {
  position: relative;
  float: right;
  right: 460px;
}
.upload-demo {
  /* height: 130px; */
}
/deep/.el-textarea__inner {
  min-height: 80px !important;
}
</style>
<style>
.numberInput input::-webkit-outer-spin-button,
.numberInput input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>
