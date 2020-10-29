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
          size="mini"
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
        <el-select
          v-model="ruleForm.label"
          class="filter-item"
          size="mini"
          placeholder="题目类型"
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
          placeholder="题目难度"
        >
          <el-option key="1" :value="0" label="初级" />
          <el-option key="2" :value="1" label="中级" />
          <el-option key="3" :value="2" label="高级" />
        </el-select>
      </el-form-item>

      <el-form-item label="镜像类型">
        <el-select
          v-model="ruleForm.image_type"
          size="mini"
          placeholder="镜像类型"
          @change="changeImageType"
        >
          <el-option value="kvm" label="KVM" />
          <el-option value="docker" label="docker" />
        </el-select>
      </el-form-item>

      <el-form-item label="镜像选择">
        <el-button
          type="primary"
          size="mini"
          @click="selectMirror = true"
        >选择</el-button
        >
        {{ ruleForm.image_name }}
      </el-form-item>

      <!-- 实例模板选择 -->
      <template>
        <el-form-item prop="flavor_uuid" label="实例模板">
          <el-select
            v-model="ruleForm.flavor_uuid"
            class="filter-item"
            placeholder="请选择实例模板"
            @change="flavorSelectedChange"
          >
            <!-- <el-option
              v-for="item in flavorList"
              :key="item.uuid"
              :label="`${item.name} / ${item.msg.vcpus}核 / ${item.msg.memory/1024/1024/1024}MB / ${item.msg.disk/1024/1024/1024}GB`"
              :value="item.uuid"
            /> -->
            <el-option
              v-for="item in flavorList"
              :key="item.uuid"
              :label="`${item.name} / ${item.vcpus}核 / ${item.memory}MB / ${item.disk}GB`"
              :value="item.uuid"
            />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item
        v-if="ruleForm.image_type === 'docker'"
        label="题目端口"
        prop="source_port"
      >
        <el-input-number
          v-model="ruleForm.source_port"
          :min="0"
          :max="65535"
          :precision="0"
          placeholder="默认80端口"
        />
      </el-form-item>

      <el-form-item label="题目描述" prop="description">
        <el-input
          :rows="3"
          v-model="ruleForm.description"
          type="textarea"
          placeholder="请输入题目描述"
        />
      </el-form-item>

      <el-form-item label="题目描述英文">
        <el-input
          :rows="3"
          v-model="ruleForm.description_en"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>

      <el-form-item label="考察点分值">
        <el-input v-model.trim="ruleForm.ops_score" />
        <div>例子：{"1":10, "2":20, "3":30}</div>
        <div>
          说明：冒号前面为考察点数，要放到双引号里，且要连续，冒号后为分数，考察点与分数都不能为0
        </div>
      </el-form-item>

      <el-form-item label="checker脚本" prop="checker_script">
        <UploadFile
          :file.sync="ruleForm.checker_script"
          :file-type="['py']"
          :file-size="2 * 1024 * 1024"
        />
        （请上传py格式文件，大小不超过2M）
      </el-form-item>

      <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.wp_official"
          :file-type="['pdf', 'docx', 'md']"
        />
        （请上传pdf,docx,md格式文件，大小不超过10M）
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存
        </el-button>
        <el-button type="warning" @click="goback()">返回 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ChoiceImage from '@/components/ChoiceImage'
import UploadFile from '@/components/UploadFile'
import { DefenseAddTopic, DefenseEditSubmit } from '@/api/itemBank/defense'
import { fetchTags, fetchType, templateName } from '@/api/itemBank/common'
import {
  defenseMatchTopicInfo,
  defenseMatchTopicSunmit
} from '@/api/match/DevOps'
import { httpGetFlavorList } from '@/api/itemBank/penetration'
import { getFlavorList } from '@/api/itemBank/common'

export default {
  components: {
    UploadFile,
    ChoiceImage
  },
  data() {
    return {
      mathMode: {},
      showEn: true,
      flagType: '1',
      subType: [],
      subTag: [],
      enclosureAry: [1],
      flagAry: [{ flag: '' }],

      difficulty: [
        { name: '初级', id: 0 },
        { name: '中级', id: 1 },
        { name: '高级', id: 2 }
      ],
      is_base: '', // 镜像来源
      search: '', // 镜像搜索关键字
      os_type: '', // 镜像搜索系统类型
      //
      is_image_type: '', // 镜像类型
      //
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
      flavorList: [], // 实例模板列表

      task_id: this.$route.query.task_id,
      id: this.$route.query.id,
      tagAry: [],

      templateList: [],
      ruleForm: {
        title: '', // 题目名称
        challenge_type: '', // 题目类型id
        label: '', // 题目标签
        level: 0, // 题目难度
        image_type: 'kvm', // 镜像类型
        image_name: '', // 镜像名称
        image_uuid: '', // 镜像uuid
        flavor_name: '', // 实例模板名称
        flavor_uuid: '', // 实例模板uuid
        source_port: 80, // 题目端口
        description: '', // 题目描述
        description_en: '', // 题目描述英文
        ops_score: '', // 考察点分数{"1":3,"2":4}
        checker_script: '', // checker脚本
        wp_official: '' // 题目wp
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字', trigger: 'blur' }
        ],
        image_name: [
          { required: true, message: '请输入镜像名称', trigger: 'blur' }
        ],

        start_method: [
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
    this.getType()
    this.getTag()
    this.getFlavorInfo()
    if (this.task_id) this.subInfo()
  },
  methods: {
    goback() {
      this.$router.push({
        path: '/competition/DevOps/editMatch/editMatch',
        query: { id: this.id, step: 2 }
      })
    },
    getType() {
      // 获取题目类型
      fetchType({ type: 3 }).then((res) => {
        this.subType = res.data
      })
    },
    getTag() {
      // 获取题目标签
      fetchTags({ type: 3 }).then((res) => {
        this.tagAry = res.data
      })
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
      })
    },
    // 实例模板切换  时获取  name msg 和 uuid
    flavorSelectedChange(params) {
      this.flavorList.forEach((element) => {
        if (element.uuid == params) {
          this.ruleForm.flavor_name = element.name
          this.ruleForm.flavor_message = JSON.stringify(element.msg)
        }
      })
    },
    // 获取实例模板列表
    getFlavorInfo() {
      // httpGetFlavorList().then(res => {
      //   this.flavorList = res.data
      // })
      getFlavorList({
        page: 1,
        per_page: 999
      }).then((res) => {
        this.flavorList = res.data.data
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
              path: '/competition/DevOps/editMatch/editMatch',
              query: { id: this.id, step: 2 }
            })
          }
        })
      } else {
        DefenseAddTopic(fm).then((res) => {
          if (res.data.success) {
            this.$router.push({
              path: '/competition/DevOps/editMatch/editMatch',
              query: { id: this.id, step: 2 }
            })
          }
        })
      }
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
