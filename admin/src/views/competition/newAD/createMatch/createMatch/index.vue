<template>
  <div class="app-container create_match">
    <div class="goBottom">
      <el-button type="warning" @click="goBottom">直达底部</el-button>
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item label="竞赛名称" prop="name_zh">
        <el-input
          v-model.trim="ruleForm.name_zh"
          placeholder="请输入竞赛名称"
        />
      </el-form-item>

      <el-form-item label="竞赛时间" required>
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
          :list-type="'picture-card'"
          :file.sync="ruleForm.cover"
          :file-size="2 * 1024 * 1024"
          :file-type="['png', 'jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过 2 M）
      </el-form-item>
      <el-form-item label="竞赛 logo">
        <UploadFile
          :list-type="'picture-card'"
          :file.sync="ruleForm.logo"
          :file-size="2 * 1024 * 1024"
          :file-type="['png', 'jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过 2 M）
      </el-form-item>

      <el-form-item label="竞赛简介" prop="description_zh">
        <el-input v-model="ruleForm.description_zh" :rows="4" type="textarea" />
      </el-form-item>

      <!--<el-form-item label="参赛方式" prop="join_mode">-->
      <!--<el-select v-model="ruleForm.join_mode">-->
      <!--<el-option :value="1" label="个人赛" />-->
      <!--<el-option :value="2" label="组队赛" />-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="比赛形式" prop="event_mode">
        <el-select v-model="ruleForm.event_mode">
          <el-option :value="1" label="线上赛" />
          <!--<el-option :value="2" label="线上赛基本模式" />-->
          <el-option :value="3" label="线下赛" />
        </el-select>
      </el-form-item>

      <el-form-item label="初始分值" prop="init_score">
        <el-input-number
          v-model="ruleForm.init_score"
          :min="0"
          :max="100000"
          size="medium"
        />
      </el-form-item>

      <!-- <el-form-item label="宿主机模版" prop="flavor_name">
        <el-select v-model="ruleForm.flavor_name">
          <el-option
            v-for="item in flaList"
            :key="item.uuid"
            :value="item.name"
            :label="item.name"
          />
        </el-select>
      </el-form-item>-->

      <el-form-item label="回合时间" prop="round_time">
        <el-input-number
          v-model.trim="ruleForm.round_time"
          :min="30"
          :max="1800"
          size="medium"
        />&nbsp;&nbsp;&nbsp;秒
      </el-form-item>

      <el-form-item label="攻击成功得分" prop="defcon_attack_score">
        <el-input-number
          v-model="ruleForm.defcon_attack_score"
          :min="0"
          :max="1000"
          size="medium"
        />
      </el-form-item>

      <el-form-item label="防守成功得分" prop="defcon_defend_score">
        <el-input-number
          v-model="ruleForm.defcon_defend_score"
          :min="0"
          :max="1000"
          size="medium"
        />
      </el-form-item>

      <el-form-item label="参赛指南" prop="competition_guide_zh">
        <quill-editor
          v-model="ruleForm.competition_guide_html_zh"
          holder="请输入参赛指南"
        />
      </el-form-item>

      <div v-show="showEn">
        <br >
        <br >
        <br >
        <p style="text-align: center; font-size: 24px; font-weight: bold">
          下方为英文信息
        </p>
        <el-form-item label="竞赛名称英文" prop="name_en">
          <el-input
            v-model.trim="ruleForm.name_en"
            placeholder="请输入竞赛英文名称第一行"
          />
        </el-form-item>
        <el-form-item label="竞赛简介" prop="desc">
          <el-input v-model="ruleForm.desc" :rows="4" type="textarea" />
        </el-form-item>
        <el-form-item label="参赛指南英文" prop="competition_guide_en">
          <quill-editor
            v-model="ruleForm.competition_guide_html_en"
            holder="请输入参赛指南英文"
          />
        </el-form-item>
      </div>

      <el-form-item>
        <span
          style="color: red; font-size: 18px"
        >如果竞赛信息有所更改，一定要先点击保存，否则修改的信息会丢失。</span
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="showEn = !showEn">{{
          showEn ? "关闭填写英文信息" : "显示填写英文信息"
        }}</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button
        >
        <el-button
          :disabled="step"
          type="primary"
          @click="nextStep('ruleForm')"
        >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  fetchDefenseInfo,
  editMatchDefense,
  createDenfenseMatch
} from '@/api/match/newAD'
import { flavorsList } from '@/api/systemManage'
import { scrollTo } from '@/utils/scrollTo'
import QuillEditor from '@/components/QuillEditor'
import UploadFile from '@/components/UploadFile'
import { getFlavorList } from '@/api/itemBank/common'

export default {
  components: {
    QuillEditor,
    UploadFile
  },
  data() {
    return {
      step: true, // 是否可以点击一下步，必须保存成功才行
      showEn: true, // 是否展示英文信息
      startEndTime: [], // 起止时间
      ruleForm: {
        name_zh: '', // 竞赛中文名称
        name_en: '', // 竞赛英文名称
        start_time: '', // 开始时间
        end_time: '', // 结束时间

        cover: '', // 竞赛封面
        logo: '', // logo
        description_zh: '',
        join_mode: 2, // 参赛方式
        event_mode: 1, // 1线上vpn 2线上基本 3线下
        init_score: '', // 初始分数
        round_time: 300, // 回合时间
        defcon_defend_score: '', // 防御成功得分
        defcon_attack_score: '', // 攻击成功得分
        // flavor_name: "", // 宿主机模板

        competition_guide_html_zh: '', // 参赛指南
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
        defcon_defend_score: [
          { required: true, message: '请填防御成功得分', trigger: 'blur' }
        ],
        defcon_attack_score: [
          { required: true, message: '请输入攻击成功得分', trigger: 'blur' }
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
      flaList: [],
      process: null // 比赛进度 0进行中 1未开始 2已结束
    }
  },
  created() {
    if (this.id) {
      this.getInfo()
      this.step = false
    }
    this.getFlavors()
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
    getInfo() {
      // 获取比赛详情
      fetchDefenseInfo(this.id).then((res) => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
        this['startEndTime'] = [res.data['start_time'], res.data['end_time']]
        this.process = res.data.process
        // 富文本编辑器会自动获得焦点，导致滚动条出现在页面下方，调用方法将滚动条移动至上方
        setTimeout(() => {
          scrollTo(0, 0)
        }, 50)
      })
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

      for (const key in this.ruleForm) {
        fm.append(key, this.ruleForm[key])
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
              path: '/competition/newAD/editMatch/editMatch',
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
    },

    getFlavors() {
      getFlavorList({
        page: 1,
        per_page: 999
      }).then((res) => {
        const { data } = res
        if (data.success) {
          this.flaList = data.data
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
  width: 200px;
  background: #a5a5a5;
}

.create_match .te-switch-button {
  vertical-align: top;
}

.el-picker-panel__footer .el-button--text {
  display: none;
}
</style>
