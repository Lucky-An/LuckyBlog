<template>
  <div id="competition">
    <div class='gf-wrap'>
      <div class="clearfix" style="margin-bottom:8px;">

        <div class="create_match"  v-if="user_auth.classes==2||user_auth.classes==3" @click="createMatch">
          <!--<router-link to="/common/createMatch" class="btn">-->
          {{$t('competition.createCompetition')}}
          <!--</router-link>-->
        </div>

        <div class="create_match"  v-if="user_auth.classes==2||user_auth.classes==3">
          <router-link to="/competition/manageCenter" class="btn">
            {{$t('selfHelp_competition.contest_manage')}}
          </router-link>
        </div>

        <div class="search_match">
          <el-input
                  style="width: 400px;"
                  :placeholder="$t('selfHelp_competition.search_keyword')"
                  v-model="search" class="input-with-select">
            <el-button slot="append"  @click="getList" icon="el-icon-search">{{$t('selfHelp_competition.search')}}</el-button>
          </el-input>
        </div>
      </div>
      <ul class="competition_list_inner">
        <li v-for="item in list">
          <router-link :to="{path:'/competition/detail',query:{id:item.id,hash:item.hash}}" class="competition_ofone">
            <span class="compet_img" :style="{backgroundImage:'url(' + item.cover + ')'}"></span>
            <div class="compet_txt clearfix">
              <h3 class="whiteC mrg0T">
                              <span class="competition_name">
                                  {{$i18n.locale=='EN'? item.name_en : item.name_zh}}
                              </span>
                <span class="">
                                  <span class="competition_status"
                                        :class="{'doing_label':item.process==0,'before_label':item.process==1,'closed_label':item.process==2}"
                                        v-text="label_status(item.process)"
                                  >
                                  </span>
                              </span>
              </h3>
              <div class="clearfix">
                <div class="fl" style="margin-right:60px;">
                  <div style="color:#9cbad0;line-height:22px;margin-bottom:6px;">
                                        <span>{{$t('competition.competitionMode')}}：<span class="whiteC"
                                                                                          v-text="getmode(item.mode)"></span>
                                        </span>
                  </div>
                </div>
                <div class="fl">
                  <div style="color:#9cbad0;line-height:22px;margin-bottom:6px;">
                                        <span>{{$t('competition.startTime')}}：<span
                                                class="whiteC">{{item.start_time}}——</span>
                                          <span class="whiteC">{{item.end_time}}</span>
                                        </span>
                  </div>
                </div>
              </div>
              <div class="brief_info">
                {{$i18n.locale=='CN' ? delHtmlTag(item.description_zh).slice(0,90)+'…' :
                delHtmlTag(item.description_en).slice(0,90)+'…'}}
              </div>
            </div>
          </router-link>
          <div class="look_btn">
            <router-link :to="{path:'/competition/detail',query:{id:item.id,hash:item.hash}}"
                         class="search_competition_btn">{{$t('competition.introduce')}}
            </router-link>
            <router-link
                    :to="{path:'/adw/match/jeopardy/guide',query:{event:item.id,hash:item.hash}}"
                    class="mrg20R join_btn search_competition_btn"
                    v-if="!item.is_sponsor"
                    target="_blank"
            >{{item.process==2 ? $t('competition.review'):$t('competition.joinCompetition')}}
            </router-link>
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
  import page from '@/components/common_components/pagination'
  import {getStorage} from '@/utils/storage'

  export default {
    components: {
      page,
    },
    name: 'competition_list',
    data () {
      return {
        pager: {//页码
          currentPage: 1,//当前第几页
          pageSize: 4,//每页多少条
          total: 0,//总共多少条
          layout: 'prev, pager, next',
          class: 'bluepage'
        },
        list: [],
        search:"",//搜索的内容
        user_auth: (getStorage('isUserLogin', 'object')).user || {classes: -1},
      }
    },
    created () {
      this.change_wrapHeight()
      let that = this
      window.onresize = function () {
        that.change_wrapHeight()
      }
      this.getList()
    },
    methods: {
      delHtmlTag (str) {
        str = this.$marked(str)
        str = str.replace(/<\/?[^>]*>/g, '') //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n') //去除行尾空白
//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/&nbsp;/ig, '')//去掉&nbsp;
        return str
        // return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
      },
      createMatch () {
        this.$http.get('/api/sponsor/create_event').then((res) => {//判断是否还可以继续创建比赛
          if (res.data.success) {
            this.$router.push({
              path: '/common/createMatch'
            })
          }

        })
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
        this.$http.get('/api/evts/list', {
          params: {
            limit: this.pager.pageSize,
            offset: (this.pager.currentPage - 1) * this.pager.pageSize,
            search:this.search
          }
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
      change_wrapHeight () {
        // var minH = $(window).height() - $('#header').height() -30;
        // $('.gf-wrap').css({
        //   'height':minH,
        //   'minHeight':$('.competition_list_inner').height()+120
        // })
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
<style lang="stylus" rel="stylesheet/stylus">
  #competition {
    .gf-wrap {
      position: relative;
      padding-bottom: 60px;
      margin: 0 auto;
      padding-top: 20px;

      .page_wrap {
        position: absolute;
        bottom: -20px;
        bottom: -20px;
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
      border-bottom: 1px solid #0A325B;
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
      width: 100%;
    }

    .look_btn {
      width: 240px;
      height: 36px;
      position: absolute;
      top: 36%;
    }

    .look_btn .search_competition_btn {
      width: 106px;
      height: 36px;
      line-height: 36px;
      position: relative;
      float: right;
      cursor: pointer
    }

    .search_competition_btn {
      background: url('~@/assets/img/button/list_btn.png') no-repeat;
      background-size: 100% 100%;
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
      vertical-align: -6px;
      font-size: 20px;
    }
    @media (min-width: 1800px) {
      .gf-wrap {
        width: 1200px;
        height: 800px;
      }

      .competition_list_inner li {
        padding: 15px 275px 12px 0;
        height: 167px;
      }

      .competition_ofone {
        padding-left: 270px;
      }

      .compet_img {
        width: 235px;
        height: 135px;
      }

      .compet_txt {
        margin-top: 10px;
      }

      .compet_txt h3 {
        margin-bottom: 15px;
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
      .gf-wrap {
        width: 1200px;
        height: 680px;
      }

      .competition_list_inner li {
        padding: 7px 275px 12px 0;
        height: 140px;
      }

      .competition_ofone {
        padding-left: 270px;
      }

      .compet_img {
        width: 235px;
        height: 122px;
      }

      .compet_txt {
        margin-top: 5px;
      }

      .compet_txt h3 {
        margin-bottom: 8px;
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
      .gf-wrap {
        width: 1150px;
        height: 620px;
      }

      .competition_list_inner li {
        padding: 7px 275px 12px 0;
        height: 120px;
      }

      .competition_ofone {
        padding-left: 270px;
      }

      .compet_img {
        width: 235px;
        height: 105px;
      }

      .compet_txt {
        margin-top: 5px;
      }

      .compet_txt h3 {
        margin-bottom: 8px;
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
      .gf-wrap {
        width: 1150px;
        height: 620px;
      }

      .competition_list_inner li {
        padding: 7px 275px 12px 0;
        height: 120px;
      }

      .competition_ofone {
        padding-left: 270px;
      }

      .compet_img {
        width: 235px;
        height: 105px;
      }

      .compet_txt {
        margin-top: 5px;
      }

      .compet_txt h3 {
        margin-bottom: 8px;
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
