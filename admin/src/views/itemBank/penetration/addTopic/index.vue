<template>
  <div class="app-container create_topic penetration_task">
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
          :disabled="!!challenge_id"
          v-model="ruleForm.challenge_type"
          placeholder="请选择题目类型"
        >
          <el-option
            v-for="item in topicType"
            :key="item.value"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目标签" prop="label">
        <el-select v-model="ruleForm.label" placeholder="请选择题目标签">
          <el-option
            v-for="item in topicLabel"
            :key="item.id"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目难度" prop="level">
        <el-select v-model="ruleForm.level" placeholder="请选择题目难度">
          <el-option
            v-for="item in topicLevel"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目描述">
        <quill-editor v-model="ruleForm.content" holder="请输入题目描述" />
      </el-form-item>

      <el-form-item label="题目属性" prop="server_type">
        <el-select v-model="ruleForm.server_type" placeholder="请选择题目属性">
          <el-option
            v-for="item in server_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <div v-if="ruleForm.challenge_type === 3">
        <el-form-item
          label="实体设备组"
          prop="entity_group_uuid"
        >
          <el-select
            v-model="ruleForm.entity_group_uuid"
            placeholder="请选择实体设备组"
            @change="changeImageType"
          >
            <el-option
              v-for="item in entity_group"
              :key="item.value"
              :label="item.name"
              :value="item.uuid"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item
        v-if="ruleForm.challenge_type !== 3"
        label="镜像类型"
        required
      >
        <el-select
          v-model="ruleForm.image_type"
          placeholder="请选择镜像类型"
          @change="changeImageType"
        >
          <el-option
            v-for="item in image_type_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 配置文件选择 -->
      <div
        v-if="
          ruleForm.image_type == 'docker-compose' &&
            ruleForm.challenge_type !== 3
        "
      >
        <el-form-item label="配置文件" prop="docker_compose_id">
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
      </div>

      <el-form-item
        v-if="
          ruleForm.image_type != 'docker-compose' &&
            ruleForm.challenge_type !== 3
        "
        label="镜像选择"
        prop="image_name"
      >
        <el-button
          type="primary"
          size="mini"
          @click="selectMirror = true"
        >选择</el-button
        >
        {{ ruleForm.image_name }}
        <el-input v-show="false" v-model="ruleForm.image_name" />
      </el-form-item>

      <el-form-item
        v-if="ruleForm.challenge_type !== 3"
        label="实例模板"
        prop="flavor_uuid"
      >
        <el-select
          v-model="ruleForm.flavor_uuid"
          placeholder="请选择实例模板"
          @change="flavorSelectedChange"
        >
          <el-option
            v-for="item in flavor"
            :key="item.uuid"
            :label="`${item.name} / ${item.vcpus}核 / ${item.memory}MB / ${item.disk}GB`"
            :value="item.uuid"
          />
        </el-select>
      </el-form-item>
      <!-- 测试说无用让删除 -->
      <!-- <el-form-item label="题目端口">
        <el-input
          size="mini"
          placeholder="请填写题目端口"

          v-model="ruleForm.source_port"
        />
      </el-form-item> -->
      <el-form-item label="附件">
        <UploadFile
          :file.sync="ruleForm.attachment"
          :file-type="['zip']"
          :file-size="20 * 1024 * 1024"
        />
        （请上传zip格式文件，大小不超过20M）
      </el-form-item>

      <el-form-item v-if="ruleForm.challenge_type === 3" label="是否为提交flag">
        <el-switch
          :disabled="!!challenge_id"
          v-model="ruleForm.entity_type"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item v-if="ruleForm.entity_type === 1" label="静态Flag数量">
        <el-col :span="2">
          <el-input v-model.trim="staticFlagNum" disabled size="mini" />
        </el-col>
        <el-button
          style="margin-left: 40px"
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAddStaticFlagNum(1)"
        />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in staticFlagList"
        v-if="ruleForm.entity_type === 1"
        :label="'静态Flag' + (index + 1)"
        :key="index"
        required
      >
        <el-col :span="6">
          <el-input
            v-model.trim="item.static_flag"
            placeholder="请输入静态Flag"
          />
        </el-col>
        <el-col :span="6" style="margin-left: 30px">
          <el-input
            v-model.trim="item.desc_static_flag"
            placeholder="考点备注"
          />
        </el-col>
        <el-button
          style="margin-left: 40px"
          type="danger"
          icon="el-icon-minus"
          size="mini"
          @click.prevent="handleRemoveStaticFlagNum(index)"
        />
      </el-form-item>
      <el-form-item v-if="ruleForm.challenge_type !== 3" label="动态Flag数量">
        <el-col :span="2" style="text-align: center">
          <el-input v-model.trim="dynamicFlagNum" disabled size="mini" />
        </el-col>
        <el-button
          style="margin-left: 40px"
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAddDynamicFlagNum(1)"
        />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in dynamicFlagList"
        v-if="ruleForm.challenge_type !== 3"
        :key="index + 'a'"
        :label="'动态Flag' + (index + 1)"
      >
        <el-col :span="6">
          <UploadFile :file.sync="item.dynamic_flag" :file-type="['sh']" />
          <div>（请上传sh格式文件,大小不超过10M）</div>
        </el-col>

        <el-col :span="6" style="margin-left: 30px">
          <el-input
            v-model.trim="item.desc_dynamic_flag"
            placeholder="考点备注"
          />
        </el-col>
        <el-button
          style="margin-left: 40px"
          type="danger"
          icon="el-icon-minus"
          size="mini"
          @click.prevent="handleRemoveDynamicFlagNum(index)"
        />
      </el-form-item>
      <el-form-item label="赛题WP">
        <UploadFile
          :file.sync="ruleForm.wp_official"
          :file-type="['pdf', 'docx', 'md']"
        />
        （请上传pdf,docx,md格式文件,大小不超过10M）
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="checkForm">保存</el-button>
        <el-button type="warning" @click="goBack">返回</el-button>
      </el-form-item>
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
    <el-dialog :visible.sync="isConfig" title="配置文件选择">
      <!-- 配置文件列表 -->
      <el-table
        ref="MirrorListTable"
        :data="configlist"
        class="img_table"
        border
        tooltip-effect="dark"
        @selection-change="changeSelectedMirrorList"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="55" label="序号" />
        <el-table-column label="配置名称" align="center" prop="name" />

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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="isConfig = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import UploadFile from '@/components/UploadFile'
import {
  httpGetSettingCategorys,
  httpPostChallengeStoreList,
  httpGetDetialQuestion,
  httpPatchDetialQuestion
} from '@/api/itemBank/penetration'
import { fetchTags, getFlavorList } from '@/api/itemBank/common'
import { getConfig, getEntityGroup } from '@/api/image.js'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import ChoiceImage from '@/components/ChoiceImage'

export default {
  components: {
    QuillEditor,
    UploadFile,
    Pagination,
    ChoiceImage
  },
  directives: { waves },
  data() {
    return {
      ruleForm: {
        title: '', // 题目名称
        challenge_type: '', // 题目类型
        label: '', // 题目标签
        level: '', // 题目难度
        content: '', // 题目描述
        server_type: '', // 题目属性
        attachment: null, // 附件
        docker_compose_id: '', // 配置文件id
        docker_compose_name: '', // 配置文件名称
        entity_group_uuid: '', // 实体设备组
        entity_type: 1, // 实体设备组 1是 0否
        image_type: '', // 镜像类型
        image_name: '', // 镜像名称
        image_uuid: '', // 镜像uuid
        flavor_uuid: '', // 实例模板
        flavor_name: '', // 实例模板名称
        flavor_message: '', // 实例模板描述信息
        source_port: '', // 题目端口
        wp_official: '' // wp文件
      },

      challenge_id: this.$route.query.challenge_id,
      detialInfo: {}, // 编辑时的详细信息
      topicType: [], // 全部题目类型options
      topicLabel: [], // 全部题目标签options
      topicLevel: [
        {
          label: '初级',
          value: 0
        },
        {
          label: '中级',
          value: 1
        },
        {
          label: '高级',
          value: 2
        }
      ], // 全部题目难度options
      server_type: [
        {
          label: '非跳板机',
          value: 0
        },
        {
          label: '跳板机',
          value: 1
        }
      ], // 全部题目属性options
      entity_group: [], // 实体设备组
      flavor: [], // 全部实例模板
      staticFlagNum: 1, // 静态flag数量
      dynamicFlagNum: 0, // 动态flag数量
      staticFlagList: [{ static_flag: '', desc_static_flag: '' }], // 静态flag数组
      dynamicFlagList: [], // 动态flag数组
      selectMirror: false, // 镜像弹窗开启状态
      is_image_type: '', // 镜像类型
      image_type_list: [
        {
          label: 'KVM',
          value: 'kvm'
        },
        {
          label: 'docker',
          value: 'docker'
        }
        // {
        //   label: 'docker_compose',
        //   value: 'docker_compose'
        // }
      ], // 镜像类型列表
      os_type: '', // 系统类型
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
      search: '', // 镜像名称

      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字', trigger: 'blur' }
        ],
        challenge_type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请选择题目标签', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择题目难度', trigger: 'change' }
        ],
        docker_compose_id: [
          { required: true, message: '请选择配置文件', trigger: 'change' }
        ],
        entity_group_uuid: [
          { required: true, message: '请选择实体设备组', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入题目描述', trigger: 'blur' }
        ],
        // content
        docker_compose_file: [
          {
            required: true,
            message: '请输入docker compose file',
            trigger: 'blur'
          }
        ],
        server_type: [
          { required: true, message: '请选择题目属性', trigger: 'change' }
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
        is_dynamic_flag: [
          {
            type: 'number',
            required: true,
            message: '请选择题目类型',
            trigger: 'change'
          }
        ],
        image_name: [
          {
            required: true,
            message: '请选择镜像',
            trigger: 'change'
          }
        ],
        flavor_uuid: [
          { required: true, message: '请选择实例模板', trigger: 'change' }
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
    fetchTags({ type: 4 }).then((res) => {
      this.topicLabel = res.data
    })
    getFlavorList({
      page: 1,
      per_page: 999
    }).then((res) => {
      this.flavor = res.data.data
    })
    httpGetSettingCategorys().then((res) => {
      this.topicType = res.data
    })
    getEntityGroup({ offset: 1, limit: 9999 }).then((res) => {
      this.entity_group = res.data.data
    })
    if (this.challenge_id) {
      httpGetDetialQuestion({
        challenge_id: this.challenge_id
      }).then((res) => {
        // 回显数据
        this.detialInfo = res.data
        this.subInfo()
      })
    } else {
      this.dynamicFlagList = []
    }
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
      getConfig(this.configParams).then((res) => {
        this.configlist = res.data.row
        this.total = res.data.total
        this.isConfig = true
      })
    },
    // 编辑时的数据处理
    subInfo() {
      for (const k in this.ruleForm) {
        this.ruleForm[k] = this.detialInfo[k]
      }

      this.staticFlagNum = this.detialInfo.static.length
      // this.dynamicFlagNum = this.detialInfo.dynamic.length;
      for (let i = 0; i < this.detialInfo.dynamic.length; i++) {
        // this.dynamicFlagList.push({})
        // 锚点5
        this.handleAddDynamicFlagNum()
      }
      // this.detialInfo.static.forEach(element => {
      //   element.static_flag = element.flag;
      //   element.desc_static_flag = element.desc;
      // });
      // this.detialInfo.dynamic.forEach(element => {
      //   element.dynamic_flag = element.flag;
      //   element.desc_dynamic_flag = element.desc;
      // });
      this.staticFlagList = this.detialInfo.static
      this.$nextTick(function() {
        for (let i = 0; i < this.staticFlagList.length; i++) {
          this.$set(
            this.staticFlagList[i],
            'static_flag',
            this.staticFlagList[i].flag
          )
          this.$set(
            this.staticFlagList[i],
            'desc_static_flag',
            this.staticFlagList[i].desc
          )
        }
      })
      // this.detialInfo.dynamic.forEach(element => {
      //   this.dynamicFlagList.push(element);
      // });
      this.dynamicFlagList = this.detialInfo.dynamic
      this.$nextTick(function() {
        for (let i = 0; i < this.dynamicFlagList.length; i++) {
          this.$set(
            this.dynamicFlagList[i],
            'dynamic_flag',
            this.dynamicFlagList[i].flag
          )
          this.$set(
            this.dynamicFlagList[i],
            'desc_dynamic_flag',
            this.dynamicFlagList[i].desc
          )
        }
      })

      // this.detialInfo.dynamic
    },

    // 实例模板切换  时获取  name msg 和 uuid
    flavorSelectedChange(params) {
      this.flavor.forEach((element) => {
        if (element.uuid == params) {
          this.ruleForm.flavor_name = element.name
          this.ruleForm.flavor_message = JSON.stringify(element.msg)
        }
      })
    },

    // 增加静态flag数量
    handleAddStaticFlagNum() {
      this.staticFlagNum += 1
      this.staticFlagList.push({ static_flag: '', desc_static_flag: '' })
      // 锚点2
    },
    // 增加动态flag数量
    handleAddDynamicFlagNum() {
      this.dynamicFlagNum += 1
      this.dynamicFlagList.push({ dynamic_flag: '', desc_dynamic_flag: '' })
    },
    // 删除静态flag
    handleRemoveStaticFlagNum(index) {
      if (this.staticFlagNum === 1) {
        return
      } else {
        this.staticFlagList.splice(index, 1)
        this.staticFlagNum = this.staticFlagNum - 1
      }
    },
    // 删除动态flag
    handleRemoveDynamicFlagNum(index) {
      this.dynamicFlagList.splice(index, 1)
      this.dynamicFlagNum = this.dynamicFlagNum - 1
    },
    // 创建题目
    submitForm() {
      const fm = new FormData()
      const formData = this.ruleForm
      for (const key in formData) {
        fm.append(key, formData[key])
      }
      // 静态flag列表处理
      this.staticFlagList.forEach((element, index) => {
        fm.append('static_flag' + index, element.static_flag)
        fm.append('desc_static_flag' + index, element.desc_static_flag)
      })

      // 动态flag列表处理
      this.dynamicFlagList.forEach((element, index) => {
        fm.append('dynamic_flag' + index, element.dynamic_flag)
        fm.append('desc_dynamic_flag' + index, element.desc_dynamic_flag)
      })
      if (this.challenge_id) {
        httpPatchDetialQuestion({ challenge_id: this.challenge_id }, fm).then(
          (res) => {
            // 锚点
            if (res.data.success) {
              this.$message({
                message: '题目编辑成功',
                duration: 1000,
                type: 'success',
                onClose: () => {
                  // 保存成功跳转
                  this.$router.back(-1)
                }
              })
            } else {
            }
          }
        )
      } else {
        httpPostChallengeStoreList(fm).then((res) => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                // 保存成功跳转
                this.$router.back(-1)
              }
            })
          } else {
          }
        })
      }
    },
    // 填写校验
    checkForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitForm()
        } else {
          this.$message.error('请核验所输入的信息')
          return false
        }
      })
    },
    // 返回按钮
    goBack() {
      this.$router.back(-1)
    },
    // 切换镜像类型，清空选择的镜像
    changeImageType() {
      this.ruleForm.image_name = ''
      this.ruleForm.image_uuid = ''
      this.ruleForm.docker_compose_id = ''
      this.ruleForm.docker_compose_name = ''
    }
  }
}
</script>

<style>
.create_topic {
  width: 90%;
  min-width: 600px;
}
</style>
<style lang="scss">
.penetration_task {
  .el-input.is-disabled {
    /deep/ .el-input__inner {
      text-align: center;
    }
  }

  .el-table__header-wrapper {
    th:first-child {
      div.cell {
        display: none;
      }
    }
  }
}
</style>
