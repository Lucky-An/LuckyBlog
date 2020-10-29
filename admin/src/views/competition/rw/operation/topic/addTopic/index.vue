<template>
  <div class="app-container create_topic">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="题目名称"
        prop="title"
        placeholder="请填写题目名称"
      >
        <el-input v-model.trim="ruleForm.title" />
      </el-form-item>

      <el-form-item
        label="题目类型"
        prop="category_id"
      >
        <el-select
          v-model="ruleForm.category_id"
          class="filter-item"
          placeholder="题目类型"
          disabled
        >
          <el-option
            v-for="(item, ind) in subType"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="题目分值"
        prop="score"
      >
        <el-input-number
          v-model="ruleForm.score"
          :min="0"
          :max="1000000"
          disabled
          label="描述文字"
        />
      </el-form-item>

      <el-form-item
        label="题目内容"
        prop="markdown_content"
      >
        <quill-editor
          v-model="ruleForm.content_html"
          holder="请输入题目内容"
        />
      </el-form-item>

      <el-form-item label="题目内容英文">
        <quill-editor
          v-model="ruleForm.content_en_html"
          holder="请输入题目内容英文"
        />
      </el-form-item>
      <!-- <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.official_writeup"
          :file-type="['pdf', 'md', 'docx']"
        />
        （请上传pdf,docx,md格式文件,大小不超过10M）
      </el-form-item> -->

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
          @click="submitForm"
        >保存</el-button>
        <el-button
          type="warning"
          @click="goback"
        >返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import UploadFile from '@/components/UploadFile'
import { editTopic, matchStatus, showEditInfo } from '@/api/match/realWord'
import { fetchType } from '@/api/itemBank/common'

export default {
  components: {
    QuillEditor,
    UploadFile
  },
  data() {
    return {
      task_id: this.$route.query.task_id,
      hash: this.$route.query['hash'],
      subType: [
        {
          cn_name: 'XCTF',
          id: 1
        }
      ],
      ruleForm: {
        title_en: '',
        title: '', // 题目名称
        protocol: 1, // 题目类别（白盒测试1/黑盒测试2）
        category_id: 1, // 题目类型
        score: 0, // 题目分值
        public: 1, // public
        notes: '', // 备注
        content: '', // 题目描述html
        content_html: '', // 题目描述markdown
        content_en: '', // 题目描述英文markdown
        content_en_html: '', // 题目描述英文html
        node: '', // 题目节点
        devicename: '', // 设备名

        answer: '', // flag
        target: '',
        target_en: '',
        markdown_target: '',
        markdown_target_en: '',
        file: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        title_en: [
          { required: true, message: '请输入题目名称英文', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        devicename: [
          { required: true, message: '请输入设备名', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur' }
        ],
        score: [{ required: true, message: '请输入题目分值', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入题目描述', trigger: 'blur' }
        ],
        markdown_content_en: [
          { required: true, message: '请输入题目描述英文', trigger: 'blur' }
        ],
        markdown_target: [
          { required: true, message: '请输入题目目标', trigger: 'blur' }
        ],
        markdown_target_en: [
          { required: true, message: '请输入题目目标英文', trigger: 'blur' }
        ],
        protocol: [
          {
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        node: [
          {
            type: 'number',
            required: true,
            message: '请选择节点名称',
            trigger: 'change'
          }
        ]
      },
      process: null // 比赛进程 1未开始 2已经输 0进行中
    }
  },
  created() {
    // this.getSubType();
    this.getProcess()
    if (this.task_id) this.subInfo()
  },
  methods: {
    getProcess() {
      matchStatus(this.hash).then(res => {
        this.process = res.data.process
      })
    },
    goback() {
      this.$router.push({
        path: '/competition/rw/operation',
        query: { hash: this.hash, activeName: 'topic' }
      })
    },
    getSubType() {
      fetchType({ type: 4 }).then(res => {
        this.subType = res.data
      })
    },
    subInfo() {
      // 题目信息回显
      showEditInfo(this.hash, this.task_id).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
      })
    },

    onSubmit() {
      const fm = new FormData()
      const formData = this.ruleForm

      for (const key in formData) {
        fm.append(key, formData[key])
      }
      if (this.task_id) {
        fm.append('event_id', this.task_id)
      }

      if (this.task_id) {
        editTopic(this.hash, this.task_id, fm).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/competition/rw/operation',
              query: { hash: this.hash, activeName: 'topic' }
            })
          }
        })
      }
    },
    addEnc() {
      this.enclosureAry.push(1)
      this.flagAry.push({ flag: '' })
    },

    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
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
