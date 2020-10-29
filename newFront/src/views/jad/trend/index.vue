<template>
  <div class="contend">
    <countDown class="countDown" />
    <div
      v-show="error"
      class="guide_wrap"
      style="padding:40px 0 0 0;"
    >
      <div
        v-show="show_trend"
        id="trend_chart"
      />
      <div
        v-show="!show_trend"
        style="font-size:22px;color:white;margin-top:30px;"
      >{{ $t('competition.notBegun') }}</div>
    </div>
    <div
      v-show="!error"
      style="padding-top:100px;text-align: center"
    >
      <img
        src="@/assets/common/kong.png"
        alt=""
      >
    </div>
  </div>
</template>

<script>
import { trends } from '@/api/jad'

import { mapGetters } from 'vuex'
import countDown from '@/components/countDown'

export default {
  name: 'Trend',
  components: { countDown },

  data() {
    return {
      show_trend: true,
      error: false,
      myChart: null
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  watch: {
    match(val, old) {
      // 监听获取到的公共的题目公告。
      this.initChart()
      if (this.match.process == 1) {
        this.show_trend = false
      } else {
        this.show_trend = true
      }
    }
  },
  created() {
    if (this.match.hash) {
      this.initChart()
      if (this.match.process == 1) {
        this.show_trend = false
      } else {
        this.show_trend = true
      }
    }
  },
  methods: {
    trend_option(
      trend_legend,
      minTime,
      maxTime,
      minScore,
      maxScore,
      serverData
    ) {
      const that = this
      const obj = {
        animation: false,
        color: [
          '#ff7f50',
          '#87cefa',
          '#ffd700',
          '#32cd32',
          '#6495ed',
          '#ff69b4',
          '#ba55d3',
          '#cd5c5c',
          '#ffa500',
          '#40e0d0',
          '#1e90ff',
          '#ff6347',
          '#7b68ee',
          '#00fa9a',
          '#da70d6',
          '#6b8e23',
          '#ff00ff',
          '#3cb371',
          '#b8860b',
          '#30e0e0'
        ],
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            var name = params.seriesName
            // var time = dateUtil.formatHM(params.value[0]);
            var time = params.value[0]
            var score = params.value[1].toFixed(2)

            return (
              '<div>' + name + '</div><div>' + time + ': ' + score + '</div>'
            )
          }
        },
        legend: {
          x: 'right',
          orient: 'vertical',
          textStyle: { color: 'auto' },
          data: trend_legend
        },
        grid: {
          borderWidth: 0,
          containLabel: false,
          width: '82%',
          left: '4%'
        },
        xAxis: [
          {
            name: that.$t('trend.dialog.time'),
            nameTextStyle: {
              color: '#FFF'
            },
            type: 'time',
            boundaryGap: false,
            min: minTime, // 开始时间
            max: maxTime, // 结束时间
            axisTick: {
              show: true,
              lineStyle: { color: '#FFF' }
            },
            axisLine: { lineStyle: { color: '#fff' }},
            splitLine: { show: false },
            splitNumber: 12,
            axisLabel: { textStyle: { color: '#ffffff' }}
          }
        ],
        yAxis: [
          {
            name: that.$t('trend.dialog.score'),
            nameTextStyle: { color: '#FFF' },
            type: 'value',
            min: minScore, // 最小分数
            max: maxScore, // 最高分数
            axisLabel: {
              textStyle: { color: '#b6c7ec' }
            },
            axisTick: {
              show: true,
              lineStyle: { color: '#FFF' }
            },
            axisLine: { lineStyle: { color: '#fff' }},
            splitLine: { show: false }
          }
        ],
        series: serverData // 图表数据
      }
      return obj
    },
    initChart() {
      trends({
        evt: this.$route.query.hash,
        limit: 10,
        offset: 0
      })
        .then(res => {
          const rank_num_list = [
            this.$t('trend.dialog.first'),
            this.$t('trend.dialog.second'),
            this.$t('trend.dialog.third')
          ]
          this.error = true
          var objs = res.data.rows
          var legend = []
          objs.forEach((obj, i) => {
            if (i < 3) {
              legend.push(rank_num_list[i] + ' : ' + obj.obj_name)
            } else {
              legend.push(obj.obj_name)
            }
          })

          var startTime = new Date(this.match.start_time)
          var endTime = new Date(this.match.end_time)
          var minTime = startTime
          var maxTime = endTime
          var nowTime = new Date()
          if (nowTime < maxTime && nowTime > minTime) {
            maxTime = nowTime
          }
          var minScore = 0
          var maxScore = 0
          var series = []
          const name_str = ''
          objs.forEach((obj, i) => {
            var sumScore = 0
            var data = [{ value: [minTime, 0] }]
            var lastSubmitTime
            for (var a = 0; a < obj.data.length; a++) {
              var scoreObj = obj.data[a]
              sumScore = sumScore + parseFloat(scoreObj.score)
              var submitTime = new Date(scoreObj.time)
              data.push({
                value: [submitTime, sumScore]
              })
              if (a == obj.data.length - 1) {
                lastSubmitTime = submitTime
              }
            }
            if (maxTime == nowTime) {
              data.push({
                value: [maxTime, sumScore]
              })
            }
            if (
              maxTime == endTime &&
              lastSubmitTime &&
              lastSubmitTime != endTime
            ) {
              data.push({
                value: [maxTime, sumScore]
              })
            }
            if (maxScore < sumScore) {
              maxScore = sumScore
            }
            // var name = obj.obj_name.length>8 ?  obj.obj_name.substring(0,8)+'…' : obj.obj_name;
            // if (i < 3) {
            //   name = legend[i];
            // }
            var seriesData = {
              name: legend[i],
              type: 'line',
              legendHoverLink: true,
              data: data,
              symbol: 'emptyCircle',
              symbolSize: 2,
              showAllSymbol: true
            }
            series.push(seriesData)
          })

          if (series.length == 0) {
            series = [
              {
                name: '',
                type: 'line',
                legendHoverLink: true,
                symbol: 'circle',
                symbolSize: 2,
                showAllSymbol: true,
                data: [{ value: [minTime, 0] }, { value: [maxTime, 0] }]
              }
            ]
          }
          this.drawGraph({
            min_score: minScore,
            max_score: maxScore,
            min_time: minTime,
            max_time: maxTime,
            legend: legend,
            series: series
          })
        })
        .catch(err => {
          this.error = false
        })
    },
    drawGraph(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('trend_chart'))

      // var legendIndex = 0;
      // 指定图表的配置项和数据
      const option = {
        animation: false,
        color: [
          '#ff7f50',
          '#87cefa',
          '#ffd700',
          '#32cd32',
          '#6495ed',
          '#ff69b4',
          '#ba55d3',
          '#cd5c5c',
          '#ffa500',
          '#40e0d0',
          '#1e90ff',
          '#ff6347',
          '#7b68ee',
          '#00fa9a',
          '#da70d6',
          '#6b8e23',
          '#ff00ff',
          '#3cb371',
          '#b8860b',
          '#30e0e0'
        ],
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            var name = params.seriesName
            var time = new Date(params.value[0])
            var score = params.value[1].toFixed(2)

            return (
              '<div>' + name + '</div><div>' + time + ': ' + score + '</div>'
            )
          }
        },
        legend: {
          x: 'right',
          orient: 'vertical',
          data: data.legend,
          // formatter: function(name){
          //     legendIndex = legendIndex + 1;
          //     if (legendIndex == 1) {
          //         return '第一名:' + name;
          //     } else if (legendIndex == 2) {
          //         return '第二名:' + name;
          //     } else if (legendIndex == 3) {
          //         return '第三名:' + name;
          //     }
          //     return name;
          // },
          textStyle: {
            color: 'auto'
          }
        },
        grid: {
          borderWidth: 0,
          containLabel: false,
          width: '78%'
        },
        xAxis: [
          {
            name: this.$t('trend.dialog.time'),
            nameTextStyle: {
              color: '#FFF'
            },
            type: 'time',
            boundaryGap: false,
            min: data.min_time,
            max: data.max_time,
            axisTick: {
              show: true,
              lineStyle: {
                color: '#FFF'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff' // 左边线的颜色
              }
            },
            splitLine: {
              show: false
            },
            splitNumber: 12,
            axisLabel: {
              textStyle: {
                color: '#ffffff'
              }
            }
          }
        ],
        yAxis: [
          {
            name: this.$t('trend.dialog.score'),
            nameTextStyle: {
              color: '#FFF'
            },
            type: 'value',
            min: data.min_score,
            max: data.max_score + 1000,
            axisLabel: {
              textStyle: {
                color: '#b6c7ec'
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#FFF'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff' // 左边线的颜色
              }
            },
            splitLine: {
              show: false
            }
          }
        ],

        series: data.series
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contend {
  padding: 0 200px;
}
.countDown {
  float: right;
  margin-bottom: 20px;
}
#trend_chart {
  margin: 0 auto;
}

@media (max-width: 1300px) {
  #trend_chart {
    width: 1100px;
    height: 530px;
  }
}

@media (min-width: 1300px) and (max-width: 1600px) {
  #trend_chart {
    width: 1100px;
    height: 530px;
  }
}

@media (min-width: 1600px) and (max-width: 1920px) {
  #trend_chart {
    width: 1100px;
    height: 550px;
  }
}

@media (min-width: 1920px) {
  #trend_chart {
    width: 1200px;
    height: 600px;
  }
}
</style>
