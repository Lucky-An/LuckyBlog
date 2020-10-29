<template>
  <div class="app-container guide_box">
    <guide :guide="guide" />
  </div>
</template>

<script>
import guide from '@/components/guide'

export default {
  name: 'NoticeList',
  components: { guide },
  data() {
    return {
      guide: ''// 指南
    }
  },
  created() {
    this.getMatchInfo()
  },
  methods: {
    getMatchInfo() {
      this.$store.dispatch('match/getjadInfo', this.$route.query.hash).then(res => {
        if (this.$i18n.locale == 'en') {
          this.guide = res.competition_guide_html_en
        } else {
          this.guide = res.competition_guide_html_zh
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .guide_box{
    padding: 0 200px;
  }
</style>
