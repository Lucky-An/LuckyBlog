<template>
  <div class="app-container">
    <div class="container_bg">
      <!--赛事增删改查 begin-->
      <div class="filter-container">
        <el-button type="success" size="mini" @click="to_add">新增</el-button>
        <el-button type="danger" size="mini" @click="removeMatch">删除</el-button>
      </div>

      <!--表格 begin-->
      <el-table
        ref="multipleTable"
        :key="tableKey"
        :data="matchList"
        border
        @selection-change="checkTable"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column align="center" prop="name" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ indexMethod(listQuery.page,listQuery.per_page,scope.$index) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="vcpus" label="核数" />
        <el-table-column align="center" prop="disk" label="硬盘（GB）" />
        <el-table-column align="center" prop="memory" label="内存（MB）" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="editMatch(scope.row.uuid)">编辑</el-button>
            <!--<el-button type="danger" size="mini" @click="removeMatch([scope.row.uuid])">删除</el-button>-->
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
      <el-dialog :visible.sync="infoVisible" title="设备描述" width="30%">
        <span>{{ itemDescribe }}</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  flavorsList,
  deleteFlavors
} from '@/api/systemManage'
import Pagination from '@/components/Pagination'
import { indexMethod } from '@/utils'

const matchStatus = [
  { key: '', display_name: '全部' },
  { key: 1, display_name: '使用中' },
  { key: 0, display_name: '空闲' }
]

export default {
  name: 'IndexVue',
  components: { Pagination },
  data() {
    return {
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
    to_add() {
      this.$router.push({
        path: '/systemManage/example/create'
      })
    },
    removeMatch(data) {
      const params = {}
      // 如果data有长度，那么是单个删除，没有长度说明是vue事件默认参数，所以是多个删除
      if (data.length === 1) {
        params.ids = data
      } else {
        params.ids = this.ids
      }

      if (params.ids.length <= 0) {
        return
      }
      // 删除赛事
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFlavors(params).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() {
      // 获取表格
      flavorsList(this.listQuery).then(res => {
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
    goType() {
      this.propertyTypeVisible = true
    },
    editMatch(id) {
      // 编辑赛事
      this.$router.push({
        path: '/systemManage/example/edit',
        query: { id: id }
      })
    }
  }
}
</script>

<style scoped>
</style>
