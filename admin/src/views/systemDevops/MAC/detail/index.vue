<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-item">
        {{ name }}
      </span>
      <el-input
        v-model.trim="listQuery.mac"
        placeholder="请输入MAC"
        style="width: 200px"
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

      <el-button
        class="fr"
        type="warning"
        size="mini"
        @click="goBack"
      >返回</el-button
      >
    </div>

    <div class="filter-container">
      <el-button type="danger" size="mini" @click="removeAll">删除</el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table :data="matchList" border @selection-change="checkTable">
        <el-table-column align="center" type="selection" />

        <el-table-column label="序号" type="index" align="center" width="50" />

        <el-table-column align="center" prop="user_name" label="选手名称" />
        <el-table-column align="center" prop="ip" label="已录入MAC">
          <template slot-scope="scope">
            <div v-for="item in scope.row.mac" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="vlan" label="关联Vlan" />
        <el-table-column align="center" prop="ip" label="关联IP地址" />

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click="remove(scope.row.record_id)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { macDetail, removeMac } from '@/api/systemDevOps'

export default {
  name: 'Config',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      id: this.$route.query.id,
      name: this.$route.query.name,
      matchList: [], // 题目列表
      record_ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        page: 0,
        per_page: this.$store.state.config.row,
        mac: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      macDetail(this.id, this.listQuery).then((res) => {
        const { data } = res
        this.matchList = data.data
        this.listTotal = data.total
      })
    },
    // 删除
    removeAll(id) {
      let record_ids = []
      if (typeof id === 'string') {
        record_ids = [id]
      } else {
        if (this.record_ids.length === 0) return
        record_ids = this.record_ids
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeMac(this.id, { record_ids }).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      })
    },
    // 删除
    remove(id) {
      this.record_ids = [id]
      this.removeAll()
    },
    // 返回
    goBack() {
      history.back()
    },
    checkTable(val) {
      // 选择表格
      this.record_ids = val.map((item) => {
        return item.record_id
      })
    }
  }
}
</script>

<style scoped>
.title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border: 1px solid #ebeef5;
  padding: 0 20px;
  position: relative;
  top: 5px;
}
</style>
