<template>
  <div id="competition">
    <div class='gf-wrap'>
      <div class="clearfix" style="margin-bottom:12px;">
        <div class="filter_group" v-if="show_filter_btn">
          <el-button  class="bnSize" :type="now_type==1 ? 'primary':''" plain @click="filter_types(1)">{{$t('ad5.onlyMe')}}</el-button>
          <el-button class="bnSize" :type="now_type==0 ? 'primary':''" plain style="margin-left:-4px;" @click="filter_types(0)">{{$t('ad5.onlyAll')}}</el-button>
        </div>
      </div>
      <ul class="competition_list_inner">
        <li v-for="item in list">
          <span  class="competition_ofone">
            <span class="compet_img">
              <span class="compet_img def_cover" v-if="item.cover==null||item.cover==''" ></span>
              <span class="compet_img" v-else :style="{backgroundImage:'url(' + item.cover + ')'}"></span>
              <span class="math_lable" :class="{
                      'blues':item.process==0,
                      'huang':item.process==1,
                      'hui':item.process==2
                      }"
                      v-text="label_status(item.process)"
                      >

              </span>
            </span>
            <div class="compet_txt clearfix">
              <h3 class="whiteC mrg0T">
                <span class="competition_name">
                    {{$i18n.locale=='EN'? item.name_en : item.name_zh}}
                </span>
                <span class="" style="position:relative;top:-4px;">
                  <span class="match_type match_type_jad" v-if="item.type==4">
                    <span class="icon"></span>
                    <span class="label_txt">{{$t('ad5.mode.jad')}}</span>
                  </span>
                  <span class="match_type match_type_attack" v-if="item.type==1">
                      <span class="icon"></span>
                      <span class="label_txt">{{$t('ad5.mode.attack')}}</span>
                    </span>
                  <span class="match_type match_type_new_attack" v-if="item.type==2">
                      <span class="icon"></span>
                      <span class="label_txt">{{$t('ad5.mode.newAttack')}}</span>
                    </span>
                  <span class="match_type match_type_devops" v-if="item.type==3">
                      <span class="icon"></span>
                      <span class="label_txt">{{$t('ad5.mode.devops')}}</span>
                  </span>
                  <span class="match_type match_type_layered" v-if="item.type==5">
                      <span class="icon"></span>
                      <span class="label_txt">{{$t('ad5.mode.layered')}}</span>
                  </span>
                  <span class="match_type match_type_rw" v-if="item.type==6">
                      <span class="icon"></span>
                      <span class="label_txt">{{$t('ad5.mode.rw')}}</span>
                  </span>
                  <span class="match_type match_type_theory" v-if="item.type==7">
                      <span class="icon"></span>
                      <span class="label_txt">{{$t('ad5.mode.theory')}}</span>
                  </span>
                </span>
              </h3>
              <div class="clearfix">
                <div >
                  <div style="color:#aaaeba;" class="competition_info">
                      <span>{{$t('competition.competitionMode')}}：<span
                                                                        v-text="getmode(item.mode)"></span>
                      </span>
                  </div>
                </div>
                <div >
                  <div style="color:#aaaeba;" class="competition_info">
                      <span>{{$t('competition.startTime')}}：<span
                        >{{item.start_time}} —— </span><span >{{item.end_time}}</span>
                      </span>
                  </div>
                </div>
              </div>
              <div v-if="$i18n.locale=='CN'">
                <el-tooltip class="item" effect="light"
                              v-if="delHtmlTag(item.description_zh).length>=80"
                              popper-class="atooltip"
                              :content="delHtmlTag(item.description_zh)"
                              placement="bottom-start">
                    <div class="brief_info">
                      {{$t('competition.introduce')+'：'}}{{delHtmlTag(item.description_zh).slice(0,80)+'…'}}
                    </div>
                </el-tooltip>
                <div class="brief_info" v-else>
                  {{$t('competition.introduce')+'：'}}{{delHtmlTag(item.description_zh)}}
                </div>
              </div>
              <div v-else>
                <el-tooltip class="item" effect="light"
                            v-if="delHtmlTag(item.description_en).length>=80"
                            popper-class="atooltip"
                            :content="delHtmlTag(item.description_en)"
                            placement="bottom-start">
                    <div class="brief_info">
                      {{$t('competition.introduce')+'：'}}{{delHtmlTag(item.description_en).slice(0,80)+'…'}}
                    </div>
                </el-tooltip>
                <div class="brief_info" v-else>
                  {{$t('competition.introduce')+'：'}}{{delHtmlTag(item.description_en)}}
                </div>
              </div>
            </div>
          </span>
          <div class="look_btn">
            <span v-if="item.type==7" >
                <router-link
                    v-if="(item.process==2&&item.is_review)||(item.process==0&&!item.is_submit)"
                    :to="{path:'/ad5/match/theory/guide',query:{event:item.id,hash:item.hash}}"
                    class="mrg20R join_btn search_competition_btn"
                    :class="{
                      'not_begin':item.process==1,
                      'is_begin':item.process==0,
                      'is_end':item.process==2,
                    }"
                    target="_blank"
                  >
                  <span v-if="item.process==2">
                    {{$t('ad5.competition_review')}}
                  </span>
                  <span v-if="item.process==0">
                    {{$t('ad5.into_competition')}}
                  </span>
                  <span class="join_btn search_competition_btn" v-if="item.process==1">
                    {{$t('ad5.coming_soon2')}}
                  </span>
                </router-link>
                <span class="mrg20R join_btn search_competition_btn"
                      v-else
                      @click="tips_user(item)"
                    :class="{
                      'not_begin':item.process==1,
                      'is_begin':item.process==0,
                      'is_end':item.process==2,
                    }">
                  <span v-if="item.process==2">
                    {{$t('ad5.competition_review')}}
                  </span>
                  <span v-if="item.process==0">
                    {{$t('ad5.into_competition')}}
                  </span>
                  <span class="join_btn search_competition_btn" v-if="item.process==1">
                    {{$t('ad5.coming_soon2')}}
                  </span>
                </span>
            </span>
            <router-link
              v-else
              :to="{path:getRouter(item.type),query:{event:item.id,hash:item.hash}}"
              class="mrg20R join_btn search_competition_btn"
              :class="{
                'not_begin':item.process==1,
                'is_begin':item.process==0,
                'is_end':item.process==2,
              }"
              target="_blank"
            >
              <span v-if="item.process==2">
                {{$t('ad5.competition_review')}}
              </span>
              <span v-if="item.process==0">
                {{$t('ad5.into_competition')}}
              </span>
              <span class="join_btn search_competition_btn" v-if="item.process==1">
                {{$t('ad5.coming_soon2')}}
              </span>
            </router-link>
            <!--0:进行中，1:未开始，2:结束-->
            <span class="search_competition_btn replay_practice cursor mrg20R"
                  v-if="item.process==2&&item.is_replay&&!item.is_sponsor"
                  @click="goReplay(item)"
            >{{$t('competition.replay')}}</span>
          </div>
        </li>
      </ul>
      <div class="page_wrap">
        <page
          v-show="pager.total>pager.pageSize"
          :total="pager.total"
          :page.sync="pager.currentPage"
          :limit.sync="pager.pageSize"
          :layout="pager.layout"

          @pagination="getList"
        ></page>
      </div>
    </div>
  </div>
</template>

<script>
  import {competitionList} from '@/api/common'

  import page from '@/components/common_components/pagination'
  import {getStorage} from '@/utils/storage'

  export default {
    components: {
      page,
    },
    name: 'competition_list',
    data () {
      return {
        api:{
          competitionList
        },
        now_type:0,
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 3,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
          class: 'bluepage'
        },
        list: [],
        search:"",//搜索的内容
        user_auth: (getStorage('isUserLogin', 'object')).user || {classes: -1},
        show_filter_btn:false,
        get_list_timer:null
      }
    },
    beforeDestroy () {
      clearInterval(this.get_list_timer);
      // clearInterval(this.notice_timer);
    },
    created () {
      this.show_filter_btn = getStorage('show_all_evt','object');
      if(!this.show_filter_btn){
        this.now_type = 1;
      }
      this.getList()
      this.get_list_timer = setInterval(()=>{
        this.getList()
      },60000)//60秒
    },
    methods: {
      tips_user(item){
        let tip_message=''
        if(item.process==1){
          tip_message = this.$t('competition.notBegun')
        }
        if(item.process==0&&item.is_submit){
          tip_message = this.$t('ad5.theory.notReview1')
        }
        if(item.process==2&&!item.is_review){
          tip_message = this.$t('ad5.theory.notReview2')
        }
        this.$alert('<div style="margin-top:20px;">'+tip_message+'</div>', this.$t('dialog_list.tips'), {
          customClass: 'public_confirm public_confirm_sm small_tips',
          showConfirmButton: false,
          center: true,
          closeOnClickModal: true,
          dangerouslyUseHTMLString: true
        })
      },
      getRouter(type){
        switch (type){
          case 1:
            return '/ad5/match/attack/guide';
            break;
          case 2:
            return '/ad5/match/new_attack/guide';
            break;
          case 3:
            return '/ad5/match/devops/guide';
            break;
          case 4:
            return '/ad5/match/jeopardy/guide';
            break;
          case 5:
            return '/ad5/match/layered/guide';
            break;
          case 6:
            let ref = (getStorage('isUserLogin', 'object')).role;
            return ref&&ref=='Referee' ? '/ad5/referee/realWorld/examine' : '/ad5/match/realWorld/guide';
            break;
        }
      },
      filter_types(i){
        this.now_type = i;
        this.pager.currentPage = 1;
        this.getList()
      },
      delHtmlTag (str) {
        str = this.$marked(str)
        str = str.replace(/<\/?[^>]*>/g, '') //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n') //去除行尾空白
//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/&nbsp;/ig, '')//去掉&nbsp;
        return str
        // return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
      },
      goReplay (item) {
        this.$confirm(this.$t('competition.replay_tip'), this.$t('dialog_list.tips'), {
          confirmButtonText: this.$t('modal.confirm'),
          cancelButtonText: this.$t('modal.cancel'),
          customClass: 'public_confirm public_confirm_sm',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/match/guide',
            query: {event: item.id, hash: item.hash}
          })

        })

      },
      getList () {
        this.api.competitionList({
          limit: this.pager.pageSize,
          offset: (this.pager.currentPage - 1) * this.pager.pageSize,
          type:this.now_type,
          search:this.search
        })
          .then((res) => {
            this.list = res.data.rows
            this.pager.total = res.data.total
          })
          .catch((err) => {

          })
      },
      getmode (mode) {
        if (mode == 1) {
          return this.$t('competition.personal')
        } else if (mode == 2) {
          return this.$t('competition.team')
        }
      },
      label_status (status) {
        if (status == 0) {
          return this.$t('competition.doing')
        } else if (status == 1) {
          return this.$t('competition.before')
        } else {
          return this.$t('competition.close')
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .def_cover{
    background-image:url('~@/assets/img/ad5/competition/cover.jpg');
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .filter_group{
    text-align:right;
  }
  .not_begin{
    background:#2c326e!important;
    color:#fff!important;
    cursor:default!important;
  }
  .is_begin{
    background:#3074fd!important;
    color:#fff!important;
  }
  .is_end{
    background:#2c326e!important;
    color:#fff!important;
  }
  .math_lable{
    position:absolute;
    left:0;
    bottom:0;
    line-height:30px;
    text-align:center;
    width:100%;
    color:#fff;
  }
  .blues{
    background:rgba(48,116,253,.6)
  }
  .huang{
    background:rgba(246,162,1,.6)
  }
  .hui{
    background:rgba(68,68,68,.8)
  }
  .match_type{
    height:30px;
    display:inline-block;
    margin-right:12px;
    position:relative;
  }
  .match_type_jad,
  .match_type_devops,
  .match_type_attack,
  .match_type_new_attack,
  .match_type_layered,
  .match_type_rw,
  .match_type_theory{
    .icon{
      position:absolute;
      left:0;
      top:0;
      z-index:5;
    }
    .label_txt{
      width:100%;
      border-radius 20px;
      color:#fff;
      text-align:center;
      display:inline-block;
    }
  }
  .match_type_jad{
    .icon{
      background:url('~@/assets/img/ad5/competition/jieti.png');
      background-size:100% 100%;
    }
    .label_txt{
      background:rgba(80,87,255,.6);
      border:1px solid rgba(80,87,255,1)
    }
  }
  .match_type_attack{
    .icon{
      background:url('~@/assets/img/ad5/competition/chuantgf.png');
      background-size:100% 100%;
    }
    .label_txt{
      background:rgba(246,162,1,.6);
      border:1px solid rgba(246,162,1,1)
    }
  }
  .match_type_new_attack{
    .icon{
      background:url('~@/assets/img/ad5/competition/xingongf.png');
      background-size:100% 100%;
    }
    .label_txt{
      background:rgba(255,131,71,.6);
      border:1px solid rgba(255,131,71,1)
    }
  }
  .match_type_devops{
    .icon{
      background:url('~@/assets/img/ad5/competition/yunw.png');
      background-size:100% 100%;
    }
    .label_txt{
      background:rgba(2,166,159,.6);
      border:1px solid rgba(2,166,159,1)
    }
  }
  .match_type_layered{
    .icon{
      background:url('~@/assets/img/ad5/competition/layered.png');
      background-size:100% 100%;
    }
    .label_txt{
      background:rgba(0,84,255,.2);
      border:1px solid rgba(0,84,255,1)
    }
  }
  .match_type_rw{
    .icon{
      background:url('~@/assets/img/ad5/competition/realWorld.png');
      background-size:100% 100%;
    }
    .label_txt{
      background:rgba(0,84,255,.2);
      border:1px solid rgba(0,84,255,1)
    }
  }
  .match_type_theory{
    .icon{
      background:url('~@/assets/img/ad5/competition/theory.png');
      background-size:100% 100%;
    }
    .label_txt{
      background:rgba(255,125,98,.3);
      border:1px solid rgba(255,125,98,1)
    }
  }
  #competition {
    .gf-wrap {
      position: relative;
      padding-bottom: 60px;
      margin: 0 auto;
      padding-top: 30px;

      .page_wrap {
        position: absolute;
        bottom: -20px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
    }

    .competition_list_inner {
      width: 100%;
    }

    .competition_list_inner * {
      font-family: '微软雅黑', Arial !important;
    }

    .competition_list_inner li {
      width: 100%;
      background: -webkit-linear-gradient(rgba(36,42,103,.8), rgba(23,27,67,.8)); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(rgba(36,42,103,.8), rgba(23,27,67,.8)); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(rgba(36,42,103,.8), rgba(23,27,67,.8)); /* Firefox 3.6 - 15 */
      background: linear-gradient(rgba(36,42,103,.8), rgba(23,27,67,.8)); /* 标准的语法（必须放在最后） */
      border-radius 5px;
      border:none!important;
      position: relative;
      text-align: left;
    }

    .competition_list_inner li:nth-child(1) {
      border-top: 1px solid #0A325B;
    }

    .competition_ofone {
      width: 100%;
      display: inline-block;
      position: relative;
    }

    a:hover {
      text-decoration: none;
    }

    .compet_txt {
      .brief_info{
        color:#aaaeba!important;
      }
      width: 100%;
    }

    .look_btn {
      width: 240px;
      height: 36px;
      position: absolute;
      top: 16%;
    }

    .look_btn .search_competition_btn {
      width: 140px;
      height: 36px;
      line-height: 36px;
      position: relative;
      float: right;
      cursor: pointer
      border-radius 5px;
    }

    .search_competition_btn {
      border: none;
      display: inline-block;
      text-align: center;
      line-height: 46px;
      color: white;
    }

    .look_btn .search_competition_btn:hover {
      color: white;
    }

    .look_btn .search_competition_btn:before {
      display: none;
    }

    .available {
      color: #333;
    }

    .daterangepicker .active {
      background: #5cb85c;
      border-radius: 4px;
    }

    .daterangepicker th {
      color: #333;
    }

    .sel_type {
      width: 250px;
      height: 46px;
      background-color: rgba(0, 0, 0, 0.3) !important;
      color: gray !important;
    }

    .date_change {
      width: 250px;
      height: 46px;
      display: inline-block;
      vertical-align: 1px;
      position: relative;
      margin-right: 10px;
    }

    .date_change i {
      color: #3D5C77;
    }

    .payed {
      background: url('~@/assets/img/button/list_btn2.png') no-repeat !important;
      background-size: 100% 100% !important;
    }

    .competition_status {
      height: 23px;
      display: inline-block;
      border-radius: 5px;
      font-size: 12px;
      text-align: center;
      line-height: 22px;
      margin-left: 10px;
      vertical-align: middle;
      padding: 0px 10px;
    }

    .closed_label {
      color: #9d9a95;
      border: 1px solid #9d9a95;
    }

    .doing_label {
      color: #017efc;
      border: 1px solid #017efc;
    }

    .before_label {
      color: #ff900e;
      border: 1px solid #ff900e;
    }

    .compet_img {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      position: absolute;
      left: 0;
      top: 0;
      border-radius 6px;
      overflow hidden;
    }

    .create_match {
      margin-left: 10px
      width: 230px;
      height: 40px;
      background: url('~@/assets/img/big_list_btn.png') no-repeat !important;
      background-size: 100% 100% !important;
      text-align: center;
      line-height: 40px;
      font-size: 18px;
      float: left
      cursor: pointer;
      color: #fff;
    }

    .create_match a {
      width: 100%;
      height: 100%;
      display: inline-block;
      color: #fff !important;
    }

    .create_match a:hover {
      color: #fff !important;
    }

    .search_match {
      float: right
      .el-input-group__append{
        background: url('~@/assets/img/button/list_btn.png') no-repeat;
        background-size: 100% 100%;
        color #fff;
        border :none;
        border-radius:0px
      }
      .el-input__inner{
        border-radius:0;
        border :2px solid #053a66;
      }
    }

    .brief_info {
      color: #9cbad0;
    }

    a:hover, a:focus {
      text-decoration: none !important;
    }

    .page_position {
      position: absolute;
      bottom: 20px;
      opacity: 0;
      transition: 1s;
    }

    .compet_txt h3 .competition_name {
      max-width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
    .pagination_box{
      height:32px;
    }
    .bnSize{
      border-radius 0;
    }
    @media (min-width: 1800px) {
      .competition_info{
        line-height:22px;
        margin-bottom:8px;
      }
      .match_type_jad,
      .match_type_devops,
      .match_type_attack,
      .match_type_new_attack,
      .match_type_layered,
      .match_type_rw,
      .match_type_theory{
        .icon{
          width:30px;
          height:30px;
        }
        .label_txt{
          padding:4px 8px 4px 36px;
          font-size:14px;
          margin-top:3px;
        }
      }
      .gf-wrap {
        width: 1200px;
      }
      .bnSize{
        padding:12px 20px!important;
      }
      .bnSize:nth-child(2){
        padding:12px 30px!important;
      }
      .competition_list_inner li {
        padding: 20px 220px 20px 25px!important;
        height: 200px!important;
        margin-bottom:25px;
      }

      .competition_ofone {
        padding-left: 300px;
      }

      .compet_img {
        width: 260px!important;
        height: 158px!important;
      }

      .compet_txt {
        margin-top: 0;
      }

      .compet_txt h3 {
        margin-bottom: 12px;
        .competition_name{
          vertical-align: -6px;
          font-size: 20px;
          height:24px;
        }
      }

      .brief_info {
        line-height: 24px;
        margin-top: 5px;
      }

      .look_btn {
        right: 20px;
      }
    }
    @media (max-width: 1800px) and (min-width: 1580px) {
      .competition_info{
        line-height:22px;
        margin-bottom:8px;
      }
      .match_type_jad,
      .match_type_devops,
      .match_type_attack,
      .match_type_new_attack,
      .match_type_layered,
      .match_type_rw,
      .match_type_theory{
        .icon{
          width:30px;
          height:30px;
        }
        .label_txt{
          padding:4px 8px 4px 36px;
          font-size:14px;
          margin-top:3px;
        }
      }
      .gf-wrap {
        width: 1200px;
      }
      .bnSize{
        padding:12px 20px!important;
      }
      .bnSize:nth-child(2){
        padding:12px 30px!important;
      }
      .competition_list_inner li {
        padding: 20px 220px 20px 25px!important;
        height: 200px!important;
        margin-bottom:25px;
      }

      .competition_ofone {
        padding-left: 300px;
      }

      .compet_img {
        width: 260px!important;
        height: 158px!important;
      }

      .compet_txt {
        margin-top: 0;
      }

      .compet_txt h3 {
        margin-bottom: 15px;
        .competition_name{
          vertical-align: -6px;
          font-size: 20px;
          height:26px;
        }
      }

      .brief_info {
        line-height: 24px;
        margin-top: 5px;
      }

      .look_btn {
        right: 20px;
      }
    }
    @media (max-width: 1580px) and (min-width: 1300px) {
      .competition_info{
        line-height:18px;
        margin-bottom:4px;
      }
      .match_type_jad,
      .match_type_devops,
      .match_type_attack,
      .match_type_new_attack,
      .match_type_layered,
      .match_type_rw,
      .match_type_theory{
        .icon{
          width:22px;
          height:22px;
        }
        .label_txt{
          padding:2px 6px 3px 24px;
          font-size:12px;
          margin-top:1px;
        }
      }
      .gf-wrap {
        width: 1040px;
      }
      .bnSize{
        padding:8px 10px!important;
      }
      .bnSize:nth-child(2){
        padding:8px 16px!important;
      }
      .competition_list_inner li {
        padding: 20px 185px 15px 20px!important;
        height: 156px!important;
        margin-bottom:15px;
      }

      .competition_ofone {
        padding-left: 220px;
      }

      .compet_img {
        width: 200px!important;
        height: 118px!important;
      }

      .compet_txt {
        margin-top: 4px;
      }

      .compet_txt h3 {
        margin-bottom: 0;
        .competition_name{
          vertical-align: -4px;
          font-size: 18px;
          height:22px;
        }
      }

      .brief_info {
        line-height: 20px;
        margin-top: 0;
      }

      .look_btn {
        right: 0;
      }
    }
    @media (max-width: 1300px) {
      .competition_info{
        line-height:20px;
        margin-bottom:4px;
      }
      .match_type_jad,
      .match_type_devops,
      .match_type_attack,
      .match_type_new_attack,
      .match_type_layered,
      .match_type_rw,
      .match_type_theory{
        .icon{
          width:22px;
          height:22px;
        }
        .label_txt{
          padding:2px 6px 3px 24px;
          font-size:12px;
          margin-top:1px;
        }
      }
      .gf-wrap {
        width: 1085px;
      }
      .bnSize{
        padding:8px 10px!important;
      }
      .bnSize:nth-child(2){
        padding:8px 16px!important;
      }
      .competition_list_inner li {
        padding: 20px 185px 15px 20px!important;
        height: 156px!important;
        margin-bottom:15px;
      }

      .competition_ofone {
        padding-left: 220px;
      }

      .compet_img {
        width: 200px!important;
        height: 118px!important;
      }
      .compet_txt {
        margin-top: 4px;
      }

      .compet_txt h3 {
        margin-bottom: 0;
        .competition_name{
          vertical-align: -4px;
          font-size: 18px;
          height:22px;
        }
      }

      .brief_info {
        line-height: 20px;
        margin-top: 0;
      }

      .look_btn {
        right: 0;
      }
    }
  }
</style>
