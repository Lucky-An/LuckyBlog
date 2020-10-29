<template>
  <div class="guide_wrap" style="padding:10px 0;margin-top:-15px;" :class="{'margTop':!is_login}">
    <div class="legend" v-if="rank.length" >
      <span class="legend_not_open">{{$t('attack.legend.not_open')}}</span>
      <span class="legend_normal">{{$t('attack.legend.normal')}}</span>
      <span class="legend_abnormal">{{$t('attack.legend.abnormal')}}</span>
      <span class="legend_success" v-if="$route.path.indexOf('new_attack')==-1">{{$t('attack.legend.success')}}</span>
      <span class="legend_fail" v-if="$route.path.indexOf('new_attack')==-1">{{$t('attack.legend.fail')}}</span>
      <span class="fullScreen" v-if="!is_login">
        <fullScreen ></fullScreen>
      </span>
    </div>
    <el-table
      v-if="rank.length"
      class="attack_rank"
      :data="rank"
      :class="{'paddTop':!is_login}"
      style="width: 100%;margin-top:20px;">
      <el-table-column
        prop="rank"
        :label="$t('attack.rank_table.rank')"
        width="50">
        <template slot-scope="scope">
          <span class="rank_number">{{scope.row.rank}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('attack.rank_table.team')"
        width="210">
        <template slot-scope="scope">
          <div style="text-align:left;" >
            <span class="team_logo_show" v-if="scope.row.team_logo==null"  style="overflow: hidden;">
              <img src="@/assets/img/def_icon.jpg" alt="" style="width:100%;height:100%;">
            </span>
            <span class="team_logo_show" v-else :style="{backgroundImage:'url(' + scope.row.team_logo + ')'}"></span>
            <span class="marque_box" v-if="getStrNumber(scope.row.team_name,15,9)">
              <span>{{ scope.row.team_name}}</span>
            </span>
            <span class="marque_box" v-else>
              <span
                class="marquee"
              >{{ scope.row.team_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.team_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.team_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.team_name}} &nbsp;&nbsp;&nbsp;&nbsp;</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        width="100"
        :label="$t('attack.rank_table.score')">
        <template slot-scope="scope">
          <span class="" style="font-style:italic;font-weight:bold;">{{scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="task"
        :key="i"
        v-for="(t,i) in rank[0].challenges"
        :label="t.challenge_name">
        <template slot-scope="scope">
          <span :class="{
          'disabled_task':scope.row.challenges[i].status==1,
          'normal_task':scope.row.challenges[i].status==2,
          'abnormal_task':scope.row.challenges[i].status==4,
          'success_task':scope.row.challenges[i].status==3,
          'fail_task':scope.row.challenges[i].status==5,
          }"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showAttackDefence"
        :label="$t('attack.rank_table.successful_attack')">
        <template slot-scope="scope">
            <span class="txt_color"
                  style="font-size:20px;color:#03bb75;font-weight:bold;font-style:italic"
            >{{scope.row.attack_score}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showAttackDefence"
        :label="$t('attack.rank_table.defence_success')">
        <template slot-scope="scope">
            <span class="txt_color lv_color"
                  style="font-size:20px;color:#e64c4c;font-weight:bold;font-style:italic"
            >{{scope.row.defend_score}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('attack.rank_table.change')">
        <template slot-scope="scope">
          <div :class="{
          'change_none':scope.row.rank_change==0,
          'change_up':scope.row.rank_change>0,
          'change_down':scope.row.rank_change<0
          }">
            <span class="txt_color">{{scope.row.change_score_sum}}</span>
            <span class="icon"></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getStrNumber } from "@/common/js/common";
  import fullScreen from "@/components/match/common/small_part/fullScreen";

  export default {
    name: 'attack_rank',
    props:['rank','showAttackDefence'],
    components:{
      fullScreen
    },
    data () {
      return {
        getStrNumber,
        is_login:localStorage.isUserLogin,
      }
    },
    methods: {
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .margTop{
    margin-top:10px!important;
  }
  .paddTop{
    padding-top:10px!important;
  }
</style>
<style>
  .lv_color{
    color:rgb(3, 187, 117)!important;
  }
</style>
