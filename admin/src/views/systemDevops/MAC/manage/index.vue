<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" class="filter-item" clearable size="mini" placeholder="请选择竞赛类型">
        <el-option v-for="(val,k) in type" :key="k" :value="k" :label="val"/>
      </el-select>

      <el-input
        v-model.trim="listQuery.name"
        placeholder="请输入竞赛名称"
        style="width: 200px;"
        size="mini"
        class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList(1)">搜索
      </el-button>
    </div>

    <div class="filter-container">
      <!--表格 begin-->
      <el-table
        :data="matchList"
        border
        @selection-change="checkTable">
        <el-table-column
          :index="(listQuery.page - 1) * listQuery.per_page + 1"
          label="序号"
          type="index"
          align="center"
          width="50"/>
        <el-table-column
          align="center"
          prop="event_name"
          label="竞赛名称"/>

        <el-table-column
          align="center"
          width="250px"
          label="竞赛类型">
          <template slot-scope="scope">
            {{ type[scope.row.identity_type] }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="300"
          label="操作">
          <template slot-scope="scope">
            <router-link
              :to="{
                path:'/systemDevOps/macDetail',
                query:{
                  name:scope.row.event_name,
                  id:scope.row.event_id
                }
            }">
              <el-button
                type="primary"
                size="mini"
              >详情管理</el-button>
            </router-link>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.per_page"
      @pagination="getList"/>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { vpnOrMacLIst } from '@/api/systemDevOps'

export default {
  name: 'Config',
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      type: {
        1: '攻防赛',
        2: '新攻防',
        3: '运维赛',
        4: '解题赛',
        6: 'RW',
        7: '理论赛',
        8: '渗透赛'
      },
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        page: 1,
        per_page: this.$store.state.config.row,
        type: '',
        management_type: 'mac',
        name: '' // 关键字
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(page) {
      if (page === 1) this.listQuery.page = page

      vpnOrMacLIst(this.listQuery).then(res => {
        const { data } = res
        this.matchList = data.data
        this.listTotal = data.total
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
  .title{
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: 1px solid #EBEEF5;
    padding: 0 20px;
    position: relative;
    top: 5px;
  }
</style>
