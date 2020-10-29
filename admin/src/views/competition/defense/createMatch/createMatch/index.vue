<template>
  <div class="app-container create_match">
    <div class="goBottom">
      <el-button type="warning" @click="goBottom">直达底部</el-button>
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item label="竞赛名称" prop="name_zh">
        <el-input v-model.trim="ruleForm.name_zh" placeholder="请填写竞赛名称" />
      </el-form-item>

      <el-form-item label="起止时间" required>
        <el-date-picker
          :clearable="false"
          v-model="startEndTime"
          :disabled="process===0"
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
          :list-type="'picture-card'"
          :file-size="2*1024*1024"
          :file-type="['png','jpg']"
        />（支持PNG、JPG格式，大小不超过2M）
      </el-form-item>

      <el-form-item label="竞赛logo">
        <UploadFile
          :file.sync="ruleForm.logo"
          :list-type="'picture-card'"
          :file-size="2*1024*1024"
          :file-type="['png','jpg']"
        />（支持PNG、JPG格式，大小不超过2M）
      </el-form-item>

      <el-form-item label="比赛形式" prop="event_mode">
        <el-select
          v-model="ruleForm.event_mode"
          class="filter-item"
          placeholder="请选择题目类型"
        >
          <el-option :value="1" label="线上赛" />
          <el-option :value="2" label="线下赛" />
        </el-select>
      </el-form-item>

      <el-form-item label="回合时间" prop="round_time">
        <el-input-number v-model.trim="ruleForm.round_time" :min="30" :max="1800" size="medium" />&nbsp;&nbsp;&nbsp;秒
      </el-form-item>

      <!--<el-form-item label="积分方式" prop="integral_mode">-->
      <!--<el-select-->
      <!--v-model="ruleForm.integral_mode"-->
      <!--class="filter-item"-->
      <!--placeholder="请选择积分方式"-->
      <!--&gt;-->
      <!--<el-option :value="0" label="固定分值" />-->
      <!--<el-option :value="1" label="一二三血" />-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="宕机扣分" prop="down_score">
        <el-input-number v-model.trim="ruleForm.down_score" :min="0" :max="1000" size="medium" />
      </el-form-item>
      <el-form-item label="攻陷得分" prop="attack_score">
        <el-input-number v-model.trim="ruleForm.attack_score" :min="0" :max="1000" size="medium" />
      </el-form-item>

      <!--<el-form-item label="参赛方式" prop="join_mode">-->
      <!--<el-select-->
      <!--v-model="ruleForm.join_mode"-->
      <!--class="filter-item"-->
      <!--placeholder="请选择比赛形式"-->
      <!--&gt;-->
      <!--<el-option :value="1" label="个人" />-->
      <!--<el-option :value="2" label="组队" />-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="题目访问模式" prop="task_access">
        <el-switch
          v-model="ruleForm.task_access"
          :active-value="1"
          :inactive-value="2"
          active-color="#409eff"
          inactive-color="#409eff"
          active-text="密钥"
          inactive-text="密码"
        />
      </el-form-item>
      <el-form-item label="竞赛简介" prop="description_zh">
        <el-input
          :rows="8"
          v-model="ruleForm.description_zh"
          type="textarea"
          placeholder="请输入竞赛简介"
        />
      </el-form-item>
      <el-form-item label="参赛指南" prop="competition_guide_zh">
        <quill-editor v-model="ruleForm.competition_guide_html_zh" holder="请输入参赛指南" />
      </el-form-item>
      <el-form-item label="是否公开" prop="public">
        <el-switch
          v-model="ruleForm.public"
          :active-value="1"
          :inactive-value="0"
          active-text="公开"
          inactive-text="隐藏"
        />
      </el-form-item>

      <div v-show="showEn">
        <br >
        <br >
        <br >
        <p style="text-align: center;font-size: 24px;font-weight: bold">下方为英文信息</p>
        <el-form-item label="竞赛名称英文" prop="name_en">
          <el-input v-model.trim="ruleForm.name_en" placeholder="请填写竞赛英文名称第一行" />
        </el-form-item>

        <el-form-item label="竞赛简介英文" prop="description_en">
          <el-input
            :rows="8"
            v-model="ruleForm.description_en"
            type="textarea"
            language="zh_CN"
            placeholder="请输入竞赛简介英文"
          />
        </el-form-item>
        <el-form-item label="参赛指南英文" prop="competition_guide_en">
          <quill-editor v-model="ruleForm.competition_guide_html_en" holder="请输入参赛指南英文" />
        </el-form-item>
      </div>

      <el-form-item>
        <span style="color: red;font-size: 18px">如果竞赛信息有所更改，一定要先点击保存，否则修改的信息会丢失。</span>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="showEn=!showEn">{{ showEn?'关闭填写英文信息':'显示填写英文信息' }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button :disabled="step" type="primary" @click="nextStep('ruleForm')">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  fetchDefenseInfo,
  editMatchDefense,
  createDenfenseMatch
} from '@/api/match/defense'
import { deleteImage } from '@/api/match/common'
import { scrollTo } from '@/utils/scrollTo'
import UploadFile from '@/components/UploadFile'
import QuillEditor from '@/components/QuillEditor'

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
        // integral_mode: '', // 积分方式
        name_zh: '', // 竞赛中文名称
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        cover: '', // 竞赛封面
        logo: '', // logo
        event_mode: 1, // 比赛形式
        join_mode: 2, // 参赛模式
        task_access: 1, // 题目访问方式
        round_time: 300, // 回合时间
        // init_score: '', // 初始分数
        down_score: '', // 宕机扣分
        attack_score: '', // 攻陷得分
        public: 1, // 是否公开
        description_zh: '', // 竞赛简介中
        description_html_zh: '', // 竞赛简介中html
        competition_guide_zh: '', // 参赛指南
        competition_guide_html_zh: '', // 参赛指南
        competition_rule_zh: '', // 竞赛规则中文
        competition_rule_html_zh: '', // 竞赛规则中文
        // matters_needing_attention_zh: '', // 注意事项
        // matters_needing_attention_html_zh: '', // 注意事项
        score_ranking_zh: '', // 得分排名
        score_ranking_html_zh: '', // 得分排名
        reward_zh: '', // 竞赛奖金
        reward_html_zh: '', // 竞赛奖金
        contact_way_zh: '', // 联系方式
        contact_way_html_zh: '', // 联系方式
        competition_company_url: '', // 支撑单位图片

        name_en: '', // 竞赛英文名称
        description_en: '', // 竞赛介绍英文
        description_html_en: '', // 竞赛介绍英文html
        competition_guide_en: '', // 参赛指南
        competition_guide_html_en: '', // 参赛指南
        competition_rule_en: '', // 竞赛规则英文
        competition_rule_html_en: '', // 竞赛规则英文_html
        matters_needing_attention_en: '', // 注意事项
        matters_needing_attention_html_en: '', // 注意事项
        score_ranking_en: '', // 得分排名
        score_ranking_html_en: '', // 得分排名
        reward_en: '', // 竞赛奖金
        reward_html_en: '', // 竞赛奖金
        contact_way_en: '', // 联系方式
        contact_way_html_en: '' // 联系方式
      },
      rules: {
        name_zh: [
          { required: true, message: '请填写竞赛名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字', trigger: 'blur' }
        ],
        round_time: [
          { required: true, message: '请填写回合时间', trigger: 'blur' }
        ],
        down_score: [
          { required: true, message: '请填写宕机扣分', trigger: 'blur' }
        ],
        attack_score: [
          { required: true, message: '请填写攻陷得分', trigger: 'blur' }
        ],
        integral_mode: [
          { required: true, message: '请选择积分方式', trigger: 'blur' }
        ],
        join_mode: [
          { required: true, message: '请选择参赛方式', trigger: 'blur' }
        ],
        event_mode: [
          { required: true, message: '请选择比赛形式', trigger: 'blur' }
        ],
        description_zh: [
          { required: true, message: '请填写竞赛简介', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字', trigger: 'blur' }
        ]
      },
      id: this.$route.query.id,
      status: null, // 比赛进度 0进行中 1未开始 2暂停中 3进行中
      imgUrl: {
        logo: '',
        cover: '',
        competition_company_url: ''
      },
      process: null // 比赛进度 0进行中 1未开始 2已结束
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
      fetchDefenseInfo(this.id).then((res) => {
        for (const key in this.ruleForm) {
          if (res.data[key] !== undefined) {
            this.ruleForm[key] = res.data[key]
          }
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
          deleteImage({ field: ref, event_id: this.id }).then((res) => {
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
        editMatchDefense(this.id, fm).then((res) => {
          if (res.data.success) {
            this.nextStep()
          }
        })
      } else {
        createDenfenseMatch(fm).then((res) => {
          if (res.data.success) {
            sessionStorage.setItem('id', res.data.event_id)
            this.$router.push({
              path: '/competition/defense/editMatch/editMatch',
              query: { id: res.data.event_id, step: 1 }
            })
          }
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
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
