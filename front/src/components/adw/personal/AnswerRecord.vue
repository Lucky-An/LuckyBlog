<template>
  <div id="record_wrap" class="wrap_size">
    <v-top ></v-top>
    <div class="record" style="position:relative">
      <div class="sheet_top2">
        <div class="fl past_time detailed">
          <span class="title">{{$t('personal.answer_record')}}</span>
          <i class="star_ico star_ico2"></i>
        </div>
        <router-link class="returnhome" to="/personal">{{$t('personal.returnhome')}}</router-link>
      </div>
      <ul class="record_list" v-if="record_list.length">
        <li v-for="item in record_list" >
          <span class="record_time">{{item.time}}</span>
          <span>{{$i18n.locale=='EN' ? item.content_en : item.content}}</span>
        </li>
      </ul>
      <div v-else class="text-center">
        <img src="@/assets/img/kong.png" alt="">
      </div>
      <div style="position:absolute;bottom:-15px;left:0;right:0;margin:0 auto;">
        <v-page v-show="pager.total>pager.pageSize"
                :total="pager.total"
                :page.sync="pager.currentPage"
                :limit.sync="pager.pageSize"
                :layout="pager.layout"

                @pagination="getlist">
        </v-page>
      </div>
    </div>
  </div>
</template>

<script>
  import personTop from './personTop'
  import page from '@/components/common_components/pagination'

    export default {
      components:{
        'v-top':personTop,
        'v-page':page
      },
      name: "AnswerRecord",
      data(){
        return{
          record_list:[],
          pager: {//页码
            currentPage: 1,//当前第几页
            pageSize: 10,//每页多少条
            total: 0,//总共多少条
            layout: 'prev, pager, next',
            class:'bluepage'
          },
        }
      },
      created(){
        this.getlist();
      },
      methods:{
        getlist(){
          this.$http.get('/api/personal/answer_record',{
            params:{
              offset:(this.pager.currentPage-1)*this.pager.pageSize,
              limit:this.pager.pageSize
            }
          })
            .then((res)=>{
              this.record_list = res.data.rows;
              this.pager.total = res.data.total;
            })
            .catch((err)=>{

            })
        },
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #record_wrap
    .record
      padding-bottom:60px;
      .list_title
        margin-top:50px
        .title
          color:white
          float:left
          font-size:20px
        .content_btn
          float:right
    .record_list
      li
        border-bottom: 1px solid #053a64;
        border-left: 1px solid #053a64;
        border-right: 1px solid #053a64;
        background-color: #0c1929;
        padding-left: 35px;
        width:100%
        color:white
        text-align:left;
        &:first-child
          border-top:1px solid #053a64;
        .record_time
          color:#00c9ff;
          margin-right:15px;

  @media (max-width:1300px)
    .record
      height:440px;
      .record_list
        li
          height:28px
          line-height:28px
  @media (min-width:1300px) and (max-width:1500px)
    .record
      height:440px;
      .record_list
        li
          height:28px
          line-height:28px
  @media (min-width:1500px) and (max-width:1800px)
    .record
      height:500px;
      .record_list
        li
          height:30px
          line-height:30px
  @media (min-width:1800px)
    .record
      height:500px;
      .record_list
        li
          height:34px
          line-height:34px
</style>
<style scoped>
  .sheet_top2 {
    width: 100%;
    height: 62px;
    margin-bottom: 0;
  }
  .sheet_top2 .past_time {
    width: 280px;
    height: 42px;
    background: url('~@/assets/img/layer.png')no-repeat 40px;
    background-size: 100% 100%;
    position: relative;
    text-align: center;
    color: white;
    line-height: 42px;
    padding-left: 65px;
  }
  .detailed span {
    font-size: 18px;
    font-weight: bold;
    color: #65c0f7;
  }
  .past_time .star_ico {
    background: url('~@/assets/img/4jiao.png')no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    top: -14px;
  }
  .star_ico2 {
    width: 70px!important;
    height: 70px!important;
  }
  .returnhome {
    width: 169px;
    height: 28px;
    background: url('~@/assets/img/button/lv.png')no-repeat;
    background-size: 100% 100%;
    float: right;
    text-align: center;
    line-height: 28px;
    color: #00ffb4;
    margin-top: 10px;
  }
  .returnhome:hover, .returnhome:focus {
    background: url('~@/assets/img/button/lv1.png')no-repeat;
    background-size: 100% 100%;
    color: #fff;
    text-decoration: none;
  }

</style>
