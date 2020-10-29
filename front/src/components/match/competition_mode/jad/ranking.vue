<template>
  <div>
    <div class="nav_tab_select">
      <countDown
        v-if="is_login"
        style="float:right;margin-top:-35px;margin-right:20px;"
        class="time_wrap"
        :api="api.events"
        :arg="arg"
      ></countDown>
    </div>
    <rankBody  ref="rank_body"  :api="api" :show_randar="true" the_rank_type=""></rankBody>
  </div>
</template>

<script>
  import pagination from '@/components/common_components/pagination'
  import {createNamespacedHelpers} from 'vuex'
  const {mapState} = createNamespacedHelpers('match')
  import rankBody from '../../common/competition_rank'
  import countDown from '@/components/common_components/countDown.vue'
  import {getStrNumber} from '@/common/js/common'

  import {
    events,
    ranks,
    rank_tasks,
    tasks_detail,
    devops_nav,
    devops_data
  } from '@/api/competitionMode/solvingMode'
  export default {
    name: 'ranking',
    components: {
      rankBody,
      countDown,
      pagination
    },
    data () {
      return {
        is_login:localStorage.isUserLogin,
        getStrNumber,
        arg:this.$route.query.hash,
        api:{
          events:events,
          ranks:ranks,
          rank_tasks:rank_tasks,
          tasks_detail:tasks_detail,
        },
        subject: {//题目列表
          rows: []
        },
        rows: [//排行榜列表
        ],
        gridData: [//被点击的列表
        ],
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 1500,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next'
        },
        matchData: {},//比赛详细信息
        detail: {//表格详细信息页码
          currentPage: 1,//当前第几页
          pageSize: 10,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next'
        },
        dialogTableVisible: false,//表格弹窗
        radarData: {//个人技能参数
          indicator: [],
          val: []
        },
        detailQuery: {//获取个人详情发送的参数
          evt: this.$route.query.event,
          limit: 1,
          offset: 0
        },
        userId: '',//点击的用户id
        eventHash: '',//赛事hash,
      }
    },
    created () {
    },
    methods: {

    },
    computed: {
      ...mapState(['match_data'])
    },
  }
</script>


