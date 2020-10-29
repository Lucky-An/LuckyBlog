<template>
  <div class="app-container create_match">
    <div class="container_bg">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model.trim="ruleForm.name"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="Vcpus" prop="vcpus">
          <el-input v-model.number="ruleForm.vcpus" maxlength="9" placeholder="请输入Vcpus" />
        </el-form-item>
        <el-form-item label="内存（MB）" prop="memory">
          <el-input v-model.number="ruleForm.memory" maxlength="9" placeholder="请输入内存" />
        </el-form-item>
        <el-form-item label="硬盘（GB）" prop="disk">
          <el-input v-model.number="ruleForm.disk" maxlength="9" placeholder="请输入硬盘" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="warning" @click="backView">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getFlavors, editFlavors, createFlavors } from '@/api/systemManage'

export default {
  name: 'CreateFlavor',
  components: {

  },
  props: {
    fromTopo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked: true,
      fileList: [],
      step: false, // 是否可以点击一下步，必须保存成功才行
      showEn: true,
      ruleForm: {
        name: '',
        vcpus: '',
        disk: '',
        memory: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '名称只能包含汉字、数字、字母、下划线' }
        ],
        vcpus: [
          { required: true, message: '请填写虚拟cpu个数', trigger: 'blur' },
          { type: 'number', message: '必须为数字' }
        ],
        disk: [
          { required: true, message: '请填写硬盘大小', trigger: 'blur' },
          { type: 'number', message: '必须为数字' }
        ],
        memory: [
          { required: true, message: '请填写内存大小', trigger: 'blur' },
          { type: 'number', message: '必须为数字' }
        ]
      },
      id: this.$route.query.id,
      process: null, // 比赛进度 0进行中 1未开始 2已结束
      imgUrl: {
        logo: '',
        cover: '',
        competition_company_url: ''
      }
    }
  },
  created() {
    if (this.id) {
      this.getInfo()
      this.step = false
    }
  },
  mounted() {
    setTimeout(() => {
      this.showEn = false
    }, 200)
  },
  methods: {
    backView() {
      this.$router.push({
        path: '/systemManage/example'
      })
    },
    getInfo() {
      // 获取比赛详情
      getFlavors(this.id).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data.data[key]
        }
      })
    },
    onSubmit() {
      if (this.id) {
        editFlavors(this.id, this.ruleForm).then(res => {
          if (res.data.success) {
            this.$message.success('保存成功')
            this.$router.push({
              path: '/systemManage/example'
            })
          }
        })
      } else {
        createFlavors(this.ruleForm).then(res => {
          if (res.data.success) {
            // sessionStorage.setItem('id', res.data.event_id)
            this.$message.success('新增成功')
            if (this.fromTopo) {
              this.$emit('closeDialog')
            } else {
              this.$router.push({
                path: '/systemManage/example'
                // query: { id: res.data.event_id, step: 1 }
              })
            }
          }
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          // this.$message.error('填写信息有误')
          return false
        }
      })
    }
  }
}
</script>

<style>
.create_match {
  width: 90%;
  min-width: 600px;
}

</style>
