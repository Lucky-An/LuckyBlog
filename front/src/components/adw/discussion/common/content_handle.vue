<template>
  <div class="content_handle">
    <div style="display: inline-block" v-if="data.type!==3">
      <div class="thumb" @click="thumb_handle" :class="{'thumb_active':data.is_thumb}">
        <i class="iconfont icon-dianzan"></i>
        <span>{{data.thumb_number}}</span>
      </div>
      <div class="comment" @click="show_comment">
      <span v-if="!comment_status">
        <i class="iconfont icon-pinglun"></i>
        <span>{{data.comment_number}}条评论</span>
      </span>
        <span v-else>
         <i class="iconfont icon-pinglun"></i>
        <span>收起评论</span>
      </span>
      </div>
      <div class="answer">
        <i class="iconfont icon-answer"></i>
        <span>{{data.answer_number}}条回答</span>
      </div>
      <div class="share">
        <i class="iconfont icon-fenxiang"></i>
        <span>分享</span>
      </div>
      <div class="collect" :class="{'collect_active':data.is_collect}">
        <i class="iconfont icon-shoucang"></i>
        <span v-text="data.is_collect ? '已收藏' : '收藏'"></span>
      </div>
      <div class="edit" v-if="data.is_current">
        <i class="el-icon-edit-outline"></i>
        <span>编辑</span>
      </div>
      <div class="delete" v-if="data.is_current">
        <i class="el-icon-delete"></i>
        <span>删除</span>
      </div>
    </div>
    <span class="shrink_content" :class="{'advice_btn':data.type==3}" v-if="data.showLookLabel">
        <span class="show_content" @click="change_art" v-if="!data.showAll">
          <span>阅读全文</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <span class="hide_content" @click="change_art" v-else>
          <span>收起</span>
          <i class="el-icon-arrow-up"></i>
        </span>
      </span>
  </div>
</template>

<script>
  import comment from '@/components/common_components/comment'
  export default {
    components:{
      comment
    },
    name: 'content_handle',
    props:['data','index'],
    data(){
      return{
        comment_status:false
      }
    },
    created(){
      this.comment_status = this.data.show_comment;
    },
    methods:{
      thumb_handle(){
        if(this.data.is_thumb){
          return
        }
        alert('点赞')
      },
      show_comment(){
        this.comment_status = !this.comment_status;
        this.$emit('showComment',{
          index:this.index,
          status:this.data.show_comment
        })
      },
      change_art(){
        this.$emit('changeLookBtn',{
          index:this.index,
          status:!this.data.showAll
        });
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .content_handle
    margin-top:12px;
    font-size:14px;
    color:darkblue2;
    .thumb,.comment,.answer,.share,.collect,.edit,.delete
      display:inline-block;
      margin-right:18px;
      cursor:pointer;
      i,span
        vertical-align:middle;
      i
        font-size:18px;
    .thumb
      padding:4px 8px;
      background:darkblue;
      border-radius:4px;
    .collect_active,.thumb_active
      color:lightblue
    .shrink_content{
      margin-top:5px;
      float:right;
      cursor:pointer;
    }
    .advice_btn{
      margin-top:-30px;
    }
</style>
