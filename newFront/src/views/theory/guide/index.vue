<template>
  <div class="notice_box">
    <guide :guide="guide" />
  </div>
</template>

<script>
import guide from '@/components/guide'

export default {
  name: 'TheoryGuide',
  components: { guide },
  data() {
    return {
      guide: '', // 指南列表
      isEN: this.$i18n.locale === 'en'
    }
  },
  created() {
    this.getMatchInfo()
  },
  methods: {
    getMatchInfo() {
      this.$store
        .dispatch('match/getTheoryInfo', this.$route.query.hash)
        .then(res => {
          // this.guide = res.index;
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
.notice_box {
  padding: 0 200px;
}
</style>
