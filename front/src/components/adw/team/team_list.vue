<template>
  <div class='scoreboardList' id="team_list" v-cloak>
    <div class="handle_btn clearfix">
      <button id="create_team_btn" @click="create_team" v-if="!is_has_team" v-cloak>{{$t('team.createTeam')}}</button>
      <div class="team_search_handle">
        <div class="search_box">
          <input type="text" :placeholder="$t('team.search.placeholder')"
                 @keydown.13='search_team'
                 v-model="search.search_word"
          >
        </div>
        <button class="search_btn" @click="search_team">
          {{$t('team.search.btn')}}
        </button>
      </div>
    </div>
    <div class="gf-table posRelative special cursor" >
      <img src="@/assets/img/biaotou.png" alt="" class="table_head">
      <div class="table_content specialTable">
        <el-table
          :data="tableData"
          v-loading="loadingUsergroupList"
          :element-loading-text="$t('team.table.loading')"
          border
          @row-click="rowclickhandle"
          style="width: 100%;cursor:pointer;" v-cloak>
          <el-table-column
            label=" "
            type=index
            width="120" :index="indexMethod">
          </el-table-column>
          <el-table-column
            :label="$t('team.table.team')"
            width="220">
            <template slot-scope="scope">
              <div class="text-left" >
                <span class="team_logo" :style="{backgroundImage:'url(' + scope.row.logo_url + ')'}"></span>
                <span v-text="scope.row.name.length>10 ? scope.row.name.substr(0,10)+'…' : scope.row.name"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="team_leader_name"
            :label="$t('team.table.team_leader')">
          </el-table-column>
          <el-table-column
            prop="team_member_number"
            :label="$t('team.table.team_number')">
          </el-table-column>
          <el-table-column
            prop="point"
            :label="$t('team.table.team_points')">
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('team.table.create_time')">
          </el-table-column>
          <el-table-column
            label=""
            v-if="!is_has_team"
            width="230">
            <template slot-scope="scope"  >
              <button class="apply_join lg_blue_btn"
                      @click.stop="apply_join_event($event,scope.$index,scope.row)"
                      v-if="notapply(scope.row.id)" >
                {{$t('team.apply')}}
              </button>
              <span class="apply_join lg_blue_btn" style="display:inline-block"  v-else>
                                {{$t('team.applyed')}}
                            </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="margin-top:30px;">
        <v-page
                v-show="pager.total>pager.pageSize"
                :total="pager.total"
                :page.sync="pager.currentPage"
                :limit.sync="pager.pageSize"
                :layout="pager.layout"

                @pagination="getList"
        ></v-page>
    </div>
    <!--创建队伍弹框-->
    <el-dialog
      :title="$t('team.createTeam')"
      :visible.sync="createTeam"
      width="700px"
      custom-class="ad_public_modal createdmodal" >
      <el-form :model="createruleForm" :rules="create_rules"
               ref="createruleForm"
               label-width="100px"
               size="medium"
               class="demo-ruleForm"
      >
        <el-form-item :label="$t('team.team_name')" prop="name">
          <el-input v-model="createruleForm.name" :placeholder="$t('team.createTeamPlaceholder')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('team.team_logo')" prop="logo" >
          <div id="uploader_logo" class="clearfix fl">
            <div id="imgWrap" style="margin-right:15px;">
              <img :src="createruleForm.logo==null ? '../../../../static/img/team_logo.jpg':createruleForm.logo" id="uploadImg1" alt="">
            </div>
            <div class="file_wrap">
              <input type="file" name="" id="changefile" @change="changeupload">
              <span class="moni_btn">选择图片</span>
            </div>
          </div>
        </el-form-item>
        <div class="valiPhone2" :class="{'padLeft':$i18n.locale=='CN'}">
          <v-phone
            :config = createruleForm.config
            @send_parent_phone="get_phone"
            @send_parent_code="get_code"
            v-if="show_code_validate"
            ref="validatePhone"
          ></v-phone>
        </div>
        <el-form-item :label="$t('team.table.team_manifesto')" prop="team_message">
          <el-input type="textarea" v-model="createruleForm.team_message"  :placeholder="$t('team.manifestoPlaceholder')"></el-input>
        </el-form-item>
        <div class="mrg0L dialog-footer">
          <el-button @click="createTeam = false">{{$t('modal.cancel')}}</el-button>
          <el-button type="primary" @click="submitcreateForm('createruleForm')">{{$t('modal.submit')}}</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!--申请加入弹框-->
    <el-dialog
      :title="$t('team.apply')"
      :visible.sync="applyTeam"
      width="700px"
      custom-class="ad_public_modal applymodal" >
      <div class="team_detail mrg15B">
        <span class="other_team_logo" :style="{backgroundImage:'url(' + apply_team_info.team_logo + ')'}">
        </span>
        <div class="other_team_name mrg10T font18 mrg5B">
          <span class="">{{$t('team.table.team')}}：</span><span v-text="apply_team_info.team_name"></span>
        </div>
        <div class="font16 mrg5T">
          <span>{{$t('team.table.teamId')}}：</span><span v-text="apply_team_info.team_id"></span>
        </div>
      </div>
      <el-form :model="applyruleForm" :rules="join_rules" ref="applyruleForm"  class="demo-ruleForm apply_message mrg15T ">
        <el-form-item :label="$t('team.addmessage')" prop="desc">
          <el-input type="textarea" v-model="applyruleForm.desc" :placeholder="$t('team.addmessagePlaceholder')"></el-input>
        </el-form-item>
        <div class="mrg0L pad20T dialog-footer">
          <el-button @click="applyTeam = false">{{$t('modal.cancel')}}</el-button>
          <el-button type="primary" @click="submitjoinForm('applyruleForm')">{{$t('modal.submit')}}</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
  import {setStorage,getStorage} from '@/utils/storage'
  import page from '@/components/common_components/pagination'
  import phone from '@/components/common_components/validatePhone'
export default {
  name: "team_list",
  components:{
    'v-page':page,
    'v-phone':phone
  },
  data() {
    return {
      applyTeam:false,
      createTeam:false,
      pager: {//页码
        currentPage: 1,//当前第几页
        pageSize: 10,//每页多少条
        total: 0,//总共多少条
        layout: 'prev, pager, next',
        class:'bluepage'
      },
      tableData: [],
      page_config:{
        now_page_num:1,
        page_size:10
      },
      create_modal:{
        id:'created_team_modal',
        header:{
          title:this.$t('team.createTeam')
        },
        clickBg_nohidden:true,
      },
      applyJoin_modal:{
        id:'applyJoin_modal',
        header:{
          title:this.$t('team.apply')
        },
        clickBg_nohidden:true,
      },
      apply_team_info:{
        team_logo:'',
        team_name:'',
        team_id:''
      },
      applyruleForm: {
        desc: '',
        apply_index:''
      },
      join_rules: {
        desc: [
          { required: true, message: this.$t('team.addmessagePlaceholder'), trigger: 'blur' }
        ]
      },
      createruleForm:{
        name:'',
        logo:null,
        phone:getStorage('isUserLogin','object').user.phone,
        code:'',
        team_message:'',
        config:{
          known_phone: true,
          phone:getStorage('isUserLogin','object').user.phone,
          url:'/api/users/send_mobile_captcha/'
        }
      },
      create_rules: {
        name: [{ required: true, message: this.$t('validateform.name'), trigger: 'blur' }],
        // phone:[
        //   { required: false, message: '请输入手机号', trigger: 'blur' },
        //   { min: 11, max: 11, message: '请输入11位号码', trigger: 'blur' },
        //   {type: 'number',message: '号码必须为数字'}
        // ],
        code: [
          { required: true, type: 'number', message: this.$t('validateform.name'), trigger: 'blur' },
          {type: 'number',message: this.$t('validateform.number')}
        ],
        team_message: [{ required: true, message: this.$t('team.manifestoPlaceholder'), trigger: 'blur' }],
      },
      imageUrl: '',
      img_src:"",
      search_word2:'',
      search:{
        search_word:'',
      },
      pagination_data:{
        click_url:'/x_person/api/teams/',
        list_total:0,
        page_length:10,
        show_page:false
      },
      header:{},
      is_has_team:getStorage('isUserLogin','object').team.has_team,
      show_create_btn:false,
      loadingUsergroupList:true,
      applyList:[],
      testList:[],
      show_code_validate:getStorage('isUserLogin','object').user.is_china,
      formImage:null
    }
  },
  created(){
    get_data({
      limit:this.pager.pageSize,
      offset:(this.pager.currentPage-1)*this.pager.pageSize,
      key:''
    },this,()=>{
      this.loadingUsergroupList = false;
    })
    this.formImage = new FormData();
  },
  methods:{
    changeupload(file){
      var f = file.target.files[0];
      var filePath = f.name //获取到input的value，里面是文件的路径
      let fileSize = f.size;
      fileSize=Math.round(fileSize/1024*100)/100; //单位为KB
      let fileFormat = filePath.split('.')[1].toLowerCase()
      // 检查是否是图片
      if( !fileFormat.match(/png|jpg|jpeg/) ) {
        this.$message({
          type: 'success',
          message: '上传错误,文件格式必须为：png/jpg/jpeg'
        });
        return
      }
      if(fileSize>=200){
        this.$message({
          type: 'success',
          message: '照片最大尺寸为200KB，请重新上传!'
        });
        return
      }
      var reads = new FileReader();
      reads.readAsDataURL(f);
      reads.onload = function(e) {
        document.getElementById('uploadImg1').src = this.result;
      }
      // 文件对象
      this.formImage.delete("team_logo");
      this.formImage.append("team_logo", f);
    },
    getList (val) {//接收组件传递出的变化
      this.loadingUsergroupList = true;
      get_data({
        limit:this.pager.pageSize,
        offset:(this.pager.currentPage-1)*this.pager.pageSize,
        key:this.search_word2
      },this,()=>{
        this.loadingUsergroupList = false;
      })
    },
    notapply(id){
      return this.applyList.indexOf(Number(id))==-1;
    },
    rowclickhandle(row,columnIndex){
      this.$router.push({path:'/team/detail',query: {id: row.id}})
    },
    create_team(){
      if(this.show_code_validate&&getStorage('isUserLogin','object').user.phone===''){
        let alertTitle = this.$i18n.locale=='CN' ? '请到<a href="/personal/detail" style="color:#0080ff;margin-left:5px;margin-right:5px;">个人中心</a>绑定手机号再来创建战队吧' : 'Please go to the<a href="/personal/detail" style="color:#0080ff;margin-left:5px;margin-right:5px;">personal center</a> and bind your cell phone number to create a team.'
        this.$alert(alertTitle, this.$t('el.messagebox.title'), {
          customClass:'public_confirm public_confirm_sm text-center',
          showConfirmButton:false,
          confirmButtonText: this.$t('modal.confirm'),
          dangerouslyUseHTMLString: true,
        });
      }else{
        this.createTeam = true;
      }
    },
    apply_join_event(e,i,team_detail){
      this.apply_team_info.team_logo = team_detail.logo_url;
      this.apply_team_info.team_name = team_detail.name;
      this.apply_team_info.team_id = team_detail.id;
      this.applyruleForm.apply_index = i;
      this.applyTeam = true;
    },
    submitjoinForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/api/teams/user_records',{
            team_id:this.apply_team_info.team_id,
            content:this.applyruleForm.desc
          }).then((response)=>{
            if(response.data.success){
              var add_id = this.tableData[this.applyruleForm.apply_index].id;
              this.applyList.push(add_id);
              // this.$message({
              //   message: this.$t('team.applysuccess'),
              //   type: 'success'
              // });
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message: this.$t('team.applysuccess'),
              });
              this.applyruleForm.desc = '';
              this.applyTeam = false;
            }
          }).catch((err)=>{

          });
        } else {
          return false;
        }
      });
    },
    get_phone(val){
      if(val.length!=0){
        this.createruleForm.phone = Number(val);
      }
    },
    get_code(val){
      if(val.length!=0){
        this.createruleForm.code = Number(val);
      }
    },
    submitcreateForm(formName){
      if(this.show_code_validate){
        this.$refs.validatePhone.changeImg();
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formImage.delete('team_name')
          this.formImage.delete('verification_code')
          this.formImage.delete('declaration')
          this.formImage.delete('phone')
          this.formImage.append('team_name',this.createruleForm.name)
          this.formImage.append('verification_code',String(this.createruleForm.code))
          this.formImage.append('declaration',this.createruleForm.team_message)
          this.formImage.append('phone',String(this.createruleForm.phone))
          this.$http.post('/api/teams/list',this.formImage)
            .then((response)=>{
              if(response.data.success){
                this.$notify.success({
                  title:this.$t('dialog_list.tips'),
                  message: this.$t('team.createTeamSuccess'),
                });
                let login_data = getStorage('isUserLogin','object');
                login_data.team.has_team = true;
                login_data.team.data = response.data.message;
                setStorage('isUserLogin',login_data)
                this.$router.push({path:'/team/homepage'});
              }
            })
            .catch((err)=>{

            })
        } else {
          return false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      if(res.success){
        this.img_src = res.path;
        this.imageUrl = URL.createObjectURL(file.raw);
      }else{
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message: this.$t('api_message.'+res.message),
        });

        // this.$message.error(this.$t('api_message.'+res.message));
      }
    },
    beforeAvatarUpload(file) {
      var isJPG = false;
      if(file.type === 'image/jpeg'||file.type === 'image/png'||file.type==='image/gif'){
        isJPG = true;
      }
      const isLt2M = file.size / 1024 < 200;
      if (!isJPG) {
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message: this.$t('validateImg.file'),
        });

        // this.$message.error(this.$t('validateImg.file'));
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
    cleartxt(){
      this.applyruleForm.desc = '';
    },
    search_team(){
      this.pager.currentPage = 1;
      this.pager.total = 0;
      this.loadingUsergroupList = true;
      get_data({
        key:this.search.search_word,
        limit:this.pager.pageSize,
        offset:(this.pager.currentPage-1)*this.pager.pageSize
      },this,()=>{
        this.loadingUsergroupList = false;
        this.search_word2 = this.search.search_word;
        // this.search.search_word = '';
      })
    },
    init_list(pagelist){
      this.tableData = pagelist.list;
      this.page_config.now_page_num = pagelist.page;
    },
    indexMethod(index){
      return (this.pager.currentPage-1)*this.pager.pageSize+index+1;
    },
  },
  computed:{
    csrfToken(){
      var arr,reg=new RegExp("(^| )"+'X-CSRF-Token'+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    }
  }
}
var get_data = (arg,that,callback)=>{
    that.tableData = [];
  that.$http.get('/api/teams/list',{
    params:arg
  }).then((response)=>{
    // 响应成功回调
    let data = response.data;
    that.tableData = data.rows;
    that.applyList = data.apply_list;
    that.pager.total = data.total;
    data.total>that.pagination_data.page_length? that.pagination_data.show_page = true : that.pagination_data.show_page = false;
    if(callback){
      callback()
    }
  }).catch((err)=>{

  });
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #team_list
    width:1200px
    margin:30px auto 0
</style>
<style lang="stylus">
  #imgWrap {
    overflow: hidden;
    float: left;
    border-radius: 5px;
    width:80px;
    height:80px;
    border:1px solid #409EFF;
  }
  #imgWrap img{
    width:100%;
    height:100%;
  }
  #changefile{
    position:absolute;
    left:0;
    top:0;
    z-index:2;
    line-height: 38px;
    opacity:0;
  }
  .file_wrap{
    width:75px;
    height:38px;
    overflow: hidden;
    float:left;
    margin-right:20px;
    position:relative;
  }
  .moni_btn{
    width:75px;
    height:38px;
    background:#409EFF;
    color:white;
    line-height:38px;
    text-align:center;
    position:absolute;
    z-index:0;
    left:0;
    top:0;
    border-radius:6px;
  }
  #team_list{
    .padLeft{
      .img_validate{
        padding-left:28px;
      }
    }
    #create_team_btn,.btn_blue{
      background:url('~@/assets/img/button/list_btn.png') no-repeat;
      border:none;
      background-size:100% 100%;
      font-size:16px;
      font-weight:bold;
      float:left;
      color:white;
      text-align: center;
      &:hover{
         color:white;
       }
    }
    .handle_btn{
      margin-bottom:20px;
      .team_search_handle{
        width:345px;
        height:46px;
        float:right;
        .search_box{
          width:228px;
          height:46px;
          border:1px solid #053a66;
          border-right:none;
          float:left;
          input{
            color:white;
            width:100%;
            height:100%;
            background:none;
            border:none;
            padding:5px 12px;
          }
        }
      .search_btn{
        color:white;
        width:117px;
        height:46px;
        background:url('~@/assets/img/button/list_btn.png') no-repeat;
        background-size:100% 100%;
        float: right;
        text-align: center;
        line-height: 46px;
        font-size:16px;
        border:none;
        cursor:pointer;
        &:before{
         content:'';
         display: inline-block;
         clear:both;
         width:22px;
         height:22px;
         vertical-align: middle;
         background:url('~@/assets/img/list_search.png')no-repeat;
         background-size:100% 100%;
        }
      }
  }
      #create_team_btn,.btn_blue{
        width:150px;
        height:40px;
        line-height: 40px;
        cursor:pointer;
      }
      .handle_btn{
        margin-bottom:10px;
      }
    }
    .team_logo{
      border:1px solid white;
      background-size:cover;
      background-position: center center;
      display: inline-block;
      vertical-align: middle;
    }
    th{
      border-right:none!important;
    }
    td{
      border-right:1px solid #043a68;
      .cell{
        color:white;
        background:none;
      }
    }
    .el-table--border{
      border:none;
    }
  }
  .createdmodal,.applymodal{
    .el-textarea__inner, .el-input__inner {
      background: #0d223d!important;
      resize: none!important;
      border-color: #053a66!important;
      color: #6682a6;
      font-family:'微软雅黑'
    }
    .el-dialog__body{
      padding-left:60px;
      padding-right:60px;
      padding-bottom:0;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-form-item__label{
      color:#45779a;
    }
    .team_name,.team_logo,.test_phone,.team_motto{
      margin-bottom:15px;
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
    .el-upload__input{
      opacity: 0;
      display: none;
    }
    .change_logo_ts{
      color:#293d56;
      position: absolute;
      left: 160px;
      bottom: -8px;
      width: 320px;
      text-align:left;
    }
    .load_btn{
      display:inline-block;
      vertical-align: bottom;
      text-align: left;
      margin-left:6px;
    }
    .modal-footer{
      text-align: center;
      border-top:none;
      padding-bottom:30px;
    }
    .team_detail{
      text-align:center;
      .other_team_logo{
        width:150px;
        height:150px;
        border:1px solid #053c65;
        border-radius: 5px;
        display:inline-block;
        background-size:cover;
        background-repeat: no-repeat;
      }
      .other_team_name{
        color:#0096fd;
        font-weight:bold;
      }
    }
  }
</style>
<style>
  .valiPhone2 .img_validate .el-input{
    width:220px!important;
  }
  .valiPhone2 .img_validate img{
    height:30px;
    margin-left:16px!important;
  }
  .valiPhone2 .img_validate label{
    height:30px;
    line-height:30px;
    margin-left:5px!important;
  }
  .valiPhone2 .el-input__inner{
    height:36px;
    line-height:36px;
  }
</style>
