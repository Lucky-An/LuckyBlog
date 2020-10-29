/* File Info
 * Author:
 * CreateTime:  2020/8/13 上午10:30:43
 * LastEditor:
 * ModifyTime:  2020/9/29 上午10:29:08
 * Description: 题库管理/运维赛题目
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select v-model="listQuery.challenge_type" class="filter-item" size="mini" placeholder="题目类型">-->
      <!--<el-option label="全部题目类型" value=""/>-->
      <!--<el-option v-for="(item,ind) in subType" :key="ind" :label="item.cn_name" :value="item.id"/>-->
      <!--</el-select>-->

      <el-select
        v-model="listQuery.label"
        class="filter-item"
        size="mini"
        placeholder="请选择题目标签"
        clearable
      >
        <el-option
          v-for="(item, ind) in tagAry"
          :key="ind"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>

      <el-input
        v-model.trim="listQuery.title"
        placeholder="请输入题目名称"
        style="width: 150px"
        size="mini"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList(1)"
      >搜索
      </el-button>

      <div style="float: right">
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(1)"
        >题目类型管理</el-button>
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(2)"
        >题目标签管理</el-button>
      </div>
    </div>

    <div class="filter-container">
      <el-button
        type="success"
        size="mini"
        @click="addTopic"
      > 新增</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="removeSub"
      > 删除</el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        @selection-change="checkTable"
      >
        <el-table-column
          align="center"
          type="selection"
        />
        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column
          align="center"
          prop="title"
          label="题目名称"
        />
        <el-table-column
          align="center"
          prop="challenge_type_name"
          label="题目类型"
        />

        <el-table-column
          align="center"
          prop="label_name"
          label="题目标签"
        />

        <el-table-column
          align="center"
          prop="image_type"
          label="镜像类型"
        />

        <el-table-column
          align="center"
          prop="image_name"
          label="镜像名称"
        />

        <el-table-column
          align="center"
          label="附件"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.file"
              :href="scope.row.file"
              download
            >
              <el-button
                size="mini"
                type="warning"
              >下载 </el-button>
            </a>
            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="WriteUp"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.wp_official"
              :href="scope.row.file"
              download
            >
              <el-button
                size="mini"
                type="warning"
              >下载 </el-button>
            </a>
            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="150px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.test_status!=1"
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑
            </el-button>
            <el-button
              v-else
              size="mini"
              type="success"
              @click="NotEdit"
            >编辑
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="150px"
          label="测试"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.test_status"
              :active-value="1"
              :disabled="scope.row.flag_type == '随机'"
              :inactive-value="0"
              size="mini"
              @change="handleTestChange($event, scope.row.id)"
            />
            <el-button
              v-waves
              :disabled="!scope.row.test_status"
              size="mini"
              type="primary"
              @click="handleSearch(scope.row.id, scope.row.title)"
            >查看
            </el-button>
            <!-- vscene_id -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="digTitle"
      :visible.sync="tagDlg"
      width="780px"
      @close="closetagDlg"
    >
      <!-- form 上的   类型不让添加    v-if="tagtype===2"-->
      <el-form
        ref="form"
        label-width="0px"
      >
        <el-form-item label="">
          <el-col :span="12">
            <el-input
              v-model.trim="tagQuery.cn_name"
              clearable
              placeholder="请输入名称"
            />
          </el-col>
          <el-col
            :span="4"
            style="margin-left: 30px"
          >
            <el-button
              type="success"
              @click="addTagType"
            >新增 </el-button>
          </el-col>
        </el-form-item>
      </el-form>

      <div style="border: 1px solid rgb(240, 249, 235)">
        <el-tag
          v-for="tag in tagDlgAry"
          :key="tag.id"
          class="mytag"
          closable
          style="
            margin: 8px 20px;
            background: #fff;
            border-color: rgb(220, 220, 220);
            border-radius: 43px;
          "
          size="mini"
          @close="removeTagType(tag.id)"
        >
          <el-tooltip
            :content="tag.cn_name"
            class="item"
            effect="dark"
            placement="top-start"
          >
            <div
              style="
                display: inline-block;
                width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
              ">
              {{ tag.cn_name }}
            </div>
          </el-tooltip>
        </el-tag>
      </div>
    </el-dialog>

    <!-- 题目测试信息 -->
    <el-dialog
      :visible.sync="diaLogbool"
      title="题目测试信息"
      width="600px"
    >
      <div style="font-size: 16px; margin-left: 50px">
        <div>题目名称：{{ diaLogTitle }}</div>
        <div style="margin-top: 30px">
          地址：
          <a
            :href="diaLogUrl"
            target="view_window"
          >
            <el-button
              size="mini"
              type="primary"
            >登录控制台</el-button>
          </a>
        </div>
      </div>
    </el-dialog>
    <!-- 题目测试信息结束 -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import {
  fetchDefenseList,
  DefenseRemoveTopic,
  openTest,
  closeTest,
  getTest
} from '@/api/itemBank/DevOps'
import {
  fetchTags,
  fetchType,
  AddLabel,
  DeleteType,
  DeleteLabel,
  AddType
} from '@/api/itemBank/common'

export default {
  name: 'TopicManagement',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      diaLogbool: false, // 题目测试信息
      diaLogUrl: '', // 题目测试信息
      diaLogTitle: '', // 题目测试信息

      tagDlg: false, // 标签或类型弹窗

      tagDlgAry: [], // 标签或类型数据
      tagtype: 1, // 打开的弹窗是什么 1类型 2标签

      digTitle: '', // 标签或类型管理标题
      subType: [], // 题目类型
      tagAry: [], // 题目标签
      matchList: [],
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        order: 'asc',
        title: '', // 关键字
        label: '', // 0隐藏1公开
        challenge_type: '' // 难度
      },
      tagQuery: {
        cn_name: '',
        content: ''
      }
    }
  },
  created() {
    this.getType()
    this.getTag()
    this.getList()
  },
  methods: {
    NotEdit() {
      this.$message.error('题目环境运行中，无法编辑')
    },
    handleTestChange(val, id) {
      if (val === 0) {
        closeTest(id).then(res => {
          // this.$message.success("操作成功");
          this.getList()
        })
      } else {
        openTest(id).then(res => {
          this.$message.success('操作成功')
          this.matchList.forEach(element => {
            if (element.id == id) {
              element.vscene_id = res.data.data
            }
          })
          this.getList()
        })
      }
    },
    handleSearch(id, title) {
      getTest(id).then(res => {
        if (res.data.success) {
          this.diaLogUrl = res.data.data.url
          this.diaLogTitle = title
          this.diaLogbool = true
        }
      })
    },
    removeTagType(id) {
      // 删除标签
      const params = {
        ids: [id],
        type: 3
      }

      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.tagtype == 1) {
            DeleteType(params).then(res => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getType()
              }
            })
          }
          if (this.tagtype == 2) {
            DeleteLabel(params).then(res => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getTag()
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closetagDlg() {
      this.tagQuery = {
        cn_name: '',
        content: ''
      }
    },
    showTagDlg(num) {
      // 展示弹窗
      this.tagtype = num

      if (num == 1) {
        this.digTitle = '题目类型管理'
        this.tagDlgAry = this.subType
        this.getType()
      } else {
        this.digTitle = '题目标签管理'
        this.tagDlgAry = this.tagAry
        this.getTag()
      }

      this.tagDlg = true
    },
    addTagType() {
      // 新增标签
      if (this.tagQuery.cn_name.length > 30) {
        this.$message.error('名称长度应限制在30字以内')
        return
      }
      // 增加标签
      if (this.tagQuery.cn_name === '') {
        this.$message.error('请输入名称')
        return
      }
      this.tagQuery.type = 3
      if (this.tagtype == 1) {
        AddType(this.tagQuery).then(res => {
          if (res.data.success) {
            this.tagQuery = {
              cn_name: '',
              content: ''
            }
            this.$message.success('新增成功')
            this.getType()
          }
        })
      }
      if (this.tagtype == 2) {
        AddLabel(this.tagQuery).then(res => {
          if (res.data.success) {
            this.tagQuery = {
              cn_name: '',
              content: ''
            }
            this.$message.success('新增成功')
            this.getTag()
          }
        })
      }
    },
    getType() {
      // 获取题目类型
      fetchType({ type: 3 }).then(res => {
        this.subType = res.data
        this.tagDlgAry = res.data
      })
    },
    getTag() {
      // 获取题目标签
      fetchTags({ type: 3 }).then(res => {
        this.tagAry = res.data
        this.tagDlgAry = res.data
      })
    },
    removeSub() {
      // 删除题目
      const params = {}
      params.ids = this.ids
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DefenseRemoveTopic(params).then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addTopic() {
      // 新增赛题
      this.$router.push({
        path: '/itemBank/DevOps/addDevOps'
      })
    },
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/itemBank/DevOps/editDevOps',
        query: {
          task_id: id
        }
      })
    },
    getList(page) {
      if (page === 1) this.listQuery.offset = 1
      fetchDefenseList(this.listQuery).then(res => {
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    }
  }
}
</script>

<style scoped>
.addsub .pagination-container {
  padding: 0;
}

.dict-secong-trans {
  text-decoration: underline;
  color: #4395ff;
}

.bm {
  padding-bottom: 20px;
  border-bottom: 1px solid #bbb;
}

.fcenter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
