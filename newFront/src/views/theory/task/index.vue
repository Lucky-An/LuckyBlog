<template>
  <div class="taskContainer">
    <PlayerInfo :show-rank="false" :show-score="match.is_review_shows&&match.process===2" />
    <taskCard />
  </div>
</template>

<script>
import PlayerInfo from '@/components/PlayerInfo'
import taskCard from './taskCard'
import { mapGetters } from 'vuex'

export default {
  name: 'TheoryTask',
  components: {
    PlayerInfo,
    taskCard
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['match'])
  }

}
</script>

<style scope>
.taskContainer {
  width: 80%;
  height: 100%;
  min-width: 1366px;
  margin: 15px auto 0;
}
</style>
