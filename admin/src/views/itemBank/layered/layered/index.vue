<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.category"
        class="filter-item"
        clearable
        size="mini"
        placeholder="请选择题目类型"
      >
        <el-option
          v-for="item,ind in subType"
          :key="ind"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="listQuery.tag"
        class="filter-item"
        clearable
        size="mini"
        placeholder="请选择题目标签"
      >
        <el-option
          v-for="item,ind in subTag"
          :key="ind"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="listQuery.is_share"
        class="filter-item"
        size="mini"
        placeholder="题目状态"
      >
        <el-option
          label="全部环境状态"
          value=""
        />
        <el-option
          :value="1"
          label="共享"
        />
        <el-option
          :value="0"
          label="独享"
        />
      </el-select>

      <!--<el-input-->
      <!--v-model="listQuery.weight_score"-->
      <!--placeholder="题目难度"-->
      <!--type="number"-->
      <!--style="width: 150px;"-->
      <!--size="mini"-->
      <!--class="filter-item"/>-->

      <el-input
        v-model.trim="listQuery.name"
        placeholder="请输入题目名称"
        style="width: 150px;"
        size="mini"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList"
      >搜索
      </el-button>

      <div style="float: right;">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(1)"
        >题目类型管理</el-button>
        <el-button
          v-waves
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
      <!--<el-button type="success" size="mini" @click="publicSub(1)"> 题目公开</el-button>-->
      <!--<el-button type="danger" size="mini" @click="publicSub(0)"> 题目隐藏</el-button>-->
      <el-button
        type="success"
        size="mini"
        @click="shareJeopardySence(1)"
      > 容器共享</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="shareJeopardySence(0)"
      > 容器独享</el-button>
      <!--<el-button type="success" size="mini" @click="wpPublic(1)"> WP开放上传</el-button>-->
      <!--<el-button type="danger" size="mini" @click="wpPublic(0)"> WP关闭上传</el-button>-->

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
          align="center"
          prop="id"
          label="ID"
        />
        <el-table-column
          align="center"
          prop="title"
          label="题目名称"
        />

        <el-table-column
          align="center"
          prop="category"
          label="类型"
        />
        <el-table-column
          align="center"
          prop="weight_score"
          label="难度"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.weight==0">初级</span>
            <span v-else-if="scope.row.weight==1">中级</span>
            <span v-else-if="scope.row.weight==1">高级</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="tag"
          label="标签"
        />

        <el-table-column
          align="center"
          label="附件"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.file.length>0"
              class="filter-item"
              size="mini"
              type="success"
              @click="showDownload(scope.row.file)"
            >下载附件
            </el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="环境"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_dynamic_env==0">无</span>

            <span v-else>

              <el-button
                v-waves
                v-if="scope.row.is_share==0"
                class="filter-item"
                size="mini"
                type="danger"
                disabled
              >
                独享
              </el-button>
              <el-button
                v-waves
                v-else-if="scope.row.is_share==1"
                disabled
                class="filter-item"
                size="mini"
                type="success"
              >
                共享
              </el-button>
            </span>

          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="flag"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              v-if="scope.row.answer"
              class="filter-item"
              size="mini"
              type="success"
              @click="showflag(scope.row)"
            >查看
            </el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>

        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="public"-->
        <!--label="状态">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.public==0?'隐藏':'公开' }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          prop="need_writeup"
          label="WP状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.official_writeup">有</span>
            <span v-if="!scope.row.official_writeup">无</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="userwriteup_quantity"
          label="WP查看"
        >
          <template slot-scope="scope">
            <!--<span><router-link-->
            <!--:to="{path: '/itemBank/wpManagement', query: {task_id: scope.row.id }}"-->
            <!--class="dict-secong-trans">{{ scope.row.userwriteup_quantity }}</router-link></span>-->
            开放
          </template>
        </el-table-column>

        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="writeup_purchasing_quantity"-->
        <!--label="购买WP">-->
        <!--<template slot-scope="scope">-->
        <!--<span>-->
        <!--<router-link-->
        <!--:to="{path: '/itemBank/buyWp', query: {task_id: scope.row.id }}"-->
        <!--class="dict-secong-trans">{{ scope.row.writeup_purchasing_quantity }}-->
        <!--</router-link>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="correct_answer_quantity"-->
        <!--label="答对人数">-->
        <!--<template slot-scope="scope">-->
        <!--<span>-->
        <!--<router-link-->
        <!--:to="{path: '/itemBank/correct', query: {task_id: scope.row.id }}"-->
        <!--class="dict-secong-trans">{{ scope.row.correct_answer_quantity }}-->
        <!--</router-link>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="center"-->
        <!--label="建议">-->
        <!--<template slot-scope="scope">-->
        <!--<span>-->
        <!--<router-link-->
        <!--:to="{path: '/itemBank/proposal', query: {task_id: scope.row.id }}"-->
        <!--class="dict-secong-trans">{{ scope.row.complain_quantity }}-->
        <!--</router-link>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column-->
        <!--align="center"-->
        <!--label="讨论">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button v-waves class="filter-item" size="mini" type="success" @click="showTalking(scope.row.id)">查看-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          width="150px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑
            </el-button>
            <!--<el-button v-waves class="filter-item" size="mini" type="danger" disabled @click="">测试</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listPage"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--选择下载文件  begin-->
    <el-dialog
      :visible.sync="choseDown"
      class="addsub"
      title="下载附件"
      width="900px"
      @close="closeDown"
    >
      <p v-for="item in fileList">
        <a
          :href="item"
          download
        >
          <el-button
            type="primary"
            @click="download"
          >{{ item }}</el-button>
        </a>
      </p>
    </el-dialog>
    <!--选择下载文件  end-->

    <!--查看flag  begin-->
    <el-dialog
      :visible.sync="diaFlag"
      class="addsub"
      title="查看flag"
      width="900px"
      @close="closeDown"
    >
      <p
        v-if="is_dynamic_flag"
        class="bm"
      >
        <el-input
          v-model.trim="subInfo.search"
          placeholder="请输入用户ID、用户邮箱、用户手机号"
          style="width: 300px;"
          size="mini"
          class="filter-item"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="getFlag"
        >搜索
        </el-button>
      </p>
      <p>{{ flagList }}</p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-clipboard:copy="flagList"
          v-clipboard:success="copyFlag"
          type="primary"
        >复制flag</el-button>
      </div>
    </el-dialog>
    <!--查看flag  end-->

    <!--查看讨论  begin-->
    <el-dialog
      :visible.sync="talkDia"
      class="addsub"
      title="讨论详情"
      width="900px"
      @close="closeDown"
    >
      <div
        v-for="floor in talkAry"
        style="border: 1px solid #dadada;margin: 10px;padding: 10px;"
      >

        <span>
          <span style="color: blue;">{{ floor.replay_name }}</span>：{{ floor.content }}&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="float: right;">
            点赞数：{{ floor.thump }}&nbsp;&nbsp;&nbsp;&nbsp;
            时间：{{ floor.time }}
          </span>
        </span>
        <p
          v-for="item in floor.children"
          style="padding:10px 0;background: #eee"
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="clearfix">
            <span style="display:inline-block;color: blue;">{{ item.replay_name }}</span>
            回复
            <span style="display:inline-block;color: blue;">{{ item.replayed_name }}：</span>{{ item.content }}&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="float: right;">
              点赞数：{{ item.thump }}&nbsp;&nbsp;&nbsp;&nbsp;
              时间：{{ item.time }}
            </span>
          </span>
        </p>

      </div>
    </el-dialog>
    <!--查看讨论  end-->

    <!--题目标签 begin-->
    <el-dialog
      :title="digTitle"
      :visible.sync="tagDlg"
      width="600px"
      @close="closetagDlg"
    >
      <el-form
        ref="form"
        label-width="60px"
      >
        <el-form-item label="名称">
          <el-input v-model.trim="tagQuery.cn_name" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model.trim="tagQuery.content"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div class="fcenter">
        <el-button
          type="primary"
          @click="addTagType"
        >新增</el-button>
        <el-button
          type="danger"
          @click="removeTagType"
        >删除</el-button>
      </div>

      <el-alert
        :title="digTitle+' 详情'"
        :closable="false"
        type="success"
        center
      />
      <el-table
        :data="tagDlgAry"
        border
        height="250"
        @selection-change="checkTag"
      >
        <el-table-column
          align="center"
          type="selection"
        />
        <el-table-column
          align="center"
          prop="cn_name"
          label="名称"
        />
        <el-table-column
          align="center"
          prop="create_time"
          label="时间"
        />
        <el-table-column
          align="center"
          prop="content"
          label="备注"
        />
      </el-table>
    </el-dialog>

    <!--题目标签 end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import {
  fetchJeopardyTopicList,
  deleteJeopardySub,
  shareJeopardySence,
  fetchJeopardyFlag
} from '@/api/itemBank/layered'
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
      tagDlg: false,
      tagDlgAry: [], // 标签或类型数据
      digTitle: '', // 标签或类型管理标题
      tagtype: 1, // 打开的弹窗是什么 1类型 2标签
      tagIds: [], // 选择的标签的项
      tagQuery: {
        cn_name: '',
        content: ''
      },

      subType: [], // 题目类型
      subTag: [], // 题目标签
      choseDown: false,
      diaFlag: false,
      talkDia: false,
      talkAry: [], // 讨论数据
      fileList: [], // 文件列表
      downList: [],
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        order: 'asc',
        name: '', // 关键字
        is_share: '', // 0独享1共享
        tag: '', // 标签
        category: '' // 类型
      },
      flagList: [], // flagList
      is_dynamic_flag: 0, // 是否是动态flag

      subInfo: {
        task_id: '', // 题目id
        search: '', // 用户信息
        order: 'asc',
        offset: '',
        limit: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getTag() {
      // 获取题目标签
      fetchTags().then(res => {
        this.tagAry = res.data
        this.tagDlgAry = res.data
      })
    },
    getType() {
      // 获取题目类型
      fetchType().then(res => {
        this.subType = res.data
        this.tagDlgAry = res.data
      })
    },
    checkTag(val) {
      // 选择标签表格
      this.tagIds = val.map(item => {
        return item.id
      })
    },
    removeTagType() {
      // 删除标签
      const params = {}
      params.ids = this.tagIds
      if (this.tagIds.length <= 0) {
        return
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
    showTalking(id) {
      const params = { task_id: id }
      showTalking(params).then(res => {
        let ary = [],
          data = res.data
        data.forEach(i => {
          i.reply = []
        })

        data.forEach(item => {
          if (item.parent_id) {
            data.forEach(i => {
              if (i.id == item.parent_id) {
                i.reply.push(item)
              }
            })
          }
        })
        data.forEach(item => {
          if (!item.parent_id) {
            ary.push(item)
          }
        })

        this.talkAry = res.data
        this.talkDia = true
      })
    },
    getFlag() {
      // 获取动态flag
      fetchJeopardyFlag(this.subInfo).then(res => {
        this.flagList = res.data.flag
      })
    },
    copyFlag() {
      this.$message.success('复制成功')
    },
    shareJeopardySence(num) {
      const params = {}
      params.ids = this.ids
      params.is_share = num
      shareJeopardySence(params).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    wpPublic(num) {
      // 开放上传wp
      const params = {}
      params.ids = this.ids
      params.need_writeup = num
      wpPublic(params).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
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
          deleteJeopardySub(params).then(res => {
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
    publicSub(num) {
      // 公开题目
      const params = {}
      params.ids = this.ids
      params.public = num
      topicPublic(params).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },

    showflag(row) {
      // 展示flag
      this.diaFlag = true
      this.flagList = row.answer
      this.is_dynamic_flag = row.is_dynamic_flag
      this.subInfo.task_id = row.id
    },
    closeDown() {
      // 关闭下载弹框
      this.fileList = []
      this.downList = []
    },
    showDownload(fileList) {
      this.choseDown = true
      this.fileList = fileList
    },
    download() {
      this.downList.forEach(item => {
        window.location.href = item
      })
      this.choseDown = false
    },
    addTopic() {
      // 新增赛题
      this.$router.push({
        path: '/itemBank/layered/addLayered',
        query: { type: this.$route.name }
      })
    },
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/itemBank/layered/editLayered',
        query: {
          task_id: id,
          type: this.$route.name
        }
      })
    },
    getList() {
      // this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      this.listQuery.offset = this.listPage - 1 + 1
      fetchJeopardyTopicList(this.listQuery).then(res => {
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total

        if (
          this.listTotal <=
            this.listQuery.offset * this.listQuery.limit -
              this.listQuery.limit &&
          this.listTotal != 0
        ) {
          this.listQuery.offset = this.listQuery.offset - 1
          this.getList()
        }
        if (data.rows[0]) {
          this.subType = data.rows[0].task_category
          this.subTag = data.rows[0].task_tag
        }
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
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
