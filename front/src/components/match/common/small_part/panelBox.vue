<template>
    <div class="panel_wrap">
      <div class="title" :class="{'small_title':small_title}">
        <span>{{title}}</span>
        <slot name="other_button"></slot>
      </div>
      <div class="content_wrap">
        <slot name="content_begin"></slot>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'panelBox',
    props:['title','small_title']
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
nav_bg = #272a49
 panel_bg = #1b1f3c
  .panel_wrap{
    background:panel_bg;
    border-radius 5px;
    .title{
      width:100%;
      line-height:48px;
      background:nav_bg;
      border-top-left-radius 5px;
      border-top-right-radius 5px;
      color:#fff;
      text-align:left;
      padding-left:25px;
      font-size:16px;
    }
    .small_title{
      width:100%;
      line-height:36px;
      background:nav_bg;
      border-top-left-radius 4px;
      border-top-right-radius 4px;
      color:#fff;
      text-align:left;
      padding-left:11px;
      font-size:16px;
    }
  }
</style>
