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
      nav: [// 解题赛的导航栏。
        {
          path: '/rw/guide',
          name: this.$t('header.match.guide'),
          type: 'guide'
        },
        {
          path: '/rw/notice',
          name: this.$t('header.match.notice'),
          type: 'notice'
        },
        {
          path: '/rw/task',
          name: this.$t('header.match.questionBoard'),
          type: 'task'
        },
        {
          path: '/rw/ranking',
          name: this.$t('header.match.ranking'),
          type: 'ranking'
        },
        {
          path: '/rw/trend',
          name: this.$t('header.match.trend'),
          type: 'trend'
        }
      ]
    }
  },
  created() {
    this.getMathInfo()
  },
  methods: {
    getMathInfo() {
      this.$store.dispatch('match/getRwMatchInfos', this.$route.query.hash)
    }
  }
}
</script>

<style scoped>

</style>
