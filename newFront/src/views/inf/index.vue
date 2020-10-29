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
      nav: [// 渗透赛的导航栏。
        {
          path: '/inf/guide',
          name: this.$t('header.match.guide'),
          type: 'guide'
        },
        {
          path: '/inf/notice',
          name: this.$t('header.match.notice'),
          type: 'notice'
        },
        {
          path: '/inf/task',
          name: this.$t('header.match.questionBoard'),
          type: 'task'
        },
        {
          path: '/inf/ranking',
          name: this.$t('header.match.ranking'),
          type: 'ranking'
        },
        {
          path: '/inf/trend',
          name: this.$t('header.match.trend'),
          type: 'trend'
        },
        {
          path: '/inf/wp',
          name: this.$t('header.match.upload'),
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
      this.$store.dispatch('match/getInfInfo', { event_id: this.id })
    }
  }
}
</script>

<style scoped>

</style>
