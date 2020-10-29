<template>
  <span style="color:white;float:left;cursor: pointer;" class="change_lang">
    <span :class="{'active':lang_statu}" @click="change_lang_cn">中</span>
    <span>/</span>
    <span :class="{'active':!lang_statu}" @click="change_lang_en">En</span>
  </span>
</template>

<script>
export default {
  name: 'SwitchLanguage',
  data() {
    return {
      lang_statu: true
    }
  },
  inject: ['reload'],
  created() {
    if (localStorage.lang == 'en') this.lang_statu = false
  },
  methods: {
    change_lang_cn() { // 切换中英文按钮改变语言
      this.$i18n.locale = 'zh'
      localStorage.lang = 'zh'
      this.lang_statu = true
      this.reload()
    },
    change_lang_en() { // 切换中英文按钮改变语言d
      this.$i18n.locale = 'en'
      localStorage.lang = 'en'
      this.lang_statu = false
      this.reload()
    }
  }
}
</script>

<style scoped>
    .active {
        color: #0080ff;
    }

</style>
