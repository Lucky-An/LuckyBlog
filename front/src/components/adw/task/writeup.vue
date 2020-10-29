<template>
  <div class="writeup wrap_size">
    <div class="writeup_title">
      {{$t('task.writeup.lookWriteup')}}
    </div>
    <div class="writeup_content">
      <button class="upload_writeup" @click="uploadWriteup" v-if="needWriteup">{{$t('task.writeup.uploadWriteup')}}</button>
      <el-row class="content_parent">
        <el-col class="writeup_table" :span="9">
          <div class="grid-content bg-purple">
            <div class="clearfix" style="height:30px;margin-bottom:20px;margin-top:12px;" v-if="official.has_writeup">
              <div class="fl" style="font-size:18px;color:#0080ff" >{{$t('task.writeup.official_wp')}}</div>
              <button class="upload_writeup fr" style="margin-top:0" @click="look_offical_wp">{{$t('task.writeup.writeupTable.look')}}</button>
            </div>
            <div class="table_height">
              <el-table
                :data="tableData"
                :row-class-name="addActive"
                :height=table_height
                style="width: 100%">
                <el-table-column
                  :label="$t('task.writeup.writeupTable.index')"
                  width="50"
                  type="index"
                >
                </el-table-column>
                <el-table-column
                  prop="thinking"
                  :label="$t('task.writeup.writeupTable.thinking')"
                  width="140"
                >
                  <template slot-scope="scope" >
                    <div v-if="scope.row.thinking==null">{{$t('task.none')}}</div>
                    <div  v-else>{{scope.row.thinking.length>8 ? scope.row.thinking.substring(0,8)+'…' : scope.row.thinking}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="thumb_up"
                  :label="$t('task.writeup.writeupTable.fabulous')">
                  <template slot-scope="scope">
                    <div>
                      <span class="zan" :class="{'zan1':isZan.includes(scope.row.id)}"
                            @click="zanHandle(scope.row,scope.row.id)"></span>
                      <span>{{scope.row.thumb_up}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="uploader"
                  :label="$t('task.writeup.writeupTable.uploader')"
                >
                </el-table-column>
                <el-table-column
                  :label="$t('task.writeup.writeupTable.handle')"
                >
                  <template slot-scope="scope">
                    <div class="look_writeup" @click="look_writeup(scope.row.id)" v-if="scope.row.writeup.indexOf('media')==-1">{{$t('task.writeup.writeupTable.look')}}</div>
                    <a class="look_writeup" v-else :href="scope.row.writeup">{{$t('task.writeup.writeupTable.look')}}</a>

                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col class="writeup_about" :span="15">
          <div class="grid-content bg-purple-light">
            <div class="thinkabout" style="text-align:left">
              <el-scrollbar style="height:100%;">
                <div v-if="!init_number">
                  <div v-if="official.wp_type==3" style="text-align:center;">
                    <img :src="official.data" alt="" width="90%">
                  </div>
                  <div v-if="official.wp_type==2">
                    <!--<iframe :src="'/static/pdf/web/viewer.html?file='+show_writeup.writeup_content" width="100%" height="560" frameborder="0"></iframe>-->
                    <iframe :src="official.data" width="100%" height="560" frameborder="0"></iframe>
                  </div>
                  <div v-if="official.wp_type==1||official.wp_type==4" v-html="official.data" v-highlight>

                  </div>
                </div>
                <div v-else>
                  <div v-if="show_writeup.writeup_type==3" style="text-align:center;">
                    <img :src="show_writeup.writeup_content" alt="" width="90%">
                  </div>
                  <div v-if="show_writeup.writeup_type==2">
                    <!--<iframe :src="'/static/pdf/web/viewer.html?file='+show_writeup.writeup_content" width="100%" height="560" frameborder="0"></iframe>-->
                    <iframe :src="show_writeup.writeup_content" width="100%" height="560" frameborder="0"></iframe>
                  </div>
                  <div v-if="show_writeup.writeup_type==1||show_writeup.writeup_type==4" v-html="show_writeup.writeup_content" v-highlight>

                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :title="$t('task.writeup.uploadWriteup')"
      :visible.sync="writeupShow"
      width="700px"
      custom-class="ad_public_modal writeup" >
      <div class="task_info clearfix">
        <div class="clearfix">
          <div class="task_title">
            {{$t('task.taskTitle')}}：{{upload_writeup.task_name}}
          </div>
          <div class="task_star ">
            <span>{{$t('task.difficulty')}}</span>
            <span class="star" v-for="item in upload_writeup.task_weight"></span>
          </div>
        </div>
        <el-form :model="writeupForm" :rules="writeupRules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="Writeup" prop="file">
            <el-upload
              class="upload-demo"
              ref="upload"
              :http-request="uploadFile"
              :limit="1"
              :on-remove="remove"
              :on-change="changes"
              accept='.png,.pdf,.md'
              action="customize"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" style="margin-left:0;" class="btn">{{$t('task.writeup.selectFile')}}</el-button>
              <div slot="tip" class="el-upload__tip">{{$t('task.writeup.upload_rule')}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('validatePhone.imgValidate')" prop="image_code" style="margin-bottom:-20px;">
            <imgCode @changeCode="changeCode" @sendImgCode="getImgCode"  ref="imgCode"></imgCode>
          </el-form-item>
        </el-form>
        <el-input
          style="margin-top:20px;"
          :placeholder="$t('task.writeup.upload_tips')"
          maxlength="20"
          v-model="upload_writeup.thinking">
        </el-input>
        <div class="gold_tips">
          <span>{{$t('task.writeup.uploader_txt')}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="writeupShow = false">{{$t('modal.cancel')}}</el-button>
        <el-button type="primary" @click="submitUpload('ruleForm')">{{$t('modal.submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import imgCode from '@/components/common_components/img_code'
  export default {
    components:{
      imgCode
    },
    name: "writeup",
    data(){
      return {
        writeupForm: {
          image_code_id: '',
          image_code: '',
          event:this.$route.query.event,
          file:'',
        },
        writeupRules: {
          image_code: [
            { required: true, message: this.$t('dialog_list.write_img_code'), trigger: 'blur' },
          ],
          file: [
            { required: true, message: this.$t('task.writeup.uploadWriteup'), trigger: 'change' }
          ],
        },
        needWriteup:false,
        isZan:[],
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        writeupShow:false,
        tableData: [],
        table_height:0,
        thumb_up_number:0,
        upload_writeup:{
          task_name:'',
          task_weight:0,
          upload_writeup_price:0,
          attach_url:'',
          thinking:'',
        },
        show_writeup:{
          writeup_type:0,
          writeup_content:''
        },
        official:{
          has_writeup:false,
          data:'',
          wp_type:0
        },
        init_number:0,
        checked_id:''
      }
    },
    created(){
      this.$http.get('/api/tasks/writeups',{
        params:{
          task_id:this.$route.query.id
        }
      })
        .then((res)=>{
          if(res.data.success){
            this.tableData = res.data.message;
            // if(res.data.official_writeup){
            //   this.official.has_writeup = true;
            //   this.official.data = res.data.official_writeup.data;
            //   switch(res.data.official_writeup.type){
            //     case 'md':this.official.wp_type = 1;
            //       this.official.data = this.$marked(res.data.official_writeup.data);
            //       break;
            //     case 'pdf':this.official.wp_type = 2;
            //       this.official.data = res.data.official_writeup.data;
            //       break;
            //     case 'png':this.official.wp_type = 3;
            //       this.official.data = res.data.official_writeup.data;
            //       break;
            //     case 'html':this.official.wp_type = 4;
            //       this.official.data = res.data.official_writeup.data;
            //       break;
            //   }
            // }else{
              this.look_writeup(res.data.message[0].id);
            // }
            this.thumb_up_number = res.data.message.filter((item)=>{
              return item.has_thumb_up == true;
            }).length;
            res.data.message.forEach((item,i)=>{
              if(item.has_thumb_up){
                this.isZan.push(item.id);
              }
            })
          }
        })
        .catch((err)=>{

        })
      this.$http.get('/api/tasks/'+this.$route.query.id)
        .then((res)=>{
          if(res.data.success){
            this.needWriteup = res.data.message.need_writeup;
            this.upload_writeup.task_name = res.data.message.name;
            this.upload_writeup.task_weight = Math.round(res.data.message.weight_score);
            this.upload_writeup.upload_writeup_price = res.data.message.upload_writeup_price;
          }
        })
        .catch((err)=>{

        })
    },
    methods:{
      uploadFile(params){
        const _file = params.file;
        const isLt2M = _file.size / 1024 / 1024 < 2;
        let isJPG
        if(_file.type === 'image/png'||_file.type === 'application/pdf'){
          isJPG = true;
        }else if(_file.name.endsWith('.md')){
          isJPG = true;
        }else{
          isJPG = false;
        }
        // 通过 FormData 对象上传文件
        var formData = new FormData();
        formData.append("writeup", _file);
        if (!isJPG) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('validateImg.md'),
          });
          return false;
        }
        if (!isLt2M) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('validateImg.md_size'),
          });
          return false;
        }
        formData.append('image_code_id',this.writeupForm.image_code_id)
        formData.append('image_code',this.writeupForm.image_code)
        formData.append('task_id',this.$route.query.id)
        formData.append('thinking',this.upload_writeup.thinking)
        this.$http.post('/api/tasks/writeups',formData).then(ress => {
          let res = ress.data;
          if(res.success){
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('task.writeup.upload_success'),
            });
            this.writeupShow = false;
            this.writeupForm.file='';
            this.writeupForm.image_code_id='';
            this.writeupForm.image_code='';
            this.upload_writeup.thinking='';
            this.$refs.imgCode.clearUUid();
            this.$refs.upload.clearFiles()
          }
        })
      },
      changes(file){
        this.writeupForm.file=file;
      },
      remove(){
        this.writeupForm.file='';
        this.$refs.upload.clearFiles()
      },
      beforeAvatarUpload(file) {
        $('.el-upload-list').hide();
        let isJPG
        if(file.type === 'image/png'||file.type === 'application/pdf'){
          isJPG = true;
        }else if(file.name.endsWith('.md')){
          isJPG = true;
        }else{
          isJPG = false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('validateImg.md'),
          });
          // this.$message.error(this.$t('validateImg.md'));
        }
        if (!isLt2M) {
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('validateImg.md_size'),
          });
          // this.$message.error(this.$t('validateImg.md_size'));
        }
        return isJPG && isLt2M;
      },
      geturl(response, file, fileList){
        if(response.success){
          $('.el-upload-list').show();
          this.upload_writeup.attach_url = response.path;
        }else{
          this.$refs.upload.clearFiles();
          let str = String(response.message);
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('api_message.'+str),
          });
          // this.$message.error(this.$t('api_message.'+str));
        }
      },
      getImgCode(val){
        this.writeupForm.image_code = val.img_code;
        this.writeupForm.image_code_id = val.img_auth_code;
      },
      changeCode (val) {//切换验证码
        this.writeupForm.image_code_id = val.img_auth_code
      },
      uploadError(err, file, fileList){
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message:err.message,
        });
        // this.$message.error(err.message);
      },
      look_offical_wp(){
        this.init_number = 0;
        this.checked_id = '';
      },
      addActive(row,rowIndex){
        if(row.row.id==this.checked_id){
          return 'active'
        }
      },
      look_writeup(id){
        this.init_number = 1;
        this.$http.get('/api/tasks/ask_writeup/'+id)
          .then((res)=>{
            switch(res.data.type){
              case 'md':this.show_writeup.writeup_type = 1;
                this.show_writeup.writeup_content = this.$marked(res.data.data);
                break;
              case 'pdf':this.show_writeup.writeup_type = 2;
                this.show_writeup.writeup_content = res.data.data;
                break;
              case 'png':this.show_writeup.writeup_type = 3;
                this.show_writeup.writeup_content = res.data.data;
                break;
              case 'html':this.show_writeup.writeup_type = 4;
                this.show_writeup.writeup_content = res.data.data;
                break;
            }
          })
          .catch((err)=>{

          })
        this.checked_id = id;
      },
      uploadWriteup(){
        this.writeupShow = true;
      },
      handleRemove(file, fileList) {

      },
      handlePreview(file) {

      },
      beforeRemove(file, fileList) {
        return this.$confirm(this.$t('task.writeup.remove_tips')+` ${ file.name }？`);
      },
      zanHandle(item,id){//点赞
        if(this.thumb_up_number<3){
          if(!this.isZan.includes(item.id)){
            this.$http.post('/api/tasks/writeups/'+id)
              .then((res)=>{
                if(res.data.success){
                  this.isZan.push(item.id);
                  item.has_thumb_up = true;
                  item.thumb_up = res.data.message;
                  this.thumb_up_number++;
                  this.tableData.sort((a, b) => b.thumb_up - a.thumb_up)
                }
              })
              .catch((err)=>{

              })
          }
        }else{
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('task.writeup.thumb_tips'),
          });
          // this.$message.error(this.$t('task.writeup.thumb_tips'));
        }
      },
      submitUpload(formName) {
        this.$refs.imgCode.initUUid();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs.upload.submit();
          } else {
            return false;
          }
        });
      },
      upload_writeup_handle(){
        this.$http.post('/api/tasks/writeups',{
          task_id: this.$route.query.id,
          thinking: this.upload_writeup.thinking,
          writeup: this.upload_writeup.attach_url
        })
          .then((res)=>{
            if(res.data.success){
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message:this.$t('task.writeup.upload_success'),
              });
              // this.$message({
              //   type: 'success',
              //   message: this.$t('task.writeup.upload_success')
              // });
              this.writeupShow = false;
              this.tableData.push(res.data.message)
            }
          })
          .catch((err)=>{

          })
      }
    },
    mounted () {
      let h = $('.content_parent').height();
      let that = this;
      that.table_height = h-24;
      window.onresize=function(){
        let h = $('.content_parent').height();
        that.table_height = h-24;
      }
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


</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .writeup
    color:white;
    .zan
      width:16px;
      height:18px;
      set_bg('dz.png');
      display:inline-block;
      vertical-align:-2px;
      cursor:pointer;
    .zan1
      width:16px;
      height:18px;
      set_bg('dz1.png');
      display:inline-block;
      vertical-align:-2px;

    .writeup_title
      font-size:18px;
      background:url('~@/assets/img/xian.png')no-repeat center bottom;
      padding-bottom:12px;
      margin-top:40px;
      text-align:center;
    .writeup_content
      .upload_writeup
        float:right;
        margin-top:-60px;
        confirm-btn-md()
        color:fontSkyblue
        cursor:pointer;
      .content_parent
        margin-top:30px;
        border:1px solid inputBorderColor;
        .el-col
          height:100%;
          .grid-content
            padding:12px;
            background:#0e233e;
            height:100%;
        .writeup_table
          .grid-content
            border-right:1px solid inputBorderColor;
            .look_writeup
              color:lightblue;
              cursor:pointer;
        .thinkabout
          background:#0e233e;
          height:100%;
      .table_height
        height:calc(100% - 50px);
    .task_info
      padding:0 50px;
      .task_title
        float:left;
        font-size:16px;
      .task_star
        margin-bottom:25px;
        font-size:16px;
        float:left;
        margin-left:40px;
        .star
          width:14px;
          height:13px;
          background:url('~@/assets/img/answer/xingxing1.png')no-repeat;
          background-size:100% 100%;
          display:inline-block;
          vertical-align:middle;
      .upload-demo
        text-align:left;
      .gold_tips
        color:placeholderColor;
        text-align:left;
        margin-top:20px;
        .gold
          color:color-yellow;
          font-weight:bold;
          font-size:18px;
    @media (max-width:1300px)
      .content_parent
        height:500px;
    @media (min-width:1300px) and (max-width:1500px)
      .content_parent
        height:500px;
    @media (min-width:1500px) and (max-width:1800px)
      .content_parent
        height:550px;
    @media (min-width:1800px)
      .content_parent
        height:700px;
  .el-message-box
    background-color:lightblue;
    border:1px solid darkblue;
</style>
<style lang="stylus"  rel="stylesheet/stylus">
    .writeup{
      .ad_public_modal{
        .el-input__inner{
          border:1px solid #023b68!important;
          background: #0e233e;
        }
      }
    }
    .writeup_content{
        .el-upload .el-button{
            padding:9px 210px;
        }
        .el-upload-list__item:hover{
            background:#08325a;
        }
        .el-upload-list__item .el-icon-close{
            color:#fff;
        }
        .el-upload-list__item.is-success .el-upload-list__item-name:hover{
            color:#fff;
        }
        .writeup .el-dialog__title{
            color:white;
        }
        .el-table,.el-table th,.el-table tr{
            background-color: #0e233e!important;
        }
        .el-table td,.el-table th{
            text-align:center;
        }
        .el-table td, .el-table th.is-leaf {
            border-bottom: 1px solid #053b69;
        }
        .cell{
            color:white;
        }
        .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #1a3455;
        }
        .el-table{
            height:100%!important;
        }
        .el-table::before{
            height:0;
        }
      .el-scrollbar__wrap {
         overflow-x: hidden;
      }
      tr.active td{
        background-color: #1a3455;
      }
    }

</style>
