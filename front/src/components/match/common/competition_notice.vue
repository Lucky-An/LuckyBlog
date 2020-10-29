<template>
  <div>
    <div class="guide_wrap" style="padding:0;">
      <ul v-if="notice_list&&notice_list.length" class="i_am_notice" style="padding:0;">
        <li v-for="item in notice_list">
          <div v-if="item.task">
            <div class="notice_title">hint for {{item.task.title}}</div>
            <div class="notice_content" v-html="$i18n.locale=='EN' ? item.notice : item.notice"></div>
          </div>
          <div class="notice_content" v-else v-html="$i18n.locale=='EN' ? item.notice : item.notice"></div>
          <div class="notice_time">
            {{item.create_time}}<i v-if="item.is_topped" class="be_toped">{{$t('message.toped')}}</i>
          </div>
        </li>
      </ul>
      <div class="text-center pad50T" v-else>
        <img src="@/assets/img/kong.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import {getStorage} from '@/utils/storage'

  export default {
    components:{

    },
    name: "notice_list",
    props:['notice_list'],
    created(){
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .guide_wrap
    ul
      li
        width:100%;
        border:1px solid darkblue
        padding:6px 15px;
        margin-bottom:20px;
        position:relative;
        edge-angle();
        .notice_time
          color:fontSkyblue
          line-height:30px;
          font-size:16px;
          text-align:left;
          .be_toped
            background:lightblue;
            color:white;
            border-radius:3px;
            width:40px;
            height:20px;
            line-height:20px;
            text-align:center;
            font-size:12px;
            display:inline-block;
            margin-left:15px;
            vertical-align:3px;
        .notice_title
          margin:10px 0;
          color:white;
          text-align:left;
          font-size:16px;
        .notice_content
          padding:10px 0 6px;
          text-align:left;
          color:white;
          font-size:16px;
          line-height:26px;
</style>
