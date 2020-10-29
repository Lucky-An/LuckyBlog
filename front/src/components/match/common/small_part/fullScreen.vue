<template>
    <span class="screen_handle" >
      <span class="full_screen" v-if="screen_status" @click="fullScreen()"></span>
      <span class="shou_screen" v-else @click="fullScreen()"></span>
    </span>
</template>

<script>
  export default {
    name: 'fullScreen',
    data(){
      return{
        screen_status:true,//1退出全屏，0全屏
      }
    },
    methods:{
      fullScreen(){
        if(!this.screen_status){
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          }
          else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
          else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          if(typeof cfs != "undefined" && cfs) {
            cfs.call(el);
          }
          this.screen_status = !this.screen_status;
        }else{
          var el = document.documentElement;
          var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
          };
          this.screen_status = !this.screen_status;
          return;
        }

      },
    },
    mounted(){
      let that = this;
      window.onresize=function(){
        if(!(document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width)){
          that.screen_status = true;
        }
      }
      $(document).on('keydown', function (e) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode == 122){//捕捉F11键盘动作
          e.preventDefault();  //阻止F11默认动作
          var el = document.documentElement;
          var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;//定义不同浏览器的全屏API
          that.fullScreen()
        }
      })
    },
  }
</script>

<style scoped>

</style>
