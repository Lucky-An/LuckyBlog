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
      >
        <el-input
          v-model.trim="ruleForm.title"
          placeholder="请输入题目名称"
        />
      </el-form-item>

      <el-form-item
        label="题目类型"
        prop="category_id"
      >
        <el-select
          v-model="ruleForm.category_id"
          class="filter-item"
          placeholder="请选择题目类型"
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

      <el-form-item label="题目描述">
        <quill-editor
          v-model="ruleForm.content_html"
          holder="请输入题目描述"
        />
      </el-form-item>
      <el-form-item label="题目描述英文">
        <quill-editor
          v-model="ruleForm.content_en"
          holder="请输入题目题目描述英文"
        />
      </el-form-item>
      <el-form-item label="题目附件">
        <UploadFile
          :file.sync="ruleForm.file"
          :file-type="['zip']"
          :file-size="20 * 1024 * 1024"
        />
        （请上传zip格式文件，大小不超过20M）
      </el-form-item>

      <!-- <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.official_writeup"
          :file-type="['pdf', 'md', 'docx']"
        />
        （请上传pdf,docx,md格式文件,大小不超过10M）
      </el-form-item> -->

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
import {
  fetchNode,
  createTopic,
  editTopic,
  showEditInfo
} from '@/api/itemBank/realWord'
import { fetchType } from '@/api/itemBank/common'

export default {
  components: {
    QuillEditor,
    UploadFile
  },
  data() {
    return {
      task_id: this.$route.query.task_id,
      nodeAry: [],
      subType: [
        {
          cn_name: 'XCTF',
          id: 1
        }
      ],
      ruleForm: {
        // title_en: '',
        title: '', // 题目名称
        // protocol: 1, //题目类别(黑 白盒)
        category_id: 1, // 题目类型
        // type: '', // 题目类型（执行体1/拟态设备2）
        score: 1000, // 题目分值
        // public: 1, // public
        // notes: '', // 备注
        content_html: '', // 题目描述html
        content: '', // 题目描述markdown
        // node: '', // 题目节点
        // devicename: '', // 设备名
        content_en: '', // 题目描述英文markdown
        content_en_html: '', // 题目描述英文html
        // official_writeup: "", // wp
        // answer: '', // flag
        // target: '',
        // target_en: '',
        // markdown_target: '',
        // markdown_target_en: '',
        file: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
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
        protocol: [
          {
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        category_id: [
          {
            type: 'number',
            required: true,
            message: '请选择题目类型',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    // this.getNode()
    // this.getSubType();
    if (this.task_id) this.subInfo()
  },
  methods: {
    goback() {
      history.back()
    },
    getNode() {
      fetchNode().then(res => {
        this.nodeAry = res.data
      })
    },
    getSubType() {
      // type  1:ad  2:jad  3:ops  4:rw  5:jeopardy
      fetchType({ type: 4 }).then(res => {
        this.subType = res.data
      })
    },

    subInfo() {
      // 题目信息回显
      showEditInfo(this.task_id).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
      })
    },

    onSubmit() {
      this.ruleForm.content_en_html = this.ruleForm.content_en
      const fm = new FormData()
      const formData = this.ruleForm

      for (const key in formData) {
        fm.append(key, formData[key])
      }
      if (this.task_id) {
        fm.append('event_id', this.task_id)
      }

      if (this.task_id) {
        editTopic(this.task_id, fm)
          .then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.$router.push({
                path: '/itemBank/rw'
              })
            }
          })
          .catch(err => {
            this.$message.error(err.response.data.message_zh)
          })
      } else {
        createTopic(fm)
          .then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.$router.push({
                path: '/itemBank/rw'
              })
            }
          })
          .catch(err => {
            this.$message.error(err.response.data.message_zh)
          })
      }
    },
    addEnc() {
      this.enclosureAry.push(1)
      this.flagAry.push({ flag: '' })
    },
    removeEnc(index) {
      // 点击删除
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   if (this.enclosureAry[index] == 1) {
      //     this.$refs['enclosure' + index][0].value = ''
      //   // }
      //   // if (this.enclosureAry[index] != 1) {
      //   //   deleteFile(this.task_id, index).then(res => {
      //   //     if (this.ruleForm.is_dynamic_flag == 2) {
      //               this.enclosureAry.splice(index, 1);
      //   //       this.flagAry.splice(index, 1);
      //   //     } else {
      this.enclosureAry = [1]
      //   //     }
      //   //   })
      //   // }
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
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
