<template>
  <noticeList :notice_list="notice_list"></noticeList>
</template>

<script>
  import {sortMax} from '@/utils/sort'
  import {createNamespacedHelpers} from 'vuex'
  const { mapState } = createNamespacedHelpers('match');
  import noticeList from '@/components/match/common/competition_notice'
  import {
    notices
  } from '@/api/competitionMode/newAttackMode'
  export default {
    name: 'notice',
    components:{
      noticeList
    },
    data(){
      return{
        notice_list:[],
      }
    },
    created () {
      this.get_notice();
    },
    methods:{
      show_notice(){
        let news = this.all_notice;
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
      get_notice(){
        notices({
          event_id:this.$route.query.event
        }).then((res)=>{//平台公告消息
          this.notice_list = res.data;
        })
          .catch((err)=>{

          })
      },
    },
    computed:{
      ...mapState(['all_notice']),
    },
  }
</script>

<style scoped>

</style>
