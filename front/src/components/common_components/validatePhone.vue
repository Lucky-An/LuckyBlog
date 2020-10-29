<template>
  <div class="u_gold">
    <div class="valiPhone">
      <div class="img_validate">
        <label class="el-form-item__label" style="margin-left:-5px;" >{{$t('validatePhone.imgValidate')}}</label>
        <img_code @sendImgCode="getImgCode" ref="changs"></img_code>
      </div>
      <el-form-item :label="$t('validatePhone.phone')" prop="phone"
                    :rules="create_rules.phone"
                    class="imphone"
      >
        <el-input
              v-model="createruleForm.phone"
              @input="write_phone"
              style="width:220px;float:left;"
              v-if="!config.known_phone"
              :placeholder="$t('validatePhone.placeholderPhone')"></el-input>
        <span v-else class="fl">{{config.phone.substring(0,3)+'****'+config.phone.substring(7,11)}}</span>
        <div class="fl send_ma" v-if="createruleForm.validate_phone.can_send"
             @click="validate_phone">{{$t('validatePhone.sendma')}}</div>
        <div class="fl send_ma" v-else>{{$t('validatePhone.resend')}}<span v-text="createruleForm.validate_phone.time"></span>s</div>
      </el-form-item>
      <el-form-item :label="$t('validatePhone.code')" prop="code"
                    :rules="create_rules.code"
      >
        <el-input v-model="createruleForm.code"
                  style="width:220px;float:left;"
                  @input="write_code"
                  :placeholder="$t('validatePhone.placeholder')"></el-input>
      </el-form-item>
    </div>
  </div>
</template>

<script>
  import img_code from './img_code'
  export default {
    components:{
      img_code
    },
    name: 'gold',
    props:['config'],//需要父级传一个配置项1.known_phone:是否已知手机号，2.如果已知手机号，phone手机号，3.请求接口url
    data(){
      return{
        createruleForm:{
          phone:'',
          code:'',
          validate_phone:{
            can_send:true,
            time:60
          }
        },
        create_rules:{
          code: [
            { required: true, message: this.$t('validatePhone.placeholder'), trigger: 'blur' },
          ],
        },
        img_data:{}
      }
    },
    created(){
      let that =this;
      if(!this.config.known_phone){
        this.create_rules.phone = [
            { required: true, message: this.$t('validatePhone.placeholderPhone'), trigger: 'blur' },
            {validator:function(rule,value,callback){
                if(/^1[123456789]\d{9}$/.test(value) == false){
                  callback(new Error(that.$t('validatePhone.phoneNumber')));
                }else{
                  callback();
                }
              }, trigger: 'blur'}
          ]
      }
    },
    methods: {
      changeImg(){
        this.$refs.changs.initUUid();
      },
      getImgCode(val){
        this.img_data.uuid = val.img_code;
        this.img_data.code = val.img_auth_code;
      },
      test_phone(pone){
        var myreg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
        if (!myreg.test(pone)) {
          return false;
        } else {
          return true;
        }
      },
      write_phone(){
         this.$emit('send_parent_phone',this.createruleForm.phone)
      },
      write_code(){
        this.$emit('send_parent_code',this.createruleForm.code)
      },
      http_get(){
        if(this.config.phone)this.createruleForm.phone=this.config.phone;
        this.$http.post(this.config.url+this.createruleForm.phone,{
          code:this.img_data.uuid,
          uuid:this.img_data.code
        })
          .then((response)=>{
            if(response.data.success){
              let timers = null;
              const validate_code = this.createruleForm.validate_phone;
              validate_code.can_send = false;
              var that = this;
              timers = setInterval(function() {
                validate_code.time--;
                if(validate_code.time<1){
                  clearInterval(timers);
                  validate_code.can_send = true;
                  validate_code.time = 60;
                }
              },1000)
            }
          }).catch((err)=>{

        })
      },
      validate_phone(){
        if(!this.img_data.uuid&&!this.img_data.code){
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message:this.$t('dialog_list.write_img_code'),
          });
          // this.$message.error('请输入图片验证码');
          return;
        }
        if(this.config.known_phone){
          this.http_get();
        }else{
          if(this.test_phone(this.createruleForm.phone)){
            this.http_get();
          }else{
            this.$notify.error({
              customClass:'error_notify',
              title:this.$t('public.error'),
              message:this.$t('validatePhone.phoneNumber'),
            });
            // this.$message.error(this.$t('validatePhone.phoneNumber'));
          }
        }
      },
    },

  }
</script>

<style scoped>
  .el-form-item{
    margin-top:12px;
  }
  .send_ma{
    padding: 0 15px;
    height: 28px;
    background: url('~@/assets/img/button/lv.png')no-repeat;
    background-size: 100% 100%;
    border: none;
    margin-left: 20px;
    line-height: 28px;
    text-align:center;
    margin-top:3px;
    cursor:pointer;
  }

</style>
<style>
  .valiPhone .img_validate .el-input{
    width:220px!important;
  }
  .valiPhone .img_validate img{
    height:30px;
    margin-left:16px!important;
  }
  .valiPhone .img_validate label{
    height:30px;
    line-height:30px;
  }
</style>
