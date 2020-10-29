<template>
    <span style="color:white;float:left;margin:16px 15px;cursor: pointer;" class="change_lang">
        <span @click="change_lang_cn" :class="{'active':lang_statu}">中</span>
        <span>/</span>
        <span @click="change_lang_en" :class="{'active':!lang_statu}">En</span>
    </span>
</template>

<script>
  export default {
    name: 'switchLanguage',
    data(){
      return{
        lang_statu:true,
      }
    },
    inject:['reload'],
    created(){
      if(localStorage.lang=='EN')this.lang_statu=false;
    },
    methods:{
      change_lang_cn(){//切换中英文按钮改变语言
        this.$i18n.locale = 'CN'
        localStorage.lang = 'CN'
        this.lang_statu = true
        this.reload()
      },
      change_lang_en(){//切换中英文按钮改变语言d
        this.$i18n.locale = 'EN'
        localStorage.lang = 'EN'
        this.lang_statu = false
        this.reload()
      },
    }
  }
</script>

<style scoped>
    .active {
        color: #0080ff;
    }

</style>
