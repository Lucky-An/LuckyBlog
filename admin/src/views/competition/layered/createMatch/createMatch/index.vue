<template>
  <div class="app-container create_match">
    <div class="goBottom">
      <el-button type="warning" @click="goBottom">直达底部</el-button>
    </div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" class="demo-ruleForm">
      <el-form-item label="竞赛名称" prop="name_zh">
        <el-input v-model.trim="ruleForm.name_zh" placeholder="请输入竞赛名称"/>
      </el-form-item>

      <el-form-item label="起止时间" required>
        <el-date-picker
          :clearable="false"
          v-model="ruleForm.startEndTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime"/>
      </el-form-item>
      <el-form-item label="竞赛封面">
        <p v-if="ruleForm.cover&&!imgUrl.cover" class="imgBox">
          <span @click="deleteImg('cover')"><svg-icon icon-class="delete"/></span>
          <img :src="ruleForm.cover" style="max-width: 200px">
        </p>
        <p v-if="imgUrl.cover" class="imgBox">
          <span @click="clearImg('cover')"><svg-icon icon-class="delete"/></span>
          <img :src="imgUrl.cover" style="max-width: 200px;line-height: 0">
        </p>
        <input ref="cover" type="file" @change="handleImage('cover')">（支持PNG、JPG格式，大小不超过1M）
      </el-form-item>
      <el-form-item label="logo">
        <p v-if="ruleForm.logo&&!imgUrl.logo" class="imgBox">
          <span @click="deleteImg('logo')"><svg-icon icon-class="delete"/></span>
          <img :src="ruleForm.logo" style="max-width: 200px">
        </p>
        <p v-if="imgUrl.logo" class="imgBox">
          <span @click="clearImg('logo')"><svg-icon icon-class="delete"/></span>
          <img :src="imgUrl.logo" style="max-width: 200px;line-height: 0">
        </p>
        <input ref="logo" type="file" @change="handleImage('logo')">（支持PNG、JPG格式，大小不超过1M）
      </el-form-item>

      <el-form-item label="竞赛简介" prop="description_zh">
        <el-input
          :rows="8"
          v-model="description_zh"
          type="textarea"
          placeholder="请输入竞赛简介"/>
      </el-form-item>

      <el-form-item label="参赛方式" prop="mode">
        <el-select v-model="ruleForm.mode">
          <el-option :value="1" label="个人赛"/>
          <el-option :value="2" label="组队赛"/>
        </el-select>
      </el-form-item>

      <el-form-item label="积分方式">
        <el-select v-model="ruleForm.integral_mode" @change="changeIntegral">
          <el-option :value="1" label="累加积分" />
          <el-option :value="2" label="动态积分" />
        </el-select>
      </el-form-item>

      <el-form-item label="奖励方式">
        <el-select v-model="ruleForm.reward_mode" :disabled="ruleForm.integral_mode===1">
          <el-option :value="0" label="无" />
          <el-option :value="1" label="一二三血额外奖励" />
        </el-select>
      </el-form-item>

      <el-form-item label="上传WP文件类型格式">
        <el-input v-model.trim="ruleForm.file_type" placeholder="请输入文件格式"/>
      </el-form-item>

      <el-form-item label="上传WP文件大小">
        <el-input-number v-model.trim="ruleForm.file_size" :min="1" :max="1000" label="描述文字"/>
      </el-form-item>

      <el-form-item label="动态flag前缀">
        <el-input v-model.trim="ruleForm.flag_prefix" placeholder="请输入动态flag前缀"/>
      </el-form-item>

      <el-form-item label="参赛指南" prop="competition_guide_zh">
        <quill-editor v-model="ruleForm.competition_guide_html_zh" holder="请输入参赛指南"/>
      </el-form-item>

      <div v-show="showEn">
        <p style="text-align: center;font-size: 24px;font-weight: bold">下方为英文信息</p>
        <el-form-item label="竞赛名称英文" prop="name_en">
          <el-input v-model.trim="ruleForm.name_en" placeholder="请输入竞赛英文名称第一行"/>
        </el-form-item>

        <el-form-item label="竞赛简介英文" prop="description_en">
          <el-input
            :rows="8"
            v-model="description_en"
            type="textarea"
            placeholder="请输入竞赛简介英文"/>
        </el-form-item>
        <el-form-item label="参赛指南英文" prop="competition_guide_en">
          <quill-editor v-model="ruleForm.competition_guide_html_en" holder="请输入参赛指南英文"/>
        </el-form-item>
        <el-form-item>

          <span style="color: red;font-size: 18px">如果竞赛信息有所更改，一定要先点击保存，否则修改的信息会丢失。</span>

        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="showEn=!showEn">{{ showEn?'关闭填写英文信息':'显示填写英文信息' }}</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button :disabled="step" type="primary" @click="nextStep('ruleForm')">下一步</el-button>

        </el-form-item>
    </div></el-form>

  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import { fetchJeopardyInfo, editMatchJeopardy, createJeopardyMatch } from '@/api/match/layered'
import { deleteImage } from '@/api/match/common'
import { scrollTo } from '@/utils/scrollTo'

export default {
  components: {
    QuillEditor
  },
  data() {
    return {

      fileList: [],
      step: true, // 是否可以点击一下步，必须保存成功才行
      showEn: true,
      ruleForm: {
        startEndTime: [], // 起止时间
        name_zh: '', // 竞赛中文名称
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        description_zh: '', // 竞赛介绍中
        description_html_zh: '', // 竞赛介绍中
        mode: 1, // 参赛方式
        integral_mode: 1, // 积分方式
        reward_mode: 1, // 奖励方式
        file_type: '.pdf,.png,.md,.rar,.zip', // 文件类型格式
        file_size: 2, // 文件类型格式
        flag_prefix: '', // 动态flag前缀
        competition_guide_zh: '', // 参赛指南
        competition_guide_html_zh: '', // 参赛指南
        competition_rule_zh: '', // 竞赛规则中文
        competition_rule_html_zh: '', // 竞赛规则中文
        matters_needing_attention_zh: '', // 注意事项
        matters_needing_attention_html_zh: '', // 注意事项
        score_ranking_zh: '', // 得分排名
        score_ranking_html_zh: '', // 得分排名
        reward_zh: '', // 竞赛奖金
        reward_html_zh: '', // 竞赛奖金
        contact_way_zh: '', // 联系方式
        contact_way_html_zh: '', // 联系方式

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
        contact_way_html_en: '', // 联系方式

        logo: '', // logo
        cover: '',
        competition_company_url: '' // 支持单位图片
      },
      rules: {
        name_zh: [
          { required: true, message: '请输入竞赛名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字', trigger: 'blur' }
        ],
        startEndTime: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
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
    // 监听积分方式，如果是累加积分，将奖励方式变成无
    changeIntegral(val) {
      if (val === 1) {
        this.ruleForm.reward_mode = 0
      }
    },
    goBottom() {
      scrollTo(100000, 100)
    },
    nextStep() {
      this.$emit('nextStep', this.step)
    },
    changeComType(val) { // 切换选择类型
      this.ruleForm.type = val == 1 ? 6 : 7
    },
    getInfo() { // 获取比赛详情
      fetchJeopardyInfo(this.id).then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
        this.ruleForm['startEndTime'] = [res.data['start_time'], res.data['end_time']]
        this.process = res.data.process
        // 富文本编辑器会自动获得焦点，导致滚动条出现在页面下方，调用方法将滚动条移动至上方
        setTimeout(() => {
          scrollTo(0, 0)
        }, 50)
      })
    },
    deleteImg(ref) { // 删除服务器的图片
      this.$confirm('此操作会删除服务器中的图片，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteImage({ field: ref, event_id: this.id }).then(res => {
          if (res.data.success) {
            this.$message.success('删除成功')
            this.ruleForm[ref] = ''
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    clearImg(ref) { // 删除预览图
      this.imgUrl[ref] = ''
      this.$refs[ref].value = ''
    },
    handleImage(ref) { // input 选择文件
      const file = this.$refs[ref].files[0]
      if (file) {
        // 转成base64完成预览。
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          this.imgUrl[ref] = reader.result
        }
      } else {
        this.imgUrl[ref] = ''
      }
    },
    changeTime() { // 切换时间时触发的方法
      // 当竞赛已经开始时，不允许修改竞赛开始时间，直接重置为比赛原本的时间。
      if (this.process === 0) {
        this.$message.warning('竞赛已开始，竞赛开始时间不可修改。')
        this.ruleForm.startEndTime[0] = this.ruleForm.start_time
      }
    },
    onSubmit() {
      const fm = new FormData()
      const logo = this.$refs.logo.files
      const cover = this.$refs.cover.files
      const competition_company_url = this.$refs.competition_company_url.files
      const imgSize = 1024 * 1024
      const AllImgExt = '.jpg|.png'

      // 深克隆要提交的数据
      this.ruleForm.start_time = this.ruleForm.startEndTime[0]
      this.ruleForm.end_time = this.ruleForm.startEndTime[1]

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
      const formData = JSON.parse(JSON.stringify(this.ruleForm))
      delete formData.startEndTime
      delete formData.logo
      delete formData.competition_company_url

      for (const key in formData) {
        fm.append(key, formData[key])
      }
      if (cover.length > 0) {
        const extName = cover[0].name.substring(cover[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
        if (AllImgExt.indexOf(extName) == -1) {
          this.$message.error('封面图片必须是jpg或者png')
          return
        }
        if (cover[0].size > imgSize) {
          this.$message.error('封面图片大小不能超过1M')
          return
        }
        fm.append('cover', cover[0])
      }

      // logo图片
      if (logo.length > 0) {
        const extName = logo[0].name.substring(logo[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
        if (AllImgExt.indexOf(extName) == -1) {
          this.$message.error('logo图片必须是jpg或者png')
          return
        }
        if (logo[0].size > imgSize) {
          this.$message.error('logo图片大小不能超过1M')
          return
        }
        fm.append('logo', logo[0])
      }
      // 支撑单位图片
      if (competition_company_url.length > 0) {
        const extName = competition_company_url[0].name.substring(competition_company_url[0].name.lastIndexOf('.')).toLowerCase()// （把路径中的所有字母全部转换为小写）
        if (AllImgExt.indexOf(extName) == -1) {
          this.$message.error('支撑单位图片必须是jpg或者png')
          return
        }
        if (competition_company_url[0].size > imgSize) {
          this.$message.error('支撑单位图片大小不能超过1M')
          return
        }
        fm.append('competition_company_url', competition_company_url[0])
      }

      if (this.id) {
        editMatchJeopardy(this.id, fm).then(res => {
          if (res.data.success) {
            this.nextStep()
          }
        })
      } else {
        createJeopardyMatch(fm).then(res => {
          if (res.data.success) {
            sessionStorage.setItem('id', res.data.event_id)
            this.$router.push({
              path: '/competition/layered/editMatch/editMatch',
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
          this.$message.error('输入信息有误')
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
