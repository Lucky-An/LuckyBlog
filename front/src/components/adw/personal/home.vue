<template>
    <div class="personal_wrap wrap_size">
      <v-top ></v-top>
      <div class='user_skill mrg30B'>
        <div class='skill_charts'>
          <div class='headline'>
            <div :class="$i18n.locale=='EN' ? 'head_txt': 'head_zh'">
              {{$t('personal.randar')}}
            </div>
            <span class='headline_inner'></span>
          </div>
          <chart
            :radarData="radarData"
            :type_data="type_data"
            ref="radarChart"
          ></chart>
        </div>
        <div class='signinBox'>
          <div class='signbutton shine_bg alsignbutton' style="cursor:default" v-if="is_sign" >
            <p class='slideShine2'>{{$t('personal.sign.signed')}}</p>
          </div>
          <div class='signbutton shine_bg' v-else @click="toSign">
            <p class='slideShine2'>{{$t('personal.sign.btn')}}</p>
          </div>
          <div class='signIn calendar' id="calendar"></div>
          <div class='signRule mrg10T'>
            <div class='whiteC'>
              {{$t('personal.sign.sign_tips')}}
            </div>
            <span class='orangeC cursor'
                  @click="sign_rule"
                  style="cursor:pointer;"
            >{{$t('personal.sign.sign_rule_link')}}>></span>
          </div>
        </div>
      </div>
      <div class="user_data">
        <div class='headline'>
          <div :class="$i18n.locale=='EN' ? 'head_txt': 'head_zh'">
            {{$t('personal.task_data')}}
          </div>
          <span class='headline_inner'></span>
        </div>
        <div class="q_curve">
          <router-link to="/personal/record"
                       class="content_btn"
          >{{$t('personal.answer_record')}}</router-link>
          <ul id="myTab" class="gf_typeLine gf_typeLine_pad">
            <li :class="{'active':chartactive==i}" v-for="(item,i) in type_data" @click="changeChart(item,i)">
              {{item.title}}
            </li>
          </ul>
          <div id="chart_data">

          </div>
        </div>
      </div>
      <div class="user_honour clearfix">
        <div class="headline short">
          <div :class="$i18n.locale=='EN' ? 'head_txt': 'head_zh'">
            {{$t('personal.honor')}}
          </div>
          <span class="headline_inner"></span>
        </div>
        <ul class='gold_plate' v-if="honour.length">
          <li v-for="item in honour" >
          <span class='light_g2'></span>
          <span class='light_g3'></span>
          <div class='plate_bg'>
            <img :src="item.file" alt="" />
            <!--<img src="../../assets/img/personal/gold.png" alt="" />-->
          </div>
          <div class='plate_name ellipsis_txt pad5L pad5R'>
            {{item.title}}
          </div>
        </li>
        </ul>
        <div class="kong" v-else>
          <img src="@/assets/img/kong.png" alt="">
          <!--<span class="lightBlue">这里还空空如也……</span>-->
        </div>
      </div>
      <el-dialog
        :title="$t('personal.sign.title')"
        :visible.sync="dialogVisible"
        width="740px"
        custom-class="ad_public_modal nofoot" >
        <div class="additional">
          <div class="label">{{$t('personal.sign.des1')}}
            <span class="strongtxt">{{sign_data.sign_day}}</span> {{$t('personal.sign.des2')}}
            <span class="strongtxt">{{sign_data.sign_gold}}</span>{{$t('personal.sign.des3')}}
          </div>
          <div class='gold_box'>
            <div class="item1">
              <div class="kodai" style="top:5px;">
                <img src="@/assets/img/personal/box2.png" class="full" />
                <img src="@/assets/img/personal/box3.png" class="empty" style="display:none;" />
              </div>
              <div class="clipped-box" style="left:110px;bottom:-28px;"></div>
            </div>
            <span class='light_rot'></span>
            <span class='light_rot2'></span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import chart from '@/components/common_components/personal_chart.vue'
  import personTop from './personTop'
  import '../../../../static/js/calendar'
  import {genClips,jbPao} from '@/utils/goldAnimate'

    export default {
      components:{
        chart,
        'v-top':personTop
      },
      name: "home",
      data(){
        return{
          dialogVisible:false,
          is_sign:false,//是否签到过
          sign_data:{
            sign_day:0,
            sign_gold:0
          },
          chartactive:0,
          user:localStorage.isUserLogin.user,
          type_data:[],
          honour:[],
          lineData:{},
          radarData:{},
          lineChart:'',
          randarChart:'',
          signRule:''
        }
      },
      created() {
        this.$http.get('/api/personal')
          .then((res)=>{
            if(res.data.success){
              let res_data = res.data.message;
              this.signRule = res_data.dailyfresh_rule;
              this.is_sign = res_data.signin;
              this.radarData = res_data.radar_data;
              this.radarData.category_name.forEach((item,i)=>{
                item.max = 500;
              })
              this.type_data = res_data.percent_list;
              this.honour = res_data.glories;
              this.$nextTick(()=>{
                this.$refs.radarChart.initRadarChart();
              })
              this.changeLineChart(this.type_data[0].id);
            }
          })
          .catch((err)=>{

          })
      },
      methods:{
        changeLineChart(id){
          this.$http.get('/api/personal/chart/'+id)
            .then((res)=>{
              this.lineData = res.data
              this.initLineChart();
            })
            .catch((err)=>{

            })
        },
        changeChart(item,i){
          this.chartactive = i;
          this.changeLineChart(item.id);
        },
        sign_rule() {//签到规则
          this.$alert(this.$i18n.locale=='CN' ? this.signRule.dailyfresh_rule_zh : this.signRule.dailyfresh_rule_en, this.$t('personal.sign.signRule'), {
            customClass:'public_confirm public_confirm_md text-center',
            showConfirmButton: false,
            dangerouslyUseHTMLString: true,
          });
        },
        toSign(){//点击签到按钮
          this.$http.get('/api/personal/daily_checkin').
            then((res)=>{
              if(res.data.success){
                $('#calendar').html('');
                $('#calendar').calendar({
                  ifSwitch: true, // 是否切换月份
                  hoverDate: true, // hover是否显示当天信息
                  backToday: true // 是否返回当天
                });
                this.sign_data.sign_day = res.data.days;
                this.sign_data.sign_gold = res.data.coin;
                this.dialogVisible = true;
                this.is_sign = true;
                this.$nextTick(()=>{
                  setTimeout(()=>{
                    genClips();
                  },500)
                  setTimeout(()=>{
                    jbPao();
                    $('.light_rot').css('opacity',1);
                    $('.light_rot2').css('opacity',1);
                  },1200)
                })
              }
          })
            .catch((err)=>{

            })
        },
        initLineChart(){
          //曲线图
          var chart_data = document.getElementById('chart_data');
          this.lineChart = this.$echarts.init(chart_data);
          let new_legend=[];

          this.lineData.legend.forEach((item)=>{
            if(this.$i18n.locale=='CN'){
              new_legend.push(item.name_zh)
            }else{
              new_legend.push(item.name_en)
            }
          })
          var option2 = {
            title: {
              text: ''
            },
            color:['#fff100','#01ffff','#fe00ff','#007e61'],
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:new_legend,
              textStyle:{
                color:'white'
              },
              orient:'vertical',
              right:20
            },
            grid: {
              left: '90',
              right: '140',
              bottom: '0',
              containLabel: true,
              top:'8px'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.lineData.x,
              axisLine:{
                lineStyle:{
                  color:'#053A66'
                }
              },
              splitLine:{
                show:true,
                lineStyle: {
                  // 使用深浅的间隔色
                  color: ['#053A66']
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#47779A',
                  fontSize:'14'
                },
                rotate:10
              }
            },
            yAxis: {
              show: true,
              type: 'value',
              splitLine:{
                show:false
              },
              axisLine:{
                lineStyle:{
                  color:'#053A66'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#063a65',
                  fontSize:'14'
                },
              }
            },
            series: []
          };
          this.lineData.data.forEach((item,i)=>{
            if(this.$i18n.locale=='CN'){
              option2.series.push({
                name:item.name_zh,
                type:'line',
                data:item.point_list,
              })
            }else{
              option2.series.push({
                name:item.name_en,
                type:'line',
                data:item.point_list,
              })
            }

          })
          this.lineChart.setOption(option2)
          window.addEventListener('resize',()=>{
            this.lineChart.resize();
          })
        },
        initRadarChart(){
          //雷达图
          var randar_chart = document.getElementById('randar_chart');
          this.randarChart = this.$echarts.init(randar_chart);
          let new_legend=[];

          this.radarData.legend.forEach((item)=>{
            if(this.$i18n.locale=='CN'){
              new_legend.push(item.name_zh)
            }else{
              new_legend.push(item.name_en)
            }
          })
          var option = {
            backgroundColor: '',
            title: {
              text: '',
              left: 'center',
              textStyle: {
                color: '#eee',
              }
            },
            color:['#ff4945','#008dd3'],//图例颜色
            legend: {
              bottom:'20px',
              data: new_legend,
              textStyle: {
                color: '#fff',
              },
            },
            polar: [{    //极坐标
              indicator: this.radarData.category_name,
              radius: 120,
              startAngle: 120,   // 改变雷达图的旋转度数
              splitNumber: 5,
              name: {
                textStyle: {
                  color: '#2f4e7a',
                  fontSize: 14
                }
              },
              splitLine: {
                lineStyle: {
                  color: [
                    'rgba(8, 135, 214, 1)', 'rgba(33,45,59,1)',
                    'rgba(33,45,59,1)', 'rgba(33,45,59,1)',
                    'rgba(33,45,59,1)', 'rgba(33,45,59,1)'
                  ].reverse()
                }
              },
              splitArea: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#2f4e7a',
                  width:1
                }
              },
            }],
            series: []
          };
          this.radarData.data.forEach((item,i)=>{
            if(this.$i18n.locale=='CN'){
              option.series.push({
                name:item.name_zh,
                type:'radar',
                data:item.value,
              })
            }else{
              option.series.push({
                name:item.name_en,
                type:'radar',
                data:item.value,
              })
            }

          })
          this.randarChart.setOption(option)
          window.addEventListener('resize',()=>{
            this.randarChart.resize();
          })
        }
      },
      mounted(){
        $('#calendar').calendar({
          ifSwitch: true, // 是否切换月份
          hoverDate: true, // hover是否显示当天信息
          backToday: true // 是否返回当天
        });
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .personal_wrap
    .randar_box
      width:100%
      height:300px
      border:1px solid blue
      background:green
      font-size:50px
      color:white
      line-height:300px
      margin-top:30px
    .user_skill
      margin-bottom:30px;
      .skill_charts
        edge-angle()
        height: 100%;
        background-color: #0d1927;
        border: 1px solid #033b6a;
        position: relative;
        float: left;
    .user_data
      edge-angle()
      width: 100%;
      height: 430px;
      card_style()
      position: relative;
      margin-bottom:30px;
      .q_curve
        height: 100%;
        float: left;
        #myTab
          margin:65px 0 35px;
        #chart_data
          width:100%;
          height:calc(100% - 140px);
    .user_honour
      edge-angle()
      width: 100%;
      card_style()
      position: relative;
      min-height: 340px;
      margin-bottom:30px;
  .strongtxt
    color:color-yellow;
    font-weight:bold;
    font-size:18px;
</style>
<style scoped>
  .user_skill {
    height: 395px;
  }
  .signinBox {
    width: 305px;
    height: 100%;
    float: right;
  }
  .headline .headline_inner {
    width: 70px;
    height: 70px;
    background: url('~@/assets/img/4jiao.png')no-repeat;
    position: absolute;
    top: -35px;
    left: -14px;
    background-size: 100% 100%;
  }
  .headline {
    width: 42px;
    height: 256px;
    margin-left: 38px;
    margin-top: 58px;
    background: url('~@/assets/img/personal/layer2.png')no-repeat;
    background-size: 100% 100%;
    position: relative;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding-top: 56px;
    color: #5bc4fe;
    float: left;
    line-height: 22px;
  }
  .head_txt{
    width:256px;
    -webkit-transform: rotate(90deg);
    /* Firefox */
    -moz-transform: rotate(90deg);
    transform-origin:30px top;
    text-align:left;
    padding-left:15px;
    /* Internet Explorer 滤镜写法*/
  }
  .head_zh{
    width:25px;
    margin:0 auto;
  }
  .skill_charts .pers_randar {
    height: 100%;
    float: left;
    margin-left: 20px;
  }
  .skill_charts .dataNums {
    float: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: space-between;
    flex-flow: row wrap;
    padding-top:20px;
  }
  .skill_charts .dataNums li {
    width: 100%;
    float: left;
    text-align: left;
    color: #0087FF;
    height: 60px;
  }
  .skill_charts .dataNums li .ratio_name {
    width: 54px;
    font-size: 16px;
    display: inline-block;
  }
  .lineH50 {
    line-height: 50px;
  }
  .ratio_line {
    position: relative;
    margin: 0 15px;
  }
  .ratio_line:before {
    content: '';
    width: 45px;
    height: 52px;
    background: url('~@/assets/img/personal/5bian.png')no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .blue_line {
    width: 100%;
    height: 18px;
    background: #132438;
    border-radius: 8px;
    margin-top: 15px;
  }
  .ratio_line .ratio_num {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(to right, #00FFF6, #0087FF);
  }
  .shine_bg {
    width: 100%;
  }
  .signbutton {
    width: 270px;
    height: 52px;
    background: url('~@/assets/img/personal/signin.png')no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    font-weight: bold;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #fff;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .alsignbutton{
    background:url('~@/assets/img/personal/qiandao1.png')no-repeat;
    background-size:100% 100%;
  }
  .slideShine2 {
    width: 100%;
    font-family: "Microsoft YaHei";
    font-size: 20px;
    text-align: center;
    background: #fff -webkit-linear-gradient(left, #fff, #111) 0 0 no-repeat;
    -webkit-background-size: 80px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: rgba(255, 255, 255, 0.4);
    -webkit-animation: slideShine 3s infinite;
  }
  .kong {
    width: 340px;
    margin: 0 auto;
    margin-top: 60px;
  }
  .lightBlue {
    color: #00c9ff;
  }
  .kong img{
    vertical-align: middle;
  }
  @-webkit-keyframes slideShine {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100% 100%;
    }
  }
  .calendar {
    padding: 5px;
    border-radius: 6px;
  }
  .signIn {
    width: 305px;
    height: 280px;
    background: #1383e7;
  }
   .signRule {
    width: 100%;
    text-align: center;
  }
  .signRule .whiteC{
    color:white;
    margin-top:10px;
  }
  .signRule .orangeC{
    color:#f78701!important;
    margin-top:10px;
    display:inline-block;
  }
  .gf_typeLine_pad {
    padding: 0 150px;
  }
  .gf_typeLine {
    border-bottom: none;
    display: flex;
    width: 100%;
    height: 30px;
    justify-content: space-between;
    margin-bottom: 40px;
  }
  .gf_typeLine li {
    flex:1;
    cursor:pointer;
  }
  .gf_typeLine li:last-child{
    margin-right:0;
  }
  .gf_typeLine .active {
    background: url('~@/assets/img/button/lan1.png')no-repeat;
    background-size: 100% 100%;
    color: white;
  }
  .gf_typeLine li {
    width: 100%;
    height: 100%;
    background: url('~@/assets/img/button/lan.png')no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    font-family: 'english';
    font-size: 16px;
    color:#337ab7;
  }
  .content_btn {
    width: 169px;
    height: 28px;
    background: url('~@/assets/img/button/lv.png')no-repeat;
    background-size: 100% 100%;
    float: right;
    text-align: center;
    line-height: 28px;
    color: #00ffb4;
    margin-top: 10px;
    padding:0;
  }
  .content_btn:hover{
    background: url('~@/assets/img/button/lv1.png')no-repeat;
    background-size: 100% 100%;
    color: #fff;
  }
  @media (max-width: 1300px) {
    .user_skill .skill_charts {
      width: 920px;
    }
    .skill_charts .pers_randar {
      width: 380px;
    }
    .skill_charts .dataNums {
      width: 45%;
      padding-left: 20px;
    }
    .ratio_line {
      width: 240px;
      padding-left: 40px;
    }
    .q_curve{
      width:1115px;
    }
    .gf_typeLine li {
      margin-right:40px;
    }
    .gold_plate li{
      width:140px;
      height:150px;
      padding-top:32px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:85px;
      height:95px;
    }
    .gold_plate li .light_g2{
      width:60px;
      height: 60px;
      top: 54px;
    }
    .gold_plate li .light_g3{
      width: 65px;
      height: 65px;
      top: 50px;
    }
    .gold_plate li .plate_bg img{
      width:55px;
      height:55px;
    }
    .gold_plate li .plate_name{
      width: 110px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
    }
  }
  @media (max-width: 1500px) and (min-width: 1300px) {
    .user_skill .skill_charts {
      width: 920px;
    }
    .skill_charts .pers_randar {
      width: 380px;
    }
    .skill_charts .dataNums {
      width: 45%;
      padding-left: 20px;
    }
    .ratio_line {
      width: 240px;
      padding-left: 40px;
    }
    .q_curve{
      width:1115px;
    }
    .gf_typeLine li {
      margin-right:40px;
    }
    .gold_plate li{
      width:140px;
      height:150px;
      padding-top:32px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:85px;
      height:95px;
    }
    .gold_plate li .light_g2{
      width:60px;
      height: 60px;
      top: 54px;
    }
    .gold_plate li .light_g3{
      width: 65px;
      height: 65px;
      top: 50px;
    }
    .gold_plate li .plate_bg img{
      width:55px;
      height:55px;
    }
    .gold_plate li .plate_name{
      width: 110px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
    }
  }
  @media (max-width: 1800px) and (min-width: 1500px){
    .user_skill .skill_charts {
      width: 1060px;
    }
    .skill_charts .pers_randar {
      width: 420px;
    }
    .skill_charts .dataNums {
      width: 43%;
      padding-left: 0;
    }
    .ratio_line {
      width: 335px;
      padding-left: 40px;
    }
    .q_curve{
      width:1318px;
    }
    .gf_typeLine li {
      margin-right:50px;
    }
    .gold_plate li{
      width:180px;
      height:192px;
      padding-top:42px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:100px;
      height:115px;
    }
    .gold_plate li .light_g2{
      width:80px;
      height: 80px;
      top: 65px;
    }
    .gold_plate li .light_g3{
      width: 85px;
      height: 85px;
      top: 60px;
    }
    .gold_plate li .plate_bg img{
      width:65px;
      height:66px;
    }
    .gold_plate li .plate_name{
      width:135px;
      height:38px;
      line-height:42px;
      font-size:16px;
    }
  }
  @media (min-width: 1800px) {
    .user_skill .skill_charts {
      width: 1260px;
    }
    .skill_charts .pers_randar {
      width: 500px;
    }
    .skill_charts .dataNums {
      width: 48%;
      padding-left: 0;
    }
    .ratio_line {
      width: 450px;
      padding-left: 40px;
    }
    .q_curve{
      width:1500px;
    }
    .gf_typeLine li {
      margin-right:70px;
    }
    .gold_plate li{
      width:230px;
      height:242px;
      padding-top:57px;
      margin-right:30px;
    }
    .gold_plate li .plate_bg{
      width:123px;
      height:138px;
    }
    .gold_plate li .light_g2{
      width:96px;
      height: 96px;
      top: 83px;
    }
    .gold_plate li .light_g3{
      width: 100px;
      height: 100px;
      top: 76px;
    }
    .gold_plate li .plate_bg img{
      width:65px;
      height:66px;
    }
    .gold_plate li .plate_name{
      width:150px;
      height:38px;
      line-height:42px;
      font-size:16px;
    }
  }
</style>
<style>
  .calendar-date,.calendar-date .item-curMonth{
    background-color:#02304a!important;
    color:#fafbed!important;
  }
  .calendar-date .item{
    background-color:#0e233e;
    color:#2f4c6a;
  }
  .calendar {
    display: none;
    padding: 5px;
    border-radius: 6px;
  }
  .calendar-title {
    position: relative;
    height: 30px;
    line-height: 30px;
    text-align:center;
    margin-bottom:10px;
    margin-top:5px;
  }
  .calendar-title a.title {
    display: inline-block;
    font-size: 20px;
  }
  #backToday {
    position: absolute;
    left: 70%;
    top: 8px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    background-color: rgb(255, 128, 142);
    font-size: 18px;
  }
  .calendar-title .arrow {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    color:#e0dbd5;
  }
  .calendar-title a{
    color:#e0dbd5;
  }
  .calendar-title .arrow span {
    color: #ddd;
    font-size: 18px;
    cursor: pointer;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  .already_sign {
    background-image: url('~@/assets/img/personal/quan.png');
    background-repeat: no-repeat;
    background-position:center center;
  }
  .calendar-title .arrow span:hover {
    color: #c2c2c2;
  }
  .calendar-title .arrow-prev {
    float: left;
    margin-left:38px;
    margin-top:5px;
  }
  .calendar-title .arrow-next {
    float: right;
    margin-right:38px;
    margin-top:5px;
  }
  .calendar-week,
  .calendar-date {
    overflow: hidden;
    padding:0;
  }
  .calendar-week .item,
  .calendar-date .item {
    float: left;
    width: 42px;
    height: 33px;
    line-height: 33px;
    text-align: center;
  }
  .calendar-week {
    margin:0;
    font-size: 12px;
    background:#164e89;
    color:#e0d8d6;
  }
  .calendar-week li{
    height:27px!important;
    line-height:27px!important;
  }
  .calendar-date {}
  .calendar-date .item {
    cursor: pointer;
    font-size: 14px;
  }
  .calendar-date .item:hover,
  .calendar-date .item-curMonth:hover {
    background-color: #f0f0f0;
  }
  .calendar-date .item-curMonth {
    color: #333;
  }
  .calendar-date .item-curDay,
  .calendar-date .item-curDay:hover {
    color: #fff!important;
    background-color: #13d1e7!important;
  }
  .calendar-date .item-selected,
  .calendar-date .item-selected:hover {
    color: #FFF!important;
    background: #164e89!important;
  }
  .calendar-today {
    display: none;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 90px;
    height: 48px;
    padding: 6px 10px;
    background-color: rgb(255, 128, 142);
    border-radius: 5px;
  }
  .calendar-today .triangle {
    position: absolute;
    top: 50%;
    left: -16px;
    margin-top: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: transparent rgb(255, 128, 142) transparent transparent;
  }
  .calendar-today p {
    color: #fff;
    font-size: 14px;
    line-height: 24px;
  }
</style>
<style scoped>
  /*签到动画*/
  .gold_box{
    width:230px;
    height:235px;
    background:url('~@/assets/img/personal/plate.png')no-repeat;
    background-size:100% 100%;
    margin:0 auto;
    margin-top:10px;
    text-align:center;
    position:relative;
    transform-style: preserve-3d;
    transition: 1.5s;
    transform-origin: center;
  }
  .gold_box .full{
    animation:.6s gold_box_shake linear;
    position:relative;
    z-index:1;
  }
  .light_rot,.light_rot2{
    width:100%;
    height:150px;
    background:url('~@/assets/img/personal/guang5.png')no-repeat;
    background-size:100% 100%;
    display:inline-block;
    position:absolute;
    right:18px;
    top:8px;
    z-index:2;
    transform-origin:center bottom;
    opacity:0;
    transition:4.2s;
  }
  .light_rot{
    animation:2s rot_light linear infinite alternate;
  }
  .light_rot2{
    animation:2s rot_light2 linear infinite alternate;
  }
  @keyframes rot_light{
    0%{
      transform:rotate(-5deg)
    }
    50%{
      transform:rotate(5deg)
    }
    100%{
      transform:rotate(0deg)
    }
  }
  @keyframes rot_light2{
    0%{
      transform:rotate(5deg)
    }
    50%{
      transform:rotate(-5deg)
    }
    100%{
      transform:rotate(0deg)
    }
  }
  @keyframes gold_box_shake{
    0%{
      transform:translateX(-25px)
    }
    6%{
      transform:translateX(25px)
    }
    10%{
      transform:translateX(-21px)
    }
    15%{
      transform:translateX(21px)
    }
    20%{
      transform:translateX(-15px)
    }
    27%{
      transform:translateX(15px)
    }
    34%{
      transform:translateX(-12px)
    }
    44%{
      transform:translateX(12px)
    }
    54%{
      transform:translateX(-5px)
    }
    66%{
      transform:translateX(5px)
    }
    78%{
      transform:translateX(-3px)
    }
    85%{
      transform:translateX(2px)
    }
    100%{
      transform:translateX(0)
    }
  }
  /*勋章样式*/
  .gold_plate{
    padding-left:70px;
    padding-top:40px;
    float:left;
    width:calc(100% - 80px)
  }
  .gold_plate li{
    background:url('~@/assets/img/personal/plate.png')no-repeat;
    background-size:100% 100%;
    text-align:center;
    float:left;
    position:relative;
    margin-bottom:30px;
  }
  .gold_plate li .light_g2{
    background: url('~@/assets/img/personal/n1.png')no-repeat;
    background-size: 100% 100%;
    text-align: center;
    display: inline-block;
    position: absolute;
    left: 0;
    right:0;
    margin:auto;
    z-index: 10;
    animation:2.5s gold2 linear infinite;
  }
  .gold_plate li .light_g3{
    background: url('~@/assets/img/personal/n2.png')no-repeat;
    background-size: 100% 100%;
    text-align: center;
    display: inline-block;
    position: absolute;
    left: 0;
    right:0;
    margin:auto;
    z-index: 10;
    animation:2.1s gold3 linear infinite;
  }
  @keyframes gold{
    0%{
      transform:rotate(0)
    }
    100%{
      transform:rotate(360deg);
    }
  }
  @keyframes gold2{
    0%{
      transform:scale(1.3) rotate(0);
      opacity:0;
    }
    15%{
      opacity:1;
      transform:scale(1.5) rotate(0);
    }
    95%{
      transform:scale(2.6) rotate(20deg);
    }
    100%{
      opacity:0;
    }
  }
  @keyframes gold3{
    0%{
      transform:scale(1.8) rotate(0);
      opacity:0;
    }
    15%{
      opacity:1;
      transform:scale(1.9) rotate(0);
    }
    95%{
      transform:scale(2.5) rotate(-20deg);
    }
    100%{
      opacity:0;
    }
  }
  .gold_plate li .plate_bg{
    background:url('~@/assets/img/personal/goldbj.png')no-repeat;
    background-size:100% 100%;
    text-align:center;
    padding-top:15%;
    display:inline-block;
    position:relative;
    z-index:1;
  }
  .gold_plate li .plate_name{
    background:url('~@/assets/img/personal/xzmc.png')no-repeat;
    background-size:100% 100%;
    text-align:center;
    color:#d66b0d;
    font-weight:bold;
    margin-top:12px;
    display:inline-block;
  }
</style>
