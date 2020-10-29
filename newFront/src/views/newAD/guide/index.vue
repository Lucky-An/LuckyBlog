<template>
  <div class="notice_box">
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
      guide: '', // 指南
      isEN: this.$i18n.locale === 'en'
    }
  },
  created() {
    this.getMatchInfo()
  },
  methods: {
    getMatchInfo() {
      const data = {
        event_id: this.$route.query.id,
        evt: this.$route.query.hash
      }
      this.$store.dispatch('match/getNewADMatchInfos', data).then((res) => {
        if (this.isEN) {
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
