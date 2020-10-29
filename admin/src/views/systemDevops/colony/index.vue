<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="title">
        <span> 集群运行状况 </span>
        <span class="fr">
          <el-button
            type="danger"
            size="mini"
            @click="control('power_off')"
          >关机</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="control('restart')"
          >重启</el-button
          >
        </span>
      </div>

      <!--表格 begin-->
      <el-table :data="matchList" border @selection-change="checkTable">
        <el-table-column align="center" type="selection" />
        <el-table-column align="center" prop="name" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{
              indexMethod(listQuery.offset, listQuery.limit, scope.$index)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="hostname" label="节点名称" />
        <el-table-column align="center" prop="ip" label="节点IP" />
        <el-table-column align="center" prop="role" label="角色">
          <template slot-scope="scope"> 从节点 </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="服务状态" />
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="status"-->
        <!--label="管理状态">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-if="scope.row.status==0">正常</span>-->
        <!--<span v-if="scope.row.status!==0">异常</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="vcpus_used" label="cpu">
          <template slot-scope="scope">
            {{ scope.row.vcpus }}核 |
            {{ scope.row.vcpus_used }}
          </template>
        </el-table-column>
        <el-table-column prop="memory_rate" align="center" label="内存">
          <template slot-scope="scope">
            {{ scope.row.memory }} |
            {{ scope.row.memory_used }}
          </template>
        </el-table-column>
        <el-table-column prop="disk_rate" align="center" label="硬盘">
          <template slot-scope="scope">
            {{ scope.row.disk }} |
            {{ scope.row.disk_used }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="listTotal > 0"
      :total="listTotal"
      :page.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import clipboard from '@/directive/clipboard/index.js'
import { getColony, controlColony } from '@/api/systemDevOps'
import { indexMethod } from '@/utils'

export default {
  name: 'Config',
  directives: { waves, clipboard },
  components: {
    Pagination
  },
  data() {
    return {
      indexMethod,
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 1,
        limit: this.$store.state.config.row
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getColony(this.listQuery).then((res) => {
        const { data } = res
        this.matchList = data.resources
      })
    },
    control(action) {
      this.ids.forEach((item) => {
        const data = {
          action,
          hostname: item
        }
        controlColony(data).then((res) => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.hostname
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
