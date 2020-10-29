<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select v-model="listQuery.in_blacklist" class="filter-item" size="mini" placeholder="黑名单">-->
      <!--<el-option label="账户状态" value=""/>-->
      <!--<el-option :value="1" label="列入黑名单"/>-->
      <!--<el-option :value="0" label="不在黑名单"/>-->
      <!--</el-select>-->
      <el-input
        v-model="listQuery.search"
        style="width: 150px;"
        placeholder="战队名称"
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

    </div>

    <div class="filter-container">
      <el-button
        type="success"
        size="mini"
        @click="addTeam"
      > 新增</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="removeSub"
      > 删除</el-button>
      <div class="fr">
        <el-button
          type="success"
          size="mini"
          @click="uploadDia=true"
        > 批量导入</el-button>
        &nbsp;
        <a
          href="/api/v1/common/admin/teams/upload"
          download
        >
          <el-button
            type="warning"
            size="mini"
          > 下载模板</el-button>
        </a>
      </div>
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
          prop="name"
          label="战队名称"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="战队logo"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.logo"
              style="display:inline-block;width: 30px;height: 30px;border-radius: 50%;"
              alt=""
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="modify_time"
          label="创建时间"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="战队成员"
        >
          <template slot-scope="scope">
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="primary"
              @click="showMember(scope.row)"
            >查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_user"
          label="创建人"
        />

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
              @click="editTeam(scope.row.id)"
            >编辑
            </el-button>
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

    <!--查看成员 begin-->
    <el-dialog
      :visible.sync="memberDia"
      class="addsub"
      title="战队成员"
      width="900px"
      @close="closeUpload"
    >
      <el-table
        :data="memberList"
        border
        @selection-change="checkTable"
      >
        <el-table-column
          :index="indexMethod"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column
          align="center"
          prop="user_nickname"
          label="用户名"
        />
        <el-table-column
          align="center"
          prop="handle_time"
          label="时间"
        />
      </el-table>
    </el-dialog>
    <!--查看成员  end-->

    <!--批量导入 begin-->
    <el-dialog
      :visible.sync="uploadDia"
      class="addsub"
      title="批量导入"
      width="400px"
      @close="closeUpload"
    >
      <div>
        <el-upload
          ref="upload"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
          :file-list="fileList"
          :on-success="uploadSuccess"
          class="upload-demo"
          action="/api/v1/common/admin/teams/upload"
          name="excelfile"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >选取文件</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >只能上传excel文件，且不超过2MB</div>
        </el-upload>
        <div>
          <p
            v-for="i in errList"
            style="color: red;margin: 5px;"
          >{{ i }}</p>
        </div>
      </div>
    </el-dialog>
    <!--批量导入  end-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import { fetchTeamList, showMember, deleteTeam } from '@/api/account'
import Cookies from 'js-cookie'

export default {
  name: 'UserCneter',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      matchList: [], // 题目列表
      memberList: [], // 成员列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: this.$store.state.config.row,
        order: 'asc',
        search: '', // 关键字
        in_blacklist: '', // 0隐藏1公开
        province: '', // 省份
        classes: '' // 角色
      },
      uploadDia: false,
      memberDia: false,
      fileList: [],
      headers: { 'X-CSRF-Token': Cookies.get('X-CSRF-Token') },
      errList: [] // 导入错误列表
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) {
      // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    uploadSuccess(res) {
      if (res.success) {
        this.$message.success('操作成功')
        this.getList()
      } else {
        this.errList = res.message_zh
        // this.$message.error(res.message_zh)
      }
    },
    closeUpload() {
      this.errList = []
      this.fileList = []
    },
    showMember(row) {
      showMember(row.id).then(res => {
        this.memberDia = true
        this.memberList = res.data
      })
    },
    beforeAvatarUpload(file) {
      const fileType = file.name.substr(file.name.lastIndexOf('.'))
      const isExcel = fileType.includes('xls')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isExcel) {
        this.$message.error('文件只能是excel格式')
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 2MB!')
      }
      return isExcel && isLt2M
    },
    showTalking(content) {
      this.talkDia = true
      this.introduction = content
    },
    removeSub() {
      // 删除用户
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
          deleteTeam(params).then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList(1)
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
    addTeam() {
      // 新增用户
      this.$router.push({
        path: '/account/team/addTeam'
      })
    },
    editTeam(id) {
      // 编辑用户
      this.$router.push({
        path: '/account/team/editTeam',
        query: {
          team_id: id
        }
      })
    },
    getList(page) {
      if (page === 1) this.listPage = page
      // if(this.listTotal % this.listQuery.limit == 1) this.listPag
      this.listQuery.offset = this.listPage
      fetchTeamList(this.listQuery).then(res => {
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
</style>
<style>
.el-icon-close {
  color: red;
}
</style>
