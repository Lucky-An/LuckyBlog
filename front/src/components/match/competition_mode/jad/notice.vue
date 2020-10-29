<template>
    <noticeList :notice_list="notice_list"></noticeList>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
  const { mapState } = createNamespacedHelpers('match');
  import noticeList from '@/components/match/common/competition_notice'
  import {sortMax} from '@/utils/sort'

  export default {
    name: 'notice',
    components:{
      noticeList
    },
    data(){
      return{
        notice_list:[],
        match_id:'',
        sys_n:[],
        tips_n:[]
      }
    },
    created () {
      this.show_notice();
    },
    methods:{
      show_notice(){
        this.match_id = this.$route.query.event;
        this.sys_n = this.tips_notice;
        this.tips_n = this.system_notice;
        let news = this.sys_n.concat(this.tips_n);
        if(news.length){
          let toped = news.filter((item,i)=>{
            return item.is_topped==true;
          });
          let ordinary_notice = news.filter((item,i)=>{
            return item.is_topped==false;
          })
          if(toped.length){
            toped = sortMax(toped);
            this.notice_list = toped.concat(sortMax(ordinary_notice));
          }else{
            this.notice_list = sortMax(news);
          }
        }
      },
    },
    computed:{
      ...mapState(['tips_notice','system_notice']),
      getTips(){
        return this.tips_notice
      },
      getSys(){
        return this.system_notice
      }
    },
    watch:{
      getTips(val){
        this.show_notice();
      },
      getSys(val){
        this.show_notice();
      }
    }
  }
</script>

<style scoped>

</style>
