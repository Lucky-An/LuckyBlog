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
          path: '/newAttack/guide',
          name: this.$t('header.match.guide'),
          type: 'guide'
        },
        {
          path: '/newAttack/notice',
          name: this.$t('header.match.notice'),
          type: 'notice'
        },
        {
          path: '/newAttack/task',
          name: this.$t('header.match.questionBoard'),
          type: 'task'
        },
        {
          path: '/newAttack/ranking',
          name: this.$t('header.match.ranking'),
          type: 'ranking'
        },
        {
          path: '/newAttack/attackRanking',
          name: this.$t('header.match.attack'),
          type: 'newAttackRanking'
        },
        {
          path: '/newAttack/trend',
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
      const data = {
        event_id: this.$route.query.id,
        evt: this.$route.query.hash
      }
      this.$store.dispatch('match/getNewADMatchInfos', data)
    }
  }
}
</script>

<style scoped>
</style>
