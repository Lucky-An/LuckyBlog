<template>
  <div class="app-container create_match">
    <div class="container_bg" style="padding-top:50px;">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        style="width:680px;margin:0 auto;"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="镜像名称" prop="file_alias">
          <el-input
            v-model.trim="ruleForm.file_alias"
            class="pad_r_45"
            maxlength="20"
            show-word-limit
            placeholder="请填写镜像名称,只能包含汉字、数字、字母、下划线"
          />
        </el-form-item>
        <el-form-item label="原格式" prop="original_format">
          <el-select
            :disabled="!!id"
            v-model="ruleForm.original_format"
            placeholder="请选择镜像类型"
            clearable
            class="filter-item"
            @change="changeOrigin('original_format')"
          >
            <el-option
              v-for="item in imageFormat"
              :key="item.key"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转换后格式" prop="change_format">
          <el-select
            :disabled="!!id"
            v-model="ruleForm.change_format"
            placeholder="请选择镜像类型"
            clearable
            class="filter-item"
            @change="changeOrigin('change_format')"
          >
            <el-option
              v-for="item in imageFormat"
              :key="item.key"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item :class="{'hideBtn':id}" label="上传文件" class="file_parent" prop="file">
          <el-input v-model="ruleForm.file" class="hideInput" style="display:none" placeholder />
          <input id="home_files" ref="home_file" :disabled="id" type="file" @change="changeName" >
          <span v-if="!id" class="file_name">{{ ruleForm.file }}</span>
          <div v-if="ruleForm.file&&id">
            <span>已上传文件：{{ ruleForm.file }}</span>
          </div>
        </el-form-item>-->

        <el-form-item v-if="id" label="上传文件">
          <span>已上传文件：{{ ruleForm.file }}</span>
        </el-form-item>

        <el-form-item label="上传文件" required>
          <span class="upload_box">
            <input v-if="!id" ref="image" type="file" @change="changeFile">
            <el-button id="submit" :disabled="!!id" size="small" type="primary">选择文件</el-button>
          </span>
          <p>{{ ruleForm.filename }}</p>
          <div v-if="allChunk>0" style="margin-bottom: 10px;">
            <!--<el-progress-->
            <!--:text-inside="true"-->
            <!--:stroke-width="24"-->
            <!--:percentage="Math.ceil(chunk/allChunk*100)"-->
            <!--:status="proColor"-->
            <!--/>-->
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="progress"
              :status="proColor"
            />
          </div>
        </el-form-item>

        <el-form-item style="margin-top:60px;" class="from_submit_btn">
          <el-button :disabled="!!task_id" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button type="info" @click="backView">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getFormatInfo,
  editFormat,
  uploadInfo,
  createFormat,
  mergeFormat,
  cancelFormat
} from '@/api/match/property'
import Cookies from 'js-cookie'

export default {
  name: 'CreateFlavor',

  data() {
    return {
      imageFormat: [
        {
          key: 'qcow',
          label: 'qcow'
        },
        {
          key: 'qcow2',
          label: 'qcow2'
        },
        {
          key: 'raw',
          label: 'raw'
        },
        {
          key: 'vmdk',
          label: 'vmdk'
        },
        {
          key: 'vdi',
          label: 'vdi'
        }
      ],

      ruleForm: {
        file_alias: '',
        original_format: '',
        change_format: '',
        filename: ''
      },
      rules: {
        file_alias: [
          { required: true, message: '请填写镜像名称', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: '镜像名称只能包含汉字、数字、字母、下划线'
          }
        ],
        original_format: [
          { required: true, message: '请选择原格式', trigger: 'change' }
        ],
        change_format: [
          { required: true, message: '请选择转换后格式', trigger: 'change' }
        ],
        file: [{ required: true, message: '请上传文件', trigger: 'blur' }]
      },
      id: this.$route.query.id,
      chunk: 0, // 分片数量
      allChunk: 0, // 总分片数量
      proColor: 'success', // 进度条颜色

      progress: 0,
      task_id: '', //
      cancel: null
    }
  },

  created() {
    if (this.id) {
      this.getInfo()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.task_id) {
      // 这个字段用来判断是否正在上传文件，如果没有上传，则直接离开页面，正在上传则取消上传。
      next()
      return
    }
    this.$confirm('离开当前页面会导致上传文件失败，确认要离开吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      cancelFormat(this.task_id).then(res => {
        const data = res.data
        if (data.success) {
          this.cancel()
          next()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
      })
    }).catch((e) => {
      this.$message({
        type: 'success',
        message: '已取消离开'
      })
    })
  },
  methods: {
    changeOrigin(targetAttr) {
      if (this.ruleForm.original_format == '' && this.ruleForm.change_format == '') {
        return
      }
      if (this.ruleForm.original_format === this.ruleForm.change_format) {
        this.$message.error('原文件格式和转换后格式不能相同')
        this.ruleForm[targetAttr] = ''
      }
    },
    backView() {
      this.$router.push({
        path: '/image/imageFormat'
      })
    },

    getInfo() {
      // 获取比赛详情
      getFormatInfo(this.id).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data.data[key]
        }
        this.ruleForm.file = res.data.data.original_file
      })
    },

    onSubmit(formName) { // 点击提交按钮
      if (this.id) {
        const newForm = new FormData()
        if (this.ruleForm.file_alias) {
          newForm.append('file_alias', this.ruleForm.file_alias)
          editFormat(newForm, this.id).then(res => {
            if (res.data.success) {
              this.$message.success('保存成功')
              this.$router.push({
                path: '/image/imageFormat'
              })
            }
          })
        }
      } else {
        this.uploadImg()
      }
    },

    changeFile() { // 监听input上传文件
      const image = this.$refs['image'].files
      if (image.length > 0) {
        this.ruleForm.filename = image[0].name
        this.proColor = 'success'
      } else {
        this.ruleForm.filename = ''
      }
    },
    uploadImg() {
      const image = this.$refs['image'].files // 选择的文件
      const task_id = '' // 唯一id
      const chunkSize = 10 * 1024 * 1024 // 分片大小

      if (image.length === 0) {
        this.$message.error('请选择文件')
        return
      }

      // 计算总切片大小
      this.allChunk = Math.floor(image[0].size / chunkSize)
      uploadInfo(this.ruleForm).then(res => {
        if (res.data.success) {
          this.task_id = res.data.data.id
          // this.uploadFile(image[0], res.data.data.id)

          this.chunkUploadFile(image[0], this.chunk, res.data.data.uuid, chunkSize, res.data.data.id)
        }
      })
    },
    uploadFile(file, task_id) {
      const CancelToken = this.axios.CancelToken
      const form = new FormData()
      form.append('file', file)
      form.append('image_id', task_id)
      this.axios({
        url: '/api/v1/admin/resource/images_format/upload',
        method: 'post',
        data: form,
        headers: {
          'X-CSRF-Token': Cookies.get('X-CSRF-Token')
        },
        onUploadProgress: (progressEvent) => {
          this.progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
        },
        cancelToken: new CancelToken((c) => {
          // executor 函数接收一个 cancel 函数作为参数
          this.cancel = c
        })
      }).then(res => {
        if (res.data.success) {
          this.task_id = null// 初始化
          this.$router.push({
            path: '/image/imageFormat'
          })
        } else {
          this.$message.error(res.data.message_zh)
        }
      })
    },
    chunkUploadFile(file, chunk, task_id, chunkSize, id) {
      let endC = chunk == this.allChunk ? file.size - 1 : ((chunk + 1) * chunkSize - 1), endLength = chunk == this.allChunk ? file.size - endC : chunkSize, CancelToken = this.axios.CancelToken

      this.axios({
        url: '/api/v1/admin/resource/images_format/upload',
        method: 'post',
        data: file.slice(chunk * chunkSize, (chunk + 1) * chunkSize),
        params: { image_id: id },
        headers: {
          'Content-Disposition': 'attachment;filename="' + task_id + '"',
          'X-CSRF-Token': Cookies.get('X-CSRF-Token'),
          'X-Content-Range': 'bytes ' + chunk * chunkSize + '-' + endC + '/' + file.size,
          'X-Session-ID': task_id,
          'Content-Length': endLength + '',
          'image_id': id + '',
          'Content-Type': 'application/octet-stream'
        },
        cancelToken: new CancelToken((c) => {
          // executor 函数接收一个 cancel 函数作为参数
          this.cancel = c
        })
      }).then(res => {
        this.chunk++
        this.progress = (this.chunk / this.allChunk * 100 | 0)
        if (res.status == 200) {
          this.task_id = null// 初始化
          this.$router.push({
            path: '/image/imageFormat'
          })
        } else {
          this.chunkUploadFile(file, this.chunk, task_id, chunkSize, id)
        }
      })
    },
    mergeImage(file, task_id, id) {
      this.ruleForm.task_id = task_id

      mergeFormat(id, {
        task_id
      }).then(res => {
        if (res.data.success) {
          this.$message.success('上传成功')
          this.$router.push({
            path: '/image/imageFormat'
          })
        } else {
          this.proColor = 'exception'
          this.$message.error(res.data.message_zh)
        }
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$message.error('填写信息有误')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .create_match {
    position: relative;
    width: 100%;
    min-width: 600px;
  }

  .goBottom {
    position: absolute;
    right: -150px;
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

  .hideBtn .el-form-item__content:before {
    display: none !important;
  }

  .hideBtn #home_files {
    position: absolute;
    display: none;
  }

  .create_match {
    width: 90%;
    min-width: 600px;
  }

  .upload_box {
    position: relative;
    margin-right: 10px;
    overflow: hidden;
    cursor: pointer;
  }

  .upload_box input {
    opacity: 0;
    width: 80px;
    height: 32px;
    position: absolute;
    cursor: pointer;
    top: -7px;
  }
</style>
