<template>
  <div class="app-container create_topic">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item label="题目名称" prop="title" placeholder="请输入题目名称">
        <el-input v-model.trim="ruleForm.title" />
      </el-form-item>

      <el-form-item label="题目类型" prop="challenge_type">
        <el-select
          v-model="ruleForm.challenge_type"
          class="filter-item"
          size="mini"
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
          size="mini"
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
          size="mini"
          placeholder="请选择题目难度"
        >
          <el-option key="1" :value="0" label="初级" />
          <el-option key="2" :value="1" label="中级" />
          <el-option key="3" :value="2" label="高级" />
        </el-select>
      </el-form-item>
      <el-form-item label="镜像类型">
        <el-select
          v-model="ruleForm.start_method"
          disabled
          class="filter-item"
          size="mini"
          placeholder="请选择镜像类型"
          @change="changeImageType"
        >
          <el-option :value="0" label="Docker启动" />
          <el-option :value="1" label="KVM" />

          <!-- <el-option v-for="item,ind in tagAry" :key="ind" :label="item.cn_name" :value="item.id"/> -->
        </el-select>
      </el-form-item>
      <el-form-item label="镜像选择">
        <!-- <el-button type="primary" @click="getMirrorList">选择</el-button>
        <span>
          {{ ruleForm.image_name }}
        </span>-->
        <el-button
          disabled
          type="primary"
          size="mini"
          @click="selectMirror = true"
        >选择</el-button
        >
        {{ ruleForm.image_name }}
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
      <el-form-item label="实例模板">
        <el-select
          v-model="ruleForm.flavor_uuid"
          disabled
          class="filter-item"
          size="mini"
          placeholder="请选择实例模板"
        >
          <!-- <el-option
            v-for="(item,i) in subflavors"
            :key="i"
            :label="`${item.name} / ${item.vcpus}核 / ${item.memory/1024/1024/1024}MB / ${item.disk/1024/1024/1024}GB`"
            :value="item.uuid+','+item.name"
          /> -->
          <el-option
            v-for="item in flavorList"
            :key="item.uuid"
            :label="`${item.name} / ${item.vcpus}核 / ${item.memory}MB / ${item.disk}GB`"
            :value="item.uuid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="题目分值桶">
        <el-input-number
          v-model.trim="ruleForm.score"
          :min="-10000"
          :max="100000"
          label="描述文字"
        />
      </el-form-item>
      <el-form-item
        v-if="ruleForm.start_method == 0"
        label="附件"
        prop="checker_script"
      >
        <UploadFile
          :file.sync="ruleForm.attach_file"
          :file-type="['zip']"
          :file-size="20 * 1024 * 1024"
        />
        （请上传zip格式文件，大小不超过20M）
      </el-form-item>

      <el-form-item label="checker脚本" prop="checker_script">
        <UploadFile :file.sync="ruleForm.checker_script" :file-type="['py']" />
        (请上传py格式文件,大小不超过10M)
      </el-form-item>
      <el-form-item label="pushflag脚本" prop="checker_script">
        <UploadFile :file.sync="ruleForm.pushflag_script" :file-type="['sh']" />
        (请上传sh格式文件,大小不超过10M)
      </el-form-item>
      <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.wp_official"
          :file-type="['pdf', 'docx', 'md']"
        />
        （请上传pdf,docx,md格式文件,大小不超过10M）
      </el-form-item>
      <!-- <el-form-item label="上传题目二进制文件" required>
        <UploadFile :file.sync="ruleForm.attach" :file-size="1*1024*1024" />
        （请上传二进制文件,大小不超过1M）
      </el-form-item> -->
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
import QuillEditor from '@/components/QuillEditor'
import { DefenseAddTopic, DefenseEditSubmit } from '@/api/itemBank/defense'
import { fetchTags, fetchType, flavors, images } from '@/api/itemBank/common'
import {
  defenseMatchTopicInfo,
  defenseMatchTopicSunmit
} from '@/api/match/defense'
import UploadFile from '@/components/UploadFile'
import ChoiceImage from '@/components/ChoiceImage'
import { getFlavorList } from '@/api/itemBank/common'

export default {
  components: {
    UploadFile,
    ChoiceImage,
    QuillEditor
  },
  data() {
    return {
      flavomag: '',
      selectMirror: false,
      task_id: this.$route.query.task_id,
      id: this.$route.query.id,
      tagAry: [],
      subType: [],
      templateList: [],
      subflavors: [], // 下拉框实例模板
      flavorList: [],
      ruleForm: {
        title: '', // 题目名称
        challenge_type: '', // 题目类型id
        label: '', // 题目标签
        level: 0, // 题目难度
        start_method: '', // 镜像类型  0 docker启动 1 虚拟机启动
        image_uuid: '', // 镜像类型
        image_name: '', // 镜像名称
        port: 80, // 题目端口
        flavor_uuid: '', // 实例模板id
        flavor_name: '', // 实例模板名字
        score: '', // 题目分值桶
        attach_file: null, // 附件
        checker_script: null, // checker脚本
        pushflag_script: null, // pushflag脚本
        wp_official: null // 题目wp
        // attach: null
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
        checker_script: [
          { required: true, message: '请上传文件', trigger: 'blur' }
        ],
        start_method: [
          { required: true, message: '请选择镜像类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getType()
    this.getTag()
    this.getflavors()
    if (this.task_id) this.subInfo()
  },
  methods: {
    getflavors() {
      // 获取实例模板
      // flavors().then((res) => {
      //   this.subflavors = res.data.data
      // })
      getFlavorList({
        page: 1,
        per_page: 999
      }).then((res) => {
        this.flavorList = res.data.data
      })
    },
    goBack() {
      this.$router.push({
        path: '/competition/defense/editMatch/editMatch',
        query: { id: this.id, step: 2 }
      })
    },
    getType() {
      // 获取题目类型
      fetchType({ type: 1 }).then((res) => {
        this.subType = res.data
      })
    },
    getTag() {
      // 获取题目标签
      fetchTags({ type: 1 }).then((res) => {
        this.tagAry = res.data
      })
      // templateName().then(res => {
      //   this.templateList = res.data
      // })
    },
    subInfo() {
      // 题目信息回显
      const p = {
        challenge_id: this.task_id,
        event_id: this.id
      }
      defenseMatchTopicInfo(p).then((res) => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
        this.ruleForm.flavor_uuid = res.data.flavor_uuid
        this.ruleForm.flavor_name = res.data.flavor_name
        this.flavomag = res.data.flavor_name
      })
    },

    onSubmit() {
      const formData = this.ruleForm
      const fm = new FormData()
      for (const key in formData) {
        fm.append(key, formData[key])
      }

      if (this.task_id) {
        const params = { challenge_id: this.task_id, event_id: this.id }
        defenseMatchTopicSunmit(params, fm).then((res) => {
          if (res.data.success) {
            this.$router.push({
              path: '/competition/defense/editMatch/editMatch',
              query: { id: this.id, step: 2 }
            })
          }
        })
      } else {
        DefenseAddTopic(fm).then((res) => {
          if (res.data.success) {
            history.back()
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
p {
  margin: 0;
}
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
