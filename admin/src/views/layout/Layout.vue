<template>
  <div>
    <div class="my_header">
      <img :src="$store.state.config.home_page_logo||logo" alt="">

      <div class="logout_box">
        <div class="sysTime">
          <svg-icon icon-class="time" />
          {{ $store.state.config.time }}
        </div>
        <div>
          <el-dropdown class="avatar-container right-menu-item">
            <div class="avatar-wrapper">
              {{ $store.state.config.role_name }}
              <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <a href="/" target="_blank"><span>返回前台</span></a>
              </el-dropdown-item>
              <!--<a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">-->
              <!--<el-dropdown-item>-->
              <!--{{ $t('navbar.github') }}-->
              <!--</el-dropdown-item>-->
              <!--</a>-->
              <el-dropdown-item divided>
                <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>

    </div>
    <div style="width: 100%;height: 80px"/>

    <div :class="classObj" class="app-wrapper">

      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <sidebar class="sidebar-container"/>
      <div class="main-container">
        <navbar/>
        <tags-view/>
        <app-main/>
      </div>
    </div>
  </div>

</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      logo: require('@/assets/img/logo_header1.png')
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        sessionStorage.clear()
        this.clearCookie()
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    clearCookie() {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
      if (keys) {
        for (var i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
      }
    },
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .my_header {
    min-width: 1000px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1002;
    width: 100%;
    height: 80px;
    background: #304156;
  }

  .my_header img {
    max-height: 80px;
  }

  .my_header .logout_box {
    display: flex;
  }

  .my_header .sysTime {
    color: #fff;
    font-size: 20px;
    margin-right: 80px;
  }

  .my_header .avatar-wrapper {
    width: 90px;
    font-size: 18px;
    color: #fff;
  }

  .logout_box span {
    line-height: 80px;
    cursor: pointer;
    color: #fff;
  }
</style>
