<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.project"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择竞赛"
      >
        <el-option
          v-for="item in matching"
          :key="item.uuid"
          :value="item.uuid"
          :label="item.name"
        />
      </el-select>

      <el-select
        v-model="listQuery.type_method"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择镜像类型"
      >
        <el-option value="docker" label="docker" />
        <el-option value="kvm" label="kvm" />
      </el-select>

      <el-select
        v-model="listQuery.power_state"
        class="filter-item"
        size="mini"
        clearable
        placeholder="请选择实例状态"
      >
        <el-option v-for="(v, k, i) in power" :value="k" :label="v" :key="i" />
      </el-select>

      <el-input
        v-model.trim="listQuery.name"
        placeholder="输入名称"
        style="width: 150px"
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
    </div>

    <div class="filter-container">
      <el-button
        type="danger"
        size="mini"
        @click="control(ids)"
      >资源回收</el-button>
    </div>

    <div class="filter-container">
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

        <el-table-column align="center" prop="name" label="实例名称" />

        <el-table-column align="center" prop="project_name" label="关联竞赛" />

        <el-table-column
          align="center"
          prop="user_name"
          label="关联账户/队伍"
        />

        <el-table-column align="center" prop="os_type" label="操作系统" />

        <el-table-column
          align="center"
          prop="hypervisor_type"
          label="镜像类型"
        />

        <el-table-column align="center" prop="power_state" label="实例状态">
          <template slot-scope="scope">
            {{ power[scope.row.power_state] }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="hostname" label="运行位置" />

        <el-table-column align="center" prop="ip" label="IP地址">
          <template slot-scope="scope">
            {{ scope.row.ports[0].ip }}
          </template>
        </el-table-column>

        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="ccc"-->
        <!--label="创建者"/>-->

        <el-table-column align="center" width="160px" label="操作">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="control">
              <el-button size="mini" type="primary"> 更多菜单 </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="composeValue('start', scope.row)"
                >立即开机</el-dropdown-item
                >
                <el-dropdown-item
                  :command="composeValue('restart', scope.row)"
                >重新启动</el-dropdown-item
                >
                <el-dropdown-item
                  :command="composeValue('shutdown', scope.row)"
                >立即关机</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
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
import { getExample, controlExample, getTasking } from '@/api/systemDevOps'
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
      power: {
        running: '运行',
        shutdown: '关机',
        error: '错误',
        paused: '暂停'
      },
      matching: [], // 进行中的比赛
      matchList: [], // 题目列表
      ids: {
        action: 'delete',
        data: []
      }, // 选择的所有表格的项
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 1,
        limit: this.$store.state.config.row,
        power_state: '', // 状态 运行中'running' 错误'error' 关机'shutdown' 暂停'paused'
        type_method: '', // 'kvm', 'docker'
        name: '',
        project: '' // 比赛hash
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    control(data) {
      // 删除
      if (data.data.length === 0) return
      controlExample(data).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    composeValue(type, row) {
      // 删除
      return {
        action: type,
        data: [{
          uuid: row.uuid,
          project: row.project
        }]
      }
    },

    getList() {
      // this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      getExample(this.listQuery).then((res) => {
        const { data } = res
        this.matchList = data.data
        this.listTotal = data.total
      })
      getTasking().then((res) => {
        this.matching = res.data.data
      })
    },
    checkTable(val) {
      // 选择表格
      this.ids.data = val.map((item) => {
        return {
          uuid: item.uuid,
          project: item.project
        }
      })
    }
  }
}
</script>
