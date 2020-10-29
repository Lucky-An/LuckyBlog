<template>
  <div class="question_content">
    <div class="user">
      <span class="article_type_label" v-if="cover.type==2" style="vertical-align: middle;">答</span>
      <span class="user_logo" :style="{background: 'url('+ user.logo +')',backgroundSize:'cover' }"></span>
      <span class="user_name">{{user.name}}</span>
    </div>
    <!--列表封面-->
    <div class="question_inner" :class="{'no_border':cover.type==2}" v-if="!cover.showAll" @click="contentHandle">
      <div class="imgae_url" v-if="hasCover">
        <img src="@/assets/img/play_game.jpg" class="imgae_url" alt="">
        <!--<span style="background:url(../../../assets/img/def_icon.jpg)"></span>-->
      </div>
      <div class="right_main" :class="{'height_auto':cover.showAll}" ref="part_parent">
        <div class="main_part" v-html="cover.content" ref="part"></div>
        <div class="visible_bg" v-if="show_visible_bg"></div>
      </div>
    </div>
    <!--列表点击阅读全文后的主体内容-->
    <div class="question_inner" :class="{'no_border':cover.type==2}" v-else>
      <div class="right_main show_allover" :class="{'height_auto':cover.showAll}">
        <div class="main_part" v-html="content.content"></div>
      </div>
    </div>
    <div class="question_time">
      编辑于 2018-11-30
    </div>
  </div>
</template>

<script>
  export default {
    name: 'question_content',
    props:['content','cover','hasCover','index','type'],
    data(){
      return{
        user:{
          logo:'@/assets/img/def_icon.jpg',
          name:'张三的小兵'
        },
        show_visible_bg:true,
        content_status:null
      }
    },
    created(){
    },
    mounted(){
      this.init();
    },
    methods:{
      init() {
        let part_el_h = this.$refs.part.offsetHeight;
        let part__parent_el_h = this.$refs.part_parent.offsetHeight;
        if(part_el_h>part__parent_el_h){
          this.$emit('show_all',{
            number:this.index,
            status:true
          })
          this.show_visible_bg = true;
          this.content_status = 0;
        }else{
          if(this.cover.content.indexOf('[图片]')!==-1){
            this.$emit('show_all',{
              number:this.index,
              status:true
            })
            this.show_visible_bg = true;
            this.content_status = 0;
          }else{
            this.$emit('show_all',{
              number:this.index,
              status:false
            })
            this.show_visible_bg = false;
            this.content_status = 1;
          }
        }
      },
      contentHandle(){
        if(!this.content_status){
          this.cover.showAll = true;
        }else{
          this.$router.push({path:'/discussion/detail'})
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .question_content
    font-size:14px;
    .user
      margin-top:15px;
      .user_logo
        width: 30px;
        height: 30px;
        border: 1px solid white;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
      .user_name
        font-size: 14px;
        color: white;
        margin: 0 10px;
        font-weight: bold;
        font-family: '微软雅黑', arial;
    .question_inner
      cursor:pointer;
      width:100%;
      margin-top:12px;
      padding-bottom:20px;
      border-bottom:1px solid borderColor;
      .imgae_url
        border:1px solid rgba(255,255,255,.3);
        position: relative;
        width: 190px;
        height: 105px;
        margin-right: 18px;
        margin-bottom: 4px;
        float: left;
        background-size: cover;
        border-radius: 4px;
        span
          width:100%;
          height:100%;
          display:inline-block;
      .right_main
        max-height:105px;
        color:contentColor
        font-size:14px;
        line-height:20px;
        overflow:hidden;
        position:relative;
        .visible_bg
          width: 100%;
          height: 60px;
          background: url('~@/assets/img/art_bg.png') repeat-x;
          background-size: auto 100%;
          position: absolute;
          left: 0;
          bottom: 0;
      .show_allover
        overflow auto
        height:auto;
      .height_auto
        max-height:none!important;
    .no_border
      border-bottom:none;
    .question_time
      padding:6px 0;
      color:white;
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .article_type_label {
    width: 24px;
    height: 24px;
    background: #1390FF;
    color: white;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    display: inline-block;
    vertical-align: 3px;
  }
</style>
