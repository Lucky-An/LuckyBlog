<template>
  <div class="app-container competition_box">
    <div class="container_bg">
      <div class="filter-container">
        <el-button class="filter-item" type="success" size="mini" @click="to_add">新增</el-button>
        <el-button class="filter-item" type="danger" size="mini" @click="removeMatch">删除</el-button>
      </div>

      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        @selection-change="checkTable"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column align="center" prop="name" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ indexMethod(listQuery.offset,listQuery.limit,scope.$index) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="name" label="配置名称"/>

        <el-table-column align="center" prop="os_type" label="备注">
          <template slot-scope="scope">
            <el-button class="filter-item" type="primary" size="mini" @click="show(scope.row.remark)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="editMatch(scope.row.id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页 begin-->
      <pagination
        :total="total"
        :page.sync="listQuery.offset"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>

    <el-dialog
      :visible.sync="isRemark"
      title="备注"
    >
      <div class="filter-container">
        {{ remark }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getConfig, removeConfig } from '@/api/image.js'
import Pagination from '@/components/Pagination'
import { indexMethod } from '@/utils'

export default {
  name: 'List',

  components: { Pagination },

  data() {
    return {
      indexMethod,
      total: 0,
      listQuery: {
        limit: this.$store.state.config.row,
        offset: 1
      },

      remark: '',
      isRemark: false,

      matchList: [],
      ids: [] // 选中的表格id
    }
  },

  created() {
    this.getList()
  },

  methods: {
    show(str) {
      this.remark = str
      this.isRemark = true
    },

    to_add() {
      this.$router.push({
        path: '/image/config/add'
      })
    },
    // 单个删除
    remove(id) {
      this.ids = [id]
      this.removeMatch()
    },

    removeMatch() {
      // 删除赛事
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { ids: this.ids }
        removeConfig(data).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      })
    },

    getList(page) {
      if (page === 1) this.listQuery.offset = page
      getConfig(this.listQuery).then((res) => {
        const data = res.data
        if (data.success) {
          this.matchList = data.row
          this.total = data.total
        }
      })
    },

    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.id
      })
    },

    editMatch(id) {
      // 编辑赛事
      this.$router.push({
        path: '/image/config/edit',
        query: { id: id }
      })
    }
  }
}
</script>
