<template>
    <div id="handle_nav">
        <ul class="nav_parent">
            <li @click="goAnaswer">
                <i class="icon wtw"></i>
                <span>提问</span>
            </li>
            <li>
            <i></i>
            <!--<span>写文章</span>-->
            <!--</li>-->
            <!--<li>-->
            <!--<i></i>-->
            <!--<span>发起投票</span>-->
            </li>
            <li @click="showAdvice">
                <i class="icon xjy"></i>
                <span>写建议</span>
            </li>
        </ul>
        <div class="search">
            <el-input v-model="input" placeholder="搜索你感兴趣的内容"></el-input>
        </div>
      <el-dialog
        title="请写下你的问题"
        :visible.sync="showquesModal"
        width="950px"
        custom-class="ad_public_modal createdmodal" >
        <el-form :model="questionForm" :rules="create_rules"
                 ref="questionForm"
                 label-width="100px"
                 size="medium"
                 class="demo-ruleForm"
        >
          <el-form-item label="标题" prop="name">
            <el-input v-model="questionForm.name" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="logo" >
            <div id="uploader_logo" class="clearfix fl">
              <el-upload
                class="avatar-uploader"
                action="/api/teams/list"
                :with-credentials="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                name="logo"
                :headers="{'X-CSRF-Token':csrfToken}"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar show_team_logo">
                <i class="el-icon-plus avatar-uploader-icon">
                </i>
                <span class="change_logo_ts">{{$t('validateImg.logo_require')}}</span>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item  label="标签" prop="topic" style="text-align:left;">
            <el-select
              v-model="value10"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签">
              <el-option
                v-for="item in options5"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容" prop="topic">
            <mavon-editor
                    class="height300"
                    :language="language"
                    :toolbars="toolbars"
              :ishljs = "true"
              v-model="questionForm.content"/>
          </el-form-item>
          <el-form-item  prop="code" >
            <imgCode @sendImgCode="getImgCode"></imgCode>
          </el-form-item>
          <div class="mrg0L dialog-footer">
            <el-button @click="createTeam = false">{{$t('modal.cancel')}}</el-button>
            <el-button type="primary" @click="submitquestioinForm('questionForm')">{{$t('modal.submit')}}</el-button>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
      <el-dialog
        title="请写下你的建议"
        :visible.sync="showAdviceModal"
        width="700px"
        custom-class="ad_public_modal createdmodal" >
        <el-form :model="adviceForm" :rules="advice_rules"
                 ref="adviceForm"
                 size="medium"
                 class="demo-ruleForm"
        >
          <el-form-item prop="content">
            <el-input type="textarea" v-model="adviceForm.content" placeholder="请输入标题"></el-input>
          </el-form-item>
          <div class="mrg0L dialog-footer">
            <el-button @click="createTeam = false">{{$t('modal.cancel')}}</el-button>
            <el-button type="primary" @click="submitquestioinForm('adviceForm')">{{$t('modal.submit')}}</el-button>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
</template>

<script>
  import imgCode from '@/components/common_components/img_code'
  import mavonOptions from '@/utils/mavonOptions'

  export default {
    name: 'discussion_handle',
    components:{
      imgCode
    },
    data () {
      return {
        language:localStorage.lang=='EN'?'en':'zh-CN',
        toolbars: mavonOptions,//markdown编辑器的配置项
        input: '',
        showquesModal:false,
        showAdviceModal:false,
        questionForm:{
          name:'',
          logo:'',
          code:'',
          topic:'',
          content:'',
        },
        adviceForm:{
          content:''
        },
        new_img_code:'',
        create_rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          topic:[
            { required: true, message: '请选择或新建至少一个标签', trigger: 'change' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ],
          team_message: [{ required: true, message: this.$t('team.manifestoPlaceholder'), trigger: 'blur' }],
        },
        advice_rules:{
          content: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        },
        options5: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        value10: []
      }
    },
    methods: {
      goAnaswer() {
        this.showquesModal = true;
      },
      submitquestioinForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert(1)
          }
        })
      },
      getImgCode(val){
        this.questionForm.code = val.img_code;
        this.new_img_code = val.img_auth_code;
      },
      showAdvice(){
        this.showAdviceModal = true;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #handle_nav {
        width: 100%
        height: 80px;
        edge-angle()
        background-color: #0d1927;
        border: 1px solid #152e4a;
        margin-bottom: 20px;
        padding: 0 30px;

        .nav_parent {
            float: left

            li {
                line-height: 76px;
                text-decoration: none;
                color: white;
                font-size: 16px;
                display: inline-block;
                cursor: pointer;
                margin-right: 50px;
                .icon{
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 8px;
                }
                .wtw{
                    background: url('~@/assets/img/wtw.png') no-repeat center center;
                    background-size: 100% 100%;
                }
                .xjy{
                    background: url('~@/assets/img/xjy.png') no-repeat center center;
                    background-size: 100% 100%;
                }
            }
            li:hover {
                color: #1390FF;
            }
        }
        .search {
              width: 300px
              height: 40px
              float: right;
              margin: 20px 0px 0 0
          }
    }
</style>
<style lang="stylus" rel="stylesheet/stylus">
  #handle_nav{
    .el-dialog__body{
      padding-right:80px;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      width:150px;
      height:102px;
      display: inline-block;
      background:url('~@/assets/img/team_logo.jpg')no-repeat;
      background-size:100% 100%;
      border:1px solid #053a66;
      border-radius: 5px;
    }
    .avatar-uploader{
      text-align:left;
      height:102px;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 5px;
    }
    .el-icon-plus{
      position:absolute;
      left:160px;
      top:45px;
      width:154px;
      height:30px;
      background:url('~@/assets/img/button/an.png')no-repeat;
      background-size:100% 100%;
      border:none;
      color:#9ccfee;
      line-height: 30px;
    }
    .change_logo_ts{
      color:#293d56;
      position: absolute;
      left: 160px;
      bottom: -8px;
      width: 220px;
    }
    .load_btn{
      display:inline-block;
      vertical-align: bottom;
      text-align: left;
      margin-left:6px;
    }
    .el-form-item{
      margin-bottom:18px;
    }
  }
</style>
