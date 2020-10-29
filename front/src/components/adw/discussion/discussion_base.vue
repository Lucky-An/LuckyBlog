<template>
    <div>
        <div id="discussion" class="wrap_size clearfix">
            <div id="discussion_main" class="discussion_main">
                <v-handle></v-handle>
                <router-view></router-view>
            </div>
            <v-nav></v-nav>
        </div>

    </div>
</template>

<script>
  import handle from './discussion_handle'
  import rightNav from './right_nav'

  export default {
    components: {
      'v-handle': handle,
      'v-nav': rightNav,
    },
    name: 'discussion'
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .wrap_size {
        margin-top: 25px
        margin-bottom:100px;
        width: 1200px;
        .discussion_main {
            width: 910px;
            float: left
        }
    }

</style>
