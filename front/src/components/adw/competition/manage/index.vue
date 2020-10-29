<template>
  <div class="wrap_size mrg20T ">
    <el-breadcrumb separator-class="el-icon-arrow-right" separator="/" style="margin-bottom:30px;">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title&&item.meta.breadcrumb!==false"
                            :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">
          {{$t(item.meta.title) }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ $t(item.meta.title)  }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>


    <router-view></router-view>
  </div>
</template>

<script>
  export default {

    data () {
      return {
        levelList: null
      }
    },
    watch: {
      $route () {
        this.getBreadcrumb()
      }
    },
    created () {
      this.getBreadcrumb()
    },
    methods: {
      generateTitle () {

      },
      getBreadcrumb () {
        let matched = this.$route.matched.filter(item => {
          if (item.meta.crumbs) {
            return item
          }
        })
        // const first = matched[0]
        // if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
        //   matched = [{ path: '/admin/', meta: { title: 'dashboard' }}].concat(matched)
        // }
        this.levelList = matched
      },
      pathCompile (path) {
        // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
        const {params} = this.$route
        var toPath = pathToRegexp.compile(path)
        return toPath(params)
      },
      handleLink (item) {
        const {redirect, path} = item
        if (redirect) {
          this.$router.push({path: redirect, query: this.$route.query})
          return
        }

        this.$router.push(this.pathCompile(path))
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;

  }

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }

  .el-breadcrumb__inner a, .el-breadcrumb__separator {
    color: #547fa1;
  }

  .no-redirect {
    color: #0080ff;
  }

  /*breadcrumb transition*/
  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: all .5s;
  }

  .breadcrumb-enter,
  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }

  .breadcrumb-move {
    transition: all .5s;
  }

  .breadcrumb-leave-active {
    position: absolute;
  }

  .common_btn_md button{
    match-confirmbtn-md()
    padding: 0
  }
  .common_btn_sm{
    text-align:center
    color:white
    display:inline-block
    background:url('~@/assets/img/button/list_btn.png')
    -webkit-background-size: 100% 100%
    background-size: 100% 100%
    border:none;
    border-radius:0
    padding: 15px
  }
  .common_btn_lg  button{
    match-confirmbtn-lg()
    padding: 0
  }
</style>
