<template>
  <div id="persontop" v-cloak>
    <div class="fl">
      <div class="userLogo fl">
        <div class="boxT" :style="{backgroundImage: 'url('+ user_detail.logo +')',backgroundSize:'cover' }"></div>
      </div>
      <div class="userText pad10T">
        <div class="user_name">
          <h3 class="inLine mrg0A whiteC lineH30 mrg20R x_names" title="user_detail.name">{{user_detail.nickname}}</h3>
          <router-link to="/personal/detail" class="edit_intro">{{$t('personal.edit')}}</router-link>
          <div class="def_blue font14">ID:<span>{{user_detail.id}}</span></div>
        </div>
        <!--<div class="inaWord whiteC">成就:{{user_detail.achievement}}</div>-->
        <div>
          <div class="inaWord whiteC" v-if="user_detail.short_introduce==''">{{$t('personal.autograph')}}:{{$t('dialog_list.no_content')}}</div>
          <div class="inaWord whiteC" v-else>{{$t('personal.autograph')}}:{{user_detail.short_introduce}}</div>
        </div>
      </div>
    </div>
    <div class="fr" style="margin-top:8px;">
      <div class="fr text-center u_property">
        <gold></gold>
        <div class="mrg15T">
          <span class="label_title">{{$t('task.gold')}}：</span>
          <span class="font24" id="gold_content">{{user_detail.coin}}{{$t('task.number')}}</span>
        </div>
      </div>
      <div class="u_score fr text-center u_property">
        <img src="@/assets/img/integral_icon.png" :alt="$t('task.taskScore')">
        <div class="mrg15T">
          <span class="label_title">{{$t('task.taskScore')}}：</span>
          <span class="font24">{{user_detail.point}}{{$t('task.score')}}</span>
        </div>
      </div>
      <div class="u_score fr text-center u_property">
        <img src="@/assets/img/grade_icon.png" :alt="$t('personal.level')">
        <div class="mrg15T mrg5B">
          <span class="label_title">{{$t('personal.level')}}：</span>
          <span class="font24" v-if="user_detail.level">{{$i18n.locale=='CN' ? user_detail.level.level_zh : user_detail.level.level_en}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import gold from '@/components/common_components/gold'

  export default {
    components: {
      'gold': gold
    },
    name: 'personTop',
    data () {
      return {
        user_detail: {},
      }
    },
    created () {
      this.$http.get('/api/personal/user')
      .then((res) => {
        if (res.data.success) {
          this.user_detail = res.data.message.user
        }
      })
      .catch((err) => {

      })
    },
    mounted () {

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #persontop
    margin-top: 38px;
    width: 100%
    set_bg('personal/gerenbj.png');
    margin-bottom: 30px;

    .team_logo
      width: 150px
      height: 150px
      float: left;

      img
        width: 100%
        height: 100%

    .team_txt_info
      float: left

    .team_score
      float: right

      .score
        float: left
        margin-right: 40px

  @media (max-width: 1300px)
    #persontop
      padding: 32px 75px 0 75px;
      height: 180px;

      .u_property
        padding: 0 25px;
        margin-top: 8px;

        &:after
          height: 75px;
          top: 14px;

  @media (min-width: 1300px) and (max-width: 1600px)
    #persontop
      padding: 32px 75px 0 75px;
      height: 180px;

      .u_property
        padding: 0 30px;
        margin-top: 5px;

        &:after
          height: 75px;
          top: 14px;

  @media (min-width: 1600px) and (max-width: 1800px)
    #persontop
      height: 245px;
      padding: 66px 125px 0 125px;

      .u_property
        padding: 0 40px;
        margin-top: 0;

        &:after
          height: 85px;
          top: 14px;

  @media (min-width: 1800px)
    #persontop
      padding: 62px 155px 0 155px;
      height: 245px;

      .u_property
        padding: 0 40px;
        margin-top: 0;

        &:after
          height: 85px;
          top: 14px;
</style>
<style scoped>
  .userLogo {
    width: 100px;
    height: 100px;
    margin-right: 32px;
    position: relative;
    border: 4px solid #007be3;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 7px;
    color: white;
  }

  .boxT {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position:center center;
  }

  .userText {
    width: 286px;
    float: left;
    text-align: left;
  }

  .userText .user_name {
    width: 100%;
    height: 70px;
    background: url('~@/assets/img/personal/username.png') no-repeat bottom left;
  }

  .x_names {
    max-width: 156px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
    margin-right: 20px;
    display: inline-block;;
    line-height: 30px;
    font-size: 24px;
  }

  .userText .user_name .edit_intro {
    padding-left: 22px;
    background: url('~@/assets/img/personal/edit.png') no-repeat center left;
    display: inline-block;
    color: #fc7301;
    margin-top: 5px;
    float: right;
    padding-top: 2px;
  }

  .def_blue {
    color: #1390FF;
  }

  .userText .inaWord {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
    margin-top: 10px;
    line-height: 24px;
  }

  .u_property:first-child {
    padding-right: 0;
  }

  .u_property {
    position: relative;
  }

  .mrg15T {
    margin-top: 15px;
  }

  .u_property .label_title {
    color: #b4b6b3;
    display: inline-block;
    vertical-align: 3px;
  }

  .font24 {
    font-size: 24px;
    color: white;
  }

  .u_property:after {
    content: '';
    display: block;
    width: 1px;
    background: rgba(255, 255, 255, .4);
    position: absolute;
    right: 0;
  }

  .u_property:first-child:after {
    display: none;
  }
</style>

