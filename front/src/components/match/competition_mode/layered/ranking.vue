<template>
  <div>
    <div class="nav_tab_select">
      <countDown
        v-if="is_login"
        style="float:right;margin-top:-35px;margin-right:35px;"
        class="time_wrap"
        :api="api.events"
        :arg="arg"
      ></countDown>
    </div>
    <rankBody
      ref="rank_body"
      :api="api"
      :show_randar="false"
      the_rank_type="layered">
      <div class="rank_full_screen" slot="other_nav" @click="change_nav">
        <span class="fang" v-if="!rank_full"></span>
        <span class="shou" v-else></span>
      </div>
    </rankBody>
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
    allRanks,
    devops_nav,
    devops_data
  } from '@/api/competitionMode/layeredMode'
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
        rank_full:false,
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
      this.getDetail()
    },
    methods: {
      change_nav(){
        this.rank_full = !this.rank_full;
        $('.tab_list').toggle();
        $('.user_handle').toggle();
      },
    },
    computed: {
      ...mapState(['match_data'])
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .rank_full_screen{
    width:32px;
    height:32px;
    background:rgba(255,255,255,.1);
    border-radius 3px;
    position:absolute;
    top:-38px;
    right:0;
    cursor:pointer;
    z-index: 1802;
    .fang,.shou{
      width:20px;
      height:20px;
      display:inline-block;
      margin:0 auto;
      margin-top:6px;
    }
    .fang{
      background:url('~@/assets/img/ad5/layered/quan.png');
      background-size:100% 100%;
    }
    .shou{
      background:url('~@/assets/img/ad5/layered/shou.png');
      background-size:100% 100%;
    }
  }
  .nav_tab_select{
    margin:0 auto;
    background:#212757;
    margin-top:25px;
  }
  .def_logo{
    background:url('~@/assets/img/def_icon.jpg') no-repeat;
    background-size:100% 100%;
  }
  @media(max-width:1300px){
    .nav_tab_select{
      width:1200px;
      li{
        font-size:14px;
      }
    }
  }
  @media(min-width:1300px) and (max-width:1650px){
    .nav_tab_select{
      width:1200px;
      li{
        font-size:14px;
      }
    }
  }
  @media(min-width:1650px){
    .nav_tab_select{
      width:1400px;
      li{
        font-size:16px;
      }
    }
  }
</style>

