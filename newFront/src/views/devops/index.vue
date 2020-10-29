<template>
  <div>
    <taskHeader :nav="nav" />
    <router-view />
  </div>
</template>

<script>
import taskHeader from '@/components/taskHeader'

export default {
  name: 'Devops',
  components: {
    taskHeader
  },
  data() {
    return {
      id: this.$route.query.id,
      nav: [
        // 运维赛的导航栏。
        {
          path: '/devops/guide',
          name: this.$t('header.match.guide'),
          type: 'guide'
        },
        {
          path: '/devops/notice',
          name: this.$t('header.match.notice'),
          type: 'notice'
        },
        {
          path: '/devops/task',
          name: this.$t('header.match.questionBoard'),
          type: 'task'
        },
        {
          path: '/devops/ranking',
          name: this.$t('header.match.ranking'),
          type: 'ranking'
        },
        {
          path: '/devops/trend',
          name: this.$t('header.match.trend'),
          type: 'trend'
        },
        {
          path: '/devops/wp',
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
      this.$store.dispatch('match/getDevopsInfos', this.$route.query.id)
    }
  }
}
</script>

<style scoped>
</style>
