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
          placeholder="请选择题目类型"
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
          placeholder="请选择题目标签"
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
          placeholder="请选择题目难度"
        >
          <el-option key="1" :value="0" label="初级" />
          <el-option key="2" :value="1" label="中级" />
          <el-option key="3" :value="2" label="高级" />
        </el-select>
      </el-form-item>
      <el-form-item label="镜像类型" prop="start_method">
        <el-select
          v-model="ruleForm.start_method"
          class="filter-item"
          placeholder="请选择镜像类型"
          @change="changeImageType"
        >
          <el-option :value="0" label="Docker" />
          <el-option :value="1" label="KVM" />
        </el-select>
      </el-form-item>
      <el-form-item label="镜像选择" required>
        <el-button
          type="primary"
          size="mini"
          @click="selectMirror = true"
        >选择</el-button
        >
        <span>{{ ruleForm.image_name }}</span>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.start_method == 0"
        label="题目端口"
        prop="port"
      >
        <el-input-number
          v-model="ruleForm.port"
          :min="0"
          :max="65535"
          :precision="0"
          placeholder="默认80端口"
        />
      </el-form-item>

      <el-form-item label="实例模板" prop="flavor_uuid">
        <el-select
          v-model="currentFlavor"
          placeholder="实例模板"
          value-key="uuid"
          @change="flavorChange"
        >
          <el-option
            v-for="item in subflavors"
            :key="item.uuid"
            :value="item"
            :label="`${item.name} / ${item.vcpus}核 / ${item.memory}MB / ${item.disk}GB`"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目分值桶">
        <el-input-number
          v-model="ruleForm.score"
          :min="-10000"
          :max="100000"
          label="描述文字"
        />
      </el-form-item>

      <el-form-item label="checker脚本" required>
        <UploadFile :file.sync="ruleForm.checker_script" :file-type="['py']" />
        （请上传py格式文件,大小不超过10M）
      </el-form-item>
      <el-form-item label="pushflag脚本" required>
        <UploadFile :file.sync="ruleForm.pushflag_script" :file-type="['sh']" />
        （请上传sh格式文件,大小不超过10M）
      </el-form-item>
      <!-- label="上传题目二进制文件" -->
      <el-form-item label="题目附件" required>
        <UploadFile
          :file.sync="ruleForm.attach_file"
          :file-size="10 * 1024 * 1024"
          :file-type="['zip']"
        />
        （请上传zip格式文件,大小不超过10M）
        <!-- （请上传二进制文件,大小不超过1M） -->
      </el-form-item>
      <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.wp_official"
          :file-type="['pdf', 'docx', 'md']"
        />
        （请上传pdf,docx,md格式文件,大小不超过10M）
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button
        >
        <el-button type="warning" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
    <ChoiceImage
      v-if="selectMirror"
      :type="ruleForm.start_method == 0 ? 'docker' : 'kvm'"
      :image_name.sync="ruleForm.image_name"
      :image_uuid.sync="ruleForm.image_uuid"
      :select-mirror.sync="selectMirror"
    />
  </div>
</template>

<script>
import ChoiceImage from '@/components/ChoiceImage'

import UploadFile from '@/components/UploadFile'
import QuillEditor from '@/components/QuillEditor'
import {
  DefenseAddTopic,
  DefenseEditSubmit,
  DefenseEditInfo
} from '@/api/itemBank/defense'
import { fetchTags, fetchType, flavors, images } from '@/api/itemBank/common'
import {
  httpGetFlavorList, // 获取实力模板接口
  httpGetAdminImages // 获取镜像接口
} from '@/api/itemBank/penetration'

export default {
  components: {
    UploadFile,
    QuillEditor,
    ChoiceImage
  },
  data() {
    var checkAge = (rule, value, callback) => {
      callback()
    }
    return {
      currentFlavor: null, // 当前实例模板
      selectMirror: false, // 镜像弹窗
      allMirrorList: [],
      is_image_type: '', // 镜像类型
      image_type_list: [
        {
          label: 'kvm',
          value: 'kvm'
        },
        {
          label: 'docker',
          value: 'docker'
        },
        {
          label: 'docker_compose',
          value: 'docker_compose'
        }
      ], // 镜像类型列表
      listSelect: {
        limit: 10, // 每页显示数量
        offset: 1 // 页码
      },
      total: 0, // 总数
      search: '', // 镜像搜索关键字
      os_type_list: [
        {
          label: 'windows',
          value: 'windows'
        },
        {
          label: 'linux',
          value: 'linux'
        }
      ], // 镜像来源列表
      os_type: '', // 镜像搜索系统类型

      task_id: this.$route.query.task_id,
      tagAry: [],
      subType: [],
      subimages: [],
      subflavors: [], // 下拉框实例模板
      ruleForm: {
        title: '', // 题目名称
        challenge_type: '', // 题目类型id
        label: '', // 题目标签
        level: 0, // 题目难度
        start_method: 0, // 镜像类型  0 docker启动 1 虚拟机启动
        image_uuid: '', // 镜像类型
        image_name: '', // 镜像名称
        port: 80, // 题目端口
        flavor_uuid: '', // 实例模板id
        flavor_name: '', // 实例模板名字
        score: '', // 题目分值桶
        attach_file: null, // 附件
        checker_script: null, // checker脚本
        pushflag_script: null, // pushflag脚本
        wp_official: null, // 题目wp
        attach: null
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        image_name: [
          { required: true, message: '请输入镜像名称', trigger: 'blur' }
        ],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],

        challenge_type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请选择题目标签', trigger: 'change' }
        ],

        start_method: [
          { required: true, message: '请选择镜像类型', trigger: 'blur' }
        ],
        flavor_uuid: [
          { required: true, message: '请选择实例模板', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getType()
    this.getTag()
    this.getimages()
    this.getflavors()
    if (this.task_id) this.subInfo()
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    // 弹窗中点击取消的事件
    cancelSelect() {
      this.is_image_type = ''
      this.search = ''
      this.os_type = ''
      this.selectMirror = false
      this.selectMirrorList = []
    },
    // 镜像列表选中状态修改
    changeSelectedMirrorList(val) {
      if (val.length > 1) {
        this.$refs.MirrorListTable.clearSelection()
        this.$refs.MirrorListTable.toggleRowSelection(val[1])
        val.shift()
      }
      this.selectMirrorList = val
    },
    // 弹窗中点击确认的事件
    confirmSelect() {
      this.is_image_type = ''
      this.search = ''
      this.os_type = ''
      this.selectMirror = false
      if (this.selectMirrorList.length) {
        this.ruleForm.image_name = this.selectMirrorList[0].name
        this.ruleForm.image_uuid = this.selectMirrorList[0].uuid
      }
    },
    goBack() {
      history.back()
    },
    getType() {
      // 获取题目类型
      fetchType({ type: 1 }).then((res) => {
        this.subType = res.data
      })
    },
    getimages() {
      // 获取镜像类型
      images().then((res) => {
        this.subimages = res.data.data
      })
    },
    getflavors() {
      // 获取实例模板
      flavors().then((res) => {
        this.subflavors = res.data.data
      })
    },
    getTag() {
      // 获取题目标签
      fetchTags({ type: 1 }).then((res) => {
        this.tagAry = res.data
      })
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
        this.ruleForm.flavor_uuid = res.data.flavor_uuid
        this.ruleForm.flavor_name = res.data.flavor_name

        this.currentFlavor = { uuid: this.ruleForm.flavor_uuid }
      })
    },

    onSubmit() {
      const formData = this.ruleForm
      const fm = new FormData()
      for (const key in formData) {
        fm.append(key, formData[key])
      }

      const url = '/itemBank/defense/index'

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
    flavorChange({ name, uuid }) {
      this.ruleForm.flavor_name = name
      this.ruleForm.flavor_uuid = uuid
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const attrMap = {
            checker_script: 'checker 脚本',
            pushflag_script: 'pushflag 脚本',
            attach_file: '题目附件'
          }
          for (const key in attrMap) {
            if (!this.ruleForm[key]) {
              this.$message.error(`请上传 ${attrMap[key]}`)
              return false
            }
          }
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
.filter-item1 {
  float: left;
  width: 260px;
  margin-left: 20px;
}
.filter-item1:first-child {
  margin-left: 5%;
}
.filter-item-btn {
  margin-left: 5%;
}
</style>
