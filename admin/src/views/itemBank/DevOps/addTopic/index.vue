<template>
  <div class="app-container create_topic">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item label="题目名称" prop="title">
        <el-input v-model.trim="ruleForm.title" placeholder="请输入题目名称" />
      </el-form-item>

      <el-form-item label="题目类型" prop="challenge_type">
        <el-select
          v-model="ruleForm.challenge_type"
          class="filter-item"
          placeholder="请输入题目类型"
        >
          <el-option
            v-for="(item, ind) in subType"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目标签" prop="label">
        <el-select
          v-model="ruleForm.label"
          class="filter-item"
          placeholder="请输入题目标签"
        >
          <el-option
            v-for="(item, ind) in tagAry"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目难度">
        <el-select
          v-model="ruleForm.level"
          class="filter-item"
          placeholder="题目难度"
        >
          <el-option key="1" :value="0" label="初级" />
          <el-option key="2" :value="1" label="中级" />
          <el-option key="3" :value="2" label="高级" />
        </el-select>
      </el-form-item>

      <el-form-item label="镜像类型" required>
        <el-select
          v-model="ruleForm.image_type"
          class="filter-item"
          placeholder="镜像类型"
          @change="changeImageType"
        >
          <el-option value="kvm" label="KVM" />
          <el-option value="docker" label="docker" />
        </el-select>
      </el-form-item>

      <el-form-item label="镜像选择" required>
        <el-button
          type="primary"
          size="mini"
          @click="selectMirror = true"
        >选择</el-button
        >
        {{ ruleForm.image_name }}
      </el-form-item>

      <!-- 实例模板选择 -->
      <el-form-item prop="flavor_uuid" label="实例模板">
        <el-select
          v-model="ruleForm.flavor_uuid"
          class="filter-item"
          placeholder="请选择实例模板"
          @change="flavorSelectedChange"
        >
          <el-option
            v-for="item in flavorList"
            :key="item.uuid"
            :label="`${item.name} / ${item.vcpus}核 / ${item.memory}MB / ${item.disk}GB`"
            :value="item.uuid"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.image_type === 'docker'"
        label="题目端口"
        prop="source_port"
      >
        <el-input-number
          v-model="ruleForm.source_port"
          :min="0"
          :max="65535"
          :precision="0"
          placeholder="默认80端口"
        />
      </el-form-item>

      <el-form-item label="题目描述" prop="description">
        <el-input
          :rows="3"
          v-model="ruleForm.description"
          type="textarea"
          placeholder="请输入题目描述"
        />
      </el-form-item>

      <el-form-item label="题目描述英文">
        <el-input
          :rows="3"
          v-model="ruleForm.description_en"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>

      <el-form-item label="考察点分值">
        <el-input v-model.trim="ruleForm.ops_score" />
        <div>例子：{"1":10, "2":20, "3":30}</div>
        <div>
          说明：冒号前面为考察点数，要放到双引号里，且要连续，冒号后为分数，考察点与分数都不能为0
        </div>
      </el-form-item>

      <el-form-item label="checker脚本" prop="checker_script">
        <UploadFile :file.sync="ruleForm.checker_script" :file-type="['py']" />
        （请上传py格式文件，大小不超过2M）
      </el-form-item>

      <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.wp_official"
          :file-type="['pdf', 'docx', 'md']"
        />
        （只支持pdf,docx,md格式,且大小不超过10M）
      </el-form-item>

      <el-form-item label="题目附件">
        <UploadFile
          :file.sync="ruleForm.file"
          :file-type="['zip']"
          :file-size="20 * 1024 * 1024"
        />
        （请上传zip格式文件，大小不超过20M）
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存
        </el-button>
        <el-button type="warning" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>

    <ChoiceImage
      v-if="selectMirror"
      :image_name.sync="ruleForm.image_name"
      :image_uuid.sync="ruleForm.image_uuid"
      :type="ruleForm.image_type"
      :select-mirror.sync="selectMirror"
    />
  </div>
</template>

<script>
import {
  DefenseAddTopic,
  DefenseEditSubmit,
  DefenseEditInfo
} from '@/api/itemBank/DevOps'
import { fetchTags, fetchType, templateName } from '@/api/itemBank/common'
import { getFlavorList } from '@/api/itemBank/common'
import ChoiceImage from '@/components/ChoiceImage'
import UploadFile from '@/components/UploadFile'

export default {
  components: {
    ChoiceImage,
    UploadFile
  },
  data() {
    var checkAge = (rule, value, callback) => {
      callback()
    }
    return {
      selectMirror: false,
      task_id: this.$route.query.task_id,
      tagAry: [],
      subType: [],
      templateList: [],
      flavorList: [], // 实例模板列表
      ruleForm: {
        title: '', // 题目名称
        challenge_type: '', // 题目类型id
        label: '', // 题目标签
        level: 0, // 题目难度
        image_type: 'kvm', // 镜像类型
        image_name: '', // 镜像名称
        image_uuid: '', // 镜像uuid
        flavor_name: '', // 实例模板名称
        flavor_uuid: '', // 实例模板uuid
        source_port: 80, // 题目端口
        description: '', // 题目描述
        description_en: '', // 题目描述英文
        ops_score: '', // 考察点分数{"1":3,"2":4}
        checker_script: '', // checker脚本
        wp_official: '', // 题目wp
        file: '' // 题目附件
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入题目描述', trigger: 'blur' }
        ],
        image_name: [
          { required: true, message: '请输入镜像名称', trigger: 'blur' }
        ],
        source_port: [
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],

        challenge_type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        flavor_uuid: [
          { required: true, message: '请选择实例模板', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请选择题目标签', trigger: 'change' }
        ],
        start_method: [
          {
            type: 'number',
            required: true,
            message: '请选择题目类型',
            trigger: 'change'
          }
        ],

        checker_script: [
          { required: true, validator: checkAge, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getType()
    this.getTag()
    this.getFlavorInfo()
    if (this.task_id) this.subInfo()
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    goBack() {
      history.back()
    },
    getType() {
      // 获取题目类型
      fetchType({ type: 3 }).then((res) => {
        this.subType = res.data
      })
    },
    getTag() {
      // 获取题目标签
      fetchTags({ type: 3 }).then((res) => {
        this.tagAry = res.data
      })
      // templateName().then(res => {
      //   this.templateList = res.data
      // })
    },
    subInfo() {
      // 题目信息回显
      const p = {
        challenge_id: this.task_id
      }
      DefenseEditInfo(p).then((res) => {
        this.$store.dispatch('changeMatchName', res.data.title)
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
      })
    },
    // 实例模板切换  时获取  name msg 和 uuid
    flavorSelectedChange(params) {
      this.flavorList.forEach((element) => {
        if (element.uuid == params) {
          this.ruleForm.flavor_name = element.name
          this.ruleForm.flavor_message = JSON.stringify(element.msg)
        }
      })
    },
    // 获取实例模板列表
    getFlavorInfo() {
      getFlavorList({
        page: 1,
        per_page: 999
      }).then((res) => {
        this.flavorList = res.data.data
      })
    },
    onSubmit() {
      if (this.ruleForm.image_name === '') {
        this.$message.error('请选择镜像')
        return
      }
      if (this.ruleForm.checker_script === '') {
        this.$message.error('请选择checker脚本')
        return
      }

      const formData = this.ruleForm
      const fm = new FormData()

      for (const key in formData) {
        fm.append(key, formData[key])
      }

      const url = '/itemBank/DevOps/index'

      if (this.task_id) {
        const params = { challenge_id: this.task_id }

        DefenseEditSubmit(params, fm)
          .then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.$router.push({
                path: url
              })
            }
          })
          .catch((err) => {
            this.$message.error(err.response.data.message_zh)
          })
      } else {
        DefenseAddTopic(fm).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
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
          this.$message.error('请核验所填写的信息')
          return false
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    // 切换镜像类型，清空选择的镜像
    changeImageType() {
      this.ruleForm.image_name = ''
      this.ruleForm.image_uuid = ''
    }
  }
}
</script>

<style>
.randomBox {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.mb10 {
  margin-bottom: 10px;
}

.randomBox .uploadBox {
  width: 300px;
}

.randomBox .flagBox {
  flex: 1;
}

.randomBox .flagBox .el-input {
  width: 70%;
}

.flex-align {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.flex-align span {
  display: inline-block;
  margin: 0 10px;
}

.create_topic {
  width: 90%;
  min-width: 600px;
}

.create_topic .te-switch-button {
  vertical-align: top;
}
</style>
