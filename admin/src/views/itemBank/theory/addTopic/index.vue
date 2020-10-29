<template>
  <div class="app-container create_topic">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item label="题目名称">
        <el-input
          v-model.trim="ruleForm.title"
          clearable
          placeholder="此处为选填内容。此参数为空时系统将在题目保存时截取题目内容的前20个字符作为名称保存，方便题目列表的显示和调用。"
        />
      </el-form-item>

      <el-form-item
        label="题目类型"
        prop="type_id"
      >
        <el-select
          v-model="ruleForm.type_id"
          clearable
          class="filter-item"
          placeholder="请选择题目类型"
          @change="handleType"
        >
          <el-option
            v-for="(item,ind) in difficulty"
            :key="ind"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="题目方向"
        prop="category_id"
      >
        <el-select
          v-model="ruleForm.category_id"
          clearable
          class="filter-item"
          placeholder="请选择题目方向"
        >
          <el-option
            v-for="(item,ind) in subCategory"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="题目标签"
        prop="tag_id"
      >
        <el-select
          v-model="ruleForm.tag_id"
          clearable
          class="filter-item"
          placeholder="请选择题目标签"
        >
          <el-option
            v-for="(item,ind) in subTag"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="题目内容"
        prop="content_html"
      >
        <quill-editor
          v-model="ruleForm.content_html"
          holder="请输入题目内容"
        />
      </el-form-item>

      <!--<el-form-item label="题目附件">-->
      <!--<UploadFile :file.sync="ruleForm.file" :file-type="['zip']" :file-size="20*1024*1024"/>-->
      <!--（请上传zip格式文件，大小不超过20M）-->
      <!--</el-form-item>-->

      <el-form-item
        v-if="ruleForm.type_id!==3"
        label="选项数量"
      >
        <el-input-number
          v-model="ruleForm.option_number"
          :min="2"
          :max="6"
          label="描述文字"
          @change="handleOption"
        />
      </el-form-item>

      <el-form-item
        v-show="ruleForm.type_id!==3"
        label="选项"
        required
      >
        <div
          v-for="(v,k,i) in ruleForm.option"
          :key="i"
          style="margin-bottom: 10px;"
        >
          <el-tag
            effect="dark"
            type="warning"
          >
            选项{{ k }}
          </el-tag>

          <quill-editor
            v-model="ruleForm.option[k]"
            holder="请输入题目选项"
          />
        </div>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.type_id==1"
        required
        label="正确答案"
      >
        <el-radio-group
          v-model="ruleForm.answer[0]"
          size="small"
        >
          <el-radio
            v-for="(v,k,i) in ruleForm.option"
            :key="i"
            :label="k"
            border
          >{{ k }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.type_id==2"
        label="正确答案"
        prop="answer"
      >
        <el-checkbox-group
          v-model="ruleForm.answer"
          size="small"
        >
          <el-checkbox
            v-for="(v,k,i) in ruleForm.option"
            :key="i"
            :label="k"
            border
          >{{ k }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.type_id==3"
        required
        label="正确答案"
      >
        <el-radio-group
          v-model="ruleForm.answer[0]"
          size="small"
        >
          <el-radio
            label="A"
            border
          >√</el-radio>
          <el-radio
            label="B"
            border
          >×</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button>
        <el-button
          type="warning"
          @click="goBack"
        >返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import UploadFile from '@/components/UploadFile'
import {
  getTags,
  getCategorys,
  createTopic,
  editTopic,
  showEditInfo,
  deleteZip
} from '@/api/itemBank/theory'

export default {
  components: {
    QuillEditor,
    UploadFile
  },
  data() {
    return {
      task_id: this.$route.query.task_id,
      subTag: [], // 题目标签
      subCategory: [], // 题目方向
      difficulty: [
        { name: '单选题', id: 1 },
        { name: '多选题', id: 2 },
        { name: '判断题', id: 3 }
      ],
      optionAry: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N'
      ],
      // 数据表单
      ruleForm: {
        title: '',
        type_id: '', // 题目类型
        category_id: '', // 题目方向id
        tag_id: '', // 题目方向id

        content: '', // 题目内容
        content_html: '', // 题目内容html
        // file: '', // 题目附件
        option_number: 4, // 选项个数
        option: {
          A: '',
          B: '',
          C: '',
          D: ''
        },
        option_html: {},
        answer: ['A'] // 正确答案
      },
      rules: {
        type_id: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        content_html: [
          { required: true, message: '请输入题目内容', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择题目方向', trigger: 'change' }
        ],
        tag_id: [
          { required: true, message: '请选择题目标签', trigger: 'change' }
        ],
        answer: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个选项',
            trigger: 'change'
          }
        ]
      },
      showView: false
    }
  },
  created() {
    this.getSubType()
    if (this.task_id) this.subInfo()
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    deleteZip() {
      // 删除附件
      deleteZip(this.task_id).then(res => {
        if (res.data.success) {
          this.ruleForm.file = ''
          this.$message.success('删除成功')
        }
      })
    },
    handleType(id) {
      // 切换题目类型
      this.ruleForm.answer = ['A']
      if (id === 3) {
        this.ruleForm.option = { A: '√', B: '×' }
        this.ruleForm.option_number = 2
      } else {
        this.ruleForm.option = { A: '', B: '', C: '', D: '' }
        this.ruleForm.option_number = 4
      }
    },
    goBack() {
      history.back()
    },
    handleOption(cur, old) {
      console.log(cur, old)
      // 监听选项数量
      /*
       * 新的值  老的值
       * 当选项增减时，改动option的值。
       * */
      if (cur > old) {
        for (let i = 0; i < (cur - old); i++) {
          console.log(old + i)
          this.ruleForm.option[this.optionAry[old + i]] = ''
        }
      } else {
        for (let i = 0; i <= (old - cur); i++) {
          delete this.ruleForm.option[this.optionAry[old - i]]
        }
      }
    },

    subInfo() {
      // 题目信息回显
      showEditInfo(this.task_id).then(res => {
        this.$store.dispatch('changeMatchName', res.data.title)
        for (const k in this.ruleForm) {
          this.ruleForm[k] = res.data[k]
        }
      })
    },

    getSubType() {
      // 获取题目类型
      getTags().then(res => {
        this.subTag = res.data
      })

      getCategorys().then(res => {
        this.subCategory = res.data
      })
    },
    onSubmit() {
      // 将opation转为html
      this.ruleForm.option_html = {}
      for (const k in this.ruleForm.option) {
        if (this.ruleForm.option[k] === '') {
          return this.$message.error('请确保所有选项都已填写')
        }
        this.ruleForm.option_html[k] = this.ruleForm.option[k]
      }

      const fm = new FormData()
      const formData = this.ruleForm

      // 如果没有填写题目的话，默认取题目内容的前二十个字符
      if (formData.title == '') { formData.title = formData.content_html.slice(0, 20) }

      for (const key in formData) {
        if (key === 'option' || key === 'option_html' || key === 'answer') {
          fm.append(key, JSON.stringify(formData[key]))
        } else {
          fm.append(key, formData[key])
        }
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.task_id) {
        editTopic(this.task_id, fm)
          .then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.$router.push({
                path: '/itemBank/theory/index',
                query: { id: this.$route.query.id }
              })
            }
            loading.close()
          })
          .catch(res => {
            loading.close()
          })
      } else {
        createTopic(fm)
          .then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.$router.push({
                path: '/itemBank/theory/index',
                query: { id: res.data.event_id }
              })
            }
            loading.close()
          })
          .catch(res => {
            loading.close()
          })
      }
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
