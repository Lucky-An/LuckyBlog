<template>
    <div id="competition_detail">
      <div class='gf-wrap'>
        <div class="clearfix" style="margin-bottom:10px;" v-if="!personal_data.user.is_temp">
          <div class="create_match">
            <router-link to="/competition">
              {{$t('competition.competitionList')}}
            </router-link>
          </div>
        </div>
        <div class="panel_blue_box match_info_top clearfix">
          <div class="match_cover">
            <img :src="info.cover" alt="" v-if="info.cover">
            <span class="statu_label"
                  :class="getlabel(info.process)"></span>
          </div>
          <div class="match_information">
            <h3 class="ellipsis_txt" :title="$i18n.locale=='CN' ? info.name_zh : info.name_en">{{ $i18n.locale=='CN' ? info.name_zh : info.name_en }}</h3>
            <div class="match_sponsor" v-if="info.sponsor_zh">
              <span>{{$t('competition.sponsor')}}：</span>
              <span >{{ $i18n.locale=='CN' ? info.sponsor_zh : info.sponsor_en }}</span>
            </div>
            <div class="match_proposition" v-if="propositional_team.propositional_team_zh">
              <span>{{$t('competition.propositional')}}：</span>
              <span>{{ $i18n.locale=='CN' ? propositional_team.propositional_team_zh  : propositional_team.propositional_team_en }}</span>
            </div>
            <div class="match_time">
              <span>{{$t('competition.startTime')}}：</span>
              <span>{{info.start_time}}——{{info.end_time}}</span>
            </div>
            <div class="match_mode">
              <span>{{$t('competition.competitionMode')}}：
                <span class="whiteC" v-text="getMode(info.mode)"></span>
              </span>
            </div>
            <button class="join_btn search_competition_btn "
                    :class="{'dis_btn':dis_join()}"
                    :disabled="{true:dis_join()}"
                    v-if="dis_join()"
            >{{$t('competition.joinCompetition')}}</button>
            <router-link :to="{path:'/match/guide',query:{event:id,hash:hash}}"
                         class="join_btn search_competition_btn"
                        v-else
            >{{$t('competition.joinCompetition')}}</router-link>
          </div>
        </div>
        <div class="panel_blue_box clearfix match_detailed">
          <h3>
            <span class="match_title">
                {{$t('competition.introduce')}}
            </span>
          </h3>
          <div class="detailed_txt" v-html="getDescription()">

          </div>
        </div>
      </div>
      <!--<router-link :to="{path:'/match/guide',query:{event:'1'}}">参赛</router-link>-->
    </div>
</template>

<script>
  import {getStorage} from '@/utils/storage'

    export default {
      name: "competition_detail",
      data(){
        return{
          info:{index:[]},
          id:'',
          propositional_team:{},
          personal_data:getStorage('isUserLogin','object') || {user:{is_temp:false}},
          hash:this.$route.query.hash
        }
      },
      created(){
        this.id = this.$route.query.id;
        this.$http.get('/api/evts/detail/'+this.$route.query.hash)
          .then((res)=>{
            this.info = res.data;
            this.propositional_team = res.data.index.filter((item)=>{
              return item.title=="propositional_team"
            })[0].content
          })
          .catch((err)=>{

          })
      },
      methods:{
        getDescription(){
          if(this.info.description_zh){
            return this.$i18n.locale=='CN' ? '<div class="tui-editor-contents">' + this.$marked(this.info.description_zh)+'</div>' : '<div class="tui-editor-contents">'+this.$marked(this.info.description_en)+'</div>'
          }else{
            if(this.info.index.length){
              let new_arr=  this.info.index.filter((item,index)=>{
                return item.title=='description'
              })[0];
              if(this.$i18n.locale=='CN'){
                return '<div class="tui-editor-contents">'+this.$marked(new_arr.content.description_zh)+'</div>';
              }else{
                return '<div class="tui-editor-contents">'+this.$marked(new_arr.content.description_en)+'</div>';
              }
            }
          }
        },
        dis_join(){
          if(this.info.is_sponsor){
            return this.personal_data.user.event==this.info.id ? false : true;
          }else{
            return this.personal_data.user.is_temp ? true : false;
          }
        },
        getMode(mode){
          if(mode==1){
            return this.$t('competition.personal')
          }else if(mode==2){
            return this.$t('competition.team')
          }
        },
        getlabel(process){
          if(this.$i18n.locale=='CN'){
            if(process==0){
              return 'doing_label_zh'
            }else if(process==1){
              return 'before_label_zh'
            }else if(process==2){
              return 'closed_label_zh'
            }
          }else{
            if(process==0){
              return 'doing_label_en'
            }else if(process==1){
              return 'before_label_en'
            }else if(process==2){
              return 'closed_label_en'
            }
          }

        }
      }
    }
</script scoped>
<style>

</style>
<style lang="stylus" rel="stylesheet/stylus">
  #competition_detail{
    .panel_blue_box{
      edge-angle()
      card_style()
    }
    .closed_label{
      color:#9d9a95;
      border:1px solid #9d9a95;
    }
    .doing_label{
      color:#017efc;
      border:1px solid #017efc;
    }
    .before_label{
      color:#ff900e;
      border:1px solid #ff900e;
    }
    .compet_img{
      width:300px;
      height:180px;
      background-size:cover;
      background-repeat: no-repeat;
      background-position: center center;
      position:absolute;
      left:0;
      top:0;
    }
    .create_match{
      width:230px;
      height:40px;
      background:url("~@/assets/img/button/list_btn.png")no-repeat!important;
      background-size:100% 100%!important;
      text-align: center;
      line-height: 40px;
      font-size:18px;
      font-weight: bold;
      letter-spacing: 2px;
      float: right;
      cursor: pointer;
    }
    .create_match a{
      width:100%;
      height:100%;
      display:inline-block;
      color:#fff!important;
    }
    .create_match a:hover{
      color:#fff!important;
    }
    .match_info_top{
      width:100%;
    }
    .match_cover{
      position:absolute;
    }
    .match_cover img{
      width:100%;
      height:100%;
      display:block;
      border:none;
    }
    .match_information h3{
      color:#0185ff;
      margin-top:0;
      font-size:24px;
    }
    .match_information{
      text-align:left;
      color:white;
    }
    .join_btn{
      width:106px;
      height:36px;
      line-height:36px;
      margin-top:15px;
    }
    .search_competition_btn {
      background: url("~@/assets/img/button/list_btn.png")no-repeat;
      background-size: 100% 100%;
      border: none;
      display: inline-block;
      text-align: center;
      line-height: 36px;
      color: white;
    }
    .join_btn:hover{
      color:white;
    }
    .statu_label{
      width:90px;
      height:90px;
      position:absolute;
      right:0;
      top:0;
      border:none;
    }
    .doing_label_zh{
      background:url("~@/assets/img/big_doing.png")no-repeat;
      background-size:100% 100%;
    }
    .before_label_zh{
      background:url("~@/assets/img/big_before.png")no-repeat;
      background-size:100% 100%;
    }
    .closed_label_zh{
      background:url("~@/assets/img/big_close.png")no-repeat;
      background-size:100% 100%;
    }
    .doing_label_en{
      background:url("~@/assets/img/begin.png")no-repeat;
      background-size:100% 100%;
    }
    .before_label_en{
      background:url("~@/assets/img/soon.png")no-repeat;
      background-size:100% 100%;
    }
    .closed_label_en{
      background:url("~@/assets/img/end.png")no-repeat;
      background-size:100% 100%;
    }
    .match_detailed{
      width:100%;
      padding:30px 30px 20px;
    }
    .match_detailed *{
      background:none!important;
      color:#fff!important;
      font-size:15px;
      font-family: '微软雅黑',Arial!important;
    }
    .match_detailed h3{
      margin-bottom:26px;
      margin-top:0;
      font-weight: bold;
      text-align: center;
    }
    .match_detailed h3 .match_title{
      color:#0185ff!important;
      font-size:24px;
      font-weight:bold;
    }
    .match_detailed h3 .match_title:before,.match_detailed h3 .match_title:after{
      content:'';
      clear: both;
      display: inline-block;
      width:41px;
      height:17px;
      background:url("~@/assets/img/competition.png")no-repeat;
      background-size:100% 100%;
    }
    .match_detailed h3 .match_title:after{
      transform:rotate(180deg);
    }
    .detailed_txt{
      color:#a2a3a9;
      text-align:left;
      line-height:24px;
    }
    .detailed_txt p{
      margin-bottom:15px;
    }
    .dis_btn{
      background:url("~@/assets/img/button/disabled_list_btn.png")no-repeat;
      background-size:100% 100%;
      cursor:not-allowed!important;
      color:#666;
      border:none;
    }
    .dis_btn:hover,.dis_btn:focus{
      color:#666;
    }
    .gf-wrap{
      margin:20px auto;
    }
    @media (min-width: 1800px){
      .gf-wrap {
        width: 1200px;
      }
      .match_cover{
        width:520px;
        height:290px;
      }
      .match_info_top{
        height:335px;
        padding:20px 50px;
        margin-bottom:35px;
      }
      .match_sponsor,.match_proposition,.match_time,.match_mode{
        margin-bottom:20px;
        font-size:16px;
      }
      .match_information{
        padding-left:570px;
      }
      .match_information h3{
        margin-bottom:25px;
      }
    }
    @media (max-width: 1800px) and (min-width: 1580px){
      .gf-wrap {
        width: 1200px;
      }
      .match_cover{
        width:520px;
        height:290px;
      }
      .match_info_top{
        height:335px;
        padding:20px 50px;
        margin-bottom:35px;
      }
      .match_sponsor,.match_proposition,.match_time,.match_mode{
        margin-bottom:20px;
        font-size:16px;
      }
      .match_information{
        padding-left:570px;
      }
      .match_information h3{
        margin-bottom:25px;
      }
    }
    @media (max-width: 1580px) and (min-width: 1300px){
      .gf-wrap {
        width: 1150px;
      }
      .match_cover{
        width: 405px;
        height: 230px;
      }
      .match_info_top{
        height:275px;
        padding:20px 50px;
        margin-bottom:28px;
      }
      .match_sponsor,.match_proposition,.match_time,.match_mode{
        margin-bottom:10px;
        font-size:16px;
      }
      .match_information{
        padding-left:450px;
      }
      .match_information h3{
        margin-bottom:18px;
      }
    }
    @media (max-width: 1300px){
      .gf-wrap {
        width: 1150px;
      }
      .match_cover{
        width: 405px;
        height: 230px;
      }
      .match_info_top{
        height:275px;
        padding:20px 50px;
        margin-bottom:28px;
      }
      .match_sponsor,.match_proposition,.match_time,.match_mode{
        margin-bottom:10px;
        font-size:16px;
      }
      .match_information{
        padding-left:450px;
      }
      .match_information h3{
        margin-bottom:18px;
      }
    }
  }
</style>
