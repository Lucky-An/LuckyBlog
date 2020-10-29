<template>
  <div id="detail_wrap" >
    <div class="sheet_top2">
      <div class="fl past_time detailed">
        <span>{{$t('personal.personal_data')}}</span>
        <i class="star_ico"></i>
      </div>
      <router-link class="returnhome" to="/personal">{{$t('personal.returnhome')}}</router-link>
    </div>
    <div class="form_wrap">
      <div class="ordinary" v-if="to_edit" key="form1">
        <el-form ref="form_data2" :model="form_data2" label-width="160px">
          <div class="avatar-uploader" style="float:none;text-align:center;cursor:default">
            <img :src="form_data2.logo" class="avatar" style="border:4px solid #0080ff;border-radius: 50%;overflow:hidden;display:inline-block">
          </div>
          <el-form-item :label="$t('personal.personalLog.user_name')">
            <span >
                <span  class="whiteC" >{{form_data2.username}}</span>
            </span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.nikeName')">
            <el-input v-model="form_data2.nickname" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.sex')">
            <span v-if="form_data2.sex==null">
                <span  class="whiteC" >{{$t('task.none')}}</span>
            </span>
            <span style="color:white;" v-else>{{form_data2.sex==1? $t('personal.personalLog.woman') : $t('personal.personalLog.man')}}</span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.email')">
            <span class="whiteC">{{form_data2.email}}</span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.phone')">
            <span style="color:white" v-if="form_data2.phone==null||form_data2.phone==''">{{$t('personal.personalLog.unbound')}}</span>
            <span v-else class="whiteC">{{form_data2.phone}}</span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.place')">
            <span style="color:white">
              <span>{{form_data2.country}}</span>
              <span>{{form_data2.state}}</span>
              <span>{{form_data2.city}}</span>
            </span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.short_introduce')">
            <el-input v-model="form_data2.short_introduce" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.school')">
            <el-input v-model="form_data2.school" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.company')">
            <el-input v-model="form_data2.company" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.address')">
            <el-input  v-model="form_data2.address" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.personalinfo')">
            <el-input type="textarea" v-model="form_data2.introduction" :disabled="true"></el-input>
          </el-form-item>
          <div>
            <el-button type="primary" class="submitbtn" @click="to_edit = false">{{$t('personal.personalLog.edit')}}</el-button>
          </div>
        </el-form>
      </div>
      <div v-else class="ordinary" key="form2">
        <el-form ref="form_data" :model="form_data" label-width="160px">
          <el-upload
            class="avatar-uploader"
            style="float:none;"
            action="/api/personal/upload/avatar"
            :headers="{'X-CSRF-Token':csrfToken}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form_data.logo" :src="form_data.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-form-item :label="$t('personal.personalLog.user_name')">
            <span >
                <span  class="whiteC" >{{form_data.username}}</span>
            </span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.nikeName')">
            <el-input v-model="form_data.nickname"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.sex')">
            <el-radio-group v-model="form_data.sex">
              <el-radio label='0' >{{$t('personal.personalLog.man')}}</el-radio>
              <el-radio label='1' >{{$t('personal.personalLog.woman')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.email')">
            <span style="color:white">{{form_data.email}}</span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.phone')">
            <div v-if="form_data.phone==null||form_data.phone==''">
              <span style="color:white;">{{$t('personal.personalLog.unbound')}}</span>
              <span class="bindphone" @click="dialogVisible = true">{{$t('personal.personalLog.bindphone')}}</span>
            </div>
            <!--<el-input v-else v-model="form_data.phone"></el-input>-->
            <span v-else style="color:white;">{{form_data.phone}}</span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.place')">
            <span style="color:white;margin-right:10px;">{{form_data.country}}</span>
            <span style="color:white;margin-right:4px;">{{$t('personal.personalLog.select_add')}}:</span>
            <el-cascader
              :options="options2"
              @change="handleChange"
              @active-item-change="handleItemChange"
              v-model="selectedOptions"
              :props="props2"
            ></el-cascader>
            <span style="color:red;font-size:20px;vertical-align: middle;">*</span>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.short_introduce')">
            <el-input v-model="form_data.short_introduce"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.school')">
            <el-input v-model="form_data.school"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.company')">
            <el-input v-model="form_data.company"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.address')">
            <el-input  v-model="form_data.address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('personal.personalLog.personalinfo')">
            <el-input type="textarea" v-model="form_data.introduction"></el-input>
          </el-form-item>
          <div>
            <el-button type="primary" class="submitbtn" @click="onSubmit">{{$t('personal.personalLog.save')}}</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      :title="$t('dialog_list.validatePhone')"
      :visible.sync="dialogVisible"
      width="640px"
      center
      custom-class="ad_public_modal success_answer nofoot"
    >
      <el-form :model="phone_modal"
               ref="phone_modal"
               size="medium"
               class="demo-ruleForm ordinary"
               style="padding:0 30px;"
      >
        <validate-phone
                        :config="phone_modal.config"
                        @send_parent_phone="get_phone"
                        ref="validate_phone"
                        @send_parent_code="get_code">

        </validate-phone>
        <div style="text-align:center;margin-top:30px;">
          <el-button @click="dialogVisible = false" class="cancel">{{$t('modal.cancel')}}</el-button>
          <el-button class="submitphone" @click="confirm_bind_phone('phone_modal')">{{$t('modal.submit')}}</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">

      </span>
    </el-dialog>
  </div>
</template>

<script>
  import validatePhone from '@/components/common_components/validatePhone'
  import {setStorage,getStorage} from '@/utils/storage'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState,mapMutations } = createNamespacedHelpers('match');

    export default {
      inject:['reload'],
      components:{
        'validate-phone':validatePhone
      },
      name: "DetailedInformation",
      data() {
        return {
          to_edit:false,
          phone_modal:{
            phone:'',
            code:'',
            config:{
              known_phone:false,
              url:'/api/users/send_mobile_captcha/'
            }
          },
          dialogVisible:false,
          options: [],
          selectedOptions: [],
          imageUrl: '',
          form: JSON.parse(localStorage.isUserLogin).user,
          form_data:{
          },
          form_data2:{},
          props: {
            value: 'value',
            children: 'cities'
          },
          options2: [],
          props2: {
            value: 'value',
            label:localStorage.lang=='EN'?'label_en':'label',
            children: 'cities'
          },
          queryList:{//请求地区告诉后端现在的语言状态
            language:localStorage.lang=='EN'?'en':'zh'
          },
        }
      },
      created(){
        this.getdata();
      },
      methods: {
        ...mapMutations(['setData']),
        getdata () {
          this.$http.get('/api/personal/profile_edit')
            .then((res) => {

              if (res.data.sex !== null) {
                res.data.sex = String(res.data.sex);
              }
              this.form_data = res.data;
              this.form_data2 = JSON.parse(JSON.stringify(res.data));
              let exclude_str = ['state', 'city'];
              for (let formDataKey in this.form_data2) {
                if (this.form_data2[formDataKey] == null) {
                  if (!exclude_str.includes(formDataKey)) {
                    this.form_data2[formDataKey] = this.$t('task.none')
                  }
                }
              }
              let params=this.queryList;
              //获取所在国家的省份
              this.$http.get('/api/personal/states?country_id=' + this.form_data2.country_id,{params})
                .then((res2) => {
                  this.options2 = res2.data.rows;
                  if (this.form_data.country == 'China'&&localStorage.lang!='EN') {
                    this.options2.forEach((item, index) => {
                      this.$set(this.options2[index], 'cities', [])
                    })
                  }
                  if (this.form_data.state_id !== null) {
                    if(localStorage.lang!='EN')this.getstate(this.form_data.state_id)
                    this.selectedOptions[0] = this.form_data.state_id
                  }
                  if (this.form_data.city_id !== null) {
                    this.selectedOptions[1] = this.form_data.city_id
                  }
                })
                .catch((err) => {

                })
            })
            .catch((err) => {

            })
        },
        confirm_bind_phone (formName) {
          this.$refs.validate_phone.changeImg();
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.patch('/api/personal/save_phone', {
                phone: String(this.phone_modal.phone),
                verification_code: String(this.phone_modal.code)
              })
                .then((res) => {
                  if (res.data.success) {
                    let getuser = getStorage('isUserLogin', 'object');
                    getuser.user.phone = String(this.phone_modal.phone);
                    setStorage('isUserLogin', getuser);
                    this.form_data.phone = String(this.phone_modal.phone);
                    this.dialogVisible = false;
                    this.$notify.success({
                      title:this.$t('dialog_list.tips'),
                      message:this.$t('team.handle_success'),
                    });
                    // this.$message({
                    //   message: this.$t('team.handle_success'),
                    //   type: 'success'
                    // });
                  }
                })
            }
          })
        },
        get_phone (val) {
          if (val.length != 0) {
            this.phone_modal.phone = Number(val);
          }
        },
        get_code (val) {
          if (val.length != 0) {
            this.phone_modal.code = Number(val);
          }
        },
        handleChange (value) {
          this.form_data.state_id = value[0]
          this.form_data.city_id = value[1] || null;
        },
        handleItemChange (val) {
          if(localStorage.lang!='EN')this.getstate(val[0])
        },
        getstate (id) {
          this.$http.get('/api/personal/citys?state_id=' + id)
            .then((res) => {
              if (res.data.rows.length) {
                for (let i = 0; i < this.options2.length; i++) {
                  if (this.options2[i].value === id) {
                    this.$set(this.options2[i], 'cities', res.data.rows) // right
                    break;
                  }
                }
              }
            })
            .catch((err) => {

            })
        },
        handleAvatarSuccess (res, file) {
          if (res.success) {
            this.form_data.logo = URL.createObjectURL(file.raw);
            this.$http.get('/api/personal/user')
              .then((res) => {
                if (res.data.success) {
                  this.setData({userInformation: res.data.message.user});
                }
              })
              .catch((err) => {

              })
          } else {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('api_message.' + res.message),
            });
            // this.$message.error(this.$t('api_message.' + res.message));
          }
        },
        beforeAvatarUpload(file) {
          var isJPG = false;
          if(file.type === 'image/jpeg'||file.type === 'image/png'||file.type==='image/gif'){
            isJPG = true;
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isJPG) {
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('validateImg.logo_require'),
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
        onSubmit(){
          let testState = this.form_data.state_id;
          if(testState==null||testState==''){
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('personal.personalLog.place_tips'),
            });
            // this.$message.error(this.$t('personal.personalLog.place_tips'));
            return;
          }
          this.$http.patch('/api/personal/profile_edit',this.form_data)
          .then((res)=>{
            if(res.data.success){
              this.getdata();
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message:this.$t('team.handle_success'),
              });
              // this.$message({
              //   message: this.$t('team.handle_success'),
              //   type: 'success'
              // });
              setTimeout(()=>{
                this.to_edit = true;
              },1500)
            }
          })
          .catch((err)=>{
            head_txt
          })
        },
      },
      computed:{
        ...mapState(['userInformation']),
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
  .cancel
    confirm-btn-sm()
    padding:0;
    set_bg('button/anniu.png')
    margin-right:30px;
  .submitphone
    confirm-btn-sm()
    padding:0;
    &:hover{
      background-color: rgba(0,0,0,0)!important;
    }
  #detail_wrap
    padding-top:25px;
    margin:0 auto
    .form_wrap
      position:relative;
      width:100%;
      border: 1px solid #033b6a;
      edge-angle()
      background-color: #0d1927;
      .ordinary
        width:800px;
        margin:0 auto;
        margin-top:20px;
        .avatar-uploader
        .bindphone
          float:right;
          color:lightblue;
          cursor:pointer;
          text-decoration:underline;
        .submitbtn
          width: 204px;
          height: 44px;
          set_bg('~@/assets/img/button/lan1.png')
          text-align: center;
          line-height: 44px;
          color: white;
          border: none;
          font-size: 16px;
          display:block;
          border-radius:0;
          padding:0;
          margin:0 auto;
          margin-top: 30px;
          margin-bottom:30px;
@media (max-width:1300px)
  #detail_wrap
    width:1200px
    .avatar-uploader
      position:absolute;
      left:80px;
      top:25px;
@media (min-width:1300px) and (max-width:1500px)
  #detail_wrap
    width:1200px
    .avatar-uploader
      position:absolute;
      left:80px;
      top:25px;
@media (min-width:1500px) and (max-width:1800px)
  #detail_wrap
    width:1400px
@media (min-width:1800px)
  #detail_wrap
    width:1640px
</style>
<style scoped>
  .sheet_top2 {
    width: 100%;
    height: 62px;
    margin-bottom: 0;
  }
  .sheet_top2 .past_time {
    width: 250px;
    height: 42px;
    background: url('~@/assets/img/layer.png')no-repeat 40px;
    background-size: 100% 100%;
    position: relative;
    text-align: center;
    color: white;
    line-height: 42px;
    padding-left: 65px;
  }
  .detailed span {
    font-size: 18px;
    font-weight: bold;
    color: #65c0f7;
  }
  .detailed .star_ico {
    width: 71px;
    height: 71px;
    background: url('~@/assets/img/4jiao.png')no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    top: -14px;
  }
  .returnhome {
    width: 169px;
    height: 28px;
    background: url('~@/assets/img/button/lv.png')no-repeat;
    background-size: 100% 100%;
    float: right;
    text-align: center;
    line-height: 28px;
    color: #00ffb4;
    margin-top: 10px;
  }

</style>
<style>

 #detail_wrap .avatar-uploader .el-upload {
    border: 4px solid #007be3;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius:50%;
  }
 #detail_wrap .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
 #detail_wrap .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
 #detail_wrap .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
 #detail_wrap .el-input.is-disabled .el-input__inner,.el-textarea.is-disabled .el-textarea__inner{
    color:#2f4c6a!important;
    background-color:#0e233e!important;
    font-family:'微软雅黑',Arial;
   font-weight:normal;
  }
</style>
