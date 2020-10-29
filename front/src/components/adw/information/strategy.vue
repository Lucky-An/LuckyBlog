<template>
    <div id="strategy" class="home_rule_box">
        <div class="introduction_to_play clearfix">
            <div class="play_info_wrap">
                <img src="@/assets/img/play_game.jpg" alt="" width="100%" style="margin-bottom:30px;">
                <div class="info_wrap">
                    <h3>{{$t('dialog_list.play_info')}}</h3>
                    <div class="release_time">
                        <span>{{$t('dialog_list.releaseTime')}}:</span>
                        <span>{{detail.create_time}}</span>
                    </div>
                    <div class="play_info_content my-markdown-body" v-html="getContent()"></div>
                </div>
            </div>
            <div id="news_list" class="game_news_wrap">
                <div class="match_news mrg25B">
                    <h3 class="content_title">
                      {{$t('dialog_list.competition_news')}}
                    </h3>
                    <ul class="content_list">
                        <li v-for="item in match_notice">
                            <a :href="'https://www.xctf.org.cn/library/details/'+item.id" target="_blank" :title="item.title"
                               class="news_title">
                                <i class="el-icon-caret-right" style="font-size:16px;"></i>
                                <span class="ellipsis_txt"
                                      style="width: 92%; vertical-align: -4px;">{{item.title}}</span>
                            </a>
                            <div class="news_content">{{removeHTML(item.content,30)}}</div>
                        </li>
                    </ul>
                </div>
                <div class="match_news mrg25B">
                    <h3 class="content_title">
                      {{$t('dialog_list.sys_notice')}}
                    </h3>
                    <div v-if="!newsList.notices.length">
                      <img src="@/assets/img/kong.png" alt="" width="120" style="margin:50px auto;display:block;">
                    </div>
                    <ul class="content_list" v-else>
                        <li v-for="item in newsList.notices">
                            <router-link :to="{path:'/system_notice',query:{id:item.id}}" :title="item.title"
                                         class="news_title">
                                <i class="el-icon-caret-right" style="font-size:16px;"></i>
                                <span class="ellipsis_txt"
                                      style="width: 90%; vertical-align: -4px;">
                                  <span v-if="item.is_settop" class="istoped">{{$t('message.toped')}}</span>
                                  {{item.title}}
                                </span>
                            </router-link>
                            <div class="news_content">{{item.description.substring(0,30) + '...'}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {filter_content} from '@/utils/removeHTMLTag'

  export default {
    name: 'strategy',
    data () {
      return {
        newsList: {},
        detail: {},
        match_notice:[]
      }
    },
    created () {
      this.getList()
      this.getDetail()

    },
    methods: {
      removeHTML (str, n) {
        return filter_content(str, n)
      },
      getDetail () {
        const id=this.$route.query.id;
        if(id){
          this.$http.get('/api/users/introduce/' + this.$route.query.id).then(res => {
            this.detail = res.data
          })
        }

      },
      getList () {
        this.$http.get('/api/users/informations').then(res => {
          this.newsList = res.data
        })
        this.$http.get('/api/users/news').then(res => {
          this.match_notice = res.data.news;
        })
      },
      getContent(){
        if(this.detail.content){
          return this.$i18n.locale=='CN' ? '<div class="tui-editor-contents">'+this.detail.content+'</div>' : '<div class="tui-editor-contents">'+this.detail.content_en+'</div>';
        }else{
          return '<div class="text-center">loading……</div>';
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .istoped
      border:1px solid #0080ff;
      color:#0080ff;
      padding:0 5px;
      font-size:12px;
      border-radius:4px;
      height:18px;
      line-height:18px;
      display:inline-block;
    .introduction_to_play
        color: white;
        width: 1200px;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 60px;

        .play_info_wrap
            width: 74%;
            float: left;
            border: 1px solid #053968;
            padding: 20px 30px;
            overflow: hidden;

            .info_wrap
                h3
                    font-weight: bold;
                    text-align: center;
                    font-size: 24px;

                .release_time
                    color: #436d9d;
                    text-align: right;
                    margin-bottom: 30px;

        .game_news_wrap
            text-align: left;
            width: 23%;
            float: right;

            .match_news, .system_notice
                border: 1px solid #053968;
                padding: 18px 12px 5px;
                margin-bottom: 25px;

            .match_news
                height: 329px;

                .content_title
                    border-left: 3px solid #0080fd;
                    padding-left: 8px;
                    margin: 0;
                    color: #0080fd;
                    font-size: 24px;

                .content_list
                    li
                        border-bottom: 1px dashed #466a9e;
                        padding: 15px 0 10px;

                        &:last-child
                            border: none;

                        .news_title
                            color: white;
                            display: inline-block;
                            margin-bottom: 10px;
                            width: 100%;

                        .news_content
                            width: 100%;
                            color: #466a9e;
                            height: 40px;
                            line-height: 20px;

    /*@media (max-width:1300px)*/

    /*@media (min-width:1300px) and (max-width:1600px)*/

    /*@media (min-width:1600px) and (max-width:1920px)*/

    /*@media (min-width:1920px)*/


</style>
<style lang="stylus" rel="stylesheet/stylus">
    .home_rule_box{
      .play_info_content{
        text-align :left;

      }

    }
</style>
