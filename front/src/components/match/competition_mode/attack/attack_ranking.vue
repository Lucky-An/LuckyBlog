<template>
  <div>
    <div class="video_meng" style="background:#140d43;position:absolute;left:0;top:0;z-index:0">
      <span class="meng"></span>
      <video autoplay loop="loop"
             style="width:100%; height:100%; object-fit: fill;position:absolute;left:0;top:0;z-index:0">
        <source src="../../../../../static/media/new.mp4">
      </video>
    </div>
    <div class="guide_wrap" style="padding:10px 0;margin-top:-15px;" :class="{'margTop':!is_login,'paddTop':!is_login}">
      <div class="legend" v-if="!is_login">
        <span class="fullScreen" >
          <fullScreen ></fullScreen>
        </span>
      </div>
      <el-table
        class="attack_rank attack_defense"
        :data="ranks_list"
        style="width: 100%">
        <el-table-column
          prop="round"
          :label="$t('attack.attack_table.round')"
          width="140">
          <template slot-scope="scope">
            <span class="rank_number">{{scope.row.round}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('attack.attack_table.success')"
          width="250">
          <template slot-scope="scope">
            <div style="text-align:left;">
            <span class="team_logo_show" v-if="scope.row.attack_logo==null"  style="overflow: hidden;">
              <img src="@/assets/img/def_icon.jpg" alt="" style="width:100%;height:100%;">
            </span>
              <span class="team_logo_show" v-else :style="{backgroundImage:'url(' + scope.row.attack_logo + ')'}"></span>
              <span class="marque_box" v-if="getStrNumber(scope.row.attack_name,15,9)">
                <span>{{ scope.row.attack_name}}</span>
              </span>
              <span class="marque_box" v-else>
                <span
                  class="marquee"
                >{{ scope.row.attack_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.attack_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.attack_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.attack_name}} &nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          :label="$t('attack.attack_table.KO')">
          <template slot-scope="scope">
            <span >Pwn3d</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="challenge_name"
          :label="$t('attack.attack_table.task')">
          <template slot-scope="scope">
            <span >{{scope.row.challenge_name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          :label="$t('attack.attack_table.fail')">
          <template slot-scope="scope">
            <div style="text-align:left;">
            <span class="team_logo_show" v-if="scope.row.target_logo==null"  style="overflow: hidden;">
              <img src="@/assets/img/def_icon.jpg" alt="" style="width:100%;height:100%;">
            </span>
              <span class="team_logo_show" v-else :style="{backgroundImage:'url(' + scope.row.target_logo + ')'}"></span>
              <span class="marque_box" v-if="getStrNumber(scope.row.target_name,15,9)">
                <span>{{ scope.row.target_name}}</span>
              </span>
              <span class="marque_box" v-else>
                <span
                  class="marquee"
                >{{ scope.row.target_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.target_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.target_name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.target_name}} &nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          :label="$t('attack.attack_table.time')"
          >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { getStrNumber } from "@/common/js/common";

  import {
    attackData,
  } from '@/api/competitionMode/attackMode'

  import {createNamespacedHelpers} from 'vuex'
  const { mapState,mapMutations } = createNamespacedHelpers('match');
  import fullScreen from "@/components/match/common/small_part/fullScreen";

  export default {
    name: 'attack_ranking',
    components: {
      fullScreen
    },
    data () {
      return {
        is_login:localStorage.isUserLogin,
        getStrNumber,
        api:{
          attackData,
        },
        screenStatus:true,
        ranks_list:[
        ],
        attack_timer:null
      }
    },
    beforeDestroy () {
      clearInterval(this.attack_timer);
    },
    created () {
      if(this.match_data.id){
        this.getAttack();
      }
      this.attack_timer = setInterval(()=>{
        this.getAttack();
      },10000)//10秒
    },
    methods: {
      fullScreen(){
        if(this.screenStatus){
          $('.header').hide();
          $('.match_title').addClass('width100')
          $('.guide_wrap').addClass('width100')
          this.screenStatus = false;
        }else{
          $('.header').show();
          $('.match_title').removeClass('width100')
          $('.guide_wrap').removeClass('width100')
          this.screenStatus = true;
        }
      },
      getAttack(){
        this.api.attackData({
          event_id:this.match_data.id
        })
          .then(res=>{
            this.ranks_list = res.data;
          })
          .catch(res=>{

          })
      }
    },
    watch: {
      match_data (val, old) {
        this.getAttack();
      }
    },
    computed:{
      ...mapState(['match_data']),
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .margTop{
    margin-top:0!important;
  }
  .paddTop{
    padding-top:30px!important;
  }
</style>
