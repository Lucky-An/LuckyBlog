<template>
  <div class="app-container create_newAD_task">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item label="题目名称" prop="title" placeholder="请输入题目名称">
        <el-input v-model.trim="ruleForm.title" placeholder="请输入题目名称" />
      </el-form-item>

      <el-form-item label="题目类型" prop="challenge_type">
        <el-select
          v-model="ruleForm.challenge_type"
          class="filter-item"
          placeholder="题目类型"
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
        <el-select v-model="ruleForm.label" placeholder="题目类型">
          <el-option
            v-for="(item, ind) in tagAry"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目难度">
        <el-select v-model="ruleForm.level" placeholder="题目难度">
          <el-option key="1" :value="0" label="初级" />
          <el-option key="2" :value="1" label="中级" />
          <el-option key="3" :value="2" label="高级" />
        </el-select>
      </el-form-item>

      <el-form-item label="镜像类型" required>
        <el-select
          v-model="ruleForm.image_type"
          placeholder="镜像类型"
          @change="changeImageType"
        >
          <el-option key="1" value="kvm" label="KVM" />
          <el-option key="2" value="docker" label="Docker" />
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

      <el-form-item
        v-if="ruleForm.image_type === 'docker'"
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

      <el-form-item label="实例模板" required>
        <el-select
          v-model="currentFlavor"
          placeholder="实例模板"
          value-key="uuid"
          @change="flavorChange"
        >
          <el-option
            v-for="item in flavors"
            :key="item.uuid"
            :value="item"
            :label="`${item.name} / ${item.vcpus}核 / ${item.memory}MB / ${item.disk}GB`"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="patch 规则" prop="patch_rule">
        <el-input v-model.trim="ruleForm.patch_rule" />
      </el-form-item>

      <el-form-item label="patch 提交限制字数">
        <el-input-number
          v-model="ruleForm.limit_size"
          :min="-10000"
          :max="100000"
          label="描述文字"
        />
      </el-form-item>

      <el-form-item label="题目附件" required>
        <UploadFile
          :file.sync="ruleForm.zip_file_path"
          :file-type="['zip']"
          :file-size="20 * 1024 * 1024"
        />
        （请上传zip格式文件，大小不超过20M）
      </el-form-item>

      <el-form-item label="上传题目二进制文件" required>
        <UploadFile :file.sync="ruleForm.attach" :file-size="1 * 1024 * 1024" />
        （请上传二进制文件,大小不超过1M）
      </el-form-item>

      <el-form-item label="checker 脚本" required>
        <UploadFile :file.sync="ruleForm.checker_script" :file-type="['py']" />
        （请上传py格式文件,大小不超过10M）
      </el-form-item>

      <el-form-item label="pushflag 脚本" required>
        <UploadFile :file.sync="ruleForm.pushflag_script" :file-type="['sh']" />
        （请上传sh格式文件,大小不超过10M）
      </el-form-item>

      <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.wp_official"
          :file-type="['pdf', 'md', 'docx']"
        />
        （请上传pdf,docx,md格式文件,大小不超过10M）
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button
        >
        <el-button type="warning" @click="goback">返回</el-button>
      </el-form-item>
    </el-form>

    <choiceImage
      v-if="selectMirror"
      :type="ruleForm.image_type"
      :image_name.sync="ruleForm.image_name"
      :image_uuid.sync="ruleForm.image_uuid"
      :select-mirror.sync="selectMirror"
    />
  </div>
</template>

<script>
import {
  DefenseAddTopic,
  DefenseEditSubmit,
  DefenseEditInfo
} from '@/api/itemBank/newAD'
import {
  defenseMatchTopicInfo,
  defenseMatchTopicSunmit
} from '@/api/match/newAD'
import { fetchTags, fetchType, getFlavorList } from '@/api/itemBank/common'
import choiceImage from '@/components/ChoiceImage'
import UploadFile from '@/components/UploadFile'

export default {
  components: {
    choiceImage,
    UploadFile
  },
  data() {
    return {
      task_id: this.$route.query.task_id,
      id: this.$route.query.id,
      tagAry: [],
      subType: [],
      templateList: [],
      selectMirror: false,
      ruleForm: {
        title: '', // 题目名称
        challenge_type: '', // 题目类型id
        label: '', // 题目标签
        level: 0, // 题目难度
        port: 80, // 题目端口
        image_type: 'kvm', // 镜像类型
        image_name: '', // 镜像名称
        image_uuid: '', // 镜像 uuid
        flavor_name: '', // 模板名称
        flavor_uuid: '', // 模板 uuid
        patch_rule: '', // patch规则
        limit_size: '', // patch提交限制字数
        zip_file_path: '', // 题目附件
        attach: '', // 上传题目二进制文件
        checker_script: '', // checker脚本
        pushflag_script: '', // pushflag脚本
        wp_official: '',
        start_method: 1 // 启动方式
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        patch_rule: [
          { required: true, message: '请输入 patch 规则', trigger: 'blur' }
        ],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],

        challenge_type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请选择题目标签', trigger: 'change' }
        ]
      },
      flavors: [],
      currentFlavor: null,
      isItemBank: true
    }
  },

  watch: {
    'ruleForm.image_type': function(val, oldVal) {
      this.ruleForm.start_method = val === 'kvm' ? 1 : 0
    }
  },

  created() {
    this.getLocation()
    this.getType()
    this.getTag()
    this.getFlavors()
    if (this.task_id) this.subInfo()
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    //
    getLocation() {
      const { path } = this.$route
      this.isItemBank = path.indexOf('itemBank') >= 0
    },

    goBack() {
      history.back()
    },
    getType() {
      // 获取题目类型
      fetchType({ type: 2 }).then((res) => {
        this.subType = res.data
      })
    },
    getTag() {
      // 获取题目标签
      fetchTags({ type: 2 }).then((res) => {
        this.tagAry = res.data
      })
    },
    getFlavors() {
      getFlavorList({
        page: 1,
        per_page: 999
      }).then((res) => {
        const { data } = res
        if (data.success) {
          this.flavors = data.data
        }
      })
    },
    subInfo() {
      // 题目信息回显
      const p = {
        challenge_id: this.task_id
      }
      if (this.isItemBank) {
        DefenseEditInfo(p).then((res) => {
          this.$store.dispatch('changeMatchName', res.data.title)
          for (const key in this.ruleForm) {
            this.ruleForm[key] = res.data[key]
          }
          this.currentFlavor = { uuid: this.ruleForm.flavor_uuid }
        })
      } else {
        p.event_id = this.id
        defenseMatchTopicInfo(p).then((res) => {
          for (const key in this.ruleForm) {
            this.ruleForm[key] = res.data[key]
          }
          this.currentFlavor = { uuid: this.ruleForm.flavor_uuid }
        })
      }
    },

    onSubmit() {
      const fm = new FormData()
      if (!this.ruleForm.attach) {
        this.$message.error('请上传二进制文件')
        return
      }
      if (!this.ruleForm.checker_script) {
        this.$message.error('请上传checker脚本')
        return
      }
      if (!this.ruleForm.pushflag_script) {
        this.$message.error('请上传pushflag脚本')
        return
      }

      for (const key in this.ruleForm) {
        fm.append(key, this.ruleForm[key])
      }
      const url = '/itemBank/NewAD/index'
      if (this.isItemBank) {
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
      } else {
        const params = { challenge_id: this.task_id, event_id: this.id }
        defenseMatchTopicSunmit(params, fm)
          .then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.$router.push({
                path: '/competition/newAD/editMatch/editMatch',
                query: {
                  id: this.id,
                  step: 2
                }
              })
            }
          })
          .catch((err) => {
            this.$message.error(err.response.data.message_zh)
          })
      }
    },

    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const attrMap = {
            attach: '题目二进制文件',
            checker_script: 'checker 脚本',
            pushflag_script: 'pushflag 脚本'
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

    flavorChange({ name, uuid }) {
      this.ruleForm.flavor_name = name
      this.ruleForm.flavor_uuid = uuid
    },
    // 切换镜像类型，清空选择的镜像
    changeImageType() {
      this.ruleForm.image_name = ''
      this.ruleForm.image_uuid = ''
    },
    goback() {
      if (this.isItemBank) {
        history.back()
      } else {
        this.$router.push({
          path: '/competition/newAD/editMatch/editMatch',
          query: {
            id: this.id,
            step: 2
          }
        })
      }
    }
  }
}
</script>

<style>
.create_newAD_task {
  width: 90%;
  min-width: 600px;
}

.create_newAD_task p {
  margin: 0;
}

.create_newAD_task .te-switch-button {
  vertical-align: top;
}
</style>
