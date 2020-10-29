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
          clearable
          placeholder="请填写竞赛名称"
        />
      </el-form-item>
      <el-form-item
        label="竞赛形式"
        prop="competition_type"
      >
        <el-select
          v-model="ruleForm.competition_type"
          placeholder="请选择竞赛形式"
          clearable
        >
          <el-option
            v-for="item in competition_typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

      </el-form-item>
      <el-form-item
        v-if="ruleForm.competition_type == 2"
        label="竞赛时长"
        prop="competition_time"
      >
        <el-input
          v-model.trim="ruleForm.competition_time"
          clearable
          placeholder="请填写竞赛时长,以分钟为单位。"
        />
      </el-form-item>

      <el-form-item
        label="起止时间"
        required
      >
        <el-date-picker
          v-model="startEndTime"
          :disabled="process===0"
          :clearable="false"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />

      </el-form-item>

      <el-form-item label="竞赛封面">
        <UploadFile :file.sync="ruleForm.cover" :file-type="['jpg','png']" :list-type="'picture-card'" :file-size="2*1024*1024"/>
        （请上传PNG、JPG格式文件，大小不超过2M）
      </el-form-item>

      <el-form-item
        label="竞赛简介"
        prop="description_zh"
      >
        <el-input
          :rows="8"
          v-model="ruleForm.description_zh"
          prop="description_zh"
          type="textarea"
          placeholder="请输入竞赛简介"
        />
      </el-form-item>

      <el-form-item label="公开/隐藏">
        <el-switch
          v-model="ruleForm.public"
          :active-value="true"
          :inactive-value="false"
          active-text="公开"
          inactive-text="隐藏"
        />
      </el-form-item>

      <el-form-item label="是否允许回顾">
        <el-switch
          v-model="ruleForm.is_review"
          :active-value="true"
          :inactive-value="false"
          active-text="允许"
          inactive-text="禁止"
        />
      </el-form-item>

      <el-form-item label="答案显示">
        <el-radio-group
          v-model="ruleForm.is_review_shows"
        >
          <el-radio
            :label="true"
            border
          >竞赛回顾显示答案和分数</el-radio>
          <el-radio
            :label="false"
            border
          >竞赛回顾不显示答案和分数</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="分数显示">
        <el-radio-group
          v-model="ruleForm.is_show_score"
        >
          <el-radio
            :label="true"
            border
          >交卷时显示分数</el-radio>
          <el-radio
            :label="false"
            border
          >交卷时不显示分数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="竞赛logo">
        <UploadFile :file.sync="ruleForm.logo" :file-type="['jpg','png']" :list-type="'picture-card'" :file-size="2*1024*1024"/>
        （请上传PNG、JPG格式文件，大小不超过2M）
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

      <div v-show="showEn">
        <p style="text-align: center;font-weight: bold;font-size: 20px">下方为英文信息</p>
        <el-form-item
          label="竞赛名称英文"
          prop="name_en"
        >
          <el-input
            v-model.trim="ruleForm.name_en"
            placeholder="请填写竞赛英文名称第一行"
          />
        </el-form-item>

        <el-form-item
          label="竞赛简介英文"
          prop="description_en"
        >
          <el-input
            :rows="8"
            v-model.trim="ruleForm.description_en"
            type="textarea"
            placeholder="请输入竞赛简介"
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

        <span style="color: red;font-size: 18px">如果竞赛信息有所更改，一定要先点击保存，否则修改的信息会丢失。</span>

      </el-form-item>
      <el-form-item>

        <el-button type="success" @click="showEn=!showEn">{{ showEn?'关闭填写英文信息':'显示填写英文信息' }}</el-button>

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
import UploadFile from '@/components/UploadFile'

import {
  getUser,
  fetchJeopardyInfo,
  editMatchJeopardy,
  deleteImage,
  createMatch
} from '@/api/match/theory'
import { scrollTo } from '@/utils/scrollTo'

export default {
  components: {
    QuillEditor,
    UploadFile
  },
  data() {
    return {
      userList: [], // 教员列表
      fileList: [],
      step: true, // 是否可以点击一下步，必须保存成功才行
      showEn: true,
      competition_typeList: [
        {
          label: '标准赛制',
          value: 1
        },
        {
          label: '灵活赛制',
          value: 2
        }
      ],
      startEndTime: [], // 起止时间
      //! 数据表单
      ruleForm: {
        name_zh: '', // 竞赛中文名称
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        competition_type: '', // 竞赛形式  //!待确认
        competition_time: '', // 竞赛时长

        description_zh: '', // 竞赛介绍中
        description_html_zh: '', // 竞赛介绍html
        public: true, // 公开隐藏
        is_review: true, // 是否允许竞赛回顾
        is_review_shows: true, // 是否允许竞赛回顾
        is_show_score: true, // 是否允许竞赛回顾
        user_ids: [], // 教员

        competition_guide_zh: '', // 参赛指南
        competition_guide_html_zh: '', // 参赛指南html
        competition_rule_zh: '', // 竞赛规则中文
        competition_rule_html_zh: '', // 竞赛规则中文html
        matters_needing_attention_zh: '', // 注意事项
        matters_needing_attention_html_zh: '', // 注意事项html
        score_ranking_zh: '', // 得分排名
        score_ranking_html_zh: '', // 得分排名html
        reward_zh: '', // 竞赛奖金
        reward_html_zh: '', // 竞赛奖金html
        contact_way_zh: '', // 联系方式
        contact_way_html_zh: '', // 联系方式html

        logo: '', // logo
        cover: '',
        competition_company_url: '', // 支持单位图片

        name_en: '', // 竞赛中文名称
        description_en: '', // 竞赛介绍中
        description_html_en: '', // 竞赛介绍html
        competition_guide_en: '', // 参赛指南
        competition_guide_html_en: '', // 参赛指南html
        competition_rule_en: '', // 竞赛规则中文
        competition_rule_html_en: '', // 竞赛规则中文html
        matters_needing_attention_en: '', // 注意事项
        matters_needing_attention_html_en: '', // 注意事项html
        score_ranking_en: '', // 得分排名
        score_ranking_html_en: '', // 得分排名html
        reward_en: '', // 竞赛奖金
        reward_html_en: '', // 竞赛奖金html
        contact_way_en: '', // 联系方式
        contact_way_html_en: '' // 联系方式html
      },
      // ! 表单校验规则
      rules: {
        // competition_guide_html_en: [
        //   {
        //     required: true,
        //     message: "请填写英文参赛指南",
        //     trigger: "blur"
        //   }
        // ],
        // competition_guide_html_zh: [
        //   {
        //     required: true,
        //     message: "请填写中文参赛指南",
        //     trigger: "blur"
        //   }
        // ],
        // description_en: [
        //   {
        //     required: true,
        //     message: "请填写英文竞赛简介",
        //     trigger: "blur"
        //   }
        // ],
        description_zh: [
          { required: true, message: '请填写竞赛简介', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字', trigger: 'blur' }
        ],
        competition_type: [
          { required: true, message: '请选择竞赛形式', trigger: 'change' }
        ],
        competition_time: [
          { required: true, message: '请填写竞赛时长', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (/(^[1-9]\d*$)/.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正整数'))
              }
            },
            trigger: 'blur'
          }
        ],
        name_zh: [
          { required: true, message: '请填写竞赛名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字', trigger: 'blur' }
        ]
        // description_zh: [
        //   { required: true, message: "请填写竞赛简介", trigger: "blur" }
        // ],
      },
      hash: this.$route.query.hash,
      process: null, // 比赛进度 0进行中 1未开始 2已结束
      imgUrl: {
        logo: '',
        cover: '',
        competition_company_url: ''
      }
    }
  },
  created() {
    this.getUser()

    if (this.hash) {
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
    getUser() {
      getUser().then(res => {
        this.userList = res.data
      })
    },
    nextStep() {
      this.$emit('nextStep', this.step)
    },
    getInfo() {
      // 获取比赛详情
      fetchJeopardyInfo(this.hash).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
        this['startEndTime'] = [
          res.data['start_time'],
          res.data['end_time']
        ]
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
          deleteImage(this.hash, { img: ref }).then(res => {
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
      // 创建一个form
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
      /*
       * 这里和后台的约定是如果不传文件，不去更改数据库的存储，如果上传文件，则更新数据库存储的文件为最新上传的版本。
       * 下方先删除文件，用来配合上方的规则，当文件有更改的时候又会填充。
       * */

      // 将数据放入form表单中
      for (const key in formData) {
        if (key == 'user_ids') {
          fm.append('user_ids', JSON.stringify(formData['user_ids']))
        } else {
          fm.append(key, formData[key])
        }
      }

      // 如果有hash是编辑比赛，如果没有hash是新增竞赛
      if (this.hash) {
        editMatchJeopardy(this.hash, fm).then(res => {
          if (res.data.success) {
            this.nextStep()
          }
        })
      } else {
        createMatch(fm).then(res => {
          if (res.data.success) {
            sessionStorage.setItem('hash', res.data.hash)
            this.$router.push({
              path: '/competition/theory/editMatch/editMatch',
              query: { hash: res.data.hash, step: 1 }
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
