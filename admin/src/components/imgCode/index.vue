<template>
  <div style="text-align:left;cursor: pointer">
    <img :src="uidImg" alt="" height="40" class="mrg10L" @click="initUUid()">
  </div>
</template>

<script>
export default {
  name: 'ImgCode',
  props: [],
  data() {
    return {
      uidImg: '',
      uuid: ''
    }
  },
  created() {
    this.initUUid()
  },
  mounted() {

  },
  methods: {
    // 用于生成uuid
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid() {
      return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4())
    },
    initUUid() {
      this.axios.get('/api/v1/common/web/auth/image_code?image_code_id=' + this.guid())
        .then((res) => {
          this.uidImg = '/api/v1/common/web/auth/image_code?image_code_id=' + this.guid()
          this.$emit('changeCode', {
            img_auth_code: this.uidImg.split('image_code_id=')[1]
          })
        })
        .catch((err) => {

        })
    },
    getImgCode() {
      this.$emit('sendImgCode', {
        img_code: this.uuid,
        img_auth_code: this.uidImg.split('image_code_id=')[1]
      })
    }
  }
}
</script>

<style >
  .login-container .code_box img{
    display: block;
    width: 100%;
    height: 50px;
  }

</style>
