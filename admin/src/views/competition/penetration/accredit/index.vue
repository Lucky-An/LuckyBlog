<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="generateval"
        type="number"
        placeholder="批量生成账号和邀请码"
        style="width: 250px;margin-right: 10px;"
        class="filter-item"
        @change="changeNum"
      />
      <el-button v-waves class="filter-item" type="primary" @click="generate">生成</el-button>
      <el-button v-waves class="filter-item" type="warning" @click="download">下载</el-button>
    </div>

    <div class="filter-container">
      <el-select
        v-if="mode==1"
        v-model="listQuery.status"
        placeholder="使用状态"
        clearable
        class="filter-item"
        style="width: 130px">
        <el-option label="全部状态" value=""/>
        <el-option :value="1" label="已使用"/>
        <el-option :value="0" label="未使用"/>
      </el-select>
      <el-input
        v-model.trim="listQuery.search"
        placeholder="请输入名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" @click="getList">搜索</el-button>
    </div>

    <!--用户授权表格 begin-->
    <el-table
      v-loading="listLoading"
      v-if="mode==1"
      :data="accreditList"
      style="width: 100%"
      @selection-change="handleChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        :index="indexMethod"
        label="序号"
        align="center"
        type="index"
      />
      <el-table-column
        align="center"
        prop="invite_code"
        label="邀请码"/>
      <el-table-column
        align="center"
        prop="nickname"
        label="用户姓名"/>
      <el-table-column
        align="center"
        prop="email"
        label="攻防世界账号"/>
      <el-table-column
        align="center"
        prop="jointype"
        label="使用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status?'已使用':'未使用' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="280px">
        <template slot-scope="scope">
          <el-button v-waves v-if="scope.row.status" class="filter-item" type="primary" @click="showDialog(scope.row)">
            编辑
          </el-button>
          <el-button v-waves class="filter-item" type="danger" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--队伍授权表格 begin-->
    <el-table
      v-if="mode==2"
      :data="accreditList"
      style="width: 100%"
      @selection-change="handleChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        :index="indexMethod"
        label="序号"
        align="center"
        type="index"
        width="50"/>
      <el-table-column
        align="center"
        prop="invite_code"
        label="邀请码"/>
      <el-table-column
        align="center"
        prop="team_name"
        label="队伍姓名"/>
      <el-table-column
        align="center"
        prop="matchType"
        label="队伍LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.team_logo" alt="">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="user_count"
        label="队伍成员">
        <template slot-scope="scope">
          <el-button v-if="scope.row.user_count" type="success" @click="showTeamUser(scope.row.nickname)">{{
          scope.row.user_count }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="280px">
        <template slot-scope="scope">
          <el-button
            v-waves
            v-if="scope.row.team_name"
            class="filter-item"
            type="primary"
            @click="showDialog(scope.row)">编辑
          </el-button>
          <el-button v-waves class="filter-item" type="danger" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页 begin-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <!--修改弹窗 begin-->
    <el-dialog :visible.sync="editDlg" title="编辑">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="邀请码">
          <el-input v-model.trim="editForm.invite_code" disabled/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model.trim="editForm.nickname"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="editDlg = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改弹窗 begin-->
    <el-dialog :visible.sync="teamDlg" title="团队成员">
      <p v-for="item in teamMembers">{{ item }}</p>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import {
  inviteUserList,
  inviteTeamList,
  submituser,
  romoveUser,
  romoveTeam,
  submitTeam,
  generateInvite,
  downloadInvite
} from '@/api/competition'

export default {
  name: 'Idnex',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      mode: this.$route.query.mode, // 授权类型1个人2组队
      editForm: {},
      teamMembers: [],
      teamDlg: false,
      editDlg: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      listQuery: {
        event: this.$route.query.id,
        offset: 0,
        limit: this.$store.state.config.row,
        search: '',
        status: '',
        order: 'asc'
      },
      checkAry: [], // 选择的数组
      generateval: '', // 生成input
      accreditList: [// 列表数据

      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) { // 展示序号的方法
      return (this.page - 1) * this.listQuery.limit + index + 1
    },
    changeNum(type, num) { // 修改生成数量
      if (this.generateval * 1 < 0) this.generateval = 0
      if (this.mode == 1) {
        if (this.generateval * 1 + this.total > 2000) this.generateval = 2000 - this.total
      } else {
        if (this.generateval * 1 + this.total > 500) this.generateval = 500 - this.total
      }
    },
    submitForm() { // 提交编辑
      if (this.mode == 1) {
        const obj = {}
        obj.nickname = this.editForm.nickname
        obj.user_id = this.editForm.user_id
        submituser(this.editForm.id, obj).then(res => {
          if (res.data.success) {
            this.editDlg = false
            this.getList()
          }
        })
      } else {
        const obj = {}
        obj.team_name = this.editForm.nickname
        obj.team = this.editForm.team_id
        obj.event = Number(this.$route.query.id)
        submitTeam(this.editForm.id, obj).then(res => {
          if (res.data.success) {
            this.editDlg = false
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }
    },
    showDialog(obj) { // 显示编辑弹窗
      this.editDlg = true

      if (this.mode == 1) {
        this.editForm.nickname = obj.nickname
        this.editForm.invite_code = obj.invite_code
        this.editForm.id = obj.id
        this.editForm.user_id = obj.user_id
      } else {
        this.editForm.nickname = obj.team_name
        this.editForm.id = obj.id
        this.editForm.invite_code = obj.invite_code
        this.editForm.team_id = obj.team_id
      }
    },
    handleChange(val) { // 选择表格
      this.checkAry = val.map(item => {
        return item.id
      })
    },
    getList() {
      if (this.mode == 1) {
        this.getUserList()
      } else {
        this.getTeamList()
      }
    },
    remove(id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.mode == 1) {
          romoveUser(id).then(res => {
            if (res.data.success) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        } else {
          romoveTeam(id).then(res => {
            if (res.data.success) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getUserList() {
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      inviteUserList(this.listQuery).then(res => {
        this.accreditList = res.data.rows
        this.total = res.data.total
      })
    },
    getTeamList() {
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      inviteTeamList(this.listQuery).then(res => {
        this.accreditList = res.data.rows
        this.total = res.data.total
      })
    },
    showTeamUser(ary) { // 显示团队成员
      this.teamDlg = true
      this.teamMembers = ary
    },
    generate() { // 生成邀请码
      if (this.generateval == '') {
        this.$message.error('请输入生成数量')
        return
      }
      const obj = { num: Number(this.generateval), event: this.$route.query.id }
      generateInvite(obj).then(res => {
        if (res.data.success) {
          this.$message.success('生成成功')
          this.generateval = ''
          this.getList()
        }
      })
    },
    download() { // 下载
      if (this.checkAry.length == 0) {
        this.$message.error('请选择下载项')
        return
      }
      window.open('/api/ad_event/user_invite_code/down_excel?ids=[' + this.checkAry + ']')
    }
  }
}
</script>

<style scoped>

</style>
