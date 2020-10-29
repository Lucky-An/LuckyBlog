<template>
  <div id="strategy" class="noticeDetail">
    <div class="introduction_to_play clearfix">
      <div class="play_info_wrap">
        <div class="info_wrap">
          <h3>{{noticeDetail.title}}
          </h3>
          <div class="release_time">
            <span>{{$t('dialog_list.releaseTime')}}:</span>
            <span>{{noticeDetail.create_time}}</span>
          </div>
          <div class="play_info_content my-markdown-body text-left" v-html="noticeDetail.content"></div>
        </div>
      </div>

      <div id="news_list" class="game_news_wrap">
        <div class="match_news mrg25B">
          <h3 class="content_title">
            {{$t('dialog_list.play_info')}}
          </h3>
          <span @click="gorule">
                        <img src="@/assets/img/play_game.jpg" alt="" width="100%"
                             style="margin-top:18px;cursor:pointer;">
                        <div style="color:white;margin:12px 0;line-height:20px;">
                            {{$t('dialog_list.play_rule')}}
                        </div>
                    </span>
        </div>

        <div class="match_news mrg25B">
          <h3 class="content_title">
            {{$t('dialog_list.competition_news')}}
          </h3>
          <ul class="content_list">
            <li v-for="item in match_notice">
              <a :href="'https://www.xctf.org.cn/library/details/'+item.id" :title="item.title" class="news_title">
                <i class="el-icon-caret-right" style="font-size:16px;"></i>
                <span class="ellipsis_txt"
                      style="width: 92%; vertical-align: -4px;">{{item.title}}</span>
              </a>
              <div class="news_content" v-text="removeHTML(item.content,35)"></div>
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
        noticeDetail: {},
        match_notice:[]
      }
    },
    created () {
      this.getList()
      this.getDetail()
    },
    methods: {
      gorule () {
        this.$router.push({path: '/strategy', query: {id: this.newsList.introduce.id}})
      },
      removeHTML (str, n) {
        return filter_content(str, n)
      },
      getDetail () {
        const id = this.$route.query.id
        if (id) {
          this.$http.get('/api/users/notice/' + this.$route.query.id).then(res => {
            this.noticeDetail = res.data
          })
          this.$http.get('/api/users/news').then(res => {
            this.match_notice = res.data.news;
          })
        }

      },
      getList () {
        this.$http.get('/api/users/informations').then(res => {
          this.newsList = res.data;

        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

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
      min-height: 684px;

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
  .noticeDetail {

    .play_info_content {
      color: #fff;
      text-align left;
      line-height: 24px;

      h4 {
        font-size: 18px;
      }

      .h4, .h5, .h6, h4, h5, h6, p {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      table {
        tr,tr:nth-child(2n){
          background none;

        }
      }
    }

  }
</style>
