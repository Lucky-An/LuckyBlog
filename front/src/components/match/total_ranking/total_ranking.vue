<template>
  <div class="solving_type">
    <div class="video_meng" style="background:#140d43;width:100%;height:100%;position:absolute;left:0;top:0;z-index:0">
      <span class="meng"></span>
      <video autoplay loop="loop" class="video_centent"
             style="width:100%; height:100%; object-fit: fill;position:absolute;left:0;top:0;z-index:0">
        <source src="../../../../static/media/new.mp4">
      </video>
    </div>
    <div style="position:relative;" class="header_wraps">
      <div class="logoIsCenter" >
        <div class="header logoCenter" >
          <span class="ad_logo" >
            <img :src="logo" v-if="logo" alt="" width="240" height="53">
          </span>
          <switchLanguage  style="float:right;margin:20px 25px 0 0"></switchLanguage>
        </div>
      </div>
    </div>
    <div class="all_rank guide_wrap">
      <el-table
        :data="tableData"
        class="attack_rank threestyle"
        style="width: 100%">
        <el-table-column
          type="index"
          width="100"
          :label="$t('ad5.personal.rank')"
          class-name="bor_l1" >
          <template slot-scope="scope">
            <div>
              {{(scope.$index+1)+pager.pageSize*(pager.currentPage-1)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          class-name="namelie"
          :label="$t('ad5.referee.table.team_name')"
          width="300"
        >
          <template slot-scope="scope">
            <div class="user_name fcenter" style="height:36px;justify-content:left;">
              <span class="obj_logo" v-if="scope.row.team_logo" :style="'background:url('+scope.row.team_logo+');background-size:cover;background-position:center center;'" ></span>
              <span class="obj_logo" v-else-if="scope.row.obj_logo" :style="'background:url('+scope.row.obj_logo+');background-size:cover;background-position:center center;'" ></span>
              <span class="obj_logo def_logo" v-else></span>
              <span class="marque_box" v-if="getStrNumber(scope.row.name,20,15)">
                  <span>{{ scope.row.name}}</span>
              </span>
              <span class="marque_box" v-else>
                  <span class="marquee">{{ scope.row.name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.name}} &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.name}} &nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in table_header"
          :label="$i18n.locale=='CN' ? item.title_zh : item.title_en"
        >
          <template slot-scope="scope">
            <span>{{scope.row[item.type] ? scope.row[item.type] : 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="all_score"
          :label="$t('ad5.referee.table.sum_score')"
        >
        </el-table-column>
      </el-table>
      <!--分页 begin-->
      <pagination
        v-show="pager.total>pager.pageSize"
        :total="pager.total"
        :page.sync="pager.currentPage"
        :limit.sync="pager.pageSize"
        :layout="pager.layout"
        @pagination="get_all_rank"
        style="margin-top:25px;"
      ></pagination>
      <!--分页 end-->
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
  all_rank,
  personal_url
} from '@/api/common'

const {mapState} = createNamespacedHelpers('match')
export default {
  name: 'total_ranking',
  components: {
    'v-header': header,
    pagination,
    switchLanguage
  },
  data () {
    return {
      api: {
        personal_url
      },
      nav: [
      ],
      tableData: [],
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
      table_header: []
    }
  },
  created () {
    this.get_all_rank()
    // 浏览器url添加参数&timer=66任何数字可开启轮询
    if (this.$route.query.timer) {
      this.rank_timer = setInterval(() => {
        this.get_all_rank()
      }, 60000)
    }
  },
  beforeDestroy () {
    clearInterval(this.rank_timer)
  },
  methods: {
    get_all_rank () {
      all_rank()
        .then(res => {
          this.table_header = []
          this.logo = res.data.logo
          this.tableData = res.data.score
          res.data.nav_name.forEach((item) => {
            for (var attr in item) {
              this.table_header.push({
                type: attr,
                title_zh: item[attr].zh,
                title_en: item[attr].en
              })
            }
          })
          // this.pager.total = res.data.total;
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
  .obj_logo{
    width:30px;
    height:28px;
    border-radius 50%;
    border:1px solid rgba(255,255,255,.1);
    display:inline-block;
    margin-top:-5px;
    margin-right:8px;
  }
  .def_logo{
    background:url('~@/assets/img/def_icon.jpg');
    background-size:100% 100%;
    background-repeat:no-repeat;
    background-position:center center;
  }
  .marque_box {
    width: 260px;
    overflow: hidden;
    text-align: left;
  }
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .threestyle{
    tr td:not(.namelie) *{
      font-size:18px;
      font-weight:bold;
    }
    tr:nth-child(1) td *{
      color:#ffc120;
      font-weight:bold;
      font-size:20px;
      font-style:italic
    }
    tr:nth-child(2) td *{
      color:#b9e0ff;
      font-weight:bold;
      font-size:20px;
      font-style:italic
    }
    tr:nth-child(3) td *{
      color:#e57c5e;
      font-weight:bold;
      font-size:20px;
      font-style:italic
    }
    tr:nth-child(1) td:nth-child(1){
      padding:0!important;
      .cell div{
        height:40px;
        background:url('~@/assets/img/1.png') no-repeat center center;
        color:rgba(0,0,0,0);
      }
    }
    tr:nth-child(2) td:nth-child(1) {
      padding:0!important;
      .cell div{
        height:30px;
        background:url('~@/assets/img/2.png') no-repeat center center;
        color:rgba(0,0,0,0)
      }
    }
    tr:nth-child(3) td:nth-child(1) {
      padding:0!important;
      .cell div{
        height:30px;
        background:url('~@/assets/img/3.png') no-repeat center center;
        color:rgba(0,0,0,0)
      }
    }
  }
</style>
