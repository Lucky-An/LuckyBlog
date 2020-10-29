<template>
  <div class="app-container create_match">
    <div class="container_bg" style="padding-top:50px;">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        style="width: 1030px;margin:0 auto;"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="镜像名称" prop="name">
          <el-input
            v-model.trim="ruleForm.name"
            class="pad_r_45"
            maxlength="30"
            show-word-limit
            placeholder="请填写镜像名称，只能包含汉字、数字、字母、下划线"
          />
        </el-form-item>
        <el-form-item label="上传镜像类型" prop="image_type">
          <el-select
            v-model="ruleForm.image_type"
            :disabled="!!id||!!origin_id"
            placeholder="请选择上传镜像格式"
            clearable
            style="width:100%;"
            @change="clearData"
          >
            <el-option value="kvm" label="kvm" />
            <el-option value="docker" label="docker" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="ruleForm.image_type=='kvm'" label="操作系统类型" prop="os_type">
          <el-select
            v-model="ruleForm.os_type"
            clearable
            placeholder="请选择操作系统类型"
            style="width:100%;"
            @change="changeOstype"
          >
            <el-option
              v-for="item in systemType"
              :value="item.key"
              :label="item.display_name"
              :key="item.key"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="镜像来源" prop="is_base_image">
          <el-select
            v-model="ruleForm.is_base_image"
            clearable
            placeholder="请选择镜像来源"
            style="width:100%;"
          >
            <el-option key="false" value="false" label="自定义镜像" />
            <el-option key="true" value="true" label="纯净镜像" />
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="是否共享">
          <el-switch v-model="ruleForm.share" />
        </el-form-item>-->
        <!-- <el-form-item label="标签">
          <el-cascader
            v-model="ruleForm.image_tag_id"
            :options="tagTree"
            :props="{
              value:'id',
              label: 'name',
              checkStrictly: true
            }"
            clearable
            placeholder="请选择标签"
          />
        </el-form-item>-->

        <div
          v-if="ruleForm.image_type=='docker'"
          slot="tip"
          class="el-upload__tip"
        >只能上传tar.gz,tar,tgz文件</div>
        <div v-if="ruleForm.image_type=='kvm'" slot="tip" class="el-upload__tip">只能上传qcow2文件</div>

        <el-form-item v-if="!origin_id&&ruleForm.image_type" label="上传文件" required>
          <span class="upload_box">
            <input ref="image" type="file" @change="changeFile" >
            <el-button id="submit" size="small" type="primary">{{ filename ? '重新选择' : '选择文件' }}</el-button>
          </span>
          <div class="des_box">
            <p>{{ filename }}</p>
            <p v-if="ruleForm.image_type=='docker'">只能上传tar.gz,tar,tgz文件</p>
            <p v-if="ruleForm.image_type=='kvm'">只能上传qcow2文件</p>
          </div>

          <div v-if="allChunk>0" style="margin-bottom: 10px;">
            <el-progress
              :text-inside="true"
              :stroke-width="24"
              :percentage="progress"
              :status="proColor"
            />
          </div>
        </el-form-item>

        <el-form-item v-if="ruleForm.image_type=='kvm'" label="远程连接方式">
          <el-checkbox-group v-model="checkList" @change="checkChange">
            <div class="clearfix">
              <el-checkbox label="vnc" style="float:left;" disabled />
              <el-form-item label-width="90px" label="用户名" style="float:left;" prop="username">
                <el-input
                  v-model.trim="ruleForm.username"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item label-width="90px" label="密码" style="float:left;" prop="password">
                <el-input
                  v-model.trim="ruleForm.password"
                  type="text"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入密码"
                />
              </el-form-item>
            </div>

            <div class="clearfix" style="margin-top: 20px;">
              <el-checkbox
                :class="{'colorFul':ruleForm.os_type=='windows'}"
                :disabled="ruleForm.os_type=='windows'"
                label="ssh"
                style="float:left;"
              />
              <el-form-item
                v-if="ruleForm.ssh"
                label-width="90px"
                label="用户名"
                style="float:left;"
                prop="sshname"
              >
                <el-input
                  v-model.trim="ruleForm.ssh.username"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item
                v-if="ruleForm.ssh"
                label-width="90px"
                label="密码"
                style="float:left;"
                prop="sshpassword"
              >
                <el-input
                  v-model.trim="ruleForm.ssh.password"
                  type="text"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入密码"
                />
              </el-form-item>
              <el-form-item
                v-if="ruleForm.ssh"
                label-width="90px"
                label="端口"
                style="float:left;"
                prop="sshport"
              >
                <el-input
                  v-model.number.trim="ruleForm.ssh.port"
                  class="numberInput"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入端口"
                />
              </el-form-item>
            </div>

            <div class="clearfix" style="margin-top: 20px;">
              <el-checkbox label="rdp" style="float:left;" />
              <el-form-item
                v-if="ruleForm.rdp"
                label-width="90px"
                label="用户名"
                style="float:left;"
                prop="rdpname"
              >
                <el-input
                  v-model.trim="ruleForm.rdp.username"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item
                v-if="ruleForm.rdp"
                label-width="90px"
                label="密码"
                style="float:left;"
                prop="rdppassword"
              >
                <el-input
                  v-model.trim="ruleForm.rdp.password"
                  type="text"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入密码"
                />
              </el-form-item>
              <el-form-item
                v-if="ruleForm.rdp"
                label-width="90px"
                label="端口"
                style="float:left;"
                prop="rdpport"
              >
                <el-input
                  v-model.number.trim="ruleForm.rdp.port"
                  class="numberInput"
                  style="width:100px;margin-right:5px;"
                  placeholder="请输入端口"
                />
              </el-form-item>
            </div>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="镜像描述">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            placeholder="请输入描述"
            show-word-limit
          />
        </el-form-item>
        <el-form-item style="margin-top:60px;" class="from_submit_btn">

          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="warning" @click="backView">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getImagesInfo,
  editImages,
  createImages
  // getTagList,
} from '@/api/match/property'
import Cookies from 'js-cookie'

export default {
  components: {
  },
  data() {
    var validateOSType = (rule, value, callback) => {
      if (this.ruleForm.image_type == 'kvm' && value == '') {
        callback(new Error('请选择操作系统类型'))
      } else {
        callback()
      }
    }
    var validateUsername = (rule, value, callback) => {
      if (this.ruleForm.image_type == 'kvm' && value == '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (this.ruleForm.image_type == 'kvm' && value == '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }

    var sshname = (rule, value, callback) => {
      if (
        this.ruleForm.image_type == 'kvm' &&
        this.ruleForm.ssh &&
        this.ruleForm.ssh.username == ''
      ) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var sshpassword = (rule, value, callback) => {
      if (
        this.ruleForm.image_type == 'kvm' &&
        this.ruleForm.ssh &&
        this.ruleForm.ssh.password == ''
      ) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var sshport = (rule, value, callback) => {
      var r = /^[0-9]*$/
      var r2 = /^(0|[1-9][0-9]*)$/
      if (
        this.ruleForm.image_type == 'kvm' &&
        this.ruleForm.ssh &&
        this.ruleForm.ssh.port === ''
      ) {
        callback(new Error('请输入端口'))
      } else if (
        !r.test(this.ruleForm.ssh.port) ||
        !r2.test(this.ruleForm.ssh.port)
      ) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    var rdpname = (rule, value, callback) => {
      if (
        this.ruleForm.image_type == 'kvm' &&
        this.ruleForm.rdp &&
        this.ruleForm.rdp.username == ''
      ) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var rdppassword = (rule, value, callback) => {
      if (
        this.ruleForm.image_type == 'kvm' &&
        this.ruleForm.rdp &&
        this.ruleForm.rdp.password == ''
      ) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var rdpport = (rule, value, callback) => {
      var r = /^[0-9]*$/
      var r2 = /^(0|[1-9][0-9]*)$/
      if (
        this.ruleForm.image_type == 'kvm' &&
        this.ruleForm.rdp &&
        this.ruleForm.rdp.port === ''
      ) {
        callback(new Error('请输入端口'))
      } else if (
        !r.test(this.ruleForm.rdp.port) ||
        !r2.test(this.ruleForm.rdp.port)
      ) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }

    return {
      checkList: ['vnc'],

      systemType: [
        { key: 'linux', display_name: 'linux' },
        { key: 'windows', display_name: 'windows' }
        // { key: 'honeypot', display_name: '蜜罐平台' }
      ],
      typeData: [
        { key: 'router', name: '路由器' },
        { key: 'firewall', name: '防火墙' },
        { key: 'instance', name: '实例' },
        { key: 'other', name: '其他' }
      ],
      ruleForm: {
        name: '',
        image_type: '',
        os_type: '',
        // is_base_image: "",
        min_disk: 0,
        min_ram: 0,
        image_metadata: '',
        description: '',
        username: '',
        password: '',
        // image_tag_id: [],
        // share: false, // 是否共享
        ssh: null,
        rdp: null
      },
      rules: {
        name: [
          { required: true, message: '请填写镜像名称', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: '镜像名称只能包含汉字、数字、字母、下划线'
          }
        ],
        image_type: [
          { required: true, message: '请选择镜像类型', trigger: 'change' }
        ],
        os_type: [
          { required: true, validator: validateOSType, trigger: 'change' }
        ],
        // is_base_image: [
        //   { required: true, message: "请选择镜像来源", trigger: "change" },
        // ],
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        sshname: [{ required: true, validator: sshname, trigger: 'blur' }],
        sshpassword: [
          { required: true, validator: sshpassword, trigger: 'blur' }
        ],
        sshport: [{ required: true, validator: sshport, trigger: 'change' }],
        rdpname: [{ required: true, validator: rdpname, trigger: 'blur' }],
        rdppassword: [
          { required: true, validator: rdppassword, trigger: 'blur' }
        ],
        rdpport: [{ required: true, validator: rdpport, trigger: 'blur' }]
      },
      id: this.$route.query.id,
      origin_id: this.$route.query.origin_id,
      // tagTree: [],
      filename: '',
      filenameGet: '',
      chunk: 0, // 分片数量
      allChunk: 0, // 总分片数量
      proColor: 'success', // 进度条颜色
      progress: 0,
      image_uuid: '', //
      cancel: null
    }
  },

  created() {
    if (this.id) {
      this.getInfo()
    }
    // this.getTagList();
    if (this.origin_id) {
      this.ruleForm.image_type = 'kvm'
    }
  },

  beforeRouteLeave(to, from, next) {
    if (!this.image_uuid) {
      // 这个字段用来判断是否正在上传文件，如果没有上传，则直接离开页面，正在上传则取消上传。
      next()
      return
    }
    this.$confirm('离开当前页面会导致上传文件失败，确认要离开吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.cancel()
        next()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
      .catch((e) => {
        this.$message({
          type: 'success',
          message: '已取消离开'
        })
      })
  },
  methods: {
    checkChange(val) {
      // 多选框选中事件
      if (val.includes('ssh')) {
        // 如果选中了ssh并且form中ssh的值为null，则重置ssh
        if (!this.ruleForm.ssh) {
          this.ruleForm.ssh = { username: '', password: '', port: '' }
        }
      } else {
        this.ruleForm.ssh = null
      }

      if (val.includes('rdp')) {
        // 如果选中了rdp并且form中rdp的值为null，则重置rdp
        if (!this.ruleForm.rdp) {
          this.ruleForm.rdp = { username: '', password: '', port: '' }
        }
      } else {
        this.ruleForm.rdp = null
      }
    },
    changeFile() {
      // 监听input上传文件
      const image = this.$refs['image'].files
      if (image.length > 0) {
        if (this.ruleForm.image_type == 'kvm') {
          if (!this.endWith(image[0].name, '.qcow2')) {
            this.$message.error('只能上传.qcow2文件')
            this.$refs['image'].value = ''
            this.filename = this.filenameGet
            return
          }
        } else if (this.ruleForm.image_type == 'docker') {
          const type = ['.tar.gz', '.tar', '.tgz']
          const isType = type.some((item) => this.endWith(image[0].name, item))
          if (!isType) {
            this.$message.error('只能上传tar.gz,tar,tgz文件')
            this.$refs['image'].value = ''
            this.filename = this.filenameGet
            return
          }
        }
        this.filename = image[0].name
      } else {
        // 没有选中文件，文件名重置
        this.filename = this.filenameGet
      }
    },
    endWith(str, endStr) {
      // 判断文件名称以什么结尾
      var d = str.length - endStr.length
      return d >= 0 && str.toLowerCase().lastIndexOf(endStr) == d
    },
    uploadImg(data) {
      const image = this.$refs['image'].files // 选择的文件

      // 如果长度为0，说明没有选择文件上传，直接返回列表
      if (image.length === 0) {
        this.$message.success('操作成功')
        this.$router.push({
          path: '/image/virtual'
        })
        return
      }

      this.image_uuid = data.image_uuid // 唯一id
      const chunkSize = 10 * 1024 * 1024 // 分片大小

      // 计算总切片大小
      this.allChunk = Math.floor(image[0].size / chunkSize)
      this.chunkUploadFile(image[0], this.chunk, this.image_uuid, chunkSize)
    },
    chunkUploadFile(file, chunk, image_uuid, chunkSize) {
      // 需要将每片文件的起始值和结尾值发给后台。
      // endC结尾值，endLength当前分片长度，CancelToken用于取消接口。
      const endC =
        chunk == this.allChunk ? file.size - 1 : (chunk + 1) * chunkSize - 1
      const endLength = chunk == this.allChunk ? file.size - endC : chunkSize
      const CancelToken = this.axios.CancelToken
      const data = file.slice(chunk * chunkSize, (chunk + 1) * chunkSize)
      this.axios({
        url: '/api/v1/admin/upload',
        method: 'post',
        data,
        params: { image_uuid: image_uuid },
        headers: {
          'Content-Disposition': 'attachment;filename="' + image_uuid + '"',
          'X-CSRF-Token': Cookies.get('X-CSRF-Token'),
          'X-Content-Range':
            'bytes ' + chunk * chunkSize + '-' + endC + '/' + file.size,
          'X-Session-ID': image_uuid,

          'Content-Type': 'application/octet-stream'
        },
        cancelToken: new CancelToken((c) => {
          // executor 函数接收一个 cancel 函数作为参数
          this.cancel = c
        })
      }).then((res) => {
        this.chunk++
        this.progress = ((this.chunk / this.allChunk) * 100) | 0
        if (res.status == 200) {
          this.image_uuid = null // 初始化
          this.$message.success('操作成功')
          this.$router.push({
            path: '/image/virtual'
          })
        } else {
          this.chunkUploadFile(file, this.chunk, image_uuid, chunkSize)
        }
      })
    },
    changeOstype(val) {
      if (val == 'windows') {
        this.ruleForm.image_metadata = 'disk_bus:ide,vif_type:rtl8139'
      } else {
        this.ruleForm.image_metadata = ''
      }
    },

    clearData() {
      this.ruleForm.os_type = ''
      this.ruleForm.min_disk = 0
      this.ruleForm.min_ram = 0
      this.ruleForm.image_metadata = ''
      this.ruleForm.username = ''
      this.ruleForm.password = ''
    },
    backView() {
      if (this.origin_id) {
        this.$router.push({
          path: '/image/imageFormat'
        })
      } else {
        this.$router.push({
          path: '/image/virtual'
        })
      }
    },

    getInfo() {
      // 获取详情
      getImagesInfo(this.id).then((res) => {
        const { data } = res
        if (data.success) {
          for (const key in this.ruleForm) {
            this.ruleForm[key] = data.data[key]
          }
          // this.ruleForm.is_base_image = String(this.ruleForm.is_base_image);
          const { show_name: sn } = data.data
          this.filename = this.filenameGet = sn
            ? data.data.show_name + '.qcow2'
            : ''

          // 如果后台没有返回ssh，则手动添加ssh。若返回，则勾选ssh
          if (!this.ruleForm.ssh) {
            this.ruleForm.ssh = null
          } else {
            this.checkList.push('ssh')
          }
          // 如果后台没有返回ssh，则手动添加ssh。若返回，则勾选ssh
          if (!this.ruleForm.rdp) {
            this.ruleForm.rdp = null
          } else {
            this.checkList.push('rdp')
          }
        }
      })
    },
    onSubmit() {
      // 如果没有勾选这两种连接方式，则不将相应字段传给后台。
      if (this.ruleForm.image_type !== 'kvm' || !this.ruleForm.ssh) {
        delete this.ruleForm.ssh
      }
      if (this.ruleForm.image_type !== 'kvm' || !this.ruleForm.rdp) {
        delete this.ruleForm.rdp
      }
      if (this.ruleForm.image_type === 'kvm') { this.ruleForm.beats_injection = true }
      if (this.id) {
        editImages(this.id, this.ruleForm).then((res) => {
          if (res.data.success) {
            this.uploadImg(res.data.data)
          }
        })
      } else {
        if (this.origin_id) {
          this.ruleForm.origin_id = this.origin_id
        }
        createImages(this.ruleForm).then((res) => {
          if (res.data.success) {
            this.uploadImg(res.data.data)
          }
        })
      }
    },
    uploadImage(uuid) {
      setTimeout(() => {
        this.$refs.upload.submit()
      }, 0)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          return false
        }
      })
    },

    // getTagList() {
    //   // 获取全部镜像标签
    //   return getTagList().then((res) => {
    //     this.tagTree = this.initData(res.data.data);
    //   });
    // },

    initData(list) {
      // 将数组转为树形结构
      const temp = {}
      const tree = []
      for (const i of list) {
        i.id = String(i.id)
        temp[i.id] = i
      }
      for (const i in temp) {
        if (temp[i].parent_id) {
          if (!temp[temp[i].parent_id].children) {
            temp[temp[i].parent_id].children = []
          }
          temp[temp[i].parent_id].children.push(temp[i])
        } else {
          tree.push(temp[i])
        }
      }
      return tree
    }
  }
}
</script>

<style>
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
</style>
<style>
.numberInput input::-webkit-outer-spin-button,
.numberInput input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>
