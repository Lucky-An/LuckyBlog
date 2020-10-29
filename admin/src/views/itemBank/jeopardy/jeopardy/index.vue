<template>
  <div class="app-container jeopardy_list">
    <div class="filter-container">
      <el-select
        v-model="listQuery.category"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择题目类型"
      >
        <el-option
          v-for="item in subType"
          :key="item.id"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="listQuery.tag"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择题目标签"
      >
        <el-option
          v-for="item in subTag"
          :key="item.id"
          :label="item.cn_name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="listQuery.origin"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择题目来源"
      >
        <el-option
          v-for="(item, index) in subOrigin"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select
        v-model="listQuery.is_share"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择环境状态"
      >
        <el-option :value="0" label="共享" />
        <el-option :value="1" label="独享" />
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
        style="width: 150px"
        size="mini"
        class="filter-item"
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
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(1)"
        >题目类型管理</el-button
        >
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(2)"
        >题目标签管理</el-button
        >
        <!-- <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="mini"
          @click="showTagDlg(3)"
        >题目来源管理</el-button> -->
      </div>
    </div>

    <div class="filter-container">
      <el-button type="success" size="mini" @click="addTopic"> 新增</el-button>
      <el-button type="danger" size="mini" @click="removeSub"> 删除</el-button>
      <!--<el-button type="success" size="mini" @click="publicSub(1)"> 题目公开</el-button>-->
      <!--<el-button type="danger" size="mini" @click="publicSub(0)"> 题目隐藏</el-button>-->
      <!--<el-button type="success" size="mini" @click="shareJeopardySence(1)">-->
      <!--环境共享</el-button-->
      <!--&gt;-->
      <!--<el-button type="danger" size="mini" @click="shareJeopardySence(0)">-->
      <!--环境独享</el-button-->
      <!--&gt;-->
      <!--<el-button type="success" size="mini" @click="wpPublic(1)"> WP开放上传</el-button>-->
      <!--<el-button type="danger" size="mini" @click="wpPublic(0)"> WP关闭上传</el-button>-->
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="matchList" border @selection-change="checkTable">
        <el-table-column align="center" type="selection" />
        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column align="center" prop="title" label="题目名称" />

        <el-table-column align="center" prop="category" label="题目类型" />
        <el-table-column align="center" prop="origin" label="题目来源" />
        <el-table-column align="center" prop="weight" label="题目难度">
          <template slot-scope="scope">
            <span>{{
              scope.row.weight == 0 ? "初级" : (scope.row.weight == 1 ? "中级" : "高级")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="tag" label="题目标签" />

        <el-table-column align="center" label="附件">
          <template slot-scope="scope">
            <el-badge
              v-if="scope.row.file.length > 0"
              :value="scope.row.file.length"
              class="item"
            >
              <el-button
                v-waves
                size="mini"
                type="warning"
                @click="showDownload(scope.row)"
              >下载
              </el-button>
            </el-badge>

            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="环境">
          <template slot-scope="scope">
            <span v-if="scope.row.is_dynamic_env == 0">无</span>

            <span v-else>
              <el-button
                v-waves
                v-if="scope.row.is_share == 0"
                size="mini"
                type="danger"
                @click="shareOne(1, scope.row)"
              >
                独享
              </el-button>
              <el-button
                v-waves
                v-else-if="scope.row.is_share == 1"
                size="mini"
                type="success"
                @click="shareOne(0, scope.row)"
              >
                共享
              </el-button>
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="flag_type" label="Flag类型" />

        <el-table-column align="center" label="Flag查看">
          <template slot-scope="scope">
            <el-button
              v-waves
              type="primary"
              size="mini"
              @click="showflag(scope.row)"
            >查看
            </el-button>
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
        <!-- <el-table-column
          align="center"
          prop="need_writeup"
          label="WP状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.official_writeup">有</span>
            <span v-if="!scope.row.official_writeup">无</span>
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="userwriteup_quantity"
          label="WriteUp"
        >
          <template slot-scope="scope">
            <!--<span><router-link-->
            <!--:to="{path: '/itemBank/wpManagement', query: {task_id: scope.row.id }}"-->
            <!--class="dict-secong-trans">{{ scope.row.userwriteup_quantity }}</router-link></span>-->
            <a
              v-if="scope.row.official_writeup"
              :href="scope.row.official_writeup"
              download
            >
              <el-button
                v-waves
                size="mini"
                type="warning"
              >下载
              </el-button>
            </a>

            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="操作">
          <template slot-scope="scope">
            <el-button
              v-waves
              size="mini"
              type="success"
              @click="editTopic(scope.row.id)"
            >编辑
            </el-button>
            <!--<el-button v-waves class="filter-item" size="mini" type="danger" disabled @click="">测试</el-button>-->
          </template>
        </el-table-column>
        <el-table-column align="center" width="150px" label="测试">
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
              @click="handleSearch(scope.row.vscene_id, scope.row.title)"
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
      <template v-if="fileList.file">
        <el-row style="padding-left: 50px; font-size: 18px">
          <el-col :span="3"> 题目名称： </el-col>
          <el-col :span="8">
            {{ fileList.title }}
          </el-col>
        </el-row>
        <!-- 单文件附件下载 -->
        <el-row
          v-if="fileList.file.length < 2"
          style="
            padding-left: 50px;
            font-size: 18px;
            margin: 50px 0;
            line-height: 28px;
          "
        >
          <el-col :span="3"> 附件名称： </el-col>
          <el-tooltip
            :content="
              fileList.file[0].split('/')[
                fileList.file[0].split('/').length - 1
              ]
            "
            class="item"
            effect="dark"
            placement="top-start"
          >
            <el-col :span="6" class="threePoint">
              {{
                fileList.file[0].split("/")[
                  fileList.file[0].split("/").length - 1
                ]
              }}
            </el-col>
          </el-tooltip>
          <a :href="fileList.file[0]" style="margin-left: 50px" download>
            <!-- 锚点2 -->
            <el-button type="primary" size="mini"> 下载 </el-button>
          </a>
        </el-row>
        <!-- 单文件附件下载结束 -->
        <el-row
          v-for="(item, index) in fileList.file"
          v-else
          :key="index"
          style="
            padding-left: 50px;
            font-size: 18px;
            margin: 30px 0;
            line-height: 28px;
          "
        >
          <el-col :span="3"> 附件{{ index + 1 }}名称： </el-col>
          <el-tooltip
            :content="item.split('/')[item.split('/').length - 1]"
            class="item"
            effect="dark"
            placement="top-start"
          >
            <el-col :span="6" class="threePoint">
              {{ item.split("/")[item.split("/").length - 1] }}
            </el-col>
          </el-tooltip>
          <a :href="item" style="margin-left: 50px" download>
            <el-button type="primary" size="mini"> 下载 </el-button>
          </a>
        </el-row>
      </template>
    </el-dialog>
    <!--选择下载文件  end-->

    <!--查看flag  begin-->

    <!-- 静态flag查看 -->
    <el-dialog
      :visible.sync="staticDiaFlag"
      class="addsub"
      width="40%"
      title="查看静态Flag"
      @close="resetData"
    >
      <el-form ref="flagList" :model="flagList" label-width="80px">
        <el-form-item label="题目名称">
          <el-col :span="14">
            <el-input v-model.trim="flagList.name" disabled />
          </el-col>
        </el-form-item>

        <el-form-item label="Flag">
          <el-col :span="14">
            <el-input :value="flagList.staticFlag[0]" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          v-clipboard:copy="flagList.staticFlag[0]"
          v-clipboard:success="copyFlag"
          type="success"
          size="mini"
        >复制flag</el-button
        >
        <el-button type="danger" size="mini" @click="resetData">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <!-- 静态flag查看结束 -->

    <!-- 动态flag查看开始 -->
    <el-dialog
      :visible.sync="dynamicDiaFlag"
      class="addsub"
      width="40%"
      title="查看动态Flag"
      @close="resetData"
    >
      <el-form ref="flagList" :model="flagList" label-width="80px">
        <el-form-item label="题目名称">
          <el-col :span="14">
            <el-input v-model.trim="flagList.name" disabled />
          </el-col>
        </el-form-item>
        <template v-if="flagList.dynamicFlag.length == 1">
          <el-form-item
            v-for="(item, index) in flagList.dynamicFlag"
            :key="index"
            label="Flag"
          >
            <el-col :span="14">
              <el-input :value="item" disabled />
            </el-col>
          </el-form-item>
        </template>

        <template v-if="flagList.dynamicFlag.length > 1">
          <el-form-item
            v-for="(item, index) in flagList.dynamicFlag"
            :label="'Flag' + (index + 1)"
            :key="index"
          >
            <el-col :span="14">
              <el-input :value="item" disabled />
            </el-col>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="danger" size="mini" @click="resetData">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <!--查看flag  end-->

    <!-- 随机 -->
    <el-dialog
      :visible.sync="randomDiaFlag"
      class="addsub"
      width="40%"
      title="查看随机附件Flag"
      @close="resetData"
    >
      <el-form ref="flagList" :model="flagList" label-width="80px">
        <el-form-item label="题目名称">
          <el-col>
            <el-input v-model.trim="flagList.name" disabled />
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-for="(item, index) in flagList.fileName"
              :key="index"
              label="附件名称"
            >
              <!-- {{item}} -->
              <el-tooltip
                :content="item"
                class="item"
                effect="dark"
                placement="top-start"
              >
                <el-col :span="24" class="threePoint">
                  {{ item }}
                </el-col>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-for="(item, index) in flagList.flagValue"
              :key="index"
              label="Flag值"
            >
              <el-input :value="item" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="danger" size="mini" @click="resetData">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <!-- 随机结束 -->

    <!--题目标签 begin-->
    <el-dialog
      :title="digTitle"
      :visible.sync="tagDlg"
      width="780px"
      @close="closetagDlg"
    >
      <!-- form 上的   类型不让添加    v-if="tagtype===2"-->
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
            <el-button type="success" @click="addTagType">新增 </el-button>
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
  fetchJeopardyFlag,
  fetchTag,
  fetchCreateTag,
  fetchDeleteTag,
  fetchtype,
  fetchCreateType,
  fetchDeleteType,
  postTest,
  getTest
} from '@/api/itemBank/jeopardy'

export default {
  name: 'TopicManagement',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      diaLogbool: false,
      diaLogUrl: '',
      diaLogTitle: '',
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
      subOrigin: [
        {
          label: 'CP新手',
          value: 'CP新手'
        },
        {
          label: 'CP进阶',
          value: 'CP进阶'
        },
        {
          label: 'CP扩展',
          value: 'CP扩展'
        },
        {
          label: '自定义',
          value: '自定义'
        }
      ],
      choseDown: false,
      diaFlag: false,
      staticDiaFlag: false, // 静态flag
      dynamicDiaFlag: false, // 动态flag
      randomDiaFlag: false, // 随机flag
      talkDia: false,
      talkAry: [], // 讨论数据
      fileList: [], // 文件列表  //! 更改释意 为  行数据
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
        category: '', // 类型
        origin: '' // 题目来源
      },
      flagList: {
        name: '',
        flag: [],
        flag_type: '',
        fileName: [],
        flagValue: [],
        staticFlag: [],
        dynamicFlag: []
      },
      // flagList 锚点3
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
  watch: {
    subType: {
      handler: function() {
        this.tagDlgAry = this.subType
      },
      deep: true
    },
    subTag: {
      handler: function() {
        this.tagDlgAry = this.subTag
      },
      deep: true
    }
  },
  created() {
    this.getList()
    this.getType()
    this.getTag()
  },
  methods: {
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.offset - 1) * this.listQuery.limit + index + 1
    },
    resetData() {
      this.staticDiaFlag = false // 静态flag
      this.dynamicDiaFlag = false // 动态flag
      this.randomDiaFlag = false // 随机flag
      this.flagList.name = ''
      this.flagList.flag = []
      this.flagList.flag_type = ''
      this.flagList.fileName = []
      this.flagList.flagValue = []
      this.flagList.staticFlag = []
      this.flagList.dynamicFlag = []
    },
    getTag() {
      // 获取题目标签 type  1:ad  2:jad  3:ops  4:rw  5:jeopardy
      fetchTag({ type: 5 }).then((res) => {
        this.subTag = res.data.rows
      })
    },
    getType() {
      // 获取题目类型
      // type  1:ad  2:jad  3:ops  4:rw  5:jeopardy
      fetchtype({ type: 5 }).then((res) => {
        this.subType = res.data.rows
      })
    },
    checkTag(val) {
      // 选择标签表格
      this.tagIds = val.map((item) => {
        return item.id
      })
    },
    handleTestChange(val, id) {
      if (val === 0) {
        postTest({ task_id: id, action: 0 }).then(({ data }) => {
          if (data.success) {
            this.getList()
          }
        })
      } else {
        postTest({ task_id: id, action: 1 }).then((res) => {
          this.getList()
          const { data } = res
          if (data.success) {
            this.$message.success('操作成功')
          }
        })
      }
    },
    handleSearch(id, title) {
      getTest({ vscene_id: id }).then((res) => {
        if (res.data.success) {
          this.diaLogUrl = res.data.data
          this.diaLogTitle = title
          this.diaLogbool = true
        }
      })
    },
    diaLogClose() {
      this.diaLogbool = false
      this.diaLogUrl = ''
      this.diaLogTitle = ''
    },
    removeTagType(id) {
      // 删除标签
      const params = { ids: [], type: 5 }
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
            params.type = 5
            fetchDeleteType(params).then((res) => {
              if (res.data.success) {
                this.$message.success('删除成功')
                this.getType()
              }
            })
          }
          if (this.tagtype == 2) {
            fetchDeleteTag(params).then((res) => {
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
      // type 等于5是解题赛专属类型和标签
      this.tagQuery.type = 5
      if (this.tagtype == 1) {
        fetchCreateType(this.tagQuery).then((res) => {
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
        fetchCreateTag(this.tagQuery).then((res) => {
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
      } else if (num == 2) {
        this.digTitle = '题目标签管理'
        this.tagDlgAry = this.subTag
        this.getTag()
      } else {
        this.digTitle = '题目来源管理'
        // this.tagDlgAry = this.subType;
        // this.getType();
      }

      this.tagDlg = true
    },

    copyFlag() {
      this.$message.success('复制成功')
    },
    shareOne(num, row) {
      this.ids = [row.id]
      this.shareJeopardySence(num)
    },
    shareJeopardySence(num) {
      const params = {}
      params.ids = this.ids
      params.is_share = num
      shareJeopardySence(params).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    // wpPublic(num) {
    //   // 开放上传wp
    //   const params = {}
    //   params.ids = this.ids
    //   params.need_writeup = num
    //   wpPublic(params).then((res) => {
    //     if (res.data.success) {
    //       this.$message.success('操作成功')
    //       this.getList()
    //     }
    //   })
    // },
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
          deleteJeopardySub(params).then((res) => {
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
    // publicSub(num) {
    //   // 公开题目
    //   const params = {}
    //   params.ids = this.ids
    //   params.public = num
    //   topicPublic(params).then((res) => {
    //     if (res.data.success) {
    //       this.$message.success('操作成功')
    //       this.getList()
    //     }
    //   })
    // },

    showflag(row) {
      // 展示flag
      // this.diaFlag = true;
      this.flagList.name = row.title
      // 锚点3
      this.flagList.flag_type = row.flag_type // 类型  静态动态  随机
      const id = row.id
      this.getFlag(id)
    },
    getFlag(id) {
      fetchJeopardyFlag({ task_id: id }).then((res) => {
        if (this.flagList.flag_type == '静态') {
          this.flagList.staticFlag = res.data
          this.staticDiaFlag = true
        } else if (this.flagList.flag_type == '动态') {
          if (res.data[0].indexOf('环境未创建') != -1) {
            this.$message.warning(res.data[0])
          } else {
            this.flagList.dynamicFlag = res.data
            this.dynamicDiaFlag = true
          }
        } else if (this.flagList.flag_type == '随机') {
          res.data.forEach((element) => {
            this.flagList.fileName = this.flagList.fileName.concat(
              Object.keys(element)
            )

            this.flagList.flagValue = this.flagList.flagValue.concat(
              Object.values(element)
            )
          })
          this.randomDiaFlag = true
        }
      })
      // 获取动态flag
      // fetchJeopardyFlag(this.subInfo).then(res => {
      //   this.flagList = res.data.flag;
      // });
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
      this.downList.forEach((item) => {
        window.location.href = item
      })
      this.choseDown = false
    },
    addTopic() {
      // 新增赛题
      this.$router.push({
        path: '/itemBank/jeopardy/addJeopardy',
        query: { type: this.$route.name }
      })
    },
    editTopic(id) {
      // 编辑题目
      this.$router.push({
        path: '/itemBank/jeopardy/editJeopardy',
        query: {
          task_id: id,
          type: this.$route.name
        }
      })
    },
    getList(page) {
      if (page === 1) this.listPage = page

      this.listQuery.offset = this.listPage
      fetchJeopardyTopicList(this.listQuery).then((res) => {
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
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.id
      })
    }
  }
}
</script>

<style scoped>
.mytag >>> .el-icon-close {
  top: -6px;
  right: 3px;
}
.el-tag >>> .el-icon-close::before {
  font-size: 18px;
}
.threePoint {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.addsub .pagination-container {
  padding: 0;
}
.jeopardy_list .el-table >>> .cell {
  overflow: visible;
}
</style>
