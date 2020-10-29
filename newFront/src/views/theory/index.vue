<template>
  <!-- 理论赛 -->
  <div>
    <taskHeader :nav="nav" />
    <router-view />
  </div>
</template>

<script>
import taskHeader from '@/components/taskHeader'

export default {
  name: 'Theory',
  components: {
    taskHeader
  },
  data() {
    return {
      id: this.$route.query.id,
      nav: [
        // 理论赛的导航栏。
        {
          path: '/theory/guide',
          name: this.$t('header.match.guide'),
          type: 'guide'
        },

        {
          path: '/theory/task',
          name: this.$t('header.match.questionBoard'),
          type: 'task'
        }
      ]
    }
  },
  created() {
    this.getMathInfo()
  },
  methods: {
    getMathInfo() {
      this.$store.dispatch('match/getTheoryInfo', this.$route.query.hash)
    }
  }
}
</script>

<style scoped>
</style>
