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
          path: '/jad/guide',
          name: this.$t('header.match.guide'),
          type: 'guide'
        },
        {
          path: '/jad/notice',
          name: this.$t('header.match.notice'),
          type: 'notice'
        },
        {
          path: '/jad/task',
          name: this.$t('header.match.questionBoard'),
          type: 'task'
        },
        {
          path: '/jad/ranking',
          name: this.$t('header.match.ranking'),
          type: 'ranking'
        },
        {
          path: '/jad/trend',
          name: this.$t('header.match.trend'),
          type: 'trend'
        },
        {
          path: '/jad/wp',
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
      this.$store.dispatch('match/getjadInfo', this.$route.query.hash)
    }
  }
}
</script>

<style scoped>

</style>
