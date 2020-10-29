<template>
  <div>
    <div class="guide_wrap" v-if="match_data.index" style="padding-top:60px;">
      <ul class="introduce">
        <li class="list" v-for="(item,i) in match_data.index">
          <div class="guide_title">
            <div class="title_index">
              <span>{{i+1}}</span>
            </div>
            <div class="title_name">{{$t('guide.'+item.title)}}</div>
          </div>
          <div class="guide_content">
            <div style="margin-bottom:6px;"
                 v-if="item.title=='description'||item.title=='competition_guide'">
              <div v-html="change_contact(item)"></div>
            </div>
            <div style="margin-bottom:6px;"
                 v-if="item.title=='task_category'">
              <div v-for="type in item.content">{{type}}</div>
            </div>
            <div style="margin-bottom:6px;"
                 v-if="item.title=='competition_rule'||item.title=='score_ranking'||item.title=='reward'||item.title=='matters_needing_attention'||item.title=='organizational_unit'">
              <div v-html="change_contact(item)"></div>
            </div>
            <div style="margin-bottom:6px;"
                 v-if="item.title=='contact_way'">
              <div v-html="change_contact(item)"></div>
            </div>
            <div style="margin-bottom:6px;"
                 v-if="item.title=='propositional_team'">
              <div v-text="change_lang(item)"></div>
            </div>
            <div style="margin-bottom:6px;" v-if="item.title=='company'">
              <div class="logo_list" >
                <img :src="item.content" width="80%">
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div style="margin-top:100px;" v-else>
      <img src="@/assets/img/kong.png" alt="">
    </div>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
  const { mapState } = createNamespacedHelpers('match');
  export default {
    name: 'competition_introduce',
    data(){
      return{}
    },
    methods:{
      change_lang(item){
        return this.$i18n.locale == 'EN' ? item.content[item.title+'_en'] : item.content[item.title+'_zh']
      },
      change_contact(data){
        if(this.$i18n.locale=='EN'){
          return '<div class="tui-editor-contents">' + this.$marked(data.content[data.title+'_en']) +'</div>';
        }else{
          return '<div class="tui-editor-contents">' + this.$marked(data.content[data.title+'_zh']) +'</div>';
        }
      },
    },
    computed:{
      ...mapState(['match_data'])
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~@/common/stylus/mixin.styl'
  .guide_wrap
    width:1220px;
    .list
      text-align:left
      .guide_title
        .title_index
          height: 52px;
          width: 52px;
          position: relative;
          border-radius: 50%;
          display:inline-block;
          border: 1px dashed lightblue;
          &:after
            content:'';
            width: 8px;
            height: 8px;
            position: absolute;
            right: -2px;
            top: -2px;
            border-radius: 50%;
            background-color:lightblue;
          span
            display: inline-block;
            border-radius: 50%;
            color: rgb(7, 31, 59);
            font-size: 30px;
            width: 43px;
            line-height: 43px;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color:lightblue;
            color:white;
        .title_name
          font-size:22px;
          color:lightblue;
          line-height:52px;
          display:inline-block;
          vertical-align top;
          margin-left:5px;
      .guide_content
        color:contentColor;
        padding:8px 35px 22px;
        border-left:1px dashed lightblue;
        margin-left:25px;
        line-height:20px;
        font-size:14px;
        a
          color:contentColor
        .logo_list
          margin-bottom:15px;
          .label_title
            color:lightblue
            font-size:18px;
            font-weight:bold;
            line-height:55px;
            display:inline-block;
            width:90px;
          .logo_wrap
            vertical-align:middle;
            width:100%;
            img
              width:165px;
              height:48px;
              border-radius:5px;
              margin-right:30px;
              margin-bottom:5px;
              display:inline-block;

</style>

