<template>
  <div class="app-container create_topic">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="题目名称" prop="title" placeholder="请填写题目名称">
        <el-input v-model.trim="ruleForm.title"/>
      </el-form-item>

      <el-form-item label="题目类型" prop="category_id">
        <el-select v-model="ruleForm.category_id" class="filter-item" size="mini" placeholder="题目类型">
          <el-option v-for="(item,ind) in subType" :key="ind" :label="item.cn_name" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="题目难度">
        <el-select v-model="ruleForm.weight" class="filter-item" size="mini" placeholder="题目难度">
          <el-option v-for="(item,ind) in difficulty" :key="ind" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="题目内容" prop="resource">
        <quill-editor v-model="ruleForm.content_html" holder="请输入题目内容"/>
      </el-form-item>

      <el-form-item label="level" prop="resource">
        <el-input-number v-model="ruleForm.level" :min="0" :max="1000"/>
      </el-form-item>

      <el-form-item label="是否有场景链接">
        <el-switch
          v-model="ruleForm.is_remote_env"
          :active-value="1"
          :inactive-value="0"/>
      </el-form-item>

      <el-form-item label="Flag形态">
        <el-select
          :disabled="task_id?true:false"
          v-model="ruleForm.is_dynamic_flag"
          placeholder="请选择flag类型"
          @change="handleType">
          <el-option :value="0" label="静态Flag"/>
          <el-option :value="2" label="随机附件随机Flag"/>
          <el-option :value="1" label="动态容器动态Flag"/>
          <el-option :value="3" label="动态容器静态Flag"/>
        </el-select>
      </el-form-item>

      <div v-if="ruleForm.is_dynamic_flag==0">
        <el-form-item label="题目附件">
          <span v-if="enclosureAry[0]!=1">
            <a :href="ruleForm.file[0]" download><el-button type="success" size="mini">下载附件查看</el-button></a>
            <el-button type="danger" size="mini" @click="removeEnc(0)">删除附件</el-button>
          </span>
          <span v-for="(item,index) in enclosureAry" v-else>
            <input :ref="'enclosure'+index" type="file">（只支持.zip格式附件）
          </span>

        </el-form-item>
        <!--<el-form-item label="docker compose file">-->
        <!--<el-input-->
        <!--:rows="4"-->
        <!--v-model="ruleForm.docker_compose_file"-->
        <!--type="textarea"-->
        <!--placeholder="请输入内容"/>-->
        <!--</el-form-item>-->
        <el-form-item label="题目Flag" prop="is_dynamic_flag">
          <el-input
            v-for="(item,index) in flagAry"
            :key="index"
            v-model.trim="item.flag"
            type="input"
            placeholder="请输入flag"/>
        </el-form-item>
        <!--<el-form-item label="是否公开">-->
        <!--<el-switch v-model="ruleForm.public" :active-value="1"-->
        <!--:inactive-value="0"/>-->
        <!--</el-form-item>-->
        <el-form-item label="赛题WP">
          <div v-if="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">&nbsp;下载wp查看&nbsp;</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">&nbsp;删除wp&nbsp;</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持pdf,docx,md格式）
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="warning" @click="goback">返回</el-button>
        </el-form-item>
      </div>

      <div v-if="ruleForm.is_dynamic_flag==1">
        <el-form-item label="题目附件">

          <div v-if="enclosureAry[0]!=1">
            <a :href="ruleForm.file[0]" download>
              <el-button type="success" size="mini">下载附件查看</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeEnc(0)">删除附件</el-button>

          </div>
          <span v-for="(item,index) in enclosureAry" v-else>
            <input :ref="'enclosure'+index" type="file">（只支持.zip格式附件）
          </span>
        </el-form-item>
        <el-form-item label="docker compose file">
          <el-input
            :rows="4"
            v-model="ruleForm.docker_compose_file"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>

        <el-form-item label="场景请求方式">
          <el-select
            v-model="ruleForm.protocol"
            placeholder="场景请求方式">
            <el-option :value="1" label="web"/>
            <el-option :value="2" label="pwn"/>
          </el-select>
        </el-form-item>

        <el-form-item label="动态flag脚本文件">
          <div v-if="ruleForm.push_flag_script">
            <a :href="ruleForm.push_flag_script" download>
              <el-button type="success" size="mini">下载脚本查看</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeScript">删除脚本</el-button>
          </div>
          <span v-show="!ruleForm.push_flag_script">
            <input ref="push_flag_script" type="file">（只支持.sh格式附件）
          </span>
        </el-form-item>
        <!--<el-form-item label="是否公开">-->
        <!--<el-switch v-model="ruleForm.public" :active-value="1"-->
        <!--:inactive-value="0"/>-->
        <!--</el-form-item>-->
        <el-form-item label="赛题WP">
          <div v-if="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">&nbsp;下载wp查看&nbsp;</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">&nbsp;删除wp&nbsp;</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持pdf,docx,md格式）
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="warning" @click="goback">返回</el-button>
        </el-form-item>
      </div>

      <div v-if="ruleForm.is_dynamic_flag==2">
        <el-form-item label="题目附件" prop="is_dynamic_flag">
          <div>
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addEnc"/>
          </div>

          <div class="randomBox">
            <div class="uploadBox">
              <div v-for="(item,index) in enclosureAry" class="mb10">
                <div v-if="item!=1">
                  已有附件：
                  <a :href="item" download>
                    <el-button type="success" size="mini">下载附件查看</el-button>
                  </a>
                </div>
                <div v-else>
                  <input :ref="'enclosure'+index" type="file">
                </div>
              </div>
            </div>
            <div class="flagBox">
              <div v-for="(item,index) in flagAry" :key="index" class="mb10">
                flag:
                <el-input v-model.trim="item.flag" width="300px"/>
                <el-button type="danger" size="mini" icon="el-icon-close" @click="removeEnc(index)"/>
              </div>
            </div>
          </div>

        </el-form-item>
        <el-form-item label="是否公开">
          <el-switch
            v-model="ruleForm.public"
            :active-value="1"
            :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="赛题WP">
          <div v-if="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">&nbsp;下载wp查看&nbsp;</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">&nbsp;删除wp&nbsp;</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持pdf,docx,md格式）
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="warning" @click="goback">返回</el-button>
        </el-form-item>
      </div>

      <div v-if="ruleForm.is_dynamic_flag==3">
        <el-form-item label="题目附件">

          <div v-if="enclosureAry[0]!=1">
            <a :href="ruleForm.file[0]" download>
              <el-button type="success" size="mini">下载附件查看</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeEnc(0)">删除附件</el-button>

          </div>
          <span v-for="(item,index) in enclosureAry" v-else>
            <input :ref="'enclosure'+index" type="file">（只支持.zip格式附件）
          </span>
        </el-form-item>
        <el-form-item label="docker compose file">
          <el-input
            :rows="4"
            v-model="ruleForm.docker_compose_file"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="题目Flag" prop="is_dynamic_flag">
          <el-input
            v-for="(item,index) in flagAry"
            :key="index"
            v-model.trim="item.flag"
            type="input"
            placeholder="请输入flag"/>
        </el-form-item>
        <!--<el-form-item label="是否公开">-->
        <!--<el-switch v-model="ruleForm.public" :active-value="1"-->
        <!--:inactive-value="0"/>-->
        <!--</el-form-item>-->
        <el-form-item label="赛题WP">
          <div v-if="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">&nbsp;下载wp查看&nbsp;</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">&nbsp;删除wp&nbsp;</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持pdf,docx,md格式）
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="warning" @click="goback">返回</el-button>
        </el-form-item>
      </div>

    </el-form>

  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import {
  fetchTag,
  fetchtype,
  createTopic,
  editTopic,
  showJeopardyEditInfo,

  deleteJeopardyFile,
  deleteJeopardyWriteup,
  deleteJeopardyScript
} from '@/api/itemBank/layered'

export default {
  components: {
    QuillEditor
  },
  data() {
    return {
      task_id: this.$route.query.task_id,
      showEn: true,
      flagType: '1',
      subType: [],
      difficulty: [{ name: '初级', id: 0 }, { name: '中级', id: 1 }, { name: '高级', id: 2 }],
      enclosureAry: [1],
      flagAry: [{ flag: '' }],
      ruleForm: {
        file: [],
        answer: [],
        official_writeup: null,
        title: '', // 题目名称
        category_id: 1, // 题目类型id
        weight: 0, // 题目难度
        content: '', // 题目内容
        content_html: '', // 题目内容html
        level: 1,
        is_remote_env: 0, // 是否有场景链接
        is_dynamic_flag: 1, // 是否是动态环境
        docker_compose_file: '', // docker_compose_file
        protocol: '', // 场景请求方式
        push_flag_script: null, // push flag
        public: 1
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字', trigger: 'blur' }
        ],
        category_id: [
          { type: 'number', required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        is_dynamic_flag: [
          { type: 'number', required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getSubType()
    if (this.task_id) this.subInfo()
  },
  methods: {
    goBack() {
      history.back()
    },
    removeWriteup() { // 删除wp
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteJeopardyWriteup(this.task_id).then(res => {
          if (res.data.success) {
            this.ruleForm.official_writeup = null
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    removeScript() { // 删除脚本
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteJeopardyScript(this.task_id).then(res => {
          if (res.data.success) {
            this.ruleForm.push_flag_script = null
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    subInfo() { // 题目信息回显
      showJeopardyEditInfo(this.task_id).then(res => {
        for (const k in this.ruleForm) {
          this.ruleForm[k] = res.data[k]
        }

        if (res.data.answer.length > 0) {
          this.flagAry = res.data.answer.map(item => {
            return { flag: item }
          })
        }

        if (res.data.file.length > 0) {
          this.enclosureAry = res.data.file.map(item => {
            return item
          })
        }

        if (this.ruleForm.is_dynamic_flag == 2) {
          this.flagAry.push({ flag: '' })
          this.enclosureAry.push(1)
        }
      })
    },
    handleType(val) { // 切换环境的时候初始化
      if (val === 0) {
        this.flagAry = [{ flag: '' }]
        this.ruleForm.file = []
        this.enclosureAry = [1]
        this.ruleForm.push_flag_script = null
      } else if (val === 1) {
        this.flagAry = [{ flag: '' }]
        this.ruleForm.file = []
        this.enclosureAry = [1]
      } else {
        this.flagAry = [{ flag: '' }]
        this.ruleForm.file = []
        this.enclosureAry = [1]
        this.ruleForm.push_flag_script = null
        this.ruleForm.docker_compose_file = ''
      }
    },
    getSubType() { // 获取题目类型
      fetchtype().then(res => {
        this.subType = res.data.rows
      })
    },
    checkFormat(flie, key, name) {
      const AllImgExt = name
      const extName = flie.name.substring(flie.name.lastIndexOf('.')).toLowerCase()
      if (AllImgExt.indexOf(extName) == -1) {
        this.$message.error(key + ' 必须是' + name)
        return false
      } else {
        return true
      }
    },
    onSubmit() {
      const AllImgExt = '.zip'
      const fm = new FormData()
      const formData = JSON.parse(JSON.stringify(this.ruleForm))
      delete formData.answer
      delete formData.file
      delete formData.official_writeup
      delete formData.push_flag_script

      for (let i = 0; i < this.enclosureAry.length; i++) {
        if (this.enclosureAry[i] !== 1 && formData.is_dynamic_flag === 2 && this.flagAry[i].flag.length <= 0) {
          this.$message.error('flag必须和文件对应')
          return
        } else if (this.enclosureAry[i] == 1) {
          if (formData.is_dynamic_flag === 2 && this.$refs['enclosure' + i][0].files.length < 1 && this.flagAry[i].flag.length > 0) {
            this.$message.error('flag必须和文件对应')
            return
          }

          if (this.$refs['enclosure' + i][0].files.length > 0) {
            if (!this.checkFormat(this.$refs['enclosure' + i][0].files[0], '附件', '.zip')) {
              return
            }
            if (this.$refs['enclosure' + i][0].files[0].size > 8 * 1024 * 1024) {
              this.$message.error('文件大小不应超过8M')
              return
            }
            fm.append('file' + i, this.$refs['enclosure' + i][0].files[0])
          }
        }
      }

      if (this.$refs['writeUp'].files.length > 0) {
        if (!this.checkFormat(this.$refs['writeUp'].files[0], 'writeUp', '.pdf.png.md')) {
          return
        }
        if (this.$refs['writeUp'].files[0].size > 8 * 1024 * 1024) {
          this.$message.error('文件大小不应超过8M')
          return
        }
        fm.append('official_writeup', this.$refs['writeUp'].files[0])
      }

      if (this.$refs['push_flag_script'] && this.$refs['push_flag_script'].files.length > 0) {
        if (!this.checkFormat(this.$refs['push_flag_script'].files[0], 'push_flag_script', '.sh')) {
          return
        }
        if (this.$refs['push_flag_script'].files[0].size > 8 * 1024 * 1024) {
          this.$message.error('文件大小不应超过8M')
          return
        }
        fm.append('push_flag_script', this.$refs['push_flag_script'].files[0])
      }

      for (let i = 0; i < this.flagAry.length; i++) {
        if (this.enclosureAry[i] == 1) {
          if (formData.is_dynamic_flag == 2 && this.$refs['enclosure' + i][0].files.length > 0 && this.flagAry[i].flag == '') {
            this.$message.error('flag必须和文件对应')
            return
          }
        }

        if (this.flagAry[i].flag.length > 0) {
          fm.append('flag' + i, this.flagAry[i].flag)
        }
      }

      for (const key in formData) {
        fm.append(key, formData[key])
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.task_id) {
        editTopic(this.task_id, fm).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.$router.push({
              path: '/itemBank/layered/index',
              query: { id: this.$route.query.id }
            })
          }
          loading.close()
        }).catch(res => {
          loading.close()
        })
      } else {
        createTopic(fm).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.$router.push({
              path: '/itemBank/layered/index',
              query: { id: res.data.event_id }
            })
          }
          loading.close()
        }).catch(res => {
          loading.close()
        })
      }
    },
    addEnc() {
      this.enclosureAry.push(1)
      this.flagAry.push({ flag: '' })
    },
    removeEnc(index) { // 点击删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.enclosureAry[index] == 1) {
          this.$refs['enclosure' + index][0].value = ''
          // 页面上至少剩有一个上传选项。
          if (this.enclosureAry.length > 1) {
            this.enclosureAry.splice(index, 1)
            this.flagAry.splice(index, 1)
          }
        }
        if (this.enclosureAry[index] != 1) {
          deleteJeopardyFile(this.task_id, index).then(res => {
            if (this.ruleForm.is_dynamic_flag == 2) {
              this.enclosureAry.splice(index, 1)
              this.flagAry.splice(index, 1)

              // 当删除光时，给页面添加一个默认上传选项
              if (this.enclosureAry.length == 0) {
                this.enclosureAry.push(1)
                this.flagAry.push({ flag: '' })
              }
            } else {
              this.enclosureAry = [1]
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    }
  }
}
</script>

<style>
  .randomBox {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap
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
