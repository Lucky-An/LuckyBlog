<template>
  <div class="app-container create_topic">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="题目名称" prop="title" placeholder="请输入题目名称">
        <el-input v-model.trim="ruleForm.title"/>
      </el-form-item>
      <el-form-item label="积分方式" placeholder="请输入题目名称">
        <span>{{ mathMode.integral_mode==2?'动态计分':'累加计分' }}</span>
      </el-form-item>
      <el-form-item v-if="mathMode.integral_mode==1" label="题目分值" prop="score" placeholder="请输入题目分值">
        <el-input v-model.trim="ruleForm.score"/>
      </el-form-item>
      <el-form-item label="题目类型" prop="category_id">
        <el-select v-model="ruleForm.category_id" class="filter-item" size="mini" placeholder="题目类型">
          <el-option v-for="(item,ind) in subType" :key="ind" :label="item.cn_name" :value="item.id"/>
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
        <el-form-item label="题目Flag" prop="category_id">
          <el-input
            v-for="(item,index) in flagAry"
            :key="index"
            v-model.trim="item.flag"
            type="input"
            placeholder="请输入flag"/>
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
              <el-button type="success" size="mini">下载wp查看</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持.pdf/.md/.png格式）
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
        <el-form-item key="docker_compose_file" label="docker compose file" prop="docker_compose_file">
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

        <el-form-item label="动态flag脚本文件" prop="category_id">
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
        <el-form-item label="是否公开">
          <el-switch
            v-model="ruleForm.public"
            :active-value="1"
            :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="赛题WP">
          <div v-if="ruleForm.official_writeup">
            <a :href="ruleForm.official_writeup" download>
              <el-button type="success" size="mini">下载wp查看</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持.pdf/.md/.png格式）
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="warning" @click="goback">返回</el-button>
        </el-form-item>
      </div>

      <div v-if="ruleForm.is_dynamic_flag==2">
        <el-form-item label="题目附件" prop="category_id">
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
              <el-button type="success" size="mini">下载wp查看</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持.pdf/.md/.png格式）
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
        <el-form-item key="docker_compose_file" label="docker compose file" prop="docker_compose_file">
          <el-input
            :rows="4"
            v-model="ruleForm.docker_compose_file"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="题目Flag" prop="category_id">
          <el-input
            v-for="(item,index) in flagAry"
            :key="index"
            v-model.trim="item.flag"
            type="input"
            placeholder="请输入flag"/>
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
              <el-button type="success" size="mini">下载wp查看</el-button>
            </a>
            <el-button type="danger" size="mini" @click="removeWriteup">删除wp</el-button>
          </div>
          <span v-show="!ruleForm.official_writeup">
            <input ref="writeUp" type="file">（只支持.pdf/.md/.png格式）
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
  fetchJeopardyTopicType,

  showJeopardyEditInfo,
  editJeopardyTopic,
  deleteJeopardyFile,
  deleteJeopardyWriteup,
  matchJeopardyMode,
  deleteJeopardyScript
} from '@/api/match/layered'

export default {
  components: {
    QuillEditor
  },
  data() {
    var checkScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('分值不能为0或空'))
      }
      if (isNaN(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value > 10000) {
          callback(new Error('分值应小于10000'))
        } else {
          callback()
        }
      }
    }
    return {
      task_id: this.$route.query.task_id,
      mathMode: {},
      showEn: true,
      flagType: '1',
      subType: [],
      enclosureAry: [1],
      flagAry: [{ flag: '' }],
      ruleForm: {
        score: 0,
        file: [],
        answer: [],
        official_writeup: null,
        event_id: this.$route.query.id,
        title: '', // 题目名称
        category_id: 1, // 题目类型id
        content: '', // 题目内容
        content_html: '', // 题目内容html
        level: 1,
        is_remote_env: 0, // 是否有场景链接
        is_dynamic_flag: 1, // 是否是动态环境
        docker_compose_file: '', // docker_compose_file
        protocol: '',
        public: true, // public
        push_flag_script: null // push flag
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字', trigger: 'blur' }
        ],
        docker_compose_file: [
          { required: true, message: '请输入docker compose file', trigger: 'blur' }
        ],
        score: [
          { validator: checkScore, required: true, trigger: 'blur' }
        ],
        push_flag_script: [
          { required: true, trigger: 'change' }
        ],
        category_id: [
          { type: 'number', required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getSubType()
    this.getMode()
    if (this.task_id) this.subInfo()
  },
  methods: {
    goback() {
      this.$router.push({
        path: '/competition/layered/editMatch/editMatch',
        query: { id: this.$route.query.id, step: 2 }
      })
    },
    getMode() {
      matchJeopardyMode(this.$route.query.id).then(res => {
        this.mathMode = res.data
      })
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
        this.ruleForm = res.data
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
      fetchJeopardyTopicType().then(res => {
        this.subType = res.data
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
      if (this.flagAry[0].flag === '' && this.ruleForm.is_dynamic_flag != 1) {
        this.$message.error('请至少输入一个flag')
        return
      }
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
      } else if (!this.ruleForm.push_flag_script && this.$refs['push_flag_script'] && this.$refs['push_flag_script'].files.length === 0) {
        this.$message.error('请上传动态flag脚本文件')
        return
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
      fm.append('event_id', this.$route.query.id)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.task_id) {
        editJeopardyTopic(this.task_id, fm).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/competition/layered/editMatch/editMatch',
              query: { id: this.$route.query.id, step: 2 }
            })
          }
          loading.close()
        }).catch(res => {
          loading.close()
        })
      } else {
        createTopic(fm).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/competition/operation',
              query: { id: this.$route.query.id }
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
        }
        if (this.enclosureAry[index] != 1) {
          deleteJeopardyFile(this.task_id, index).then(res => {
            if (this.ruleForm.is_dynamic_flag == 2) {
              this.enclosureAry.splice(index, 1)
              this.flagAry.splice(index, 1)
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
