<template>
  <div class="app-container important_box">
    <div
      ref="choose_box"
      class="choose_box"
    >
      <div class="filter-container explain">
        操作说明：随机选题的参数为 0 时，表示系统会选中您的筛选条件结果下的所有数据。
      </div>
      <div class="filter-container">
        <el-select
          v-model="listQuery.type_id"
          size="mini"
          clearable
          style="width: 20%;"
          class="filter-item"
          placeholder="请选择题目类型"
          @change="getList(1)"
        >
          <!-- <el-option label="全部题目类型" value=""/> -->
          <el-option
            label="单选"
            value="1"
          />
          <el-option
            label="多选"
            value="2"
          />
          <el-option
            label="判断"
            value="3"
          />
        </el-select>

        <el-select
          v-model="listQuery.tag_id"
          size="mini"
          clearable
          class="filter-item"
          style="width: 20%;"
          placeholder="请选择题目标签"
          @change="getList(1)"
        >
          <el-option
            v-for="(item,ind) in tag"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>

        <el-select
          v-model="listQuery.category_id"
          size="mini"
          clearable
          style="width: 20%;"
          class="filter-item"
          placeholder="请选择题目方向"
          @change="getList(1)"
        >
          <el-option
            v-for="(item,ind) in category"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>

        <el-input
          v-model.trim="listQuery.search"
          size="mini"
          style="width: 20%;"
          placeholder="请输入题目名称"
          class="filter-item"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="getList(1)"
        >筛选
        </el-button>
      </div>
      <div class="filter-container">
        <span class="extract">
          随机选择
          <el-input-number
            v-model="reviewQuery.random_num"
            :min="0"
            :max="150"
            size="mini"
            label="描述文字"
          /> 道题目
        </span>

        <span class="extract">
          每题
          <el-input-number
            v-model="reviewQuery.score"
            :min="1"
            :max="100"
            :precision="1"
            size="mini"
            label="描述文字"
          /> 分数
        </span>

        <el-button
          v-waves
          style="margin-right: 10px;"
          class="filter-item"
          type="primary"
          size="mini"
          @click="sureTipicNum"
        >
          题目添加
        </el-button>

        <span class="explain allTopic">当前已筛选出 <b style="color: #000;">{{ listTotal }}</b> 道题目</span>
      </div>

      <div class="filter-container">
        <!--表格 begin-->
        <el-table
          v-loading="listLoading"
          ref="multipleTable"
          :key="tableKey"
          :data="matchList"
          header-cell-class-name="no_checked"
          border
          fit
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%"
          @select-all="checkAll"
          @select="checkTable"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            align="center"
            prop="title"
            min-width="180"
            label="题目名称"
          >
            <template slot-scope="scope">
              <span style="text-align: left">{{ scope.row.title.length>10?scope.row.title.substr(0,10)+'...':scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="type_name"
            label="题目类型"
          />
          <el-table-column
            align="center"
            prop="category_name"
            label="题目方向"
          />
          <el-table-column
            align="center"
            prop="tag_name"
            label="题目标签"
          />
        </el-table>
      </div>

      <pagination
        v-show="listTotal>0"
        :total="listTotal"
        :page.sync="listPage"
        :limit.sync="listQuery.limit"
        :layout=" ' sizes, prev, pager, next'"
        @pagination="getList"
      />

    </div>
    <div style="width: 49%;">
      <div class="goBack">
        <router-link :to="{path:'/competition/theory/editMatch/editMatch',query:{step:1,hash:hash}}">
          <el-button
            v-waves
            class="filter-item"
            type="warning"
          >
            返回
          </el-button>
        </router-link>
      </div>

      <div
        :style="'height:'+paperHeight+'px;'"
        class="paper_box"
      >

        <paper
          :judge-list.sync="judgeList"
          :check-box-list.sync="checkBoxList"
          :radio-list.sync="radioList"
          :judge-score="judgeScore"
          :radio-score="radioScore"
          :check-box-score="checkBoxScore"
          :edit="true"
          :hash="hash"
          @submitPaper="submitPaper"
          @getSore="getSore"
          @deleteTopic="deleteTopic"
        />

      </div>

    </div>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import paper from '@/views/competition/theory/common/paper'
import {
  fetchImportList,
  fetchPreviewList,
  submitPaper,
  fetchImported
} from '@/api/match/theory'
import { getTags, getCategorys } from '@/api/itemBank/theory'

export default {
  name: 'TopicManagement',
  directives: { waves },
  components: {
    Pagination,
    paper
  },
  data() {
    return {
      paperHeight: 0, // 试卷高度
      tag: [], // 题目标签
      category: [], // 题目方向
      matchList: [], // 所有题目列表
      importList: [], // 所有导入题目列表
      tableKey: 0,
      listTotal: 0, // 题目列表总条数
      listLoading: false,
      listPage: 1, // 题目列表页码
      hash: this.$route.query.hash,
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        tag_id: '',
        category_id: '',
        type_id: '',
        search: ''
      },
      ids: [], // 选择的所有表格的项
      reviewQuery: {
        // 确认导入题目传递的参数
        random_num: 0,
        score: 0
      },
      num: 0,
      judgeList: [], // 判断题列表
      radioList: [], // 单选题列表
      checkBoxList: [], // 多选题列表
      judgeScore: 0, // 多选题列表
      radioScore: 0, // 多选题列表
      checkBoxScore: 0 // 多选题列表
    }
  },
  created() {
    this.getList()
    this.getImported()
    this.getType()
  },
  methods: {
    deleteTopic(row) {
      // 删除试卷中的题目
      // 删除已选择的全部题目中对应的那条数据
      this.importList = this.importList.filter(item => {
        return item.id != row.id
      })

      // 取消勾选
      this.matchList.some(match => {
        if (row.id === match.id) {
          this.$refs.multipleTable.toggleRowSelection(match, false)
          return
        }
      })

      if (row.type_id === 3) {
        // 删除判断题
        this.judgeList = this.judgeList.filter(item => {
          return item.id != row.id
        })
        this.getSore(this.judgeList, 'judgeScore')
      }
      if (row.type_id === 2) {
        // 删除多选题
        this.checkBoxList = this.checkBoxList.filter(item => {
          return item.id != row.id
        })
        this.getSore(this.checkBoxList, 'checkBoxScore')
      }
      if (row.type_id === 1) {
        // 删除单选题
        this.radioList = this.radioList.filter(item => {
          return item.id != row.id
        })
        this.getSore(this.radioList, 'radioScore')
      }
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    getType() {
      // 获取题目标签和方向
      getTags().then(res => {
        this.tag = res.data
      })
      getCategorys().then(res => {
        this.category = res.data
      })
    },
    getList(init) {
      // 获取题目列表
      // 在点击筛选或者切换下拉框时，页码重置
      if (init === 1) this.listPage = 1

      this.listQuery.offset = this.listPage
      fetchImportList(this.hash, this.listQuery).then(res => {
        setTimeout(() => {
          this.paperHeight = this.$refs.choose_box.offsetHeight - 126
        }, 0)

        // 竞赛列表
        this.matchList = res.data.rows
        // 题目总条数
        this.listTotal = res.data.total
        // 调用自动勾选的方法
        this.autoCheck()
      })
    },
    sureTipicNum() {
      // 抽取题目前确认题目数量
      // 导入全部题目时的提示。
      if (
        this.reviewQuery.random_num === 0 &&
        this.listTotal > 150 - this.importList.length
      ) {
        this.$confirm(
          `最大可以导入150道题目，当前已选择${
            this.importList.length
          }道题目，本次将随机导入${150 - this.importList.length}道题目。`
        )
          .then(_ => {
            this.fetchPreviewList()
          })
          .catch(_ => {})
      } else if (this.reviewQuery.random_num > 150 - this.importList.length) {
        this.$confirm(
          `最大可以导入150道题目，当前已选择${
            this.importList.length
          }道题目，本次将随机导入${150 - this.importList.length}道题目。`
        )
          .then(_ => {
            this.reviewQuery.random_num = 150 - this.importList.length
            this.fetchPreviewList()
          })
          .catch(_ => {})
        //   //随机导入题目和已导入题目总数量大于150时所作的提示
        //   this.$message.error(`题目总数量大于150，还可以导入${150 - this.importList.length}道题目，请修改导入题目数量。`)
      } else {
        this.fetchPreviewList()
      }
    },
    autoCheck() {
      // 循环当前列表数据，判断是否在所有题目中，如果是，则全部勾选。
      this.$refs.multipleTable.clearSelection()
      this.matchList.forEach(match => {
        if (this.importList.some(im => match.id === im.id)) {
          setTimeout(() => {
            this.$refs.multipleTable.toggleRowSelection(match, true)
          }, 0)
        }
      })
    },
    getImported() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      fetchImported(this.hash)
        .then(res => {
          loading.close()
          // 将导入到所有题目全部保存到一个数组中
          this.importList = this.importList.concat([
            ...res.data[3],
            ...res.data[2],
            ...res.data[1]
          ])
          // 调用自动勾选方法
          this.autoCheck()

          // 合并数组并去重
          this.judgeList = this.uniqueArr(this.judgeList, res.data[3])
          this.radioList = this.uniqueArr(this.radioList, res.data[1])
          this.checkBoxList = this.uniqueArr(this.checkBoxList, res.data[2])

          // 获取总分
          this.getSore(this.judgeList, 'judgeScore')
          this.getSore(this.radioList, 'radioScore')
          this.getSore(this.checkBoxList, 'checkBoxScore')
        })
        .catch(err => {
          loading.close()
        })
    },
    fetchPreviewList() {
      // 抽取题目
      // 定义抽取题目传递的参数
      const params = JSON.parse(JSON.stringify(this.reviewQuery))
      params.tag_id = this.listQuery.tag_id
      params.category_id = this.listQuery.category_id
      params.type_id = this.listQuery.type_id
      params.search = this.listQuery.search
      // 将已选择的题的id传给后端，让后端在随机抽题的时候不会重复抽题。
      const ids = this.importList.map(item => item.id)

      fetchPreviewList(this.hash, params, { ids }).then(res => {
        if (res.data.success) {
          // 将导入到所有题目全部保存到一个数组中
          this.importList = this.importList.concat([
            ...res.data.data[3],
            ...res.data.data[2],
            ...res.data.data[1]
          ])
          // 调用自动勾选方法
          this.autoCheck()

          // 合并数组并去重
          this.judgeList = JSON.parse(
            JSON.stringify(this.uniqueArr(this.judgeList, res.data.data[3]))
          )
          this.radioList = this.uniqueArr(this.radioList, res.data.data[1])
          this.checkBoxList = this.uniqueArr(
            this.checkBoxList,
            res.data.data[2]
          )

          // 获取总分
          this.getSore(this.judgeList, 'judgeScore')
          this.getSore(this.radioList, 'radioScore')
          this.getSore(this.checkBoxList, 'checkBoxScore')
        }
      })
    },
    uniqueArr(arr1, arr2) {
      // 合并数组并且去重
      // 合并两个数组
      arr1.unshift(...arr2) // 或者arr1 = [...arr1,...arr2]
      // 去重
      const res = new Map()
      return arr1.filter(a => !res.has(a.id) && res.set(a.id, 1))
    },
    getSore(arr3, type) {
      // 获取分数总和
      this[type] = arr3.reduce((acc, cur) => {
        return acc + cur.point
      }, 0)
    },
    checkAll(rows) {
      if (rows.length === 0) {
        this.matchList.forEach(row => {
          row.point = 1
          // 删除已选择的全部题目中对应的那条数据
          this.importList = this.importList.filter(item => {
            return item.id != row.id
          })

          if (row.type_id === 3) {
            this.judgeList = this.judgeList.filter(item => {
              return item.id != row.id
            })
            this.getSore(this.judgeList, 'judgeScore')
          }
          if (row.type_id === 2) {
            this.checkBoxList = this.checkBoxList.filter(item => {
              return item.id != row.id
            })
            this.getSore(this.checkBoxList, 'checkBoxScore')
          }
          if (row.type_id === 1) {
            this.radioList = this.radioList.filter(item => {
              return item.id != row.id
            })
            this.getSore(this.radioList, 'radioScore')
          }
        })
      } else {
        rows.forEach(item => {
          this.importList.unshift(item)

          item.point = 1
          if (item.type_id === 3 && !this.iSnclude(this.judgeList, item)) {
            this.judgeList.unshift(item)
            this.getSore(this.judgeList, 'judgeScore')
          }
          if (item.type_id === 2 && !this.iSnclude(this.checkBoxList, item)) {
            this.checkBoxList.unshift(item)
            this.getSore(this.checkBoxList, 'checkBoxScore')
          }
          if (item.type_id === 1 && !this.iSnclude(this.radioList, item)) {
            this.radioList.unshift(item)
            this.getSore(this.radioList, 'radioScore')
          }
        })
      }
    },
    checkTable(val, row) {
      // 选择表格
      // 初始化分数
      row.point = 1

      this.importList.unshift(row)
      // 如果是true是选中，false是取消选中。
      if (this.iSnclude(val, row)) {
        if (row.type_id === 3 && !this.iSnclude(this.judgeList, row)) {
          this.judgeList.unshift(row)
          this.getSore(this.judgeList, 'judgeScore')
        }
        if (row.type_id === 2 && !this.iSnclude(this.checkBoxList, row)) {
          this.checkBoxList.unshift(row)
          this.getSore(this.checkBoxList, 'checkBoxScore')
        }
        if (row.type_id === 1 && !this.iSnclude(this.radioList, row)) {
          this.radioList.unshift(row)
          this.getSore(this.radioList, 'radioScore')
        }
      } else {
        // 删除已选择的全部题目中对应的那条数据
        this.importList = this.importList.filter(item => {
          return item.id != row.id
        })

        if (row.type_id === 3) {
          this.judgeList = this.judgeList.filter(item => {
            return item.id != row.id
          })
          this.getSore(this.judgeList, 'judgeScore')
        }
        if (row.type_id === 2) {
          this.checkBoxList = this.checkBoxList.filter(item => {
            return item.id != row.id
          })
          this.getSore(this.checkBoxList, 'checkBoxScore')
        }
        if (row.type_id === 1) {
          this.radioList = this.radioList.filter(item => {
            return item.id != row.id
          })
          this.getSore(this.radioList, 'radioScore')
        }
      }
    },
    iSnclude(arr, row) {
      // 试卷中是否包含这个题目 arr试卷数组 row要增加的项
      return arr.some(item => {
        if (item.id == row.id) {
          return true
        }
      })
    },
    submitPaper() {
      // 保存试卷
      if (this.importList.length > 150) {
        this.$message.error('导入题目数量最大为150,请删减题目')
        return
      }
      // 将数据更改为后台想要的数据格式 {id：point}
      const data = { tasks: {}}
      this.judgeList.forEach(item => {
        data.tasks[item.id] = item.point
      })
      this.radioList.forEach(item => {
        data.tasks[item.id] = item.point
      })
      this.checkBoxList.forEach(item => {
        data.tasks[item.id] = item.point
      })

      submitPaper(this.hash, data).then(res => {
        if (res.data.success) {
          this.$message.success('保存成功')
          this.$router.push({
            path: '/competition/theory/editMatch/editMatch',
            query: { hash: this.hash, step: 1 }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.important_box {
  display: flex;
  justify-content: space-between;
}

.important_box .explain {
  font-size: 13px;
  color: #757575;
}

.important_box .extract {
  vertical-align: top;
  display: inline-block;
  font-size: 13px;
  color: #757575;
  margin-right: 20px;
}

.important_box .allTopic {
  display: inline-block;
  width: 165px;
}

.important_box .choose_box {
  width: 49%;
}

.goBack {
  display: flex;
  flex-direction: row-reverse;
  padding-bottom: 20px;
}

.paper_box {
  height: 100%;
  border: 1px solid #a0a0a0;
  min-height: calc(100vh - 170px);
  overflow: auto;
}
</style>

