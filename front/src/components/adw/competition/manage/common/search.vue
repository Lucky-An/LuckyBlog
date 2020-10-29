<template>
  <div class="search_wrap">
    <el-input
      v-model="search_val"
      :placeholder="$t('selfHelp_competition.search_keyword')"
      style="width: 180px;"
      size="small"/>
    <el-button   class="def_btn"
                 size="small"
                 style="margin-left:-4px;z-index:5;position:relative;vertical-align: top"
                 icon="el-icon-search" @click="go_search">{{$t('selfHelp_competition.search')}}
    </el-button>
  </div>
</template>
<script>
  export default {
    name: 'search',
    data() {
      return {
        search_val:''
      }
    },
    methods: {
      go_search(){
        this.$emit('searchEvent',this.search_val)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
 .search_wrap .el-input__inner
    border-top-right-radius 0
    border-bottom-right-radius 0
</style>


