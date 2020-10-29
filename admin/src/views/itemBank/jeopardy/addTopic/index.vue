<template>
  <div class="app-container create_topic">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <!-- 题目名称 -->
      <el-form-item
        label="题目名称"
        prop="title"
      >
        <el-input
          v-model.trim="ruleForm.title"
          placeholder="请输入题目名称"
        />
      </el-form-item>
      <!-- 题目类型 -->
      <el-form-item
        label="题目类型"
        prop="category_id"
      >
        <el-select
          v-model="ruleForm.category_id"
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
      <!-- 题目难度 -->
      <el-form-item label="题目难度">
        <el-select
          v-model="ruleForm.weight"
          class="filter-item"
          placeholder="请选择题目难度"
        >
          <el-option
            v-for="(item, ind) in difficulty"
            :key="ind"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 题目标签 -->
      <el-form-item
        label="题目标签"
        prop="tag_id"
      >
        <el-select
          v-model="ruleForm.tag_id"
          class="filter-item"
          placeholder="请选择题目标签"
        >
          <el-option
            v-for="(item, ind) in subTag"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 题目内容 -->
      <el-form-item
        label="题目内容"
        prop="resource"
      >
        <quill-editor
          v-model="ruleForm.content_html"
          holder="请输入题目内容"
        />
      </el-form-item>
      <!-- 题目内容英文 -->
      <el-form-item label="题目内容英文">
        <quill-editor
          v-model="ruleForm.content_en_html"
          holder="请输入题目内容英文"
        />
      </el-form-item>
      <!-- Flag类型选择  @change="handleType" -->
      <el-form-item
        label="Flag类型"
        prop="is_dynamic_flag"
      >
        <el-select
          :disabled="task_id ? true : false"
          v-model="ruleForm.is_dynamic_flag"
          placeholder="请选择Flag类型"
          @change="handleType"
        >
          <el-option
            :value="0"
            label="静态Flag"
          />
          <el-option
            :value="1"
            label="动态Flag"
          />
          <el-option
            :value="2"
            label="随机Flag"
          />
        </el-select>
      </el-form-item>

      <!-- 镜像类型选择 -->
      <template v-if="ruleForm.is_dynamic_flag != '2'">
        <el-form-item
          label="镜像类型"
          prop="image_type"
        >
          <el-select
            :disabled="!!task_id"
            v-model="ruleForm.image_type"
            placeholder="请选择镜像类型"
            @change="changeImageType"
          >
            <el-option
              value="kvm"
              label="kvm"
            />
            <!--<el-option-->
            <!--value="docker"-->
            <!--label="docker"-->
            <!--/>-->
            <el-option
              value="docker-compose"
              label="docker-compose"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- 配置文件选择 -->
      <template
        v-if="
          ruleForm.is_dynamic_flag != '2' &&
            ruleForm.image_type == 'docker-compose'
        ">
        <el-form-item
          label="配置文件"
          required
        >
          <el-col :span="2">
            <el-button
              type="primary"
              size="mini"
              @click="getConfigList"
            >选择
            </el-button>
          </el-col>

          <el-col :span="18">
            {{ ruleForm.docker_compose_name }}
          </el-col>
        </el-form-item>
      </template>

      <!-- 端口 -->
      <template
        v-if="
          ruleForm.image_type == 'docker' ||
            ruleForm.image_type == 'docker-compose'
        ">
        <el-form-item
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
      </template>

      <!-- 镜像选择 -->
      <template
        v-if="
          ruleForm.is_dynamic_flag != '2' &&
            ruleForm.image_type != 'docker-compose'
        ">
        <el-form-item
          label="镜像选择"
          class="red_start"
        >
          <el-button
            type="primary"
            size="mini"
            @click="selectMirror = true"
          >选择
          </el-button>

          {{ ruleForm.image_name }}
        </el-form-item>
      </template>

      <!-- 实例模板选择 -->
      <template v-if="ruleForm.is_dynamic_flag != '2'">
        <el-form-item
          prop="flavor_uuid"
          label="实例模板"
        >
          <el-select
            v-model="ruleForm.flavor_uuid"
            class="filter-item"
            placeholder="请选择实例模板"
            @change="flavorSelectedChange"
          >
            <el-option
              v-for="item in flavorList"
              :key="item.uuid"
              :label="`${item.name} / ${item.vcpus}核 / ${item.memory}MB / ${item.disk}GB`"
              :value="item.uuid"
            />
          </el-select>
        </el-form-item>
      </template>

      <!--静态flag-->
      <div v-if="ruleForm.is_dynamic_flag == 0">
        <el-form-item
          label="题目附件"
        >
          <UploadFile
            :file.sync="ruleForm.file[0]"
            :file-type="['zip']"
            :file-size="20 * 1024 * 1024"
          />
          （请上传zip格式文件，大小不超过20M）
        </el-form-item>

        <el-form-item
          label="题目Flag"
          class="red_start"
        >
          <el-input
            v-model.trim="ruleForm.flag[0]"
            type="input"
            placeholder="请输入题目Flag"
          />
        </el-form-item>

        <el-form-item label="赛题WP">
          <UploadFile
            :file.sync="ruleForm.official_writeup"
            :file-type="['pdf', 'docx', 'md']"
          />
          （请上传pdf,docx,md格式文件,大小不超过10M）
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
          >保存 </el-button>
          <el-button
            type="warning"
            @click="goBack"
          > 返回 </el-button>
        </el-form-item>
      </div>

      <!--动态flag-->
      <div v-if="ruleForm.is_dynamic_flag == 1">
        <el-form-item label="题目附件">
          <UploadFile
            ref="zipFile"
            :file.sync="ruleForm.file[0]"
            :file-type="['zip']"
            :file-size="20 * 1024 * 1024"
          />
          （请上传zip格式文件，大小不超过20M）
        </el-form-item>

        <el-form-item
          label="动态flag脚本文件"
          prop="is_dynamic_flag"
        >
          <UploadFile
            :file.sync="ruleForm.push_flag_script"
            :file-type="['sh']"
          />
          （请上传sh格式文件，大小不超过10M）
        </el-form-item>

        <el-form-item label="赛题WP">
          <UploadFile
            :file.sync="ruleForm.official_writeup"
            :file-type="['pdf', 'docx', 'md']"
          />
          （请上传pdf,docx,md格式文件,大小不超过10M）
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
          >保存 </el-button>
          <el-button
            type="warning"
            @click="goBack"
          >返回 </el-button>
        </el-form-item>
      </div>

      <!-- 随机附件 -->
      <div v-if="ruleForm.is_dynamic_flag == 2">
        <el-form-item
          label="题目附件"
          prop="is_dynamic_flag"
          required
        >
          <div>
            <el-button
              type="success"
              icon="el-icon-plus"
              @click="addEnc"
            />
            （注：请上传zip格式文件，大小不超过20M）
          </div>

          <div class="randomBox">
            <div class="uploadBox">
              <div
                v-for="(item, index) in ruleForm.flag"
                :key="index"
                class="mb10"
                style="height: 36px"
              >
                <UploadFile
                  :file.sync="ruleForm.file[index]"
                  :file-type="['zip']"
                  :file-size="20 * 1024 * 1024"
                />
              </div>
            </div>
            <div class="flagBox">
              <div
                v-for="(item, index) in ruleForm.flag"
                :key="index"
                class="mb10"
              >
                flag:
                <el-input
                  v-model.trim="ruleForm.flag[index]"
                  width="300px"
                />
                <el-button
                  v-if="ruleForm.flag.length > 1"
                  type="danger"
                  icon="el-icon-close"
                  @click="removeEnc(index)"
                />
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="是否公开">
          <el-switch
            v-model="ruleForm.public"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item> -->
        <el-form-item label="赛题WP">
          <UploadFile
            :file.sync="ruleForm.official_writeup"
            :file-type="['pdf', 'docx', 'md']"
          />
          （请上传pdf,docx,md格式文件,大小不超过10M）
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
          >保存 </el-button>
          <el-button
            type="warning"
            @click="goBack"
          >返回 </el-button>
        </el-form-item>
      </div>
    </el-form>

    <!-- 镜像选择dialog -->
    <ChoiceImage
      v-if="selectMirror"
      :image_name.sync="ruleForm.image_name"
      :image_uuid.sync="ruleForm.image_uuid"
      :type="ruleForm.image_type"
      :select-mirror.sync="selectMirror"
    />

    <!-- 配置文件选择dialog -->
    <el-dialog
      :visible.sync="isConfig"
      title="配置文件选择"
    >
      <!-- 配置文件列表 -->
      <el-table
        ref="MirrorListTable"
        :data="configlist"
        class="img_table"
        border
        tooltip-effect="dark"
        @selection-change="changeSelectedMirrorList"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          type="index"
          width="55"
          label="序号"
        />
        <el-table-column
          label="配置名称"
          align="center"
          prop="name"
        />

        <el-table-column
          prop="remark"
          align="center"
          label="备注"
          show-overflow-tooltip
        />
      </el-table>
      <!-- 镜像列表完 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="configParams.offset"
        :limit.sync="configParams.limit"
        @pagination="getConfigList"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="confirmSelect"
        >确 定</el-button>
        <el-button @click="isConfig = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import UploadFile from '@/components/UploadFile'
import ChoiceImage from '@/components/ChoiceImage'
import {
  fetchTag,
  fetchtype,
  createTopic,
  editTopic,
  showJeopardyEditInfo
} from '@/api/itemBank/jeopardy'
import { httpGetFlavorList } from '@/api/itemBank/penetration'
import { getFlavorList } from '@/api/itemBank/common'
import { getConfig } from '@/api/image.js'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  components: {
    QuillEditor,
    Pagination,
    UploadFile,
    ChoiceImage
  },
  directives: { waves },
  data() {
    return {
      task_id: this.$route.query.task_id,
      showEn: true,
      flagType: '1',
      subType: [],
      subTag: [],
      difficulty: [
        { name: '初级', id: 0 },
        { name: '中级', id: 1 },
        { name: '高级', id: 2 }
      ],
      enclosureAry: [1],
      flagAry: [{ flag: '' }],

      is_base: '', // 镜像来源
      search: '', // 镜像搜索关键字
      os_type: '', // 镜像搜索系统类型
      //
      is_image_type: '', // 镜像类型
      //
      image_type_list: [
        // 镜像类型列表
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
      ],
      os_type_list: [
        // 镜像来源列表
        {
          label: 'windows',
          value: 'windows'
        },
        {
          label: 'linux',
          value: 'linux'
        }
      ],
      flavorList: [], // 实例模板列表

      selectMirror: false, // 镜像弹窗
      // 表单对象
      ruleForm: {
        image_type: 'kvm', // 镜像类型
        image_uuid: '', // 镜像uuid
        image_name: '', // 镜像名称
        source_port: 80, // 题目端口
        flavor_uuid: '', // 实例模板uuid
        flavor_name: '', // 实例模板名称
        flavor_message: '', // 实例模板信息
        docker_compose_name: '', // 配置文件选择
        docker_compose_id: '', // 配置文件选择
        file: [''],
        answer: [''],
        flag: [''],
        official_writeup: '',
        title: '', // 题目名称
        category_id: '', // 题目类型id
        tag_id: '', // 题目标签
        weight: 0, // 题目难度
        content: '', // 题目内容
        content_html: '', // 题目内容html
        content_en: '', // 题目描述英文markdown
        content_en_html: '', // 题目描述英文html
        is_dynamic_flag: '', // 是否是动态环境
        protocol: '', // 场景请求方式
        push_flag_script: '', // push flag
        public: 1
      },
      // 校验规则
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        category_id: [
          {
            type: 'number',
            required: true,
            message: '请选择题目类型',
            trigger: 'change'
          }
        ],
        tag_id: [
          {
            type: 'number',
            required: true,
            message: '请选择题目类型',
            trigger: 'change'
          }
        ],

        image_type: [
          {
            required: true,
            message: '请选择镜像类型',
            trigger: 'change'
          }
        ],
        flavor_uuid: [
          {
            required: true,
            message: '请选择实例模板',
            trigger: 'change'
          }
        ],
        is_dynamic_flag: [
          {
            required: true,
            message: '请选择Flag类型',
            trigger: 'change'
          }
        ],
        source_port: [
          { required: true, message: '请输入题目端口', trigger: 'blur' }
        ]
      },

      isConfig: false, // 配置文件选择
      configlist: [], // 配置文件列表
      selectConfigList: [], // 选中配置文件列表
      total: 0, // 配置文件总数
      configParams: {
        limit: 10, // 每页显示数量
        offset: 1 // 页码
      }
    }
  },
  created() {
    this.getSubType()
    this.getFlavorInfo()
    if (this.task_id) this.subInfo()
  },
  beforeDestroy() {
    // 离开时清除面包屑面包屑
    this.$store.dispatch('changeMatchName', '')
  },
  methods: {
    // 配置文件弹窗中点击确认的事件
    confirmSelect() {
      this.isConfig = false
      if (this.selectConfigList.length) {
        this.ruleForm.docker_compose_name = this.selectConfigList[0].name
        this.ruleForm.docker_compose_id = this.selectConfigList[0].id
      }
    },
    // 配置文件列表选中状态修改
    changeSelectedMirrorList(val) {
      if (val.length > 1) {
        this.$refs.MirrorListTable.clearSelection()
        this.$refs.MirrorListTable.toggleRowSelection(val[1])
        val.shift()
      }
      this.selectConfigList = val
    },
    // 配置文件列表查询
    getConfigList() {
      getConfig(this.configParams).then(res => {
        this.configlist = res.data.row
        this.total = res.data.total
        this.isConfig = true
      })
    },
    // 实例模板切换  时获取  name msg 和 uuid
    flavorSelectedChange(params) {
      this.flavorList.forEach(element => {
        if (element.uuid == params) {
          this.ruleForm.flavor_name = element.name
          this.ruleForm.flavor_message = JSON.stringify(element.msg)
        }
      })
    },
    // 获取实例模板列表
    getFlavorInfo() {
      getFlavorList({
        page: 1,
        per_page: 999
      }).then(res => {
        this.flavorList = res.data.data
      })
    },
    goBack() {
      history.back()
    },
    // 题目信息回显
    subInfo() {
      showJeopardyEditInfo(this.task_id).then(res => {
        this.$store.dispatch('changeMatchName', res.data.title)
        for (const k in this.ruleForm) {
          this.ruleForm[k] = res.data[k]
        }
        this.ruleForm.flag = res.data['answer']
      })
    },
    handleType(val) {
      // 切换环境的时候初始化
      if (val === 0) {
        this.ruleForm.file = ['']
        this.ruleForm.flag = ['']
      } else if (val === 1) {
        this.ruleForm.file = ['']
        this.ruleForm.flag = []
      } else {
        this.ruleForm.file = ['']
        this.ruleForm.flag = ['']
        this.ruleForm.image_type = ''
        this.ruleForm.image_uuid = ''
        this.ruleForm.image_name = ''
        this.ruleForm.flavor_uuid = ''
        this.ruleForm.flavor_name = ''
        this.ruleForm.flavor_message = ''
        this.ruleForm.source_port = ''
      }
    },
    getSubType() {
      // 获取题目类型
      fetchtype({ type: 5 }).then(res => {
        this.subType = res.data.rows
      })
      fetchTag({ type: 5 }).then(res => {
        this.subTag = res.data.rows
      })
    },
    onSubmit() {
      if (this.ruleForm.flag[0] === '' && this.ruleForm.is_dynamic_flag != 1) {
        this.$message.error('请至少输入一个flag')
        return
      }

      // 随机附件时候才校验是否上传了附件
      if (this.ruleForm.is_dynamic_flag === 2) {
        // 先循环flag，判断flag填写了的那栏文件是否填写
        for (let i = 0; i < this.ruleForm.flag.length; i++) {
          // 如果填写了flag，那么必须对应写一个文件
          if (this.ruleForm.flag[i]) {
            if (!this.ruleForm.file[i]) {
              this.$message.error('附件必须和flag对应')
              return
            }
          }
        }

        // 循环file，判断附件填写了的那栏flag是否填写
        for (let i = 0; i < this.ruleForm.file.length; i++) {
          // 如果填写了文件，那么必须对应写一个flag
          if (this.ruleForm.file[i] && this.ruleForm.is_dynamic_flag !== 1) {
            if (!this.ruleForm.flag[i]) {
              this.$message.error('附件必须和flag对应')
              return
            }
          }
        }
      }

      // if (!this.ruleForm.file[0]) {
      //   this.$message.error("请上传附件");
      //   return;
      // }

      // 如果是动态flag,且没有上传动态flag脚本文件
      if (
        this.ruleForm.is_dynamic_flag == 1 &&
        !this.ruleForm.push_flag_script
      ) {
        this.$message.error('请上传动态flag脚本文件')
        return
      }

      const fm = new FormData()
      const formData = this.ruleForm

      // 循环插入form表单中 flag。
      this.ruleForm.flag.forEach((item, i) => {
        fm.append('flag' + i, item)
      })

      // 循环插入form表单中 file。
      this.ruleForm.file.forEach((item, i) => {
        fm.append('file' + i, this.ruleForm.file[i])
      })

      for (const key in formData) {
        if (key !== 'file' && key !== 'flag') {
          fm.append(key, formData[key])
        }
      }

      if (this.task_id) {
        editTopic(this.task_id, fm).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.$router.push({
              path: '/itemBank/jeopardy/index',
              query: { id: this.$route.query.id }
            })
          }
        })
      } else {
        createTopic(fm).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.$router.push({
              path: '/itemBank/jeopardy/index',
              query: { id: res.data.event_id }
            })
          }
        })
      }
    },
    addEnc() {
      this.ruleForm.flag.push('')
      this.ruleForm.file.push('')
    },
    removeEnc(index) {
      this.ruleForm.flag.splice(index, 1)
      this.ruleForm.file.splice(index, 1)
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
</style>
<style lang="scss">
.img_table .el-table__header-wrapper {
  th:first-child {
    div.cell {
      display: none;
    }
  }
}

.red_start {
  .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
