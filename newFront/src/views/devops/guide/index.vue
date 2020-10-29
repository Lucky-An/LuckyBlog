<template>
  <div class="app-container guide_box">
    <guide :guide="guide" />
  </div>
</template>

<script>
import guide from '@/components/guide'

export default {
  name: 'DevopsGuide',
  components: { guide },
  data() {
    return {
      guide: '' // 指南
    }
  },
  created() {
    this.getMatchInfo()
  },
  methods: {
    getMatchInfo() {
      this.$store
        .dispatch('match/getDevopsInfos', this.$route.query.id)
        .then(res => {
          if (this.$i18n.locale == 'en') {
            this.guide = res.competition_guide_en
          } else {
            this.guide = res.competition_guide_zh
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.guide_box {
  padding: 0 200px;
}
</style>
