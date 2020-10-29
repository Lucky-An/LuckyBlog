<template>
  <div class="platform_line guide_wrap"
       :class="{'rank_style':$route.path.indexOf('attack/attackRanking')!==-1||$route.path.indexOf('attack/ranking')!==-1}"
       >
    <div class="team_head">
     <span class="team_logo_show logo" v-if="team_data.logo==null||team_data.logo==''"  style="overflow: hidden;">
        <img src="@/assets/img/def_icon.jpg" alt="" style="width:100%;height:100%;">
      </span>
      <span class="logo" v-else :style="{backgroundImage:'url(' + team_data.logo + ')'}"></span>
      <span class="name">{{team_data.name}}</span>
      <slot name="user_school"></slot>
    </div>
    <span
      v-if="team_data&&!hide_some_menu"
        style="margin:auto;position:absolute;left:0;right:0;top:0;bottom:0;">
      <span class="rank">
        <span>RANK:</span>
        <span class="data_weight">{{team_data.rank}}</span>
      </span>
      <slot name="other"></slot>
      <span style="margin-right:0" class="rank">
        <span>SCORE:</span>
        <span class="data_weight">{{team_data.score}}</span>
      </span>
    </span>
    <slot name="theory_btn"></slot>
    <countDown
      class="time_wrap"
       v-if="match_data"
      :match_all_times="match_all_time"
      :api="api"
      :arg="arg"
      @matchBegin="match_is_begin"
      @matchEnd="match_is_end"
    ></countDown>
    <slot name="theory_grade"></slot>
  </div>
</template>

<script>
  import countDown from '@/components/common_components/countDown.vue'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState } = createNamespacedHelpers('match');
  export default {
    name: 'challenge_menu',
    props:['user','team_data','api','arg','hide_some_menu'],
    components:{
      countDown
    },
    data(){
      return{
        match_all_time:'',
        distance_match_time:''
      }
    },
    created(){
    },
    methods:{
      match_is_begin(){
        this.$emit('the_begin')
      },
      match_is_end(){
        this.$emit('the_end')
      }
    },
    computed:{
      ...mapState(['match_data']),
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .platform_line {
    width: 100%;
    background: rgba(36,43,117,.8);
    border-radius 6px;
    text-align: center;
    position: relative;
    z-index:1855;
    .time_wrap{
      float:right;
    }
    .team_head {
      position: absolute;
      .logo {
        border-radius 50%;
        border: 2px solid lightblue;
        display: inline-block;
        background-size: cover;
        background-position:center center;
      }

      .name {
        color: #fff;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        font-weight:bold;
        font-size:16px;
        color:lightblue;
      }
    }
  }
  .rank_style{
    background:rgba(0,11,52,.8);
  }
  @media (max-width:1300px){
    .platform_line {
      height: 60px;
      padding-top: 18px;
      margin-bottom: 25px;
      .team_head {
        top: 10px;
        .logo {
          width: 40px;
          height: 40px;
          vertical-align -12px;
          background-position:center center;
        }
        .name {
          font-size: 18px;
          max-width: 180px;
          margin-left: 6px;
        }
      }
    }
  }
  @media (min-width:1300px) and (max-width:1600px){
    .platform_line {
      height: 50px;
      padding-top: 12px;
      margin-bottom: 15px;
      .team_head {
        top: 5px;
        .logo {
          width: 36px;
          height: 36px;
          vertical-align -8px;
        }
        .name {
          font-size: 18px;
          max-width: 180px;
          margin-left: 6px;
        }
      }
    }
  }

  @media (min-width:1600px) and (max-width:1920px){
    .platform_line {
      height: 60px;
      padding-top: 18px;
      margin-bottom: 25px;
      .team_head {
        top: 10px;
        .logo {
          width: 40px;
          height: 40px;
          vertical-align -12px;
        }
        .name {
          font-size: 18px;
          max-width: 180px;
          margin-left: 6px;
        }
      }
    }
  }

  @media (min-width:1920px){
    .platform_line {
      height: 60px;
      padding-top: 18px;
      margin-bottom: 25px;
      .team_head {
        top: 10px;
        .logo {
          width: 40px;
          height: 40px;
          vertical-align -12px;
        }
        .name {
          font-size: 18px;
          max-width: 180px;
          margin-left: 6px;
        }
      }
    }
  }

</style>
