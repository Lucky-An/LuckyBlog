<template>
  <div style="text-align:left;cursor: pointer">
    <el-input type="input" v-model="uuid" style="width:200px;" :placeholder="$t('validateform.code')" @input="getImgCode"></el-input>
    <img :src="uidImg" alt="" height="40" @click="initUUid()" class="mrg10L">
  </div>
</template>

<script>
  import {prefix_url} from '@/api/urlPrefix'

  export default {
    name: 'img_code',
    props:['project'],
    data(){
      return{
        uidImg:'',
        uuid:'',
        prefix_url,
        now_url:''
      }
    },
    created(){
      this.initUUid();
    },
    methods: {
      clearUUid(){
        this.uuid='';
      },
      //用于生成uuid
      S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      },
      guid() {
        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
      },
      initUUid(){
        this.$http.get(this.prefix_url+'auth/image_code?image_code_id=' + this.guid())
          .then((res)=>{
            this.uidImg  = this.prefix_url+'auth/image_code?image_code_id=' + this.guid()
            this.$emit('changeCode',{
              img_auth_code:this.uidImg.split('image_code_id=')[1],
            })
          })
          .catch((err)=>{

          })
      },
      getImgCode(){
        this.$emit('sendImgCode',{
          img_code:this.uuid,
          img_auth_code:this.uidImg.split('image_code_id=')[1],
        })
      }
    },
    mounted () {

    }
  }
</script>

<style>

</style>
