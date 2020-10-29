<template>
  <div class="solving_type">
    <div style="position:relative;" class="header_wraps">
      <div class="logoIsCenter" >
        <div class="header logoCenter" >
          <span class="ad_logo" >
            <img :src="spectatorData.logo" v-if="spectatorData.logo" alt="" width="240" height="53">
          </span>
        </div>
      </div>
    </div>
    <div class="all_rank guide_wrap">
      <div class="spectator_title">
        <span style="font-size:24px;font-weight:bold;margin-right:13px;">观众席</span>
        <span style="font-size:16px;" v-if="spectatorData.list.length">（当前有{{spectatorData.list.length}}场进行中赛事可供查看）</span>
      </div>
      <ul class="spectator_list">
        <li v-for="(item,index) in spectatorData.list">
          <span class="spectator_index">{{index+1}}</span>
          <span class="spectator_name marque_box" v-if="getStrNumber(item.name_zh,15,9)">
            <span>{{ item.name_zh}}</span>
          </span>
          <span class="spectator_name marque_box" v-else>
              <span
                class="marquee"
              >{{ item.name_zh}} &nbsp;&nbsp;&nbsp;&nbsp;{{ item.name_zh}} &nbsp;&nbsp;&nbsp;&nbsp;{{ item.name_zh}} &nbsp;&nbsp;&nbsp;&nbsp;{{ item.name_zh}} &nbsp;&nbsp;&nbsp;&nbsp;</span>
            </span>
          <span class="spectator_type">
            <span v-if="item.type==1">{{$t('ad5.mode.attack')}}</span>
            <span v-if="item.type==2">{{$t('ad5.mode.newAttack')}}</span>
            <span v-if="item.type==3">{{$t('ad5.mode.devops')}}</span>
            <span v-if="item.type==4">{{$t('ad5.mode.jad')}}</span>
            <span v-if="item.type==5">{{$t('ad5.mode.layered')}}</span>
            <span v-if="item.type==6">{{$t('ad5.mode.rw')}}</span>
            <span v-if="item.type==7">{{$t('ad5.mode.theory')}}</span>
          </span>
          <span class="spectator_button">
            <router-link
              :to="{
                path:'/ad5/match/'+getRouter(item.type)+'/ranking',
                query:{event:item.contest_id,hash:item.hash}}"
              target="_blank"
              class="el-button el-button--primary"
            >排行榜</router-link>
            <router-link target="_blank"
                         class="el-button el-button--primary"
                         :to="{path:'/ad5/match/'+getRouter(item.type)+'/trend',query:{event:item.contest_id,hash:item.hash}}">趋势图</router-link>
            <router-link
              target="_blank"
              v-if="item.type==1||item.type==2"
              class="el-button el-button--primary"
              :to="{path:'/ad5/match/'+getRouter(item.type)+'/attackRanking',query:{event:item.contest_id,hash:item.hash}}">攻击榜</router-link>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import header from '@/components/common_components/header'
  import pagination from '@/components/common_components/pagination'
  import {createNamespacedHelpers} from 'vuex'
  import switchLanguage from '@/components/common_components/switchLanguage'
  import countDown from '@/components/common_components/countDown.vue'
  import {getStrNumber} from '@/common/js/common'

  import {
    look_match,
  } from '@/api/common'

  const {mapState} = createNamespacedHelpers('match')
  export default {
    name: 'spectator',
    components: {
      'v-header': header,
      pagination,
      switchLanguage
    },
    data () {
      return {
        nav: [
        ],
        spectatorData: {
          list:[]
        },
        getStrNumber,
        arg: this.$route.query.hash,
        pager: {// 页码
          currentPage: 1, // 当前第几页
          pageSize: 50, // 每页多少条
          total: 0, // 总共多少条
          layout: 'prev, pager, next'
        },
        matchData: {}, // 比赛详细信息
        rank_timer: null,
        logo: null,
      }
    },
    created () {
      this.get_spectator()
      // 浏览器url添加参数&timer=66任何数字可开启轮询
      if (this.$route.query.timer) {
        this.rank_timer = setInterval(() => {
          this.get_spectator()
        }, 60000)
      }
    },
    beforeDestroy () {
      clearInterval(this.rank_timer)
    },
    methods: {
      getRouter(type){
        switch (type){
          case 1:
            return 'attack';
            break;
          case 2:
            return 'new_attack';
            break;
          case 3:
            return 'devops';
            break;
          case 4:
            return 'jeopardy';
            break;
          case 5:
            return 'layered';
            break;
          case 6:
            return 'realWorld';
            break;
        }
      },
      get_spectator () {
        look_match()
          .then(res => {
            this.spectatorData = res.data;
          })
      }
    },
    mounted () {

    },
    computed: {
      ...mapState(['match_data'])
    }
  }
  require('@/common/css/match_theme_color/ad5_attack.styl')

</script>
<style lang="stylus" rel="stylesheet/stylus">
  /*ad5公用样式*/
  @import '~@/common/css/match_theme_color/common.styl'

</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .marque_box
    overflow hidden;
    .marquee
      line-height 34px;
  .spectator_title{
    width:100%;
    height:60px;
    border-radius 2px;
    background:#242B75;
    color:#fff;
    line-height:60px;
    text-align:left;
    padding-left:28px;
    margin-bottom:20px;
  }
  .spectator_list{
    li{
      width:100%;
      height:100px;
      background:#181B44;
      border-radius 2px;
      padding:0 40px;
      color:#fff;
      text-align:left;
      margin-bottom:20px;
      &:hover{
        background:#232864;
      }
      span{
        display:inline-block;
        vertical-align middle;
      }
      .spectator_index{
        font-size:24px;
        font-weight:bold;
        font-style:italic;
        line-height:100px;
      }
      .spectator_name{
        font-size:18px;
        line-height:100px;
      }
      .spectator_type{
        font-size:18px;
        line-height:100px;
      }
      .spectator_button {
        float: right;
        text-align: left;
        padding: 26px 0;
        width: 490px;

        a {
          margin-right: 30px;
          width: 140px !important;
          font-size: 18px;
          margin-left: 0;
          display: inline-block;
          width: 100%;
          height: 100%;
          color: #fff;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  @media(max-width:1600px){
    .spectator_name{
      width:200px;
      margin:0 50px 0 50px;
    }
  }
  @media(min-width:1600px){
    .spectator_name{
      width:250px;
      margin:0 90px 0 90px;
    }
  }
</style>

