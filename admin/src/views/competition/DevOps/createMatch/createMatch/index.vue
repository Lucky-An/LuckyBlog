<template>
  <div class="app-container create_match">
    <div class="goBottom">
      <el-button
        type="warning"
        @click="goBottom"
      >直达底部</el-button>
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="竞赛名称"
        prop="name_zh"
      >
        <el-input
          v-model.trim="ruleForm.name_zh"
          placeholder="请输入竞赛名称"
        />
      </el-form-item>

      <el-form-item
        label="起止时间"
        required
      >
        <el-date-picker
          :clearable="false"
          v-model="startEndTime"
          :disabled="process === 0"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item label="竞赛封面">
        <UploadFile
          :file.sync="ruleForm.cover"
          :file-type="['jpg', 'png']"
          :list-type="'picture-card'"
          :file-size="2 * 1024 * 1024"
        />
        （请上传PNG、JPG格式文件，大小不超过2M）
      </el-form-item>
      <el-form-item label="竞赛 Logo">
        <UploadFile
          :file.sync="ruleForm.logo"
          :file-type="['jpg', 'png']"
          :list-type="'picture-card'"
          :file-size="2 * 1024 * 1024"
        />
        （请上传PNG、JPG格式文件，大小不超过2M）
      </el-form-item>

      <el-form-item
        prop="flavor_uuid"
        label="比赛模式"
      >
        <el-select
          v-model="ruleForm.event_mode"
          class="filter-item"
          placeholder="请选择比赛模式"
        >
          <el-option
            :value="1"
            label="线上赛"
          />
          <el-option
            :value="2"
            label="线下赛"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="回合时间"
        prop="round_time"
      >
        <el-input-number
          v-model="ruleForm.round_time"
          :min="30"
          :max="1800"
          size="medium"
        />&nbsp;&nbsp;&nbsp;秒
      </el-form-item>

      <el-form-item
        label="初始分值"
        prop="init_score"
      >
        <el-input-number
          v-model="ruleForm.init_score"
          :min="0"
          :max="100000"
          size="medium"
        />
      </el-form-item>

      <el-form-item
        label="题目访问模式"
        prop="init_score"
      >
        <el-switch
          v-model="ruleForm.task_access"
          :active-value="1"
          :inactive-value="2"
          inactive-color="#409EFF"
          active-text="密钥"
          inactive-text="密码"
        />
      </el-form-item>

      <el-form-item
        label="靶标重置次数"
        prop="init_score"
      >
        <el-input-number
          v-model="ruleForm.mark_reset_count"
          :min="0"
          :max="5"
          size="medium"
        />
      </el-form-item>

      <el-form-item
        label="竞赛简介"
        prop="description_zh"
      >
        <el-input
          :rows="8"
          v-model="ruleForm.description_zh"
          type="textarea"
          placeholder="请输入竞赛简介"
        />
      </el-form-item>

      <el-form-item
        label="参赛指南"
        prop="competition_guide_zh"
      >
        <quill-editor
          v-model="ruleForm.competition_guide_html_zh"
          holder="请输入参赛指南"
        />
      </el-form-item>

      <el-form-item
        label="是否公开"
        prop="init_score"
      >
        <el-switch
          v-model="ruleForm.public"
          active-text="公开"
          inactive-text="隐藏"
        />
      </el-form-item>

      <div v-show="showEn">
        <br ><br ><br >
        <p style="text-align: center; font-size: 24px; font-weight: bold">
          下方为英文信息
        </p>
        <el-form-item
          label="竞赛名称英文"
          prop="name_en"
        >
          <el-input
            v-model.trim="ruleForm.name_en"
            placeholder="请输入竞赛英文名称第一行"
          />
        </el-form-item>

        <el-form-item
          label="竞赛简介英文"
          prop="description_en"
        >
          <el-input
            :rows="8"
            v-model="ruleForm.description_en"
            type="textarea"
            placeholder="请输入竞赛简介英文"
          />
        </el-form-item>
        <el-form-item
          label="参赛指南英文"
          prop="competition_guide_en"
        >
          <quill-editor
            v-model="ruleForm.competition_guide_html_en"
            holder="请输入参赛指南英文"
          />
        </el-form-item>
      </div>

      <el-form-item>
        <span style="color: red; font-size: 18px">如果竞赛信息有所更改，一定要先点击保存，否则修改的信息会丢失。</span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          @click="showEn = !showEn"
        >{{
          showEn ? "关闭输入英文信息" : "显示填写英文信息"
        }}</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button>
        <el-button
          :disabled="step"
          type="primary"
          @click="nextStep('ruleForm')"
        >下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import {
  fetchDefenseInfo,
  editMatchDefense,
  createDenfenseMatch
} from '@/api/match/DevOps'
import { deleteImage } from '@/api/match/common'
import { scrollTo } from '@/utils/scrollTo'
import UploadFile from '@/components/UploadFile'

export default {
  components: {
    QuillEditor,
    UploadFile
  },
  data() {
    return {
      fileList: [],
      step: true, // 是否可以点击一下步，必须保存成功才行
      showEn: true,
      startEndTime: [], // 起止时间
      ruleForm: {
        name_zh: '', // 竞赛中文名称
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        cover: '', // 竞赛封面
        logo: '', // logo
        event_mode: 1, // 比赛模式   1：线上vpn赛  2：线下赛
        round_time: 300, // 回合时间
        init_score: '', // 初始分数
        task_access: 1, // 题目访问模式
        mark_reset_count: 1, // 标靶重置次数

        description_zh: '', // 竞赛简介中
        description_html_zh: '', // 竞赛简介中html
        competition_guide_zh: '', // 参赛指南
        competition_guide_html_zh: '', // 参赛指南
        public: true, // 1：公开 0：隐藏
        join_mode: 2, // 比赛模式  1: 个人  2: 组队 运维赛只有个人
        name_en: '', // 竞赛英文名称
        description_en: '', // 竞赛介绍英文
        description_html_en: '', // 竞赛介绍英文html
        competition_guide_en: '', // 参赛指南
        competition_guide_html_en: '' // 参赛指南
      },
      rules: {
        name_zh: [
          { required: true, message: '请输入竞赛名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字', trigger: 'blur' }
        ],
        init_score: [
          { required: true, message: '请输入初始分数', trigger: 'blur' }
        ],
        round_time: [
          { required: true, message: '请输入回合时间', trigger: 'blur' }
        ],
        down_score: [
          { required: true, message: '请输入宕机扣分', trigger: 'blur' }
        ],
        attack_score: [
          { required: true, message: '请填写攻陷得分', trigger: 'blur' }
        ],
        description_zh: [
          { required: true, message: '请填写竞赛简介', trigger: 'blur' },
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字',
            trigger: 'blur'
          }
        ]
      },
      id: this.$route.query.id,
      process: null, // 比赛进度 0进行中 1未开始 2已结束
      imgUrl: {
        logo: '',
        cover: '',
        competition_company_url: ''
      }
    }
  },
  created() {
    if (this.id) {
      this.getInfo()
      this.step = false
    }
  },
  mounted() {
    setTimeout(() => {
      this.showEn = false
    }, 200)
  },
  methods: {
    goBottom() {
      scrollTo(100000, 100)
    },
    nextStep() {
      this.$emit('nextStep', this.step)
    },
    changeComType(val) {
      // 切换选择类型
      this.ruleForm.type = val == 1 ? 6 : 7
    },
    getInfo() {
      // 获取比赛详情
      fetchDefenseInfo(this.id).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
        this.startEndTime = [res.data['start_time'], res.data['end_time']]
        this.process = res.data.process
        // 富文本编辑器会自动获得焦点，导致滚动条出现在页面下方，调用方法将滚动条移动至上方
        setTimeout(() => {
          scrollTo(0, 0)
        }, 50)
      })
    },
    deleteImg(ref) {
      // 删除服务器的图片
      this.$confirm('此操作会删除服务器中的图片，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteImage({ field: ref, event_id: this.id }).then(res => {
            if (res.data.success) {
              this.$message.success('删除成功')
              this.ruleForm[ref] = ''
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    clearImg(ref) {
      // 删除预览图
      this.imgUrl[ref] = ''
      this.$refs[ref].value = ''
    },
    handleImage(ref) {
      // input 选择文件
      const file = this.$refs[ref].files[0]
      if (file) {
        // 转成base64完成预览。
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          this.imgUrl[ref] = reader.result
        }
      } else {
        this.imgUrl[ref] = ''
      }
    },
    onSubmit() {
      const fm = new FormData()

      // 深克隆要提交的数据
      this.ruleForm.start_time = this.startEndTime[0]
      this.ruleForm.end_time = this.startEndTime[1]

      // 获取当前系统时间和设置的开始时间
      let nowTime = new Date(this.$store.state.config.time),
        startTime = new Date(this.ruleForm.start_time),
        endTime = new Date(this.ruleForm.end_time)

      if (nowTime.getTime() > startTime.getTime() && this.process !== 0) {
        this.$message.error('开始时间不能早于当前时间')
        return
      }
      if (nowTime.getTime() > endTime.getTime()) {
        this.$message.error('结束时间不能早于当前时间')
        return
      }
      if (this.ruleForm.start_time === this.ruleForm.end_time) {
        this.$message.error('开始时间和结束时间不能相同')
        return
      }

      const formData = this.ruleForm

      for (const key in formData) {
        fm.append(key, formData[key])
      }

      if (this.id) {
        editMatchDefense(this.id, fm).then(res => {
          if (res.data.success) {
            this.nextStep()
          }
        })
      } else {
        createDenfenseMatch(fm).then(res => {
          if (res.data.success) {
            sessionStorage.setItem('id', res.data.event_id)
            this.$router.push({
              path: '/competition/DevOps/editMatch/editMatch',
              query: { id: res.data.event_id, step: 1 }
            })
          }
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
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

<style>
.create_match {
  position: relative;
  width: 80%;
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
</style>
