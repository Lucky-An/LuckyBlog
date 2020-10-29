<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.task_id" class="filter-item" size="mini" placeholder="题目名称">
        <el-option label="全部题目类型" value=""/>
        <el-option v-for="item in topicList" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
      <el-input
        v-model.trim="listQuery.search"
        placeholder="账户名称/ID"
        style="width: 150px;"
        size="mini"
        class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList">搜索
      </el-button>
    </div>

    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" size="mini" @click="addSence">新增
      </el-button>
      <el-button v-waves class="filter-item" type="danger" size="mini" @click="removeSence">删除
      </el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="checkTable">
        <el-table-column
          align="center"
          type="selection"/>

        <el-table-column
          :index="indexMethod"
          align="center"
          width="50px"
          label="序号"
          type="index"/>
        <el-table-column
          align="center"
          prop="name"
          label="账户">
          <template slot-scope="scope">
            {{ mode==1?scope.row.user_name:scope.row.team_name }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="task_name"
          label="题目"/>

        <el-table-column
          align="center"
          prop="addr"
          label="地址"/>

        <el-table-column
          align="center"
          prop="flag"
          label="flag"/>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">

            <el-button
              v-waves
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-document"
              @click="editSence(scope.row.id)">编辑
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
      @pagination="getList"/>

    <el-dialog :visible.sync="editDlg" title="操作" width="500px" @close="close">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="题目" label-width="100px" prop="event_task_id">
          <el-select v-model="form.event_task_id">
            <el-option v-for="item in topicList" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item v-if="mode == 1" label="用户" label-width="100px" prop="user_id">
          <el-select v-model="form.user_id">
            <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item v-else label="队伍" label-width="100px" prop="team_id">
          <el-select v-model="form.team_id">
            <el-option v-for="item in teamList" :label="item.name" :key="item.id" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="场景地址" label-width="100px" prop="addr">
          <el-input v-model.trim="form.addr"/>
        </el-form-item>

        <el-form-item label="flag" label-width="100px" prop="flag">
          <el-input v-model.trim="form.flag"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSence">确 定</el-button>
        <el-button @click="editDlg = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  getSenceLink, fetchJeopardyTopicList, getSenceUser, getSenceTeam, addSenceLick, editSenceLick, editSenceLickDetail, delSence
} from '@/api/match/layered'
import { getStorage } from '@/utils/storage'

export default {
  name: 'UserManagement',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      mode: getStorage('match_info', 'object').mode, // 1个人2组队
      id: this.$route.query.id,
      editDlg: false,
      matchList: [], // 表格数据列表
      topicList: [], // 所有题目列表
      userList: [], // 所有用户列表
      teamList: [], // 所有队伍列表
      ids: [], // 所选择的项
      listTotal: 0,
      listPage: 1,
      listQuery: {
        task_id: '',
        search: '',
        offset: 0,
        limit: this.$store.state.config.row,
        order: 'asc'
      },
      form: {// 新增或编辑时增加的字段
        user_id: '',
        team_id: '',
        event_task_id: '',
        addr: '',
        flag: ''
      },
      item_id: '', // 编辑条目的id
      rules: {
        flag: [
          { required: true, message: '请输入flag', trigger: 'blur' }
        ],
        addr: [
          { required: true, message: '请输入场景地址', trigger: 'blur' }
        ],
        user_id: [
          { required: true, trigger: 'change', message: '请选择用户' }
        ],
        team_id: [
          { required: true, trigger: 'change', message: '请选择队伍' }
        ],
        event_task_id: [
          { required: true, trigger: 'change', message: '请选择题目' }
        ],
        category_id: [
          { type: 'number', required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getTeam()
    this.getUser()
    this.getTask()
  },
  methods: {
    removeSence() {
      delSence({ ids: this.ids }).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    editSence(id) { // 编辑场景信息回显
      editSenceLickDetail(id).then(res => {
        this.item_id = res.data.id
        for (const k in this.form) {
          this.form[k] = res.data[k]
        }
        this.editDlg = true
      })
    },
    close() { // 关闭弹窗
      this.form = {
        user_id: '',
        team_id: '',
        event_task_id: '',
        addr: '',
        flag: ''
      }
      this.item_id = ''
      this.getList()
    },
    onSubmit() {
      if (this.item_id) {
        editSenceLick(this.item_id, this.form).then(res => {
          if (res.data.success) {
            this.editDlg = false
          }
        })
      } else {
        addSenceLick(this.id, this.form).then(res => {
          if (res.data.success) {
            this.editDlg = false
          }
        })
      }
    },
    submitSence() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$message.error('请核验所填写的信息')
          return false
        }
      })
    },
    addSence() { // 展示弹框
      this.getTeam()
      this.getUser()
      this.getTask()
      this.editDlg = true
    },
    indexMethod(index) { // 展示序号的方法
      return (this.listPage - 1) * this.listQuery.limit + index + 1
    },
    getList() {
      this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      getSenceLink(this.id, this.listQuery).then(res => {
        this.matchList = res.data.rows
        this.listTotal = res.data.total
      })
    },
    getTask() {
      const data = {}
      data.event = this.$route.query.id
      fetchJeopardyTopicList(data).then(res => {
        this.topicList = res.data.rows
      })
    },
    getUser() {
      const data = {}
      data.event = this.$route.query.id
      getSenceUser(data).then(res => {
        this.userList = res.data.rows
      })
    },
    getTeam() {
      const data = {}
      data.event = this.$route.query.id
      getSenceTeam(data).then(res => {
        this.teamList = res.data.rows
      })
    },
    checkTable(val) { // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    }

  }
}
</script>

<style scoped>

</style>
