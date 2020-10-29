<template>
    <div id="start">
        <div class="container2 ad_sign_content">
            <div v-if="showLogin" style="text-align:center;">
                <router-link to="/login" class="ad_sign">{{$t('header.login')}}</router-link>
                <router-link to="/register" class="ad_sign">{{$t('login.register')}}</router-link>
            </div>

            <!--消息列表-->
            <ul id="news_list" class="bottom_notice clearfix">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <div class="holder_wrap">
                                <h4 class="ad_news">
                                    {{$t('dialog_list.competition_news')}}
                                </h4>
                                <div style="padding:15px;">
                                    <ul class="news_list news_wrap">
                                        <li class="clearfix" v-for="item in match_notice">
                                            <i class="el-icon-caret-right" style="font-size:16px;"></i>
                                            <a :href="'https://www.xctf.org.cn/library/details/'+item.id"
                                               target="_blank"
                                               :title="item.title">
                                                <span class="news_max_width">{{item.title}}</span>
                                                <time class="fr font12">{{item.time}}</time>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <div class="holder_wrap">
                                <h4 class="ad_info">
                                  {{$t('dialog_list.play_info')}}
                                </h4>
                                <div style="padding:15px;cursor:pointer;" >
                                    <span @click='gorule' >
                                        <img src="@/assets/img/play_game.jpg" alt="" width="100%">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <div class="holder_wrap">
                                <h4 class="ad_notice">
                                  {{$t('dialog_list.sys_notice')}}
                                </h4>
                                <div style="padding:15px;">
                                    <ul class="news_list news_wrap" v-if="newsList.notices.length">
                                        <li class="clearfix" v-for="item in newsList.notices">
                                            <i class="el-icon-caret-right" style="font-size:16px;"></i>
                                            <span v-if="item.is_settop" class="istoped">{{$t('message.toped')}}</span>
                                            <router-link :to="{path:'/system_notice',query:{id:item.id}}"
                                                         :title="item.title">
                                                <span class="news_max_width">{{item.title}}</span>
                                                <time class="fr font12">{{item.create_time}}</time>
                                            </router-link>
                                        </li>
                                    </ul>
                                    <div v-else>
                                      <img src="@/assets/img/kong.png" alt="" width="100">
                                      <div class="whiteC mrg10T">
                                        {{$t('team.noNotice')}}
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </ul>

            <!--QQ 和 微信-->
            <div class="contact_us">
              <div class="qq_logo">
                <div class="qq_qun_box">
                  <div class="qq_qun">
                    QQ交流群:118794
                  </div>
                </div>
              </div>
              <div class="wechart_logo">
                <div class="wx_qun_box">
                  <div class="wx_qun">
                    <p>微信交流群</p>
                    <div class="erweima"></div>
                  </div>

                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'start',
    data () {
      return {
        newsList: {
          notices:[]
        },
        match_notice:[],
        showLogin:true,
      }
    },
    created () {
      this.showLogin = localStorage.isUserLogin ?false  : true;
      this.getList()
    },
    methods: {
      gorule () {
        this.$router.push({path: '/strategy', query: {id: this.newsList.introduce.id}})
      },
      getList () {//获取新闻列表。
        this.$http.get('/api/users/informations').then(res => {
          this.newsList = res.data
        })
        this.$http.get('/api/users/news').then(res => {
          this.match_notice = res.data.news;
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #start
      width: 100%;
      height: calc(100% - 80px);
      background-image: url(/static/img/index2.jpg);
      background-position: center center;
      background-size: cover;
      .contact_us
        position :fixed;
        bottom: 280px;
        right: 10px;
        animation:mymove 2s infinite alternate linear;

        .qq_logo,.wechart_logo{
          width: 40px;
          height: 40px;
        }
        .qq_logo{
          margin-bottom: 10px
          background :url("~@/assets/img/qq.png")
          position :relative;
          .qq_qun_box{
            display :none;
            position :absolute;
            right: 40px;
            bottom: 0;
           .qq_qun{
             margin-right: 10px
             width: 137px;
             height: 24px;
             line-height: 24px;
             background-color: #0e1a28;
             border-radius: 3px;
             border: solid 1px #2f455f;
             color:#fff;
           }
          }
        }
        .qq_logo:hover .qq_qun_box{
          display :block;
        }
        .wechart_logo{
          background :url("~@/assets/img/wechart.png");
          .wx_qun_box{
            display :none;
            position :absolute;
            right: 40px;
            top: 50px;
            .wx_qun{
              margin-right: 10px
              width: 110px;
              height: 117px;
              background-color: #0e1a28;
              border-radius: 3px;
              border: solid 1px #2f455f;
              color:#fff;
              p{
                padding: 13px 0;
              }
              .erweima{
                margin: 0 auto;
                width: 68px;
                height: 68px;
                background :url("~@/assets/img/wechart_erwema.jpg");
              }
            }
          }
        }
        .wechart_logo:hover .wx_qun_box{
          display :block;
        }
      .ad_sign_content
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: auto;
      .container2
          .ad_sign, .ad_register
              confirm-btn-lg()
              font-size: 16px;
              color: #A3D8F8;
              set_bg('button/an.png')

              &:hover
                  color: lightblue;

          .ad_sign
              margin-right: 100px;

          .holder_wrap
              background: #0E1A28;
              height: 208px;

              h4
                  border-bottom: 1px solid lightblue;
                  padding: 12px;
                  color: lightblue;
                  margin: 0;
                  text-align: left;
                  font-size: 16px;

                  &:before
                      content: '';
                      width: 15px;
                      height: 15px;
                      display: inline-block;
                      margin-right: 10px;
                      vertical-align: -2px;

              .ad_news:before
                  set_bg('xw.png')

              .ad_notice:before
                  set_bg('mess.png')

              .ad_info:before
                  set_bg('wanfa.png')

              .news_list
                  li
                      border-bottom: 1px solid borderColor;
                      color: #337ab7;
                      line-height: 40px;
                      cursor: pointer;
                      text-align: left;

                      .news_max_width
                          white-space: nowrap;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          display: inline-block;
                          vertical-align: -13px;
                          color: #337ab7;

                      time
                          color: #337ab7;
                      .istoped
                        border:1px solid #0080ff;
                        color:#0080ff;
                        padding:0 5px;
                        font-size:12px;
                        border-radius:4px;
                        height:18px;
                        line-height:18px;
                        display:inline-block;
                        vertical-align:2px;
  @-webkit-keyframes mymove {
    0% {
    bottom: 370px;
    }
    50% {
      bottom: 340px;
    }
    100% {
      bottom: 370px;
    }
  }
  @media (max-width: 1300px)
      .container2
          width: 1200px;

          .bottom_notice
              margin-top: 40px;

              .news_max_width
                  max-width: 160px;

  @media (min-width: 1300px) and (max-width: 1600px)
      .container2
          width: 1200px;

          .bottom_notice
              margin-top: 70px;

              .news_max_width
                  max-width: 180px;

  @media (min-width: 1600px) and (max-width: 1920px)
      .container2
          width: 1370px;

          .bottom_notice
              margin-top: 90px;

              .news_max_width
                  max-width: 200px;

  @media (min-width: 1920px)
      .container2
          width: 1370px;

          .bottom_notice
              margin-top: 110px;

              .news_max_width
                  max-width: 210px;


</style>
