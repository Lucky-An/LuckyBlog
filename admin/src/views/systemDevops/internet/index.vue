<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select v-model="listQuery.net_type" class="filter-item" size="mini" placeholder="全部状态" @change="getList">-->
      <!--<el-option label="容器网络" :value="1"/>-->
      <!--<el-option label="实例网络" :value="0"/>-->
      <!--</el-select>-->
      <el-input
        v-model.trim="listQuery.name"
        placeholder="请输入名称"
        style="width: 150px;"
        size="mini"
        class="filter-item"/>
      <el-input
        v-model.trim="listQuery.subnet"
        placeholder="请输入网段"
        style="width: 150px;"
        size="mini"
        class="filter-item"/>
      <el-input
        v-model.trim="listQuery.physical_name"
        placeholder="请输入物理主机"
        style="width: 150px;"
        size="mini"
        class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList">搜索
      </el-button>
      <el-button v-waves class="filter-item" type="danger" size="mini" @click="remove">删除全部网络
      </el-button>
    </div>

    <div class="filter-container">
      <!--<el-button type="danger" size="mini" @click="">删除</el-button>-->
      <!--<el-button type="danger" size="mini" @click="removeSub">强制关机</el-button>-->
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        v-show="listQuery.net_type==1"
        :data="tableData"
        border>
        <el-table-column
          align="center"
          prop="name"
          label="名称"/>
        <el-table-column
          align="center"
          prop="subnet"
          label="网段"/>
        <el-table-column
          align="center"
          prop="gateway"
          label="网关"/>
        <el-table-column
          align="center"
          prop="physical_name"
          label="物理机名称"/>
        <el-table-column
          align="center"
          prop="status"
          label="是否有容器">
          <template slot-scope="scope">
            {{ scope.row.containers==1?'有':'无' }}
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-show="listQuery.net_type!=1"
        :data="tableData"
        border>
        <el-table-column
          align="center"
          prop="name"
          label="名称"/>
        <el-table-column
          align="center"
          prop="subnet"
          label="网段"/>
        <el-table-column
          align="center"
          prop="physical_name"
          label="物理机名称"/>
        <el-table-column
          align="center"
          prop="status"
          label="是否有容器">
          <template slot-scope="scope">
            {{ scope.row.instances==1?'有':'无' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import { internetList, removeInetner } from '@/api/systemDevOps'

export default {
  name: 'Config',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [], // 所有网络
      listQuery: {
        net_type: 1, // net_type 1容器  2实例
        physical_name: '', // 物理机名称
        name: '', // 名称
        subnet: '' // 网段
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      internetList(this.listQuery).then(res => {
        const { data } = res
        if (data.success !== false) {
          this.tableData = data
        } else {
          this.tableData = []
        }
      })
    },
    remove() { // 删除
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeInetner().then(res => {
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
