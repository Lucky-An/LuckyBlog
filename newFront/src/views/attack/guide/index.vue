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
      guide: ''// 指南
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
      this.$store.dispatch('match/getAttackInfo', data).then(res => {
        // console.log(res)
        // this.guide = res.index
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
  .notice_box{
    padding: 0 200px;
    padding-top: 30px;
  }
</style>
