<template>
  <div class="u_gold">
    <span class="gold_light light_width"></span>
    <img src="@/assets/img/coin_icon.png" :alt="$t('task.gold')">
  </div>
</template>

<script>
  export default {
    name: 'gold',
    methods: {

    },
    mounted () {
      yellowDotsMove()
      //金币动画（单个）
      function dotsMove(){
        var dots = document.createElement('span');
        var gold = document.getElementsByClassName('u_gold')[0];
        var w = Math.random()*10;
        var h = Math.random()*10;
        var l  = gold.offsetWidth*0.36+Math.random();
        var t  = gold.offsetHeight*Math.random();
        dots.className='gold_dots';
        dots.style.width = w+'px';
        dots.style.height = w+'px';
        dots.style.top = t+'px';
        dots.style.left = l+'px';
        gold.appendChild(dots);
      }
//金币动画（全）
      function yellowDotsMove(){
        dotsMove()
        setTimeout(function(){
          dotsMove()
        },200)
        setTimeout(function(){
          dotsMove()
        },700)
        setTimeout(function(){
          dotsMove()
        },800)
        setTimeout(function(){
          dotsMove()
        },1200)
      }
    }
  }
</script>

<style>
  .gold_dots{
    border-radius: 50%;
    position: absolute;
    background: yellow;
    box-shadow: 0 0 6px 1px yellow;
    animation: 3s dotTrans linear infinite;
  }
  .gold_light,.gold_light2{
    width:88px;
    height:80px;
    display:inline-block;
    position:absolute;
    margin:0 auto;
    animation:2.5s goldLight linear infinite;
    left: 0;
    right:0;
    top: -10px;
  }
  .gold_light2{
    background:url('~@/assets/img/personal/bi_guang5.png');
    background-size: 100% 100%;
    animation:2.5s goldLight2 linear infinite;
    top: -13px;
    left: -10px;
  }
  .u_gold{
    position:relative;
    min-width:145px;
  }
  .gold_light{
    background:url('~@/assets/img/personal/bi_guang.png');
    background-size: 100% 100%;
    animation:2.5s goldLight linear infinite;
  }
  @keyframes dotTrans{
    0%{
      transform:translateX(20px) translateY(-22px);
    }
    25%{
      transform:translateX(32px) translateY(-31px);
    }
    50%{
      transform:translateX(48px) translateY(-38px);
    }
    75%{
      transform:translateX(60px) translateY(-42px);
    }
    100%{
      transform:translateX(75px) translateY(-48px);
    }
  }
  @keyframes goldLight{
    0%{
      transform:scale(0.15)
    }
    50%{
      transform:scale(1.15)
    }
    100%{
      transform:scale(0.15)
    }
  }
  @keyframes goldLight2{
    0%{
      transform:scale(0.15)
    }
    50%{
      transform:scale(0.9)
    }
    100%{
      transform:scale(0.15)
    }
  }
</style>
