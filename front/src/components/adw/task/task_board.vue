<template>
    <div class="wraps">
      <div class="clearfix" style="height:25px;">

      </div>
      <!--<div class="clearfix">-->
      <!--<div class="rule" @click="dialogVisible = true">-->
      <!--<span class="rule_child" style="animation: rule_rotate2 0.3s linear forwards;">-->
      <!--<span class="rule_animate" style="animation: btn_hover2 0.4s linear forwards;"></span>-->
      <!--<span class="rule_animate"></span>-->
      <!--<span class="rule_animate" style="animation: btn_hover4 0.5s linear forwards;"></span>-->
      <!--</span>-->
      <!--<span>{{$t('task.ruleOfAnswer')}}</span>-->
      <!--</div>-->
      <!--</div>-->
      <div  class="card_main">
        <div class="card_nav">
          <ul>
            <li v-for="(item,i) in card_nav_data" :class="{'active_nav':now_checked_num==i}" @click="change_type(item,i)">{{item.name}}</li>
          </ul>
        </div>
        <div class="card_content">
          <div class="card_wrap" v-cloak>
            <div class="novice" >
              <router-link :to="{path:'/task/task_list',query: {type: checked_type,number:type_num,grade:0}}">
                <span  v-bind:style="{backgroundImage:'url(../../../static/img/g' + (now_checked_num*2+1) + '.jpg)'}"  class="typeBg"></span>
              </router-link>
              <span class="novicer"></span>
            </div>
            <div class="superior">
              <router-link :to="{path:'/task/task_list', query:{type:checked_type,number:type_num,grade:1}}">
                <span  v-bind:style="{backgroundImage:'url(../../../static/img/g' + (now_checked_num*2+2) + '.jpg)'}"  class="typeBg"></span>
              </router-link>
              <span class="superiorer"></span>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
          :title="$t('task.ruleOfAnswer')"
          :visible.sync="dialogVisible"
          width="900px"
          custom-class="ad_public_modal"
          >
          <p class="rules "style="text-align:left;" v-html="get_rule()"></p>
          <span slot="footer" class="dialog-footer">
          </span>
      </el-dialog>
    </div>
</template>

<script>

export default {
  name: 'answer',
  data(){
    return{
      card_nav_data:[],
      card_content_data:[],
      now_checked_num:0,
      checked_type:'',
      type_num:1,
      dialogVisible: false,
      rule:{}
    }
  },
  created(){
    this.$http.get('/api/tasks/categorys')
      .then((res)=>{
        this.card_nav_data = res.data;
        this.checked_type = res.data[0].name;
      })
      .catch((err)=>{

      })
    this.$http.get('/api/tasks/rules')
      .then((res)=>{
        this.rule = res.data;
      })
      .catch((err)=>{

      })
  },
  methods:{
    change_type(item,i){
      this.now_checked_num = i;
      this.checked_type = item.name;
      this.type_num = item.value;
    },
    get_rule(){
      if(this.rule.zh){
        if(this.$i18n.locale=='EN'){
          return this.$marked(this.rule.en);
        }else{
          return this.$marked(this.rule.zh);
        }
      }
    },
  },
  mounted(){
    var left = document.getElementsByClassName('novice')[0];
    var right = document.getElementsByClassName('superior')[0];
    var h = left.clientHeight;
    var rad = 20 * Math.PI/180;

    left.style.left = '-'+Math.tan(rad)*h/2+'px';
    right.style.right = '-'+Math.tan(rad)*h/2+'px';
    window.onresize=function(){
      var h = left.clientHeight;
      var rad = 20 * Math.PI/180;

      left.style.left = '-'+Math.tan(rad)*h/2+'px';
      right.style.right = '-'+Math.tan(rad)*h/2+'px';
    }

    $('.rule').hover(function(){
      $(this).find('.rule_child').css('animation',"rule_rotate .1s .2s linear forwards");
      $(this).find('.rule_child .rule_animate').eq(0).css('animation',"btn_hover1 .5s linear forwards");
      $(this).find('.rule_child .rule_animate').eq(2).css('animation',"btn_hover3 .6s linear forwards");
    },function(){
      $(this).find('.rule_child').css('animation',"rule_rotate2 0.3s linear forwards");
      $(this).find('.rule_child .rule_animate').eq(0).css('animation',"btn_hover2 0.4s linear forwards");
      $(this).find('.rule_child .rule_animate').eq(2).css('animation',"btn_hover4 0.5s linear forwards");
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/common/stylus/mixin.styl";
  .wraps
    margin:0 auto;
    margin-top:20px;
    .rule
      width:170px;
      height:50px;
      font-size:14px;
      color:white;
      float:right;
      background: url('~@/assets/img/answer/rule.png')no-repeat;
      line-height 50px;
      cursor: pointer;
      .rule_child
        display: inline-block;
        margin-right: 6px;
        margin-left: -5px;
        .rule_animate
          display: block;
          margin-bottom: 4px;
          background: url('~@/assets/img/answer/rule_child.png')no-repeat;
          background-size: 100% 100%;
          transition: .3s;
    .card_main
      margin-top:30px
      .card_nav
        width:100%;
        margin-bottom:35px
        ul
          width:100%;
          text-align:center;
          transform: translateX(25px);
          li
            background:url('~@/assets/img/nav1.png')no-repeat
            background-size:100% 100%
            display:inline-block
            color:#6183a9
            font-family:'myfont'
            font-size:26px;
            cursor:pointer;
            margin-left:-50px;
            position:relative;
            transition:.4s;
            &:hover
              color:white;
              background:url('~@/assets/img/nav2.png')no-repeat
              background-size:100% 100%
              z-index:20!important
              transform:scale(1.1);
            &:nth-child(1)
              z-index:10
            &:nth-child(2)
              z-index:9
            &:nth-child(3)
              z-index:8
            &:nth-child(4)
              z-index:7
            &:nth-child(5)
              z-index:6
            &:nth-child(6)
              z-index:5
            &:nth-child(7)
              z-index:4
            &:nth-child(8)
              z-index:3
            &:nth-child(9)
              z-index:2
            &:nth-child(10)
              z-index:1
          .active_nav
            color:white;
            background:url('~@/assets/img/nav2.png')no-repeat
            background-size:100% 100%
            z-index:20!important
            transform:scale(1.1);
      .card_content
        .card_wrap
          position:relative;
          margin:20px auto;
          overflow: hidden;
          .novice
            transform:skew(20deg,0deg);
            position:absolute;
            overflow:hidden;
            .novicer
              position:absolute;
              background:url('~@/assets/img/answer/xs.png') no-repeat;
              background-size:100% 100%;
              transform: skew(-20deg, 0deg);
          .superior
            transform:skew(20deg,0deg);
            position:absolute;
            overflow:hidden;
            .superiorer
              position:absolute;
              transform: skew(-20deg, 0deg);
              background:url('~@/assets/img/answer/gs.png') no-repeat;
              background-size:100% 100%;
          .novice,.superior
            .typeBg
              width:100%;
              height:100%;
              display:inline-block;
              transform: skew(-20deg, 0deg) scale(1.3);
              background-size: cover;
              background-position: center center;
              transition:1s;
              cursor:pointer;

@media (max-width:1300px)
  .wraps
    width:1120px;
    .rule
      .rule_child
        width: 22px;
        height: 22px;
        vertical-align: -4px;
        .rule_animate
          width: 22px;
          height: 5px;
    .card_nav
      li
        width:220px
        height:48px
        line-height:48px
    .card_wrap
      width:1120px;
      height:425px;
     .novice,.superior
       width:630px;
       height:425px;
      .novicer,.superiorer
        width:200px;
        height:75px;
      .novicer
        left:62px;
        bottom:26px;
      .superiorer
        right:168px;
        bottom:26px;
@media (min-width:1300px) and (max-width:1500px)
  .wraps
    width:1120px;
    .rule
      .rule_child
        width: 22px;
        height: 22px;
        vertical-align: -4px;
        .rule_animate
          width: 22px;
          height: 5px;
    .card_nav
      li
        width:220px
        height:48px
        line-height:48px
    .card_wrap
      width:1120px;
      height:425px;
      .novice,.superior
        width:630px;
        height:425px;
        .novicer,.superiorer
          width:200px;
          height:75px;
        .novicer
          left:62px;
          bottom:26px;
        .superiorer
          right:168px;
          bottom:26px;
@media (min-width:1500px) and (max-width:1800px)
  .wraps
    width:1303px;
    .rule
      .rule_child
        width: 22px;
        height: 22px;
        vertical-align: -4px;
        .rule_animate
          width: 22px;
          height: 5px;
    .card_nav
      li
        width:240px
        height:50px
        line-height:50px
    .card_wrap
      width:1303px;
      height:450px;
      .novice,.superior
        width:733px;
        height:450px;
        .novicer,.superiorer
          width:210px;
          height:78px;
        .novicer
          left:62px;
          bottom:26px;
        .superiorer
          right:200px;
          bottom:26px;
@media (min-width:1800px)
  .wraps
    width:1645px;
    .rule
      .rule_child
        width: 22px;
        height: 22px;
        vertical-align: -4px;
        .rule_animate
          width: 22px;
          height: 5px;
    .card_nav
      li
        width:270px
        height:55px
        line-height:55px
    .card_wrap
      width:1645px;
      height:600px;
      .novice,.superior
        width:925px;
        height:600px;
        .novicer,.superiorer
          width:256px;
          height:90px;
        .novicer
          left:75px;
          bottom:35px;
        .superiorer
          right:245px;
          bottom:35px;


</style>
<style scoped>
  @keyframes btn_hover1{
    0%{
      transform:translateY(0);
    }
    50%{
      transform:translateY(9px);
    }
    100%{
      transform:translateY(0);
    }
  }

  @keyframes btn_hover3{
    0%{
      transform:translateY(0);
    }
    50%{
      transform:translateY(-9px);
    }
    100%{
      transform:translateY(0);
    }
  }

  @keyframes btn_hover2{
    0%{
      transform:translateY(0);
    }
    50%{
      transform:translateY(9px);
    }
    100%{
      transform:translateY(0px);
    }
  }
  @keyframes btn_hover4{
    0%{
      transform:translateY(0);
    }
    50%{
      transform:translateY(-9px);
    }
    100%{
      transform:translateY(0px);
    }
  }

  @keyframes rule_rotate{
    0%{
      transform:rotate(0);
    }
    50%{
      transform:rotate(40deg)
    }
    100%{
      transform:rotate(90deg)
    }
  }
  @keyframes rule_rotate2{
    0%{
      transform:rotate(90deg);
    }
    100%{
      transform:rotate(0deg);
    }
  }
</style>
