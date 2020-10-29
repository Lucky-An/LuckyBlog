<template>
  <div id="app">
    <router-view v-if="isRouterAlive" v-wechat-title="$t($route.meta.title)"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    }
  }
}
</script>

<style>
  @import './common/stylus/base.styl'
  html{
    width:100%;
    min-width:1200px;
    height:100%;
  }
  body{
    background-image:url('assets/img/ad5/bj1.jpg');
    background-position:center;
    background-size:100% 100%;
    background-repeat:no-repeat;
    background-attachment: fixed;
    background-color:rgb(0,11,52);
    padding:0!important;
    margin:0;
    height:100%;
    min-width:1200px;
    font-size:14px!important;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
}

</style>
