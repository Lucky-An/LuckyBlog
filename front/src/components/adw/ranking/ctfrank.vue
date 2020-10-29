<template>
  <div>
    <div id="gf-topic">
      <div class="subject" style="letter-spacing:2px;">
        <span>{{$t('header.ranking.ctf')}}</span>
        <span class="subjectStar"></span>
      </div>
    </div>
    <div class="upload_time">
      【{{$t('ad_ranking.upload_time')}}】
    </div>
    <div class="table_content specialTable posRelative">
      <img src="@/assets/img/biaotou.png" alt="" class="table_head">
      <el-table
        :data="tableData"
        class="first_width"
        style="width: 100%">
        <el-table-column
          type="index"
          :label="$t('ad_ranking.table.index')"
          width="180"
          :index="indexMethod"
          >
        </el-table-column>
        <el-table-column
          prop="user_logo"
          :label="$t('ad_ranking.table.logo')"
          >
          <template slot-scope="scope">
            <div class="text-center" >
              <span class="team_logo" :style="{backgroundImage:'url(' + scope.row.user_logo + ')'}"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          :label="$t('ad_ranking.table.id')"
         >
        </el-table-column>
        <el-table-column
          prop="task_num"
          :label="$t('ad_ranking.table.solved_number')"
          >
        </el-table-column>
        <el-table-column
          prop="user_point"
          :label="$t('ad_ranking.table.score')">
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:30px;">
      <v-page
        v-show="pager.total>pager.pageSize"
        :total="pager.total"
        :page.sync="pager.currentPage"
        :limit.sync="pager.pageSize"
        :layout="pager.layout"

        @pagination="getList"
      ></v-page>
    </div>
  </div>
</template>

<script>
  import page from '@/components/common_components/pagination'
  export default {
    components:{
      'v-page':page,
    },
    name: "ctfrank",
    data() {
      return {
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 30,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
          class:'bluepage'
        },
        nowType:0,
        tableData: [],
      }
    },
    created(){
      this.get_data();
    },
    methods:{
      indexMethod(index){
        return (this.pager.currentPage-1)*this.pager.pageSize+index+1;
      },
      get_data(){
        this.$http.get('/api/rank',{
          params:{
            limit:this.pager.pageSize,
            offset:(this.pager.currentPage-1)*this.pager.pageSize,
          }
        })
          .then((res)=>{
            this.tableData = res.data.rows;
            this.pager.total = res.data.total;
          })
      },
      getList (val) {//接收组件传递出的变化
        this.get_data({
          limit:this.pager.pageSize,
          offset:(this.pager.currentPage-1)*this.pager.pageSize,
          key:''
        },this)
      },
    }
  }
</script>

<style  lang="stylus" rel="stylesheet/stylus" scoped>
  .team_logo
    width:36px;
    height:36px;
    display:inline-block;
    border:1px solid #0082ff;
    border-radius: 50%;
    background-repeat:no-repeat;
    background-size:cover;
    background-position: center center;
  .subject
    width: 257px;
    height: 50px;
    set_bg('layer.png')
    margin: 0 auto;
    position: relative;
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 26px;
    letter-spacing: 8px;
    line-height: 50px;
    margin-bottom:40px;
    margin-top:30px;
    span
      font-weight:bold;
    .subjectStar
      width: 76px;
      height: 76px;
      set_bg('4jiao.png')
      display: inline-block;
      position: absolute;
      left: -48px;
      top: -14px;
  .table_nav
    display: flex;
    justify-content: space-between;
    margin:0 auto;
    margin-bottom:40px;
    padding:0 50px;
    li
      flex:1;
      height:30px;
      line-height:30px;
      set_bg('button/lan.png');
      float:left;
      color:#337ab7;
      margin-right:50px;
      cursor:pointer;

      &:hover
        set_bg('button/lan1.png');
        color: white;
      &:last-child
        margin-right:0;
    .active
      set_bg('button/lan1.png');
      color: white;
  .upload_time
    color:#02ceff;
    text-align:right;
    width:1200px;
    margin:0 auto;
    margin-bottom:5px;
  .table_content
    width:1200px;
    margin:0 auto;
    margin-bottom:40px;
  @media (max-width:1300px)
    .table_nav
      width:1200px;
  @media (min-width:1300px) and (max-width:1500px)
    .table_nav
      width:1200px;
  @media (min-width:1500px) and (max-width:1800px)
    .table_nav
      width:1200px;
  @media (min-width:1800px)
    .table_nav
      width:1200px;
</style>

