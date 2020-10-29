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
          path: '/referee/realWorld/examine',
          name: this.$t('header.match.examine'),
          type: 'examine'
        },
        {
          path: '/referee/realWorld/ranking',
          name: this.$t('header.match.ranking'),
          type: 'ranking'
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
