<template>
  <div style="margin-top:-15px;" :class="{'marT':!is_login}">
    <fullScreen v-if="!is_login"></fullScreen>
    <div v-if="show_trend&&error" class="clearfix">
      <div id="trend_chart" :class="{'left_side':config.showBoard}"></div>
      <div class="trend_board" v-if="config.showBoard">
        <div class="trend_data_title">{{$t('trend.data_list.Player_data')}}</div>
        <div class="trend_data_body">
          <ul>
            <li>
              <span>{{$t('trend.data_list.person_total_number')}}：</span>
              <span class="data_number">10</span>
            </li>
            <li>
              <span>{{$t('trend.data_list.solved_topic_number')}}：</span>
              <span class="data_number">10</span>
            </li>
            <li>
              <span>{{$t('trend.data_list.Number_of_answers')}}：</span>
              <span class="data_number">10</span>
            </li>
            <li>
              <span>{{$t('trend.data_list.first_blood_number')}}：</span>
              <span class="data_number">10</span>
            </li>
            <li>
              <span>{{$t('trend.data_list.IP_Number')}}：</span>
              <span class="data_number">10</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div style="margin-top:100px;padding-bottom:120px;" v-else>
      <img src="@/assets/img/kong.png" alt="">
    </div>
  </div>

</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
  const { mapState } = createNamespacedHelpers('match');
  import fullScreen from "@/components/match/common/small_part/fullScreen";
  export default {
    components:{
      fullScreen
    },
    name: 'competition_trend',
    props:['config','api','agar'],
    data(){
      return{
        is_login:localStorage.isUserLogin,
        show_trend:false,//比赛未开始不显示曲线图
        error:true,//接口报错时不显示曲线图
        trend_data:{
          data:{},
          minScore:0,
          maxScore:0,
          maxTime:'',
          minTime:'',
          trend_legend:[],
          serverData:[]
        },
        myChart:null
      }
    },
    created(){
      if(this.match_data.process == 1){
        this.show_trend = false;
      }else{
        this.show_trend = true;
      }
    },
    methods:{
      trend_option(trend_legend,minTime,maxTime,minScore,maxScore,serverData){
        let sys_type= window.location.pathname.split('/')[1];
        let color_purple='#4e537b'
        if(sys_type=='ad5'){
          color_purple='#4e537b'
        }else{
          color_purple='#fff'
        }

        let that = this;
        let obj = {
          color:["#ff7f50","#87cefa","#ffd700","#32cd32",
            "#6495ed","#ff69b4","#ba55d3","#cd5c5c",
            "#ffa500","#40e0d0","#1e90ff","#ff6347",
            "#7b68ee","#00fa9a","#da70d6","#6b8e23",
            "#ff00ff","#3cb371","#b8860b","#30e0e0"],
          tooltip: {
            trigger: 'item',
            formatter: function(params, ticket, callback){
              var name = params.seriesName;
              // var time = dateUtil.formatHM(params.value[0]);
              var time = params.value[0];
              var score = params.value[1].toFixed(2);

              return '<div>' + name + '</div><div>' + time + ': ' + score + '</div>';
            }
          },
          legend:{
            x:"right",
            orient:"vertical",
            textStyle:{color:"auto"},
            data:trend_legend
          },
          grid:{
            borderWidth:0,
            containLabel:false,
            width:"82%",
            left:'4%'
          },
          xAxis:[
            {
              name:that.$t('trend.dialog.time'),
              nameTextStyle:{
                color:color_purple
              },
              type:"time",
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color:'rgba(255,255,255,.1)'
                }
              },
              boundaryGap:false,
              min:minTime,//开始时间
              max:maxTime,//结束时间
              axisTick:{
                show:true,
                lineStyle:{color:color_purple}
              },
              axisLine:{lineStyle:{color:color_purple}},
              splitNumber:12,
              axisLabel:{textStyle:{color:color_purple}}
            }
          ],
          yAxis:[{
            name:that.$t('trend.dialog.score'),
            nameTextStyle:{color:color_purple},
            type:"value",
            min:minScore,//最小分数
            max:maxScore+1000,//最高分数
            axisLabel:{
              textStyle:{color:color_purple}
            },
            axisTick:{
              show:true,
              lineStyle:{color:color_purple}
            },
            axisLine:{lineStyle:{color:color_purple}},
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color:'rgba(255,255,255,.1)'
              }
            }}
          ],
          series:serverData//图表数据
        }
        return obj;
      },
      initChart(myChart,state){
        var that = this;
        this.api.trends(this.agar,{
          limit:10,
          offset:0
        }).then((res)=>{
          if(!res.data.rows.length){
            this.error = false;
            return;
          }else{
            this.error = true;
          }
          let data = res.data;
          let change_name='';
          let name_str='';
          let rank_num_list = [that.$t('trend.dialog.first'),that.$t('trend.dialog.second'),that.$t('trend.dialog.third')]
          this.trend_data.minTime = this.match_data.start_time;//比赛开始时间
          this.trend_data.maxTime = this.match_data.end_time;//比赛结束时间
          let nowTime = new Date();
          if(state == 0){
            this.trend_data.maxTime = nowTime;
          }

          data.rows.forEach((item,i)=>{
            let server_arr = [];
            name_str = item.obj_name.length>8 ?  item.obj_name.substring(0,8)+'…' : item.obj_name;
            change_name = i<3 ? rank_num_list[i]+':'+name_str : name_str;
            server_arr.push({value: [this.trend_data.minTime, 0]});//添加一个在0位置的值
            let addNum = 0;
            item.data.forEach((items,i)=>{
              addNum+=items.score;
              if(this.trend_data.maxScore<addNum){
                this.trend_data.maxScore = addNum
              }
              server_arr.push({
                value:[new Date(Date.parse(items.time.replace(/-/g,"/"))),addNum]
              })
            })
            server_arr.push({value: [this.trend_data.maxTime, addNum]});//添加一个当前位置的值
            this.trend_data.serverData.push({
              name:change_name,
              type:"line",
              legendHoverLink:true,
              symbol:"emptyCircle",
              symbolSize:6,
              showAllSymbol:true,
              data:server_arr
            })
            this.trend_data.trend_legend.push(change_name);
          })

          let obj_data = this.trend_option(this.trend_data.trend_legend,this.trend_data.minTime,this.trend_data.maxTime,this.trend_data.minScore,this.trend_data.maxScore,this.trend_data.serverData)

          let myChart = this.$echarts.init(document.getElementById('trend_chart'))
          myChart.setOption(obj_data);

          window.onresize = function(){
            myChart.resize();
          }
        })
          .catch((err)=>{
            this.error = false;
          })
      },
    },
    mounted () {
      this.myChart = this.$echarts.init(document.getElementById('trend_chart'))
      if(this.match_data.hash){
        this.initChart(this.myChart,this.match_data.process)
      }
    },
    watch: {
      match_data (val, old) {//监听获取到的公共的题目公告。
        this.initChart(this.myChart,this.match_data.process)
      }
    },
    computed:{
      ...mapState(['match_data'])
    },
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  #trend_chart
    margin:0 auto;
  @media (max-width:1300px)
    #trend_chart
      width:1200px;
      height:550px;
  @media (min-width:1300px) and (max-width:1600px)
    #trend_chart
      width:1200px;
      height:590px;
  @media (min-width:1600px) and (max-width:1920px)
    #trend_chart
      width:1360px;
      height:650px;
  @media (min-width:1920px)
    #trend_chart
      width:1360px;
      height:700px;
  .left_side{
    width:calc(100% - 280px)!important;
  }
  .left_side{
    float:left;
  }
  .trend_board{
    float:right;
  }
  .trend_board{
    width:250px;
    height:377px;
    background:#08325a;
    border-radius 8px;
    .trend_data_title{
      background:lightblue;
      line-height:54px;
      color:#fff;
      font-size:16px;
      border-top-left-radius 8px;
      border-top-right-radius 8px;
    }
    .trend_data_body{
      padding:6px 10px 0;
      ul{
        li{
          line-height:58px;
          border-bottom:1px solid rgba(255,255,255,.15);
          text-align:left;
          color:#fff;
          font-size:16px;
          padding-left:20px;
          &:last-child{
            border-bottom:none;
          }
          .data_number{
            color:lightblue;
            font-size:22px;
            font-weight:bold;
            margin-left:5px;
            font-style:italic;
          }
        }
      }
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .screen_handle
    position:absolute;
    right:25px;
    top:-20px;
    z-index:8000;
  .marT
    margin-top:20px!important;
</style>
