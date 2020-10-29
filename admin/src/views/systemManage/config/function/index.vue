<template>
  <div v-if="reload" class="app-container systemConfig">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="软件系统名称"
        prop="email"
      >
        <el-input
          v-model.trim="ruleForm.system_name"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="软件版本号"
        prop="username"
      >
        <el-input
          v-model.trim="ruleForm.system_version"
          disabled
        />
      </el-form-item>

      <el-form-item
        label="登录页版权信息"
        prop="username"
      >
        <el-input v-model.trim="ruleForm.login_description" />
      </el-form-item>

      <el-form-item
        label="前台模块展示"
        prop="username"
      >
        <el-checkbox-group v-model="checkList">
          <!-- <el-checkbox
            label="is_practice"
            name="type"
            disabled
          >练习</el-checkbox> -->
          <el-checkbox
            label="is_tool"
            name="type"
          >工具库</el-checkbox>
          <el-checkbox
            label="is_leak"
            name="type"
          >漏洞库</el-checkbox>
          <el-checkbox
            label="is_personal"
            name="type"
          >个人中心</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="标签页Logo">
        <UploadFile
          :file.sync="ruleForm.home_page_logo"
          :list-type="'picture-card'"
          :file-size="2*1024*1024"
          :file-type="['png','jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过2M，<b>推荐 宽度 * 高度：400px * 80px</b> ）
      </el-form-item>

      <el-form-item label="登录页Logo">
        <UploadFile
          :file.sync="ruleForm.login_logo"
          :list-type="'picture-card'"
          :file-size="2*1024*1024"
          :file-type="['png','jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过2M，<b>推荐 宽度 * 高度：400px * 80px</b> ）
      </el-form-item>

      <el-form-item label="登录页banner">
        <UploadFile
          :file.sync="ruleForm.banner_logo"
          :list-type="'picture-card'"
          :file-size="2*1024*1024"
          :file-type="['png','jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过2M，<b>推荐 宽度 * 高度：400px * 80px</b>）
      </el-form-item>

      <el-form-item label="登录页背景图">
        <UploadFile
          :file.sync="ruleForm.background_logo"
          :list-type="'picture-card'"
          :file-size="2*1024*1024"
          :file-type="['png','jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过2M，<b>不传则显示默认视频背景</b>）
      </el-form-item>

      <!--<el-form-item label="登录页支撑单位图片" prop="email">-->
      <!--<UploadFile :file.sync="ruleForm.support_company_logo" :list-type="'picture-card'" :file-size="2*1024*1024" :file-type="['png','jpg']"/>-->
      <!--（请上传PNG、JPG格式文件，大小不超过2M，<b>推荐高度：160px</b>）-->
      <!--</el-form-item>-->

      <el-form-item
        label="观摩页面logo"
        prop="email"
      >
        <UploadFile
          :file.sync="ruleForm.inspect_logo"
          :list-type="'picture-card'"
          :file-size="2*1024*1024"
          :file-type="['png','jpg']"
        />
        （请上传PNG、JPG格式文件，大小不超过2M，<b>推荐 宽度 * 高度：400px * 80px</b> ）
      </el-form-item>

      <el-form-item
        label="首页下载链接文字描述"
        prop="image_code"
      >
        <el-input v-model.trim="ruleForm.link_description" />
      </el-form-item>

      <el-form-item
        label="首页下载文件"
        prop="email"
      >
        <UploadFile
          :file.sync="ruleForm.download_file"
          :file-type="['zip']"
          :file-size="100*1024*1024"
        />
        （请上传zip格式文件，大小不超过100M）
      </el-form-item>

      <!-- <el-form-item
        label="竞赛环境端口映射"
        prop="email"
      >
        <el-radio
          v-model="ruleForm.is_competition_port"
          :label="0"
        >关闭</el-radio>
        <el-radio
          v-model="ruleForm.is_competition_port"
          :label="1"
        >开启</el-radio>
      </el-form-item> -->

      <!--<el-form-item label="是否开启默认验证码">-->
      <!--<el-switch-->
      <!--v-model="ruleForm.is_show"-->
      <!--:active-value="1"-->
      <!--:inactive-value="0"/>-->
      <!--</el-form-item>-->

      <!--<el-form-item v-if="ruleForm.is_show" label="请输入默认验证码" prop="image_code">-->
      <!--<el-input v-model="ruleForm.image_code"/>-->
      <!--</el-form-item>-->

      <el-form-item>
        <el-button
          v-waves
          type="primary"
          @click="submitForm"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import UploadFile from '@/components/UploadFile'
import { submitConfig, fetchConfigInfo } from '@/api/systemManage'

export default {
  name: 'Index',
  directives: { waves },
  components: {
    UploadFile
  },
  data() {
    return {
      allCheck: ['is_tool', 'is_leak', 'is_personal'],
      checkList: [],
      user_id: this.$route.query.user_id,
      ruleForm: {
        system_name: '', // 软件系统名称
        system_version: '', // 软件版本号
        login_description: '', // 登录页版权信息

        is_practice: 0, // 练习
        is_tool: 0, // 工具库
        is_leak: 0, // 漏洞库
        is_personal: 0, // 个人中心

        home_page_logo: '', // 标签页logo
        login_logo: '', // 登录页logo
        banner_logo: '', // 登录页banner
        background_logo: '', // 登录页背景图
        support_company_logo: '', // 登录页支撑单位图片
        inspect_logo: '', // 观摩页面logo

        link_description: '', // 首页下载链接文字描述
        download_file: '', // 首页下载文件
        is_competition_port: 1 // 竞赛环境端口映射
      },
      reload: true// 刷新
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    blurRows(i) {
      // 全局行数失去焦点
      this.ruleForm.global_table_rows = this.ruleForm.global_table_rows || 0
    },
    goBack() {
      history.back()
    },
    getInfo() {
      // 初始信息
      fetchConfigInfo().then(res => {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
          if (this.allCheck.includes(key) && res.data[key]) {
            this.checkList.push(key)
          }
        }
      })
    },
    onSubmit() {
      const fm = new FormData()
      const formData = this.ruleForm
      this.allCheck.forEach(item => {
        if (this.checkList.includes(item)) {
          this.ruleForm[item] = 1
        } else {
          this.ruleForm[item] = 0
        }
      })

      for (const key in formData) {
        fm.append(key, formData[key])
      }

      submitConfig(fm).then(res => {
        if (res.data.success) {
          this.getInfo()
          this.$store.dispatch('getConfig')
          this.$message.success('操作成功')
          this.reload = false
          this.$nextTick(() => {
            this.reload = true
          })
        }
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.systemConfig {
  width: 90%;
  min-width: 600px;
}

.systemConfig .el-form-item p {
  background: #a5a5a5;
  width: 200px;
  position: relative;
  line-height: 0;
}

.systemConfig .el-form-item p .svg-icon {
  width: 25px;
  height: 25px;
  position: absolute;
  right: -13px;
  top: -13px;
  cursor: pointer;
}
</style>
