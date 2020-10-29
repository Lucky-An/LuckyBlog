<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listSelect.challenge_type"
        class="filter-item"
        size="mini"
        placeholder="请选择题目类型"
        clearable
      >
        <el-option
          v-for="item in topicType"
          :key="item.id"
          :label="item.content"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listSelect.label"
        class="filter-item"
        size="mini"
        placeholder="请选择题目标签"
        clearable
      >
        <el-option
          v-for="item in topicLabel"
          :key="item.id"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listSelect.level"
        class="filter-item"
        size="mini"
        placeholder="请选择题目难度"
        clearable
      >
        <el-option
          v-for="item in topicLevel"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listSelect.server_type"
        class="filter-item"
        size="mini"
        placeholder="请选择题目属性"
        clearable
      >
        <el-option
          v-for="item in topicServerType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model.trim="listSelect.title"
        class="filter-item"
        style="width: 200px"
        size="mini"
        placeholder="请输入题目名称"
        clearable
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList(1)"
      >搜索
      </el-button>
      <div style="float: right">
        <!--<el-button-->
        <!--v-waves-->
        <!--class="filter-item"-->
        <!--type="primary"-->
        <!--size="mini"-->
        <!--@click="showTagDlg(1)"-->
        <!--&gt;题目类型管理</el-button>-->
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(2)"
        >题目标签管理</el-button
        >
      </div>
    </div>

    <div class="filter-container">
      <el-button type="success" size="mini" @click="addTopic"> 新增</el-button>
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="tableList" border @selection-change="checkTable">
        <el-table-column align="center" type="selection" />
        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column align="center" prop="title" label="题目名称" />

        <el-table-column
          align="center"
          prop="challenge_type_name"
          label="题目类型"
        />
        <el-table-column align="center" prop="level_name" label="题目难度" />
        <el-table-column align="center" prop="label_name" label="题目标签" />
        <el-table-column align="center" label="题目属性">
          <template slot-scope="scope">
            <span v-if="scope.row.server_type == 0">非跳板机</span>
            <span v-else-if="scope.row.server_type == 1">跳板机</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="附件">
          <template slot-scope="scope">
            <a
              v-if="scope.row.attachment"
              :href="scope.row.attachment"
              download
            >
              <el-button v-waves size="mini" type="warning">下载 </el-button>
            </a>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="image_name" label="镜像名称" />

        <el-table-column align="center" prop="flag_numbers" label="flag数量" />

        <el-table-column align="center" label="查看flag">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.flag_numbers"
              size="mini"
              type="primary"
              @click="showflag(scope.row)"
            >查看
            </el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="WriteUp">
          <template slot-scope="scope">
            <a
              v-if="scope.row.wp_official"
              :href="scope.row.wp_official"
              download
            >
              <el-button v-waves size="mini" type="warning">下载 </el-button>
            </a>
            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="success"
              @click="updateTopic(scope.row.id)"
            >编辑
            </el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="测试">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.test_status"
              :active-value="1"
              :inactive-value="0"
              size="mini"
              @change="handleTestChange($event, scope.row.id)"
            />
            <el-button
              v-waves
              :disabled="!scope.row.test_status"
              size="mini"
              type="primary"
              style="margin-left: 10px"
              @click="handleCheckTest(scope.row)"
            >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listSelect.offset"
      :limit.sync="listSelect.limit"
      @pagination="getList"
    />
    <!-- 查看flag弹框 -->
    <el-dialog
      :visible.sync="viewFlag"
      :before-close="handleClose"
      title="查看题目Flag"
    >
      <div style="margin:0  0 20px 30px">题目名称:{{ viewFlagData.title }}</div>
      <div
        v-for="(item, index) in viewFlagData.static"
        :key="index"
        style="margin-left: 30px"
      >
        <span>静态flag{{ index + 1 }}:</span
        ><span style="margin-left: 50px">{{ item }}</span>
      </div>
      <br >
      <div
        v-for="(item, index) in viewFlagData.dynamic"
        :key="index"
        style="margin-left: 30px"
      >
        <span>动态flag{{ index + 1 }}:</span
        ><span style="margin-left: 50px">{{ item }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="handleClose">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 查看弹窗结束 -->
    <!-- 标签管理 -->
    <el-dialog
      :title="digTitle"
      :visible.sync="tagDlg"
      width="780px"
      @close="closetagDlg"
    >
      <el-form ref="form" label-width="0px">
        <el-form-item label="">
          <el-col :span="12">
            <el-input
              v-model.trim="tagQuery.cn_name"
              clearable
              placeholder="请输入名称"
            />
          </el-col>
          <el-col :span="4" style="margin-left: 30px">
            <el-button type="success" @click="addTagType">新增</el-button>
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
              "
            >
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
      @close="diaLogClose"
    >
      <div style="font-size: 16px; margin-left: 50px">
        <div>题目名称：{{ diaLogTitle }}</div>
        <div style="margin-top: 30px">
          地址：
          <a :href="diaLogUrl" target="view_window">
            <el-button
              style="margin-left: 30px"
              size="mini"
              type="primary"
            >登录控制台
            </el-button>
          </a>
        </div>
      </div>
    </el-dialog>
    <!-- 题目测试信息结束 -->
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  fetchTags,
  fetchType,
  AddLabel,
  DeleteType,
  DeleteLabel,
  AddType
} from '@/api/itemBank/common'
import waves from '@/directive/waves'
import {
  httpChallengeStoreList,
  httpChallengeTags,
  httpChallengeStoreFlag,
  httpDeleteChallengeStore,
  httpGetSettingCategorys,
  enableTest,
  disableTest,
  checkTest
} from '@/api/itemBank/penetration'

export default {
  name: 'TopicManagement',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      diaLogbool: false,
      diaLogUrl: '',
      diaLogTitle: '',
      listSelect: {
        challenge_type: '', // 题目类型数据存放
        label: '', // 题目标签数据存放
        level: '', // 难度
        server_type: '', // 属性
        title: '', // 关键字
        limit: 10, // 每页显示数量
        offset: 1 // 页码
      },
      checkedlist: [], // 选中列表
      viewFlag: false, // 查看弹出窗
      viewFlagData: {},
      topicType: [], // 全部题目类型options
      topicLabel: [], // 全部题目标签options
      topicLevel: [
        {
          label: '初级',
          value: 0
        },
        {
          label: '中级',
          value: 1
        },
        {
          label: '高级',
          value: 2
        }
      ], // 全部题目难度options
      topicServerType: [
        {
          label: '非跳板机',
          value: 0
        },
        {
          label: '跳板机',
          value: 1
        }
      ], // 全部题目属性options
      tableList: [], // 列表数据
      total: 0, // 总数据条数
      tagDlg: false,
      tagtype: 0,
      digTitle: '',
      tagDlgAry: [],
      tagQuery: {
        cn_name: '',
        content: ''
      }
    }
  },
  created() {
    this.getList(this.listSelect)
    this.getTagsOptions()
    this.getType()
  },
  methods: {
    getType() {
      httpGetSettingCategorys().then((res) => {
        this.topicType = res.data
      })
    },
    checkTag(val) {
      // 选择标签表格
      this.tagIds = val.map((item) => {
        return item.id
      })
    },
    removeTagType(id) {
      // 删除标签
      const params = { ids: [] }
      // params.ids = this.tagIds;
      params.ids.push(id)
      if (params.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.tagtype == 1) {
            DeleteType(params).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getType()
              }
            })
          }
          if (this.tagtype == 2) {
            DeleteLabel(params).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getTagsOptions() // 123
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
    addTagType() {
      // 增加标签
      if (this.tagQuery.cn_name.length > 30) {
        this.$message.error('名称长度应限制在30字以内')
        return
      }
      // 增加标签
      if (this.tagQuery.cn_name === '') {
        this.$message.error('请输入名称')
        return
      }
      if (this.tagtype == 1) {
        AddType(this.tagQuery).then((res) => {
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
        this.tagQuery.type = 4
        AddLabel(this.tagQuery).then((res) => {
          if (res.data.success) {
            this.tagQuery = {
              cn_name: '',
              content: ''
            }
            this.$message.success('新增成功')
            this.getTagsOptions() // 123
          }
        })
      }
    },
    closetagDlg() {
      this.tagQuery = {
        cn_name: '',
        content: ''
      }
    },
    //! 获取table中的数据
    getList(page) {
      if (page === 1) this.listSelect.offset = page

      httpChallengeStoreList(this.listSelect).then((res) => {
        this.total = res.data.total
        this.tableList = res.data.rows
      })
    },
    // ! 查看题目flag请求
    getChallengeStoreFlag(params, title) {
      httpChallengeStoreFlag(params).then((res) => {
        this.viewFlagData.static = res.data.static
        this.viewFlagData.dynamic = res.data.dynamic
        this.viewFlagData.title = title
        this.viewFlag = true
      })
    },
    // ! 获取标签下拉框中的内容
    getTagsOptions() {
      fetchTags({ type: 4 }).then((res) => {
        this.topicLabel = res.data
        this.tagDlgAry = this.topicLabel
      })
    },
    // ! 点击查看flag
    showflag(params) {
      this.getChallengeStoreFlag({ challenge_id: params.id }, params.title)
    },
    //! 关闭查看flag
    handleClose() {
      this.viewFlag = false
      this.viewFlagData = {}
    },
    // ! 题目类型管理 params=1  和  题目标签管理按钮 params=2
    showTagDlg(num) {
      // 展示弹窗
      this.tagtype = num
      if (num == 1) {
        this.digTitle = '题目类型管理'
        this.tagDlgAry = this.topicType
        this.getType()
      } else {
        this.digTitle = '题目标签管理'

        this.getTagsOptions() // 123
      }

      this.tagDlg = true
    },
    // ! 切换表格选中状态
    checkTable(val) {
      const list = []
      val.forEach((element) => {
        list.push(element.id)
      })
      this.checkedlist = list
    },
    // ! 删除按钮
    removeSub() {
      if (this.checkedlist.length === 0) {
        return
      }
      this.$confirm('确认删除题目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = { ids: this.checkedlist }
          httpDeleteChallengeStore(data).then((res) => {
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // ! 新增按钮
    addTopic() {
      this.$router.push({
        path: '/itemBank/penetration/addpenetration',
        query: { type: this.$route.name }
      })
    },
    // ! 编辑按钮
    updateTopic(id) {
      this.$router.push({
        path: '/itemBank/penetration/editpenetration',
        query: { type: this.$route.name, challenge_id: id }
      })
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listSelect.offset - 1) * this.listSelect.limit + index + 1
    },
    handleTestChange(e, id) {
      if (e) {
        enableTest(id).then((res) => {
          const { data } = res
          if (data.success) {
            this.$message({
              type: 'success',
              message: '启动成功'
            })
          }
          this.getList()
        })
      } else {
        disableTest(id).then((res) => {
          const { data } = res
          if (data.success) {
            this.$message({
              type: 'success',
              message: '销毁成功'
            })
          }
          this.getList()
        })
      }
    },
    handleCheckTest({ id, title }) {
      checkTest(id).then((res) => {
        const { data } = res
        if (data.success) {
          this.diaLogUrl = data.data.url
          this.diaLogTitle = title
          this.diaLogbool = true
        }
      })
    }
  }
}
</script>
<style scoped>
>>> .el-dialog__footer {
  text-align: center;
}
</style>
