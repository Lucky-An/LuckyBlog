<template>
  <div class="app-container competition_box">
    <div class="container_bg">
      <div class="filter-container">
        <el-input
          v-model.trim="listQuery.file_alias"
          placeholder="请输入镜像名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="getList"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"

          @click="getList"
        >搜索</el-button>
      </div>
      <!--赛事增删改查 begin-->
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" @click="to_add">新增</el-button>
      </div>

      <!--表格 begin-->
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :key="tableKey"
        :data="matchList"
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="checkTable"
      >
        <el-table-column align="center" width="70px" prop="name" label="序号">
          <template slot-scope="scope">
            <span>{{ indexMethod(listQuery.page,listQuery.per_page,scope.$index) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="file_alias" label="镜像名称" />
        <el-table-column align="center" prop="username" label="创建人" />
        <el-table-column align="center" width="250" prop="original_file" label="原文件" />
        <el-table-column align="center" prop="original_format" label="原格式" />
        <el-table-column align="center" prop="change_format" label="转换后格式" />
        <el-table-column align="center" prop="change_file" label="转换后文件">
          <template slot-scope="scope">
            <a
              v-if="scope.row.change_file"
              :href="downloadFormat+scope.row.id"
              class="fang_button_link"
              download
            >下载</a>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <div>{{ scope.row.status }}</div>
            <span
              v-if="scope.row.status=='转换成功'&&scope.row.change_format=='qcow2'"
              class="fang_button_link"
              @click="importImage(scope.row.id)"
            >导入镜像库</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="130">
          <template slot-scope="scope">
            <span
              v-if="scope.row.status=='上传成功'||scope.row.status=='转换失败'"
              class="fang_button_link"
              style="margin-right:15px;display:inline-block;"
              @click="transform(scope.row.id)"
            >转换</span>
            <span
              class="fang_button_link"
              style="margin-right:15px;display:inline-block;"
              @click="editMatch(scope.row.id)"
            >编辑</span>
            <span class="fang_button_link" @click="removeMatch(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页 begin-->
      <pagination
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.per_page"
        @pagination="getList"
      />
      <el-dialog v-el-drag-dialog :visible.sync="infoVisible" title="设备描述" width="30%">
        <span>{{ itemDescribe }}</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  formatList,
  deleteFormat,
  // publicJeopardyMatch,
  // fetchJeopardyInfo,
  transformFormat
} from '@/api/match/property'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { indexMethod } from '@/utils'
import elDragDialog from '@/directive/el-dragDialog'

const matchStatus = [
  { key: '', display_name: '全部' },
  { key: 1, display_name: '使用中' },
  { key: 0, display_name: '空闲' }
]

export default {
  name: 'IndexVue',
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      downloadFormat: '/api/v1/admin/resource/images_format/download/',
      changeItemId: '', // 当前编辑设备类别的id
      typeData: {
        flow_controller: '流控设备',
        switch: '交换机',
        router: '路由器',
        firewall: '防火墙',
        log_server: '流控设备'
      },
      propertyTypeVisible: false,
      infoVisible: false,
      indexMethod,
      radio: '1',
      dialogVisible: false,
      id: this.$route.id, // 竞赛id
      tableKey: 0,
      pager: {
        // 页码
        currentPage: 1, // 当前第几页
        pageSize: this.$store.state.config.row, // 每页多少条
        total: 0, // 总共多少条
        layout: 'prev, pager, next',
        class: 'bluepage'
      },
      total: 0,
      listLoading: false,
      page: 1,
      matchStatus,
      listQuery: {
        order: 'asc',
        per_page: this.$store.state.config.row,
        page: 1,
        file_alias: '',
        total: 0
      },
      itemDescribe: '测试描述',
      matchList: [],
      ids: [] // 选中的表格id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    importImage(id) {
      this.$router.push({
        path: '/image/virtual/create',
        query: {
          origin_id: id
        }
      })
    },
    transform(id) {
      // 转换
      const newForm = new FormData()
      newForm.append('id', id)
      transformFormat(newForm)
        .then(res => {
          if (res.data.success) {
            this.$message.success('开始转换')
            this.getList()
          }
        })
        .catch(() => {})
    },
    to_add() {
      this.$router.push({
        path: '/image/imageFormat/create'
      })
    },
    removeMatch(id) {
      // 删除赛事
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteFormat(id).then(res => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {})
    },
    getList() {
      // 获取表格
      formatList(this.listQuery).then(res => {
        this.matchList = res.data.data
        this.listQuery.total = res.data.total
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map(item => {
        return item.uuid
      })
    },
    editMatch(id) {
      // 编辑赛事
      this.$router.push({
        path: '/image/imageFormat/edit',
        query: { id: id }
      })
    }
  }
}
</script>

<style scoped>
</style>
