<template>
  <div class="guide_wrap">
    <div class="tools_type">
      <div class="types clearfix">
        <div class="label">{{$t('ad5.tools.type')}}：</div>
        <ul class="all_types">
          <li :class="{'active':now_index==type.id}" v-for="type in types"
          @click="changeType(type)"
          >{{type.label}}</li>
        </ul>
      </div>
      <div class="types clearfix" style="border-bottom:none;">
        <div class="label">{{$t('ad5.tools.platform')}}：</div>
        <ul class="all_types">
          <li v-for="sys in system"
              :class="{'active':now_sys==sys}"
              @click="changeSys(sys)"
          >{{sys}}</li>
        </ul>
        <div style="margin-top: 15px;" class="search">
          <el-input :placeholder="$t('selfHelp_competition.search_keyword')"
                    @keyup.enter.native="search_tool()"
                    v-model="search">
            <template slot="append" >
              <span class="el-icon-search" @click="search_tool()">
              </span>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="tools_table view_path">
      <el-table
        :data="tools_list"
        border
        style="width: 100%"
      >
        <el-table-column
          :label="$t('ad5.tools.tools_name')"
          prop="name"
          width="200">
        </el-table-column>
        <el-table-column
          prop="label"
          :label="$t('ad5.tools.tools_type')"
        >
        </el-table-column>
        <el-table-column
          prop="system_type"
          :label="$t('ad5.tools.platform')"
          width="150">
        </el-table-column>
        <el-table-column
          prop="upload_time"
          :label="$t('ad5.tools.upload_time')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="edition"
          :label="$t('ad5.tools.version')"
          width="140">
        </el-table-column>
        <el-table-column
          prop="tool_size"
          :label="$t('ad5.tools.size')"
          width="140">
        </el-table-column>
        <el-table-column
          prop="url"
          :label="$t('ad5.tools.handle')"
          width="140">
          <template slot-scope="scope">
            <div style="text-align:center;">
              <a :href="down_tools + scope.row.id">
                <span class="el-icon-download" style="font-size:26px;cursor:pointer;"></span>
              </a>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px;">
        <!--分页 begin-->
        <pagination
          v-show="detail.total>detail.pageSize"
          :total="detail.total"
          :page.sync="detail.currentPage"
          :limit.sync="detail.pageSize"
          :layout="detail.layout"
          @pagination="getTools"


        ></pagination>
        <!--分页 end-->
      </div>
    </div>
  </div>
</template>

<script>
  import pagination from '@/components/common_components/pagination'
  import {
    tools,
    down_tools,
    tools_tag
  } from '@/api/common'
  export default {
    name: 'index',
    components:{
      pagination
    },
    data(){
      return{
        down_tools,
        search:'',
        now_sys:'',
        now_index:'',
        types:[
        ],
        system:[
        ],
        tools_list:[
        ],
        detail: {//表格详细信息页码
          currentPage: 1,//当前第几页
          pageSize: 10,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next'
        },
      }
    },
    created(){
      tools_tag()
        .then(res=>{
          this.types = res.data.label;
          this.system = res.data.platform;
          this.types.unshift({
            id:'',
            label:"全部",
            description:''
          })
          this.system.unshift('全部')
          this.now_index = res.data.label[0].id;
          this.now_sys = res.data.platform[0];
          this.getTools();
        })
    },
    methods:{
      search_tool(){
        this.getTools();
        this.search = '';
      },
      getSys(type){
        switch(type){
          case 0 : return this.$t('tools.system.system1');
          break;
          case 1 : return this.$t('tools.system.system2');
          break;
          case 2 : return this.$t('tools.system.system3');
          break;
          case 3 : return this.$t('tools.system.system4');
          break;
          case 4 : return this.$t('tools.system.system5');
          break;
          case 5 : return this.$t('tools.system.system6');
          break;
        }
      },
      getTools(){
        tools({
          label:this.now_index,
          platform:this.now_sys=='全部' ? '':this.now_sys,
          name:this.search,
          offset: this.detail.pageSize * (this.detail.currentPage - 1),
          limit: this.detail.pageSize,
        })
          .then(res=>{
            this.tools_list = res.data.rows;
            this.detail.total = res.data.total;
          })
      },
      changeType(item){
        this.now_index = item.id;
        this.getTools()
      },
      changeSys(item){
        this.now_sys = item;
        this.getTools()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/css/match_theme_color/ad5_attack.styl'
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .el-icon-download{
    &:hover{
      color:#3372fd;
    }
  }
  .search{
    .el-input__inner{
      border:none;
      color:#4c5067;
    }
    .el-input-group__append{
      background:#0d1927;
      border:none;
      cursor:pointer;
    }
    .el-icon-search{
      font-size:20px;
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tools_type{
    width:100%;
    background:#1b1f3c;
    border-radius 5px;
    margin-bottom:20px;
    .types{
      position:relative;
      padding:30px;
      border-bottom:1px solid rgba(255,255,255,.1);
      .label{
        color:#fff;
        font-size:18px;
        font-weight:bold;
        float:left;
      }
      .all_types{
        width:calc(100% - 160px);
        float:left;
        color:#acaebb;
        margin-top:-6px;
        text-align:left;
        li{
          padding:10px 25px;
          display:inline-block;
          margin-right:5px;
          margin-bottom:5px;
          cursor:pointer;
        }
        .active{
          background:#3074fd;
          border-radius 4px;
          color:#fff;
        }
      }
    }
    .search{
      position:absolute;
      right:30px;
      bottom:30px;
    }
  }
</style>
