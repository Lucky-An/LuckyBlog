<template>
  <div>
    <noticeList :notice_list="notice_list"></noticeList>
  </div>
</template>

<script>
  import {
    notices
  } from '@/api/competitionMode/devopsMode'
  import noticeList from '@/components/match/common/competition_notice'

  export default {
    name: 'notice',
    components:{
      noticeList,
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
      get_notice(){
        notices({
          event_id:this.$route.query.event
        }).then((res)=>{//平台公告消息
          this.notice_list = res.data;
        })
          .catch((err)=>{

          })
      },
    }
  }
</script>

<style scoped>

</style>
