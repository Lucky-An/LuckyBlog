<template>
  <div class="wrap_size user_notice_detail" style="padding-top:50px;">
    <div class="user_intro mrg30B user_intro3 text-center" style="position: static; top: 0px;" v-show="user_info!=={}">
      <div class="userLogo inLine" >
        <div class="boxT" :style="{backgroundImage: 'url('+ user_info.user.logo +')',backgroundSize:'cover' }"></div>
      </div>
      <div class="userText pad10T mrg50B">
        <div class="">
          <h3 class="inLine mrg0A whiteC lineH30 ellipsis_txt" style="width:70%" title="None">{{user_info.user.nickname}}</h3>
        </div>
      </div>
      <div class="pad15T clearfix">
        <div class="u_score text-center mrg25R">
          <img src="@/assets/img/integral_icon.png" :alt="$t('task.gold')" width="53">
          <div class="mrg10T">
            <span class="font18">{{user_info.user.point}}</span>
            <div>
              {{$t('task.taskScore')}}
            </div>
          </div>
        </div>
        <div class="u_gold text-center">
          <gold></gold>
          <div class="mrg10T">
            <span class="font18">{{user_info.user.coin}}</span>
            <div>
              {{$t('task.gold')}}
            </div>
          </div>
      </div>
      </div>
    </div>
    <div class="mes_height message_content" v-if="!show_content">
      <div >
        <ul class="type_menu">
          <li v-for="(item,i) in message_type"
              :class="{'active' : now_type==i}"
              @click="changeMessage(item.id,i)">{{item.name}}</li>
        </ul>
        <div class="board_one" id="" name="">
          <ul v-if="message_data.length">
            <li v-for="item in message_data">
              <span>
                  <span class="mes_detail" v-text="getType(item)"></span>
                  <span class="grayC mrg5L mrg5R">[{{type_name=='notice'?item.create_time:item.time}}]</span>
              </span>
              <span class="message_max_width link_message"
                    v-if="type_name=='notice'"
                    style="width:62%;cursor:pointer;"
                    :title="item.title" @click="show_message_content(item)">{{$i18n.locale=='EN' ? item.title_en : item.title}}</span>
              <span class="message_max_width " v-else style="width:62%;" :title="item.content" >{{$i18n.locale=='EN' ? item.content_en : item.content}}</span>
            </li>
          </ul>
          <div style="text-align:center;padding-top:20px;" v-else>
            <img src="@/assets/img/kong.png" alt="">
          </div>
        </div>
      </div>
        <div style="margin-top: 25px; text-align:center;">
            <page
                    v-show="pager.total>pager.pageSize"
                    :total="pager.total"
                    :page.sync="pager.currentPage"
                    :limit.sync="pager.pageSize"
                    :layout="pager.layout"

                    @pagination="getList"
            ></page>
        </div>

    </div>
    <div class="message_content min-h" v-else >
      <div class="message_inner">
        <span class="comeback" @click="show_message_list">{{$t('task.returnView')}}</span>
        <div class="inner" v-html="now_checked_message"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import gold from '@/components/common_components/gold'
  import page from '@/components/common_components/pagination'

  export default {
    components:{
      'gold':gold,
      page
    },
    name: 'message',
    data(){
      return{
        user_info:{
          user:{
            username:''
          }
        },
        show_content:false,
        message_type:[
          {
            name:this.$t('message.all'),
            id:'all',
            contrast:'全部',
          },
          {
            name:this.$t('message.sys'),
            id:'system',
            contrast:'系统',
          },
          {
            name:this.$t('message.answer'),
            id:'answer',
            contrast:'答题',
          },
          {
            name:this.$t('message.award'),
            id:'award',
            contrast:'奖励',
          },
          {
            name:this.$t('message.notice'),
            id:'notice',
            contrast:'公告',
          }
        ],
        now_type:0,
        type_name:'all',
        now_checked_message:'',
        message_data:[],
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
      this.getList('all');
      this.$http.get('/api/personal/user')
        .then((res)=>{
          if(res.data.success){
            this.user_info = res.data.message;
          }
        })
        .catch((err)=>{

        })
    },
    methods:{
      getType(data){
        // let type = this.message_type.filter((item,i)=>{
        //   console.log(item.contrast==data.category)
        //   return item.contrast==data.category;
        // })[0].name;
        return this.$i18n.locale=='EN' ? "["+data.category_en+"]" : "["+data.category+"]";
      },
      getList(category){//获取列表

        this.$http.get('/api/users/message',{
          params:{
            offset:(this.pager.currentPage-1)*this.pager.pageSize,
            limit:this.pager.pageSize,
            category:this.type_name
          }
        })
        .then((res)=>{
          this.message_data = res.data.rows;
          this.pager.total = res.data.total;
        })
        .catch((err)=>{

        })
      },
      changeMessage(item,i){
        this.message_data = [];
        this.pager.currentPage = 1;
        this.pager.total = 0;
        this.now_type = i;
        this.type_name = item;
        this.getList(item);
      },
      show_message_content(item){
        this.show_content = true;
        this.now_checked_message = this.$i18n.locale=='EN' ? item.content_en : item.content;
      },
      show_message_list(){
        this.show_content = false;
        this.now_checked_message = '';
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .message_content
    width:calc(100% - 320px);
    edge-angle()
    padding:40px;
    .type_menu
      display:flex;
      justify-content space-between;
      margin-bottom:30px;
      li
        flex:1;
        set_bg('button/lan.png');
        display: inline-block;
        text-align: center;
        font-size: 16px!important;
        line-height: 30px;
        font-family: '微软雅黑';
        color:white;
        cursor:pointer;
        &:hover
          set_bg('button/lan1.png');
        &:last-child
          margin-right:0;
      .active
        set_bg('button/lan1.png');
    .board_one
      ul
        li
          text-align:left;
          padding:15px 0;
          border-bottom: 1px solid borderColor;
          .mes_detail
            color:lightblue;
          .grayC
            color:#c2c2c2;
            margin-right:5px;
            margin-left:5px;
          .message_max_width
            width:62%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
            color:white;
            line-height:15px;
          .link_message
            color:lightblue;
@media (max-width:1300px)
  .mes_height

    .type_menu
      padding:0 60px;
      li
        margin-right:30px;
  .min-h
    min-height:580px!important;
@media (min-width:1300px) and (max-width:1500px)
  .mes_height

    .type_menu
      padding:0 60px;
      li
        margin-right:30px;
  .min-h
    min-height:580px!important;
@media (min-width:1500px) and (max-width:1800px)
  .mes_height
    height: 680px;
    .type_menu
      padding:0 120px;
      li
        margin-right:30px;
  .min-h
    min-height:680px!important;
@media (min-width:1800px)
  .mes_height
    height: 700px;
    .type_menu
      padding:0 120px;
      li
        margin-right:45px;
  .min-h
    min-height:700px!important;
</style>
<style scoped>
  .u_gold {
    min-width: auto;
  }
  .user_intro3 {
    width: 260px;
    height: 380px!important;
    background: url('~@/assets/img/ce.png')no-repeat;
    background-size: 100% 100%;
    padding: 50px 0!important;
    text-align: center;
    float: left;
    color:white;
  }
  .userLogo {
    width: 100px;
    height: 100px;
    margin-right: 32px;
    position: relative;
    border: 4px solid #007be3;
    border-radius: 50%;
    overflow: hidden;
    margin:0 auto;
    margin-top: 7px;
  }
  .boxT {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position:center center;
  }
  .user_intro3 .userText {
    width: 100%;
  }
  .user_intro .userText {
    float: left;
    margin-bottom: 50px!important;
    padding-top: 10px!important;
  }
  .user_intro3 .u_gold, .user_intro3 .u_score {
    display: inline-block;
  }
  h3{
    font-size:24px;
  }
  .font20{
    font-size:20px;
  }
  .user_intro3 .u_score {
    margin-right: 35px;
  }
  .message_content{
    background-color: #0d1927;
    border: 1px solid #033b6a;
    position: relative;
    min-height: 340px;
    float: right;
  }
  .u_gold{
    width:83px;
  }
  .comeback{
    width: 98px;
    height: 40px;
    background: url('~@/assets/img/button/go_back2.png')no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    padding-left: 50px;
    line-height: 40px;
    color: white;
    font-size: 14px;
    cursor:pointer;
  }
  .message_inner{
    text-align:left;
  }
  .message_inner .inner{
    padding:30px 15px;
    color:white;
    line-height:24px;
  }
</style>
<style lang="stylus" rel="stylesheet/stylus">
    .user_notice_detail{
        text-align :left;
        h4{
            font-size :18px;
            font-weight :bold;

        }
        .h4, .h5, .h6, h4, h5, h6,p {
            margin-top: 10px;
            margin-bottom: 16px;
            line-height: 1.6;
            color :#fff;
        }
    }
</style>
