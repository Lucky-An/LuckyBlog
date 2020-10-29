<template>
  <div class='section wrap_size' id="team_detail">
    <div class="handle_btn clearfix">
      <router-link to="/team/list" id="create_team_btn" style="float:right!important;">{{$t('team.teamWall')}}</router-link>
    </div>
    <div class="card_style detail_info clearfix" v-cloak >
      <div class="team_logo_box">
          <span class="logo_img" :style="{backgroundImage:'url(' + user_data.logo_url + ')'}">
           </span>
      </div>
      <div class="team_name">
        <div class="label_name">{{$t('team.table.team')}}</div>
        <el-tooltip class="item" effect="dark" :content="user_data.name" placement="bottom-start">
          <div class="label_value" v-text="user_data.name.length>8 ? user_data.name.slice(0,8)+'...' : user_data.name"></div>
        </el-tooltip>
      </div>
      <div class="team_num">
        <div class="label_name">{{$t('team.table.team_number')}}</div>
        <el-tooltip class="item" effect="dark" :content="user_data.team_member_number+$t('task.people')" placement="bottom-start">
          <div class="label_value" ><span v-text="user_data.team_member_number"></span>{{$t('task.people')}}</div>
        </el-tooltip>
      </div>
      <div class="team_score">
        <div class="label_name">{{$t('team.table.team_points')}}</div>
        <el-tooltip class="item" effect="dark" :content="user_data.point+$t('team.table.score')" placement="bottom-start">
          <div class="label_value" ><span v-text="user_data.point==null ? 0 : user_data.point"></span>{{$t('team.table.score')}}</div>
        </el-tooltip>
      </div>
      <div class="team_createtime">
        <div class="label_name">{{$t('team.table.create_time')}}</div>
        <el-tooltip class="item" effect="dark" :content="user_data.create_time" placement="bottom-start">
          <div class="label_value" style="font-size:16px;"  v-text="user_data.create_time"></div>
        </el-tooltip>
      </div>
      <div class="team_message">
        <div class="label_name">{{$t('team.table.team_manifesto')}}</div>
        <el-tooltip class="item" effect="dark" :content="user_data.manifesto" placement="bottom-start">
          <div class="label_value" style="font-size:16px;"  v-text="manifesto(user_data.manifesto)"></div>
        </el-tooltip>
      </div>
    </div>
    <div class="skill_parameter clearfix mrg20B">
      <div class="card_style competition_num" id="homepage">
        <div class="card_head">
          {{$t('team.competition_record')}}
        </div>
        <span class="look_more cursor" @click="dialogVisible=true" v-show="show_lookmore">{{$t('team.lookMore')}}</span>
        <div v-if="competition.length">
          <div class="ordinary">
            <template>
              <el-table
                ref="singleTable"
                :data="competition"
                border
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  prop="event_name"
                  :label="$t('team.table.competition_name')"
                  width="300">
                </el-table-column>
                <el-table-column
                  prop="rank"
                  :label="$t('team.table.rank')">
                </el-table-column>
                <el-table-column
                  prop="team_score"
                  :label="$t('team.table.team_score')">
                </el-table-column>
                <el-table-column
                  prop="team_point"
                  :label="$t('team.table.team_points')">
                </el-table-column>
              </el-table>
            </template>
          </div>
          <div class="ordinary">
            <el-dialog
              :title="$t('team.competition_record')"
              :visible.sync="dialogVisible"
              width="1100px"
              custom-class="ad_public_modal success_answer record" >
              <el-table
                :data="eventlog_data"
                height="450"
                border
                style="width: 100%">
                <el-table-column
                  prop="event_name"
                  :label="$t('team.table.competition_name')"
                  width="300">
                </el-table-column>
                <el-table-column
                  prop="rank"
                  :label="$t('team.table.rank')"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="team_score"
                  :label="$t('team.table.team_score')">
                </el-table-column>
                <el-table-column
                  prop="team_point"
                  :label="$t('team.table.team_points')">
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer">
      </span>
            </el-dialog>
          </div>
        </div>
        <div v-else class="text-center">
          <img src="@/assets/img/kong.png" alt="">
        </div>
      </div>
      <div class="skill_randar card_style">
        <div class="card_head">
          {{$t('team.skill')}}
        </div>
        <div id="skill_chart" ></div>
      </div>
    </div>
    <div class="team_honor card_style">
      <div class="card_head">
        {{$t('team.honor')}}
      </div>
      <div v-cloak>
        <ul class="honor_box clearfix" v-if="!honor_data.length==0">
          <li v-for="item in honor_data" class="honor_list" >
            <div class="honor_gold">
              <img :src="item.image" alt="" width=140>
            </div>
            <div class="text-center label_wrap">
              <span v-text="item.name" :title="item.name" class="honor_label ellipsis_txt pad10L pad10R"></span>
            </div>
          </li>
        </ul>
        <span style="width:100%;display:inline-block;text-align:center;" v-else>
            <img src="@/assets/img/kong.png" alt="">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {setStorage,getStorage} from '@/utils/storage'

    export default {
      name: "team_detail",
      data(){
          return{
            dialogVisible:false,
            user_data:{
              name:''
            },
            competition:[],
            eventlog_data:[],
            skill_data:[],
            team_id:'',
            eventlog_modal:{
              id:'eventlog',
              header:{
                title:''
              },
              clickBg_nohidden:true,
            },
            honor_data:[],
            show_lookmore:false
          }
      },
      created(){
        this.team_id = this.$route.query.id;
        this.$http.get('/api/teams/'+this.team_id).then((response)=>{
          // 响应成功回调
          this.user_data = response.data;
          this.honor_data = response.data.glories;
        }).catch((err)=>{

        });
        this.$http.get('/api/teams/radar_data/'+this.team_id).then((res)=>{
          this.skill_data = res.data;
          this.init_chart()
        }).catch((err)=>{

        })
        this.$http.get('/api/teams/event_logs/'+this.team_id).then((res)=>{
          if(res.data.length>5){
            this.competition = res.data.slice(0,5);
            this.eventlog_data = res.data;
            this.show_lookmore = true;
          }else{
            this.competition = res.data;
            this.eventlog_data = res.data;
          }
        })
          .catch((err)=>{

          })
      },
      methods:{
        manifesto(data){
          if(data==null||data==''){
            return this.$t('dialog_list.no_content')
          }else{
            if(data.length>10){
              return data.substr(0,9)+'…';
            }else{
              return data;
            }
          }
        },
        init_chart(){
          var chart1 = this.$echarts.init(document.getElementById("skill_chart"));

          var option = {
            title: {
              top: '5%',
              left: '3%',
              textStyle: {
                color: '#fff',
                fontSize: 20,
              }
            },
            // legend: {                        // 图例组件
            //     show: true,
            //     icon: 'circle',                   // 图例项的 icon。ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'也可以通过 'image://url' 设置为图片，其中 url 为图片的链接，或者 dataURI。可以通过 'path://' 将图标设置为任意的矢量路径。
            //     top : '-5px',                    // 图例距离顶部边距
            //     left : '0',                   // 图例距离左侧边距
            //     itemWidth: 10,                  // 图例标记的图形宽度。[ default: 25 ]
            //     itemHeight: 10,                 // 图例标记的图形高度。[ default: 14 ]
            //     itemGap: 8,                	// 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
            //     orient: 'horizontal',             // 图例列表的布局朝向,'horizontal'为横向,''为纵向.
            //     textStyle: {                    // 图例的公用文本样式。
            //         fontSize: 12,
            //         color: '#fff'
            //     },
            //     data: [],
            // },
            radar: [{                       // 雷达图坐标系组件，只适用于雷达图。
              center: ['50%', '50%'],             // 圆中心坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
              radius: 130,                        // 圆的半径，数组的第一项是内半径，第二项是外半径。
              startAngle: 0,                     // 坐标系起始角度，也就是第一个指示器轴的角度。[ default: 90 ]
              nameGap: 15,                        // 指示器名称和指示器轴的距离。[ default: 15 ]
              splitNumber: 4,                     // (这里是圆的环数)指示器轴的分割段数。[ default: 5 ]
              shape: 'polygon',                    // 雷达图绘制类型，支持 'polygon'(多边形) 和 'circle'(圆)。[ default: 'polygon' ]
              axisLine: {                         // (圆内的几条直线)坐标轴轴线相关设置
                lineStyle: {
                  color: '#046ba5',                   // 坐标轴线线的颜色。
                  width: 1,                      	 // 坐标轴线线宽。
                  type: 'solid',                   // 坐标轴线线的类型。
                }
              },
              splitLine: {                        // (这里是指所有圆环)坐标轴在 grid 区域中的分隔线。
                lineStyle: {
                  color: '#3b4851',                       // 分隔线颜色
                  width:1, 							 // 分隔线线宽
                }
              },
              splitArea: {                        // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                show: true,
                areaStyle: {                            // 分隔区域的样式设置。
                  color: ['rgba(0,0,0,0)'],       // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                }
              },
              indicator: []
            }],
            series: [{
              name: '雷达图',             // 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
              type: 'radar',              // 系列类型: 雷达图
              itemStyle: {                // 折线拐点标志的样式。
                normal: {                   // 普通状态时的样式
                  lineStyle: {
                    width: 1
                  },
                  opacity: 0.2
                },
                emphasis: {                 // 高亮时的样式
                  lineStyle: {
                    width: 1
                  },
                  opacity: 1
                }
              },
              data: []
            }, ]
          };
          var skill = this.skill_data;
          var color_data = ['255,0,0','51,0,255','255,255,0']
          var server_data=[];
          var indicator_data=[];
          var legend = [];
          for(var i=0;i<skill.length;i++){
            server_data.push({
              name: skill[i].name,
              value: skill[i].value,
              symbol: 'circle',
              symbolSize: 3,
              itemStyle: {
                normal: {
                  borderColor: 'rgba('+color_data[i]+',1)',
                  borderWidth: 1,
                }
              },
              lineStyle: {
                normal: {
                  opacity: 0.5
                }
              },
              areaStyle: {
                normal: {
                  color: 'rgba('+color_data[i]+',0.5)'
                }
              }
            })
            // legend.push({                    // 图例的数据数组。数组项通常为一个字符串，每一项代表一个系列的 name（如果是饼图，也可以是饼图单个数据的 name）。图例组件会自动根据对应系列的图形标记（symbol）来绘制自己的颜色和标记，特殊字符串 ''（空字符串）或者 '\n'（换行字符串）用于图例的换行。
            //     name: skill[i].name,                 // 图例项的名称，应等于某系列的name值（如果是饼图，也可以是饼图单个数据的 name）。
            //     icon: 'rect',               // 图例项的 icon。
            //     textStyle: {                // 图例项的文本样式。
            //         color: 'rgba(51,0,255,1)',
            //         fontWeight: 'bold'		// 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
            //     }
            // })
          }
          for(var i=0;i<skill[0].type.length;i++){
            indicator_data.push({
              name:skill[0].type[i],
              max:100
            })
          }

          option.series[0].data = server_data;
          option.series[0].data = server_data;
          option.radar[0].indicator = indicator_data;
          // option.legend.data = legend;
          // 使用刚指定的配置项和数据显示图表

          chart1.setOption(option)

        },
      },
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #team_detail
    .record .el-table{
      border-bottom:1px solid #2a4362;
    }
    #create_team_btn, .btn_blue {
      background: url('~@/assets/img/button/list_btn.png') no-repeat;
      border: none;
      background-size: 100% 100%;
      font-size: 16px;
      font-weight: bold;
      float: left;
      color: white;
      text-align: center;
      margin:15px 0;
    }
    .card_style
      edge-angle()
      card_style()
      margin-bottom:25px;
</style>
<style lang="stylus" rel="stylesheet/stylus" >
  #team_detail{
    .el-table__body tr.current-row>td{
      background-color:rgba(0,0,0,0)!important;
    }
    #homepage .el-table--enable-row-hover .el-table__body tr:hover{
      background-image:none!important;
      background-color:rgba(0,0,0,0)!important;
      cursor:default!important;
    }
    .card_head {
      border-left: 4px solid #0080ff;
      padding-left: 6px;
      font-size: 18px;
      font-weight: bold;
      margin-bottom:18px;
      color:white;
      text-align:left;
    }
    .detail_info{
      width:100%;
      .team_logo_box{
        border:2px solid #0080ff;
        border-radius: 6px;
        float:left;
        .logo_img{
          width:100%;
          height:100%;
          background-repeat: no-repeat;
          background-size:cover;
          display:inline-block;
        }
      }
      .team_name,.team_num,.team_score,.team_createtime,.team_message{
        float:left;
        border-right:1px solid #053a66;
        text-align:left;
        .label_name{
          font-size:16px;
          color:#e7e9e8;
        }
        .label_value{
          font-size:18px;
          color:#0080fd;
          font-weight:bold;
        }
      }
      .team_message{
        border:none;
      }
    }
    .skill_parameter{
      .competition_num{
        position: relative;
        float:left;
        .look_more{
          position: absolute;
          color:#0080fd;
          text-decoration: underline;
          cursor:pointer;
        }
      }
    }
    .skill_randar{
      float:right;
      #skill_chart{
        width:100%;
        height:300px;
      }
    }
    .card_head{
      border-left:4px solid #0080ff;
      padding-left:6px;
      font-size:18px;
      font-weight:bold;
    }
    .honor_box{
      .honor_list{
        width: 140px;
        height:152px;
        margin-right:40px;
        float:left;
        margin-bottom:30px;
        .honor_gold{
          width:140px;
          height:140px;
          img{
            width:100%;
            height:100%;
          }
        }
        .label_wrap{
          margin-top:-20px;
          .honor_label{
            width:113px;
            height:29px;
            display:inline-block;
            background:url('~@/assets/img/personal/xzmc.png');
            background-size:100% 100%;
            font-size:14px;
            color:#cc6a05;
            line-height: 29px;
            font-weight: bold;
          }
        }
      }
    }
  }
  @media (max-width:1300px){
    #team_detail{
      padding-bottom:50px;
      #create_team_btn, .btn_blue {
        width: 150px;
        height: 40px;
        line-height: 40px;
      }
      .detail_info{
        height: 120px;
        padding: 20px 30px;
        margin-bottom:20px;
        .team_logo_box{
          width:80px;
          height:66px;
          margin-top:8px;
        }
        .team_name,.team_num,.team_score,.team_createtime,.team_message{
          padding:15px;
          width: 185px;
          padding-left: 34px;
          height:80px;
          margin-top: 0;
          .label_name{
            margin-bottom:16px;
          }
        }
        .team_message{
          width:295px;
        }
      }
      .skill_parameter{
        .competition_num{
          padding:25px;
          width:calc(100% - 530px);
          height:377px;
          .look_more{
            right:25px;
            top:25px;
          }
        }
      }
      .skill_randar{
        width:500px;
        height:377px;
        padding:25px;
        #skill_chart{
          height:300px;
        }
      }
      .card_head{
        margin-bottom:20px;
      }
      .team_honor{
        padding:25px;
      }
    }
  }
  @media (min-width:1300px) and (max-width:1500px){
    #team_detail{
      padding-bottom:50px;
      #create_team_btn, .btn_blue {
        width: 150px;
        height: 40px;
        line-height: 40px;
      }
      .detail_info{
        height: 130px;
        padding: 20px 30px;
        margin-bottom:20px;
        .team_logo_box{
          width:85px;
          height:70px;
          margin-top:10px;
        }
        .team_name,.team_num,.team_score,.team_createtime,.team_message{
          padding:15px;
          width: 200px;
          padding-left: 50px;
          height:85px;
          margin-top: 2px;
          .label_name{
            margin-bottom:16px;
          }
        }
        .team_message{
          width:295px;
        }
      }
      .skill_parameter{
        .competition_num{
          padding:25px;
          width:calc(100% - 530px);
          height:377px;
          .look_more{
            right:25px;
            top:25px;
          }
        }
      }
      .skill_randar{
        width:500px;
        height:377px;
        padding:25px;
        #skill_chart{
          height:300px;
        }
      }
      .card_head{
        margin-bottom:20px;
      }
      .team_honor{
        padding:25px;
      }
    }
  }
  @media (min-width:1500px) and (max-width:1800px){
    #team_detail{
      padding-bottom:50px;
      #create_team_btn, .btn_blue {
        width: 175px;
        height: 45px;
        line-height: 45px;
      }
      .detail_info{
        height:160px;
        padding:30px 40px;
        margin-bottom:20px;
        .team_logo_box{
          width: 96px;
          height: 80px;
          margin-top: 9px;
        }
        .team_name,.team_num,.team_score,.team_createtime,.team_message{
          padding:15px;
          width: 230px;
          padding-left: 54px;
          height:96px;
          .label_name{
            margin-bottom:16px;
          }
        }
        .team_message{
          width:340px;
        }
      }
      .skill_parameter{
        .competition_num{
          padding:25px;
          width:calc(100% - 530px);
          height:377px;
          .look_more{
            right:25px;
            top:25px;
          }
        }
      }
      .skill_randar{
        width:500px;
        height:377px;
        padding:25px;
        #skill_chart{
          height:300px;
        }
      }
      .card_head{
        margin-bottom:20px;
      }
      .team_honor{
        padding:25px;
      }
    }
  }
  @media (min-width:1800px){
    #team_detail{
      padding-bottom:50px;
      #create_team_btn, .btn_blue {
        width: 175px;
        height: 45px;
        line-height: 45px;
      }
      .detail_info{
        height:160px;
        padding:30px 40px;
        margin-bottom:20px;
        .team_logo_box{
          width: 96px;
          height: 80px;
          margin-top: 9px;
        }
        .team_name,.team_num,.team_score,.team_createtime,.team_message{
          padding:15px;
          width:265px;
          padding-left:75px;
          height:96px;
          .label_name{
            margin-bottom:16px;
          }
        }
        .team_message{
          width:340px;
        }
      }
      .skill_parameter{
        .competition_num{
          padding:25px;
          width:calc(100% - 530px);
          height:377px;
          .look_more{
            right:25px;
            top:25px;
          }
        }
      }
      .skill_randar{
        width:500px;
        height:377px;
        padding:25px;
        #skill_chart{
          height:300px;
        }
      }
      .card_head{
        margin-bottom:20px;
      }
      .team_honor{
        padding:25px;
      }
    }
  }
</style>
