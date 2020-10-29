<template>
  <div class="personal_wrap">
    <div class="personal_tops clearfix" v-if="to_personal_edit">
      <div class="top_left">
        <div class="inner">
          <span class="logo"
                :style="{backgroundImage: 'url('+ personform.logo +')',backgroundSize:'cover' }"></span>
        </div>
      </div>
      <div class="top_right">
        <div class="inner">
          <div class="user_author online">
            <span class="label_left">{{$t('ad5.personal.account')}}：</span>
            <span>{{personform.username?personform.username:$t('task.none')}}</span>
          </div>
          <div class="user_role online">
            <span class="label_left">{{$t('ad5.personal.role')}}：</span>
            <span>{{personform.role?personform.role:$t('task.none')}}</span>
          </div>
          <div class="user_group online">
            <span class="label_left">{{$t('ad5.personal.group')}}：</span>
            <span>{{personform.usergroup_name?personform.usergroup_name:$t('task.none')}}</span>
          </div>
          <div class="user_term online">
            <span class="label_left">{{$t('ad5.personal.term')}}：</span>
            <span>{{personform.expire_time?personform.expire_time:$t('task.none')}}</span>
          </div>
          <div class="user_name online">
            <span class="label_left">{{$t('ad5.personal.nikeName')}}：</span>
            <span>{{personform.nickname?personform.nickname:$t('task.none')}}</span>
          </div>
          <div class="user_phone online">
            <span class="label_left">{{$t('ad5.personal.phone')}}：</span>
            <span>{{personform.phone?personform.phone:$t('task.none')}}</span>
          </div>
          <div class="user_idNumber online">
            <span class="label_left">{{$t('ad5.personal.idNumber')}}：</span>
            <span>{{personform.identity_number?personform.identity_number:$t('task.none')}}</span>
          </div>
          <div class="user_email online">
            <span class="label_left">{{$t('ad5.personal.email')}}：</span>
            <span>{{personform.email?personform.email:$t('task.none')}}</span>
          </div>
          <div class="user_short_introduce online">
            <span class="label_left">{{$t('ad5.personal.short_introduce')}}：</span>
            <span>{{personform.introduction?personform.introduction:$t('task.none')}}</span>
          </div>
        </div>
      </div>
      <div class="edit" @click="to_personal_edit=false" v-if="user.role!=='Admin'">{{$t('team.edit')}}</div>
    </div>
    <div class="personal_tops clearfix" v-else>
      <div class="top_left">
        <div class="inner">
          <span class="logo"
                :style="{backgroundImage: 'url('+ personform.logo +')',backgroundSize:'cover' }">
            <span class="to_change" @click="logoVisible=true">
              {{$t('ad5.personal.changeLogo')}}
            </span>
          </span>
          <el-button type="primary" @click="passWordVisible = true">{{$t('personal.changePassword')}}</el-button>
        </div>
      </div>
      <div class="top_right">
        <div class="inner">
          <el-form ref="ruleForm" :rules="rules" :model="edit_personform" label-width="195px">
            <el-form-item :label="$t('ad5.personal.account')+'：'">
              <el-input v-model="edit_personform.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.role')+'：'">
              <el-input v-model="edit_personform.role" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.group')+'：'">
              <el-input v-model="edit_personform.usergroup_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.term')+'：'">
              <el-input v-model="edit_personform.expire_time" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.nikeName')+'：'">
              <el-input v-model="edit_personform.nickname"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.phone')+'：'">
              <el-input v-model="edit_personform.phone"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.idNumber')+'：'">
              <el-input v-model="edit_personform.identity_number"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.email')+'：'">
              <el-input v-model="edit_personform.email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ad5.personal.short_introduce')+'：'">
              <el-input type="textarea" v-model="edit_personform.introduction"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="edit" style="right:120px;" @click="submitForm('ruleForm')">{{$t('modal.submit')}}</el-button>
              <el-button class="cancel" @click="cancel_edit()">{{$t('modal.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      class="my-dialog"
      :title="$t('ad5.personal.changeLogo')"
      width="650px"
      :visible.sync="logoVisible"
    >
      <el-upload
        ref="upload"
        action="customize"
        class="avatar-uploader"
        :http-request="uploadLogo"
        :on-change="changefile"
        accept="image/jpeg,image/png"
        :multiple="false"
        :file-list="fileList"
        :auto-upload="false"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div style="text-align:center;color:#a4a8b3 ">
        {{$t('ad5.personal.logo_accept')}}，{{$t('validateImg.md_size')}}
      </div>
      <div class="submit_handle" >
        <el-button class="confirm_btn" @click="submitUpload()" size="small" type="primary">{{$t('question.submit')}}</el-button>
        <button class="cancel_btn" @click="cancel_change_logo()">{{$t('modal.cancel')}}</button>
      </div>
    </el-dialog>
    <el-dialog
      class="my-dialog changePass"
      :title="$t('ad5.personal.changePass')"
      width="650px"
      :visible.sync="passWordVisible"
    >
      <el-form :model="passWordForm" status-icon :rules="passWordrules" ref="passWordForm" label-width="190px" class="demo-ruleForm">
        <el-form-item :label="$t('ad5.personal.oldPass')+'：'" prop="password">
          <el-input type="password" v-model="passWordForm.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('ad5.personal.newPass')+'：'" prop="password1">
          <el-input type="password" v-model="passWordForm.password1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('ad5.personal.againPass')+'：'" prop="password2">
          <el-input type="password" v-model="passWordForm.password2" autocomplete="off"></el-input>
        </el-form-item>
        <span style="margin-left:180px;">{{$t('ad5.personal.pass_info')}}</span>
        <el-form-item class="submit_handle" >
          <el-button type="primary" @click="submitPassWordForm('passWordForm')">{{$t('question.submit')}}</el-button>
          <el-button class="cancel_btn" @click="passWordVisible=false">{{$t('modal.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--<div class='user_skill mrg30B'>-->
      <!--<div class='skill_charts'>-->
        <!--<box :title="$t('personal.randar')">-->
          <!--<div  slot="content_begin" style="height:100%;">-->
            <!--<chart-->
              <!--:radarData="radarData"-->
              <!--:type_data="type_data"-->
              <!--ref="radarChart"-->
            <!--&gt;</chart>-->
          <!--</div>-->
        <!--</box>-->
      <!--</div>-->
      <!--<div class='signinBox'>-->
        <!--<div class='signIn calendar' id="calendar"></div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<box :title="$t('ad5.personal.task_number')">-->
      <!--<div class="user_data" slot="content_begin">-->
        <!--<div class="q_curve">-->
          <!--<div id="chart_data">-->

          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</box>-->
    <!--<box :title="$t('ad5.personal.record')" style="margin-bottom:30px;">-->
      <!--<div class="tools_table view_path" slot="content_begin" style="padding:30px 30px 10px 30px;">-->
        <!--<el-table-->
          <!--:data="record"-->
          <!--style="width: 100%"-->
        <!--&gt;-->
          <!--<el-table-column-->
            <!--:label="$t('ad5.personal.competition_name')"-->
            <!--prop="name"-->
            <!--width="400">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="mode"-->
            <!--:label="$t('ad5.personal.competition_mode')"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{scope.row.mode==1?$t('selfHelp_competition.self_match') : $t('selfHelp_competition.team_match')}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="type"-->
            <!--:label="$t('ad5.personal.competition_type')"-->
           <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="score"-->
            <!--:label="$t('ad5.personal.score')"-->
            <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="rank"-->
            <!--:label="$t('ad5.personal.rank')"-->
           <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="time"-->
            <!--:label="$t('ad5.personal.time')"-->
            <!--&gt;-->
          <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<div style="margin-top:15px;">-->
          <!--&lt;!&ndash;分页 begin&ndash;&gt;-->
          <!--<pagination-->
            <!--v-show="detail.total>detail.pageSize"-->
            <!--:total="detail.total"-->
            <!--:page.sync="detail.currentPage"-->
            <!--:limit.sync="detail.pageSize"-->
            <!--:layout="detail.layout"-->



          <!--&gt;</pagination>-->
          <!--&lt;!&ndash;分页 end&ndash;&gt;-->
        <!--</div>-->
      <!--</div>-->
    <!--</box>-->
  </div>
</template>

<script>
  import box from '@/components/match/common/small_part/panelBox'
  import chart from '@/components/common_components/personal_chart'
  import pagination from '@/components/common_components/pagination'
  import '../../../../static/js/calendar'
  import {
    personalCenter,
    personalInfo,
    personalLogo,
    personalPass
  } from '@/api/common'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import {setStorage,getStorage} from '@/utils/storage'

  export default {
    components:{
      chart,
      box,
      pagination
    },
    name: "index",
    inject: ['reload'],
    data(){
      var checkOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('旧密码不能为空'));
        }
        setTimeout(() => {
          callback();
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(this.passWordForm.password1.length<6 || this.passWordForm.password1.length>20){
          callback(new Error('密码长度在6-20之间'));
        }else {
          if (this.passWordForm.password2 !== '') {
            this.$refs.passWordForm.validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        }else if(this.passWordForm.password2.length<6 || this.passWordForm.password2.length>20){
          callback(new Error('密码长度在6-20之间'));
        }else if (value !== this.passWordForm.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return{
        passWordForm: {
          password1: '',
          password2: '',
          password: ''
        },
        passWordrules: {
          password1: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          password: [
            { validator: checkOldPass, trigger: 'blur' }
          ]
        },
        to_personal_edit:true,
        logoVisible:false,
        passWordVisible:false,
        personform: {},//个人数据展示
        edit_personform: {},//待编辑的个人数据
        rules: {
          nickname: [
            { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' },
          ],
          email: [
            { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' },
          ],
          phone: [
            { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' },
          ],
          short_introduce: [
            { required: true, message: this.$t('selfHelp_competition.enter_cont'), trigger: 'blur' },
          ],
        },
        imageUrl: '',
        user_detail:null,
        user:getStorage('isUserLogin','object').user,
        type_data:null,
        lineData:{},
        radarData:null,
        lineChart:'',
        randarChart:'',
        fileList:[],
        record:[
          {
            name:'大学生网络攻防传统赛',
            mode:1,//1组队赛，2个人赛
            type:'jad',
            score:800,
            rank:1,
            time:'2019/05/04'
          },
          {
            name:'大学生网络攻防传统赛',
            mode:1,//1组队赛，2个人赛
            type:'jad',
            score:800,
            rank:1,
            time:'2019/05/04'
          }
        ],
        detail: {//表格详细信息页码
          currentPage: 1,//当前第几页
          pageSize: 10,//每页多少条
          total: 12,//总共多少条
          layout: 'prev, pager, next'
        },
      }
    },
    created() {
      // this.$http.get('/api/personal')
      //   .then((res)=>{
      //     if(res.data.success){
      //       let res_data = res.data.message;
      //       this.signRule = res_data.dailyfresh_rule;
      //       this.is_sign = res_data.signin;
      //       this.radarData = res_data.radar_data;
      //       this.radarData.category_name.forEach((item,i)=>{
      //         item.max = 500;
      //       })
      //       this.type_data = res_data.percent_list;
      //       this.honour = res_data.glories;
      //       this.$nextTick(()=>{
      //         this.$refs.radarChart.initRadarChart();
      //       })
      //       this.changeLineChart(this.type_data[0].id);
      //     }
      //   })
      //   .catch((err)=>{
      //
      //   })
      this.user_detail = this.userInformation
      this.ruleForm = this.userInformation;
      this.getPerson();
    },
    methods:{
      cancel_change_logo(){
        this.logoVisible=false;
        this.fileList = [];
      },
      changefile(file,fileList){
        this.$refs.upload.uploadFiles=[this.$refs.upload.uploadFiles[this.$refs.upload.uploadFiles.length-1]]
        var _this = this;
        var event = event || window.event;
        var file = event.target.files[0];
        var reader = new FileReader();
        //转base64
        reader.onload = function(e) {
          _this.imageUrl = e.target.result //将图片路径赋值给src
        }
        reader.readAsDataURL(file);
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      uploadLogo: function (param) { //自定义文件上传
        var fileObj = param.file;
        // FormData 对象
        var form = new FormData();
        // 文件对象
        form.append("logo", fileObj);
        // XMLHttpRequest 对象
        personalLogo(form)
          .then(res=>{
            if(res.data.success){
              this.$notify.success({
                title: this.$t("dialog_list.tips"),
                message: this.$t("select_address.success")
              });
              this.logoVisible = false;
              this.fileList = [];
              this.personform.logo = res.data.logo;
              this.imageUrl = res.data.logo;
            }
          })
      },
      cancel_edit(){
        this.to_personal_edit=true;
        this.edit_personform = JSON.parse(JSON.stringify(this.personform));
      },
      getPerson(){
        personalCenter()
          .then(res=>{
            this.personform = res.data;
            this.edit_personform = JSON.parse(JSON.stringify(res.data));
            this.imageUrl = res.data.logo;
          })
      },
      // 比较数据
      diffDevinfo() {
        let diffData = {};
        for(let k in  this.personform) {
          if(this.personform[k]  !=  this. edit_personform[k]) {
            diffData[k] = this.edit_personform[k];
          }
        }
        return diffData;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let new_params = this.diffDevinfo();
            let formData = new FormData();
            for(var attr in new_params){
              formData.append(attr, new_params[attr]);
            }
            personalInfo(formData)
              .then(res=>{
                  if(res.data.success){
                    this.to_personal_edit = true;
                    this.personform = JSON.parse(JSON.stringify(this.edit_personform));
                    this.$notify.success({
                      title: this.$t("dialog_list.tips"),
                      message: this.$t("select_address.success")
                    });
                    this.reload()
                  }
              })
          } else {
            return false;
          }
        });
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        var isJPG = false;
        if(file.type === 'image/jpeg'||file.type === 'image/png'){
          isJPG = true;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('ad5.personal.logo_accept'),
          });
          // this.$message.error(this.$t('validateImg.logo_require'));
        }
        if (!isLt2M) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('validateImg.size'),
          });
          // this.$message.error(this.$t('validateImg.size'));
        }
        return isJPG && isLt2M;
      },
      changeLineChart(id){
        this.$http.get('/api/personal/chart/'+id)
          .then((res)=>{
            this.lineData = res.data
            this.initLineChart();
          })
          .catch((err)=>{

          })
      },
      initLineChart(){
        //曲线图
        var chart_data = document.getElementById('chart_data');
        this.lineChart = this.$echarts.init(chart_data);
        let new_legend=[];

        this.lineData.legend.forEach((item)=>{
          if(this.$i18n.locale=='CN'){
            new_legend.push(item.name_zh)
          }else{
            new_legend.push(item.name_en)
          }
        })
        var option2 = {
          title: {
            text: ''
          },
          color:['#3074fd','#182a5c','#fe00ff','#007e61'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:new_legend,
            textStyle:{
              color:'white'
            },
            orient:'vertical',
            right:20
          },
          grid: {
            left: '90',
            right: '50',
            bottom: '0',
            containLabel: true,
            top:'30'
          },
          xAxis: {
            name:this.$t('ad5.time'),
            type: 'category',
            boundaryGap: false,
            data: this.lineData.x,
            axisLine:{
              lineStyle:{
                color:'#aaaeb9'
              }
            },
            splitLine:{
              show:true,
              lineStyle: {
                type: 'dashed',
                // 使用深浅的间隔色
                color: ['#323651']
              }
            },
            axisLabel: {
              textStyle: {
                color:'#aaaeb9',
                fontSize:'14'
              },
              rotate:10
            }
          },
          yAxis: {
            name:this.$t('ad5.number'),
            show: true,
            type: 'value',
            splitLine:{
              show:true,
              lineStyle: {
                type: 'dashed',
                // 使用深浅的间隔色
                color: ['#323651']
              }
            },
            axisLine:{
              lineStyle:{
                color:'#aaaeb9'
              }
            },
            axisLabel: {
              textStyle: {
                color:'#aaaeb9',
                fontSize:'14'
              },
            }
          },
          series: []
        };
        this.lineData.data.forEach((item,i)=>{
          if(this.$i18n.locale=='CN'){
            option2.series.push({
              name:item.name_zh,
              type:'line',
              data:item.point_list,
            })
          }else{
            option2.series.push({
              name:item.name_en,
              type:'line',
              data:item.point_list,
            })
          }

        })
        this.lineChart.setOption(option2)
        window.addEventListener('resize',()=>{
          this.lineChart.resize();
        })
      },
      submitPassWordForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            personalPass(this.passWordForm)
              .then(res=>{
                  if(res.data.success){
                    this.$notify.success({
                      title: this.$t("dialog_list.tips"),
                      message: this.$t("select_address.success")
                    });
                    this.passWordVisible = false;
                    this.$router.push({
                      path: '/login',//跳转到登录页重新登录
                    })
                  }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    mounted(){
      setTimeout(()=>{
        $('#calendar').calendar({
          ifSwitch: true, // 是否切换月份
          hoverDate: true, // hover是否显示当天信息
          backToday: true // 是否返回当天
        });
      },500)
    },
    computed:{
      ...mapState(['userInformation'])
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/css/match_theme_color/ad5_attack.styl'
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .avatar-uploader
    text-align:center;
    margin-bottom:20px;
  .avatar-uploader .el-upload {
    border: 1px dashed lightblue;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: lightblue;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .skill_charts .content_wrap{
    height:calc(100% - 48px);
    .dataNums{
      margin-left:3%;
    }
    .dataNums li{
      height:40px!important;
    }
    .ratio_name{
      width:65px!important;
      text-align:right;
      font-size:18px!important;
    }
    .ratio_line{
      margin:0;
      padding-left:20px!important;
      margin-right:20px!important;
      &:before{
        display:none;
      }
      .ratio_num{
        background:#3074fd;
        border-radius 20px;
      }
    }
    .blue_line{
      height:16px;
      background:#12172b;
      border-radius 20px;
    }
  }
  .personal_wrap{
    .personal_tops{
      width:100%;
      padding:80px 40px;
      background:#1b1f3c;
      border-radius 5px;
      margin:20px 0 30px;
      position:relative;
      .top_left{
        width:220px;
        float:left;
        padding-top:16px;
        .inner{
          display:inline-block;
          .logo{
            width:140px;
            height:140px;
            border:2px solid #3074fd;
            border-radius 4px;
            display:inline-block;
            .to_change{
              width:100%;
              height:100%;
              background:rgba(0,0,0,.4);
              color:#fff;
              font-size:16px;
              text-align:center;
              line-height:140px;
              cursor:pointer;
              display:inline-block;
            }
          }
          button{
            width:120px;
            height:36px;
            padding:0;
            margin-top:20px;
          }
        }
      }
      .top_right{
        padding-top:16px;
        width:calc(100% - 300px);
        text-align:left;
        float:left;
        height:100%;
        *{
          color:#fff;
          font-size:16px;
        }
        .label_left{
          width:180px;
          text-align:right;
          margin-right:5px;
          display:inline-block;
        }
        .online{
          margin-bottom:40px;
        }
      }
      .edit{
        width:70px;
        height:36px;
        line-height:36px;
        border-radius 4px;
        position:absolute;
        right:20px;
        top:20px;
        color:#fff!important;
        cursor:pointer;
        background:lightblue!important;
        padding:0;
        border:none!important;
      }
      .cancel{
        width:70px;
        height:36px;
        line-height:36px;
        border-radius 4px;
        position:absolute;
        right:20px;
        top:20px;
        padding:0;
      }
      .avatar-uploader .el-upload {
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width:100%;
        height:100%;
        .avatar{
          width:100%;
          height:100%;
        }
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 16px;
        color: #fff;
        width: 122px;
        height: 122px;
        line-height: 122px;
        text-align: center;
        position:absolute;
        left:0;
        top:0;
        background:rgba(0,0,0,.3);
        font-style:normal;
      }
      .avatar_wrap{
        width:230px!important;
      }
      .avatar-uploader {
        width: 122px;
        height: 122px;
        display: inline-block;
        border-radius 50%;
        overflow hidden;
        border: 2px solid #3074fd;
        float:left;
        margin:-10px 40px 0 60px;
      }
    }
    .el-form{
      text-align:left!important;
    }
    .el-form-item{
      width:100%;
    }
    .el-form-item__content{
      width:50%;
    }
    .el-form-item__label{
      color:#fff;
      font-size:16px;
    }
    .el-textarea__inner,.el-input__inner{
      width:620px;
      height:40px;
      background:rgba(34,38,68,1);
      border:1px solid rgba(48,53,87,1);
      border-radius:4px;
    }
    .el-input.is-disabled .el-input__inner{
      background:rgba(34,38,68,1);
      border:1px solid rgba(48,53,87,1);
      color:#424971;
    }
    .changePass{
      .el-textarea__inner,.el-input__inner{
        width:300px;
        height:40px;
      }
    }
  }

</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .personal_wrap
    width:1200px;
    margin:0 auto;
    .randar_box
      width:100%
      height:300px
      border:1px solid blue
      background:green
      font-size:50px
      color:white
      line-height:300px
      margin-top:30px
    .user_skill
      margin-bottom:30px;
      .skill_charts
        width:calc(100% - 390px);
        height: 100%;
        position: relative;
        float: left;
        .panel_wrap{
          height:100%;
        }
    .user_data
      width: 100%;
      height:270px;
      position: relative;
      margin-bottom:30px;
      .q_curve
        height: 100%;
        float: left;
        padding-top:10px;
        #myTab
          margin:65px 0 35px;
        #chart_data
          width:100%;
          height:calc(100% - 20px);

</style>
<style scoped>

  .user_skill {
    height: 340px;
  }
  .signinBox {
    width: 370px;
    height: 100%;
    float: right;
  }
  .kong img{
    vertical-align: middle;
  }
  @-webkit-keyframes slideShine {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100% 100%;
    }
  }
  .calendar {
    padding: 5px;
    border-radius: 6px;
  }
  .signIn {
    width: 370px;
    height: 340px;
    background: #3074fd;
  }
  .signRule .whiteC{
    color:white;
    margin-top:10px;
  }
  .signRule .orangeC{
    color:#f78701!important;
    margin-top:10px;
    display:inline-block;
  }

  @media (max-width: 1300px) {
     .q_curve{
      width:1115px;
    }
    .gf_typeLine li {
      margin-right:40px;
    }
    .gold_plate li{
      width:140px;
      height:150px;
      padding-top:32px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:85px;
      height:95px;
    }
    .gold_plate li .light_g2{
      width:60px;
      height: 60px;
      top: 54px;
    }
    .gold_plate li .light_g3{
      width: 65px;
      height: 65px;
      top: 50px;
    }
    .gold_plate li .plate_bg img{
      width:55px;
      height:55px;
    }
    .gold_plate li .plate_name{
      width: 110px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
    }
  }
  @media (max-width: 1500px) and (min-width: 1300px) {
    .q_curve{
      width:1115px;
    }
    .gf_typeLine li {
      margin-right:40px;
    }
    .gold_plate li{
      width:140px;
      height:150px;
      padding-top:32px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:85px;
      height:95px;
    }
    .gold_plate li .light_g2{
      width:60px;
      height: 60px;
      top: 54px;
    }
    .gold_plate li .light_g3{
      width: 65px;
      height: 65px;
      top: 50px;
    }
    .gold_plate li .plate_bg img{
      width:55px;
      height:55px;
    }
    .gold_plate li .plate_name{
      width: 110px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
    }
  }
  @media (max-width: 1800px) and (min-width: 1500px){
    .q_curve{
      width:1318px;
    }
    .gf_typeLine li {
      margin-right:50px;
    }
    .gold_plate li{
      width:180px;
      height:192px;
      padding-top:42px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:100px;
      height:115px;
    }
    .gold_plate li .light_g2{
      width:80px;
      height: 80px;
      top: 65px;
    }
    .gold_plate li .light_g3{
      width: 85px;
      height: 85px;
      top: 60px;
    }
    .gold_plate li .plate_bg img{
      width:65px;
      height:66px;
    }
    .gold_plate li .plate_name{
      width:135px;
      height:38px;
      line-height:42px;
      font-size:16px;
    }
  }
  @media (min-width: 1800px) {
    .q_curve{
      width:1500px;
    }
    .gf_typeLine li {
      margin-right:70px;
    }
    .gold_plate li{
      width:230px;
      height:242px;
      padding-top:57px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:123px;
      height:138px;
    }
    .gold_plate li .light_g2{
      width:96px;
      height: 96px;
      top: 83px;
    }
    .gold_plate li .light_g3{
      width: 100px;
      height: 100px;
      top: 76px;
    }
    .gold_plate li .plate_bg img{
      width:65px;
      height:66px;
    }
    .gold_plate li .plate_name{
      width:150px;
      height:38px;
      line-height:42px;
      font-size:16px;
    }
  }
</style>
<style>
  .calendar-date,.calendar-date .item-curMonth{
    background-color:#1b1f3c!important;
    color:#fafbed!important;
  }
  .calendar-date .item{
    background-color:#1b1f3c;
    color:#2e324f;
  }
  .calendar {
    display: none;
    padding: 5px;
    border-radius: 6px;
  }
  .calendar-title {
    position: relative;
    height: 30px;
    line-height: 30px;
    text-align:center;
    margin-bottom:10px;
    margin-top:5px;
  }
  .calendar-title a.title {
    display: inline-block;
    font-size: 20px;
  }
  #backToday {
    position: absolute;
    left: 70%;
    top: 8px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    background-color: rgb(255, 128, 142);
    font-size: 18px;
  }
  .calendar-title .arrow {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    color:#e0dbd5;
  }
  .calendar-title a{
    color:#e0dbd5;
  }
  .calendar-title .arrow span {
    color: #ddd;
    font-size: 18px;
    cursor: pointer;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  .already_sign {
    background-image: url('~@/assets/img/personal/quan.png');
    background-repeat: no-repeat;
    background-position:center center;
  }
  .calendar-title .arrow span:hover {
    color: #c2c2c2;
  }
  .calendar-title .arrow-prev {
    float: left;
    margin-left:38px;
    margin-top:5px;
  }
  .calendar-title .arrow-next {
    float: right;
    margin-right:38px;
    margin-top:5px;
  }
  .calendar-week,
  .calendar-date {
    overflow: hidden;
    padding:0;
  }
  .calendar-week .item,
  .calendar-date .item {
    float: left;
    width: 51px;
    height: 43px;
    line-height: 43px;
    text-align: center;
  }
  .calendar-week {
    margin:0;
    font-size: 12px;
    background:#1b1f3c;
    color:#fff;
  }
  .calendar-week li{
    height:27px!important;
    line-height:27px!important;
  }
  .calendar-date {}
  .calendar-date .item {
    cursor: pointer;
    font-size: 14px;
  }
  .calendar-date .item:hover,
  .calendar-date .item-curMonth:hover {
    background-color: #f0f0f0;
  }
  .calendar-date .item-curMonth {
    color: #333;
  }
  .calendar-date .item-curDay,
  .calendar-date .item-curDay:hover {
    color: #fff!important;
    background-color: #3074fd!important;
  }
  .calendar-date .item-selected,
  .calendar-date .item-selected:hover {
    color: #FFF!important;
    background: #164e89!important;
  }
  .calendar-today {
    display: none;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 90px;
    height: 48px;
    padding: 6px 10px;
    background-color: rgb(255, 128, 142);
    border-radius: 5px;
  }
  .calendar-today .triangle {
    position: absolute;
    top: 50%;
    left: -16px;
    margin-top: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: transparent rgb(255, 128, 142) transparent transparent;
  }
  .calendar-today p {
    color: #fff;
    font-size: 14px;
    line-height: 24px;
  }
</style>
<style scoped>
  .submit_handle{
    margin-top:35px!important;
  }
  .submit_handle  button{
    width:80px!important;
    height:36px!important;
    line-height: 36px!important;
    padding:0!important;
  }

  /*签到动画*/
  .gold_box{
    width:230px;
    height:235px;
    background:url('~@/assets/img/personal/plate.png')no-repeat;
    background-size:100% 100%;
    margin:0 auto;
    margin-top:10px;
    text-align:center;
    position:relative;
    transform-style: preserve-3d;
    transition: 1.5s;
    transform-origin: center;
  }
  .gold_box .full{
    animation:.6s gold_box_shake linear;
    position:relative;
    z-index:1;
  }
  .light_rot,.light_rot2{
    width:100%;
    height:150px;
    background:url('~@/assets/img/personal/guang5.png')no-repeat;
    background-size:100% 100%;
    display:inline-block;
    position:absolute;
    right:18px;
    top:8px;
    z-index:2;
    transform-origin:center bottom;
    opacity:0;
    transition:4.2s;
  }
  .light_rot{
    animation:2s rot_light linear infinite alternate;
  }
  .light_rot2{
    animation:2s rot_light2 linear infinite alternate;
  }
  @keyframes rot_light{
    0%{
      transform:rotate(-5deg)
    }
    50%{
      transform:rotate(5deg)
    }
    100%{
      transform:rotate(0deg)
    }
  }
  @keyframes rot_light2{
    0%{
      transform:rotate(5deg)
    }
    50%{
      transform:rotate(-5deg)
    }
    100%{
      transform:rotate(0deg)
    }
  }
  @keyframes gold_box_shake{
    0%{
      transform:translateX(-25px)
    }
    6%{
      transform:translateX(25px)
    }
    10%{
      transform:translateX(-21px)
    }
    15%{
      transform:translateX(21px)
    }
    20%{
      transform:translateX(-15px)
    }
    27%{
      transform:translateX(15px)
    }
    34%{
      transform:translateX(-12px)
    }
    44%{
      transform:translateX(12px)
    }
    54%{
      transform:translateX(-5px)
    }
    66%{
      transform:translateX(5px)
    }
    78%{
      transform:translateX(-3px)
    }
    85%{
      transform:translateX(2px)
    }
    100%{
      transform:translateX(0)
    }
  }
  /*勋章样式*/
  .gold_plate{
    padding-left:70px;
    padding-top:40px;
    float:left;
    width:calc(100% - 80px)
  }
  .gold_plate li{
    background:url('~@/assets/img/personal/plate.png')no-repeat;
    background-size:100% 100%;
    text-align:center;
    float:left;
    position:relative;
    margin-bottom:30px;
  }
  .gold_plate li .light_g2{
    background: url('~@/assets/img/personal/n1.png')no-repeat;
    background-size: 100% 100%;
    text-align: center;
    display: inline-block;
    position: absolute;
    left: 0;
    right:0;
    margin:auto;
    z-index: 10;
    animation:2.5s gold2 linear infinite;
  }
  .gold_plate li .light_g3{
    background: url('~@/assets/img/personal/n2.png')no-repeat;
    background-size: 100% 100%;
    text-align: center;
    display: inline-block;
    position: absolute;
    left: 0;
    right:0;
    margin:auto;
    z-index: 10;
    animation:2.1s gold3 linear infinite;
  }
  @keyframes gold{
    0%{
      transform:rotate(0)
    }
    100%{
      transform:rotate(360deg);
    }
  }
  @keyframes gold2{
    0%{
      transform:scale(1.3) rotate(0);
      opacity:0;
    }
    15%{
      opacity:1;
      transform:scale(1.5) rotate(0);
    }
    95%{
      transform:scale(2.6) rotate(20deg);
    }
    100%{
      opacity:0;
    }
  }
  @keyframes gold3{
    0%{
      transform:scale(1.8) rotate(0);
      opacity:0;
    }
    15%{
      opacity:1;
      transform:scale(1.9) rotate(0);
    }
    95%{
      transform:scale(2.5) rotate(-20deg);
    }
    100%{
      opacity:0;
    }
  }
  .gold_plate li .plate_bg{
    background:url('~@/assets/img/personal/goldbj.png')no-repeat;
    background-size:100% 100%;
    text-align:center;
    padding-top:15%;
    display:inline-block;
    position:relative;
    z-index:1;
  }
  .gold_plate li .plate_name{
    background:url('~@/assets/img/personal/xzmc.png')no-repeat;
    background-size:100% 100%;
    text-align:center;
    color:#d66b0d;
    font-weight:bold;
    margin-top:12px;
    display:inline-block;
  }
</style>
