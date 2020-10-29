<template>
  <span class="screen_handle">
    <span v-if="screen_status" class="full_screen" @click="fullScreen()" />
    <span v-else class="shou_screen" @click="fullScreen()" />
  </span>
</template>

<script>
export default {
  name: 'FullScreen',
  data() {
    return {
      screen_status: true// 1退出全屏，0全屏
    }
  },
  mounted() {
    const that = this
    window.onresize = function() {
      if (!(document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width)) {
        that.screen_status = true
      }
    }
    document.onkeydown = function(e) {
      var e = event || window.event || arguments.callee.caller.arguments[0]
      if (e && e.keyCode == 122) { // 捕捉F11键盘动作
        e.preventDefault() // 阻止F11默认动作
        var el = document.documentElement
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen// 定义不同浏览器的全屏API
        that.fullScreen()
      }
    }
  },
  methods: {
    fullScreen() {
      if (!this.screen_status) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        if (typeof cfs !== 'undefined' && cfs) {
          cfs.call(el)
        }
        this.screen_status = !this.screen_status
      } else {
        var el = document.documentElement
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
        if (typeof rfs !== 'undefined' && rfs) {
          rfs.call(el)
        }
        this.screen_status = !this.screen_status
        return
      }
    }
  }
}
</script>

<style scoped>

</style>
