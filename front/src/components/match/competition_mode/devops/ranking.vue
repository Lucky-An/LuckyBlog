<template>
  <div>
    <rankBody  ref="rank_body"  :api="api" :show_rank="true" :not_click_row="true"></rankBody>
  </div>
</template>

<script>
  import rankBody from '../../common/competition_rank'
  import {
    dev_matchStatus,
    ranks,
    rank_tasks,
    tasks_detail
  } from '@/api/competitionMode/devopsMode'
  export default {
    name: 'ranking',
    components: {
      rankBody
    },
    data () {
      return {
        api:{
          events:dev_matchStatus,
          ranks:ranks,
          rank_tasks:rank_tasks,
          tasks_detail:tasks_detail
        }
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>


