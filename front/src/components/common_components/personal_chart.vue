<template>
    <div style="height:100%;">
      <div class='pers_randar' id='randar_chart'>

      </div>
      <ul class='pad20T dataNums'>
        <li v-for="item in type_data" >
          <span class='fl lineH50 ratio_name'>{{item.title}}</span>
          <div class='fl ratio_line'>
            <div class="blue_line">
              <div class="ratio_num" v-bind:style="{width: item.value + '%' }">

              </div>
            </div>
          </div>
          <span class='fl lineH50 font16'>{{item.value}}%</span>
        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: 'personal_chart',
    props:['radarData','type_data'],
    data(){
      return{
        randarChart:null
      }
    },
    methods:{
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
            bottom:'10px',
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
                color: '#3173fd',
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
                color: '#2c68e3',
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
    }
  }
</script>

<style scoped>
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
  @media (max-width: 1300px) {
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
  }
  @media (max-width: 1500px) and (min-width: 1300px) {
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
  }
  @media (max-width: 1800px) and (min-width: 1500px){
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
  }
  @media (min-width: 1800px) {
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
  }
</style>
