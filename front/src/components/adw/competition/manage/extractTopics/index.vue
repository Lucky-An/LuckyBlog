<template>
  <div class="app-container extarct_box" id="homepage">
    <div class="ordinary select_sub">
      <el-table
              :data="topicList"
              :span-method="objectSpanMethod"
              border
              style="width: 100%; margin-top: 20px">
        <el-table-column
                prop="cn_name"
                align="center"
                :label="$t('selfHelp_competition.topic_type')"
        >
        </el-table-column>
        <el-table-column
                align="center"
                prop="difficulty"
                :label="$t('selfHelp_competition.difficulty')">
        </el-table-column>
        <el-table-column
                align="center"
                prop="allnum"
                :label="$t('selfHelp_competition.chose_num')">
        </el-table-column>
        <el-table-column
                align="center"
                prop="amount1"
                :label="$t('selfHelp_competition.topic_num')">
          <template slot-scope="scope">
            <el-input-number v-model="difficulty[scope.$index]" @change="handleChange(scope.$index)" :min="0"
                             :max="scope.row.allnum" ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="amount2"
                :label="$t('selfHelp_competition.topic_score')">
          <template slot-scope="scope">
            <el-input-number v-model="score[scope.$index]" :min="mathMode.integral_mode==2?1000:100" :step="10" :max="1000"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="common_btn_md">
      <button @click="confirm">{{$t('selfHelp_competition.confirmation')}}</button>
    </div>


    <el-dialog :title="$t('selfHelp_competition.make_sure')" :visible.sync="dialogTableVisible" custom-class="ad_public_modal title-center">
      <span class="warning">{{$t('selfHelp_competition.make_sure_tips')}}</span>
      <div class="ordinary noHover">
        <el-table :data="gridData" :span-method="alerdySelectSpan">
          <el-table-column property="type" class="sub_type" :label="$t('selfHelp_competition.topic_type')"></el-table-column>
          <el-table-column property="difficulty_str" :label="$t('selfHelp_competition.difficulty')" width="200px"></el-table-column>
          <el-table-column property="number" :label="$t('selfHelp_competition.topic_num')"></el-table-column>
          <el-table-column property="title" :label="$t('selfHelp_competition.topic_name')"></el-table-column>
          <el-table-column property="score" :label="$t('selfHelp_competition.topic_score')"></el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectAgain">{{$t('selfHelp_competition.re_choice')}}</el-button>
        <el-button type="primary" @click="confirmSelect">{{$t('selfHelp_competition.confirmation')}}</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'extractTopics',
    data () {
      return {
        mathMode:{},//计分类型
        typeList: [],
        topicList: [],
        difficulty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        score: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        gridData: [],
        dialogTableVisible: false,
        submitData: {},
        id: this.$route.query.id,

        type_arr: {},
        difficulty_arr: {},
        index_arr: [0],
        diff_index_arr: [0],
      }
    },
    created () {
      this.getSubType();
      this.getMode();
    },
    computed: {
      sum () {//计算所选的题目的和
        return this.difficulty.reduce(function (prev, cur, index, arr) {
          return prev + cur
        })
      }
    },
    methods: {
      type_list (type_arr, item) {//合并单元格的方法
        if (type_arr.hasOwnProperty(item)) {
          type_arr[item] += 1
        } else {
          type_arr[item] = 1
        }
      },
      join_list (arr, indexarr) {//合并单元格的方法
        let m = 0
        for (let attr in arr) {
          m += arr[attr]
          indexarr.push(m)
        }
      },
      alerdySelectSpan ({row, column, rowIndex, columnIndex}) {//合并单元格的方法
        let arr_type = this.merge_cell(0, this.index_arr, this.type_arr, rowIndex, columnIndex, row)
        if (arr_type !== null) {
          return arr_type
        }
        let arr_diff = this.merge_cell(1, this.diff_index_arr, this.difficulty_arr, rowIndex, columnIndex, row)
        if (arr_diff !== null) {
          return arr_diff
        }
        let arr_number = this.merge_cell(2, this.diff_index_arr, this.difficulty_arr, rowIndex, columnIndex, row)
        if (arr_number !== null) {
          return arr_number
        }
      },
      merge_cell (n, index_arr, row_arr, rowIndex, columnIndex, row) {//合并单元格的方法
        let merge_data = null
        if (columnIndex === n) {
          if (index_arr.includes(rowIndex) && rowIndex !== index_arr[index_arr.length - 1]) {
            if (columnIndex === 2) {
              row.number = row_arr[row.type + row.difficulty]
            }
            merge_data = {
              rowspan: n == 0 ? row_arr[row.type] : row_arr[row.type + row.difficulty],
              colspan: 1
            }
          } else {
            merge_data = {
              rowspan: 0,
              colspan: 0
            }
          }
        }
        return merge_data
      },
      getSubType () {
        this.$http.get('/api/sponsor/selected/event_task').then(res => {
          let {data} = res
          this.typeList = data
          data.forEach(item => {
            for (let i = 1; i < 4; i++) {
              let obj = JSON.parse(JSON.stringify(item))
              switch (i) {
                case 1:
                  obj.difficulty = this.$t('selfHelp_competition.difficulty_1')
                  obj.allnum = obj.simple_task_num
                  break
                case 2:
                  obj.difficulty = this.$t('selfHelp_competition.difficulty_2')
                  obj.allnum = obj.middle_task_num
                  break
                case 3:
                  obj.difficulty = this.$t('selfHelp_competition.difficulty_3')
                  obj.allnum = obj.difficulty_task_num
              }
              this.topicList.push(obj)
            }

          })
        })
      },
      getMode() {
        this.$http.get('/api/sponsor/event_mode/'+this.$route.query.id).then(res => {
          this.mathMode = res.data
        })
      },
      confirm () {//点击抽题
        if (this.sum > 20) {
          this.showError(this.$t('selfHelp_competition.num_21'))
          return
        }
        if (this.sum < 20) {
          this.showError(this.$t('selfHelp_competition.num_20'))
          return
        }
        this.selected()
      },
      selectAgain () {//重新选题
        this.dialogTableVisible = false
        this.gridData = []
        this.type_arr = {}
        this.difficulty_arr = {}
        this.index_arr = [0]
        this.diff_index_arr = [0]
      },
      confirmSelect () {//确认选过的题
        let data = this.submitData
        this.$http.post('/api/sponsor/confirm/event_task', data).then(res => {
          if (res.data.success) {
            this.$router.push({
              path: '/common/manage/operation',
              query: {id: this.id}
            })
          }
        })
      },
      selected () {//第一次选题
        /*
        * 传递给后台的数据格式
        *
        * {"param":[{"1":[{"1":4, "score":10}]}], "event":1}
        *
        * 将数组转为后台想要格式
        * 第一个1为类型id
        * 类型里面的数组的1/2/3代表不同等级的难度系数
        * event代表比赛id
        * */

        let data = {
          param: [],
          event: this.id
        }

        let flag = 0
        this.typeList.forEach((item, index) => {
          let obj = {}
          for (let i = 0; i < 3; i++) {
            let newObj = {}
            if (this.difficulty[flag] > 0) {
              if (!obj[item.id]) obj[item.id] = []
              newObj[i + 1] = this.difficulty[flag]
              newObj.score = this.score[flag]
              obj[item.id].push(newObj)
            }
            flag++
          }
          if (Object.keys(obj).length > 0) data.param.push(obj)
        })

        //将处理后的数据再存储，用于第二次确认抽题。
        this.submitData = data

        this.$http.post('/api/sponsor/selected/event_task', data).then(res => {
          let {data} = res

          //将或许到的后台的数据处理成可以展示多级表格的状态。
          data.forEach(item => {
            for (let i = 1; i < 4; i++) {
              switch (i) {
                case 1:
                  if (item[i]) {
                    item[i].forEach(sub => {
                      let obj = {}
                      obj.type = item.cn_name
                      obj.difficulty_str = this.$t('selfHelp_competition.difficulty_1')
                      obj.difficulty = 1
                      obj.number = item[i].length
                      obj.title = sub.title
                      obj.score = sub.score
                      this.gridData.push(obj)
                    })
                  }
                  break
                case 2:
                  if (item[i]) {
                    item[i].forEach(sub => {
                      let obj = {}
                      obj.type = item.cn_name
                      obj.difficulty_str = this.$t('selfHelp_competition.difficulty_2')
                      obj.difficulty = 2
                      obj.number = item[i].length
                      obj.title = sub.title
                      obj.score = sub.score
                      this.gridData.push(obj)
                    })
                  }
                  break
                case 3:
                  if (item[i]) {
                    item[i].forEach(sub => {
                      let obj = {}
                      obj.type = item.cn_name
                      obj.difficulty_str = this.$t('selfHelp_competition.difficulty_3')
                      obj.difficulty = 3
                      obj.number = item[i].length
                      obj.title = sub.title
                      obj.score = sub.score
                      this.gridData.push(obj)
                    })
                  }
              }
            }
          })

          this.gridData.forEach((item, index) => {
            this.type_list(this.type_arr, item.type)
            this.type_list(this.difficulty_arr, item.type + item.difficulty)
          })
          this.join_list(this.type_arr, this.index_arr)
          this.join_list(this.difficulty_arr, this.diff_index_arr)
          this.dialogTableVisible = true
        })
      },
      handleChange (ind) {
        if (this.sum > 20) {
          this.showError(this.$t('selfHelp_competition.num_21'), true)
        }

      },
      showError (info, ble) {
        this.$confirm(info, this.$t('dialog_list.tips'), {
          customClass: 'public_confirm public_confirm_sm text-center',
          confirmButtonText: this.$t('modal.confirm'),
          cancelButtonText: this.$t('modal.cancel'),
        }).then(() => {
          if (!ble && this.sum <= 20) this.selected()
        }).catch(() => {

        })
      },
      objectSpanMethod ({row, column, rowIndex, columnIndex}) {//合并题目单元格
        if (columnIndex === 0) {
          if (rowIndex % 3 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #homepage .select_sub .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #0d233d;
  }

  #homepage .select_sub .el-table--enable-row-hover .el-table__body tr:nth-child(3n+4):hover > td:nth-child(1) {
    background: none;
  }

  #homepage .select_sub .el-table--enable-row-hover .el-table__body tr:nth-child(1):hover > td:nth-child(1) {
    background: none;
  }

  #homepage .select_sub .el-table--enable-row-hover .el-table__body tr:hover {
    background: none;
  }

  .extarct_box {
    .common_btn_md {
      margin-top: 20px
    }

    .warning {
      display inline-block;
      margin-bottom: 20px
    }
  }

</style>
