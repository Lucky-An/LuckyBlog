<template>
  <div class="app-container create_tool">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="工具名称" prop="name">
        <el-input v-model.trim="ruleForm.name" placeholder="请输入工具名称"/>
      </el-form-item>

      <el-form-item label="版本号" prop="edition">
        <el-input v-model.trim="ruleForm.edition" placeholder="请输入版本号"/>
      </el-form-item>

      <el-form-item label="语言支持" prop="language">
        <el-select v-model.trim="ruleForm.language" class="filter-item" size="mini" placeholder="请选择语言支持">
          <el-option :value="0" label="中文"/>
          <el-option :value="1" label="其他"/>
        </el-select>
      </el-form-item>

      <el-form-item label="平台类型">
        <el-select v-model.trim="ruleForm.system_type" class="filter-item" size="mini" placeholder="请选择语言支持">
          <el-option v-for="(item,i) in system" :key="i" :label="item.label" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="收费模式" prop="charge">
        <el-select v-model="ruleForm.charge" class="filter-item" size="mini" placeholder="请选择收费模式">
          <el-option :value="0" label="免费"/>
          <el-option :value="1" label="付费"/>
        </el-select>
      </el-form-item>

      <el-form-item label="工具分类" prop="label">
        <el-select v-model="ruleForm.label" class="filter-item" size="mini" placeholder="请选择工具分类">
          <el-option v-for="(item,i) in tagList" :key="i" :label="item.label" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="公开/隐藏" prop="status">
        <el-select v-model="ruleForm.status" class="filter-item" size="mini">
          <el-option :value="0" label="隐藏"/>
          <el-option :value="1" label="公开"/>
        </el-select>
      </el-form-item>
      <el-form-item label="工具封面" required>
        <UploadFile :file.sync="ruleForm.logo" :file-type="['jpg','png']" :list-type="'picture-card'" :file-size="2*1024*1024"/>
        （请上传PNG、JPG格式文件，大小不超过2M,<b>推荐大小 240*140</b>）
      </el-form-item>

      <el-form-item label="工具上传" required>
        <UploadFile :file.sync="ruleForm.route" :file-type="['zip']" :file-size="500*1024*1024"/>
        （请上传zip格式文件，大小不超过500M）
      </el-form-item>

      <el-form-item label="工具描述" prop="describe">
        <quill-editor v-model="ruleForm.describe" holder="请输入工具描述"/>
      </el-form-item>

      <el-form-item>

        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="warning" @click="goBack">返回</el-button>

      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getTag, getInfo, add, edit, getSystem } from '@/api/tool'
import UploadFile from '@/components/UploadFile'
import QuillEditor from '@/components/QuillEditor'

export default {
  components: {
    QuillEditor,
    UploadFile
  },
  data() {
    return {
      id: this.$route.query.id,
      tagList: [],
      system: [], // 平台类型
      ruleForm: {
        name: '', // 工具名称
        edition: '', // 版本号
        language: '', // 语言支持 0中文 1其他
        system_type: 0, // 支持平台 0Windows 1Linux 2Mac
        charge: '', // 收费模式 0免费 1付费
        label: '', // 软件分类
        status: 0, // 是否公开 0隐藏 1公开
        logo: '', // 工具封面
        describe: '', // 工具描述
        describe_html: '', // 工具描述
        route: ''

      },
      rules: {
        name: [
          { required: true, message: '请输入工具名称', trigger: 'blur' }
        ],
        edition: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        describe_html: [
          { required: true, message: '请输入工具描述', trigger: 'blur' }
        ],
        language: [
          { required: true, message: '请选择支持平台', trigger: 'change' }
        ],
        charge: [
          { required: true, message: '请选择收费模式', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请选择软件分类，如果没有软件分类，请先在列表页创建', trigger: 'change' }
        ],
        status: [
          { required: true, message: '是否公开', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getToolTag()
    this.getSystem()
    if (this.id) this.getInfo()
  },
  methods: {
    goBack() {
      history.back()
    },
    getToolTag() { // 获取工具标签
      getTag().then(res => {
        this.tagList = res.data.rows
      })
    },
    getSystem() { // 获取平台类型
      getSystem().then(res => {
        this.system = res.data.platform
      })
    },

    getInfo() { // 信息回显
      const p = {
        id: this.id
      }
      getInfo(p).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
      })
    },

    onSubmit() {
      const fm = new FormData()

      if (!this.ruleForm.route) {
        this.$message.error('请上传工具包')
        return
      }

      if (!this.ruleForm.logo) {
        this.$message.error('请上传封面')
        return
      }

      for (const key in this.ruleForm) {
        fm.append(key, this.ruleForm[key])
      }

      const url = '/tool/tool'

      if (this.id) {
        const params = { id: this.id }

        edit(params, fm).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: url
            })
          }
        }).catch(err => {
          this.$message.error(err.response.data.message_zh)
        })
      } else {
        add(fm).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: url
            })
          }
        })
      }
    },

    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$message.error('请核验所输入的信息')
          return false
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style>

  .flex-align span {
    display: inline-block;
    margin: 0 10px;
  }

  .create_tool {
    width: 90%;
    min-width: 600px;
  }
.create_tool p{
  margin: 0;
}
  .create_match .te-switch-button {
    vertical-align: top;
  }
</style>
