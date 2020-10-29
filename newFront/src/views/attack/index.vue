<template>
  <div>
    <taskHeader :nav="nav" />
    <router-view />
  </div>
</template>

<script>
import taskHeader from '@/components/taskHeader'

export default {
  name: 'Match',
  components: {
    taskHeader
  },
  data() {
    return {
      id: this.$route.query.id,
      nav: [
        // 解题赛的导航栏。
        {
          path: '/attack/guide',
          name: this.$t('header.match.guide'),
          type: 'guide'
        },
        {
          path: '/attack/notice',
          name: this.$t('header.match.notice'),
          type: 'notice'
        },
        {
          path: '/attack/task',
          name: this.$t('header.match.questionBoard'),
          type: 'task'
        },
        {
          path: '/attack/ranking',
          name: this.$t('header.match.ranking'),
          type: 'ranking'
        },
        {
          path: '/attack/attackRanking',
          name: this.$t('header.match.attack'),
          type: 'attackRanking'
        },
        {
          path: '/attack/trend',
          name: this.$t('header.match.trend'),
          type: 'trend'
        },
        {
          path: '/attack/wp',
          name: 'WP',
          type: 'wp'
        }
      ]
    }
  },
  created() {
    this.getMathInfo()
  },
  methods: {
    getMathInfo() {
      const data = {
        event_id: this.$route.query.id,
        evt: this.$route.query.hash
      }
      this.$store.dispatch('match/getAttackInfo', data)
    }
  }
}
</script>

<style scoped>
</style>
