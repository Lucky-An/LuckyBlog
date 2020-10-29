<template>
  <div class="app-container competition_box">
    <!--表格搜索 begin-->
    <div class="filter-container">
      <el-select
        v-model="listQuery.server_id"
        placeholder="请选择VPN服务器"
        class="filter-item"
        clearable
        size="mini"
      >
        <el-option
          v-for="(val, k) in server"
          :key="k"
          :label="val.server_name"
          :value="val.id"
        />
      </el-select>

      <el-select
        v-model="listQuery.status_param"
        placeholder="请选择用户拨入状态"
        class="filter-item"
        clearable
        size="mini"
      >
        <el-option :value="1" label="在线" />
        <el-option :value="2" label="离线" />
      </el-select>

      <el-input
        v-model.trim="listQuery.name_param"
        placeholder="请输入账户名"
        style="width: 200px"
        class="filter-item"
        size="mini"
      />

      <el-button
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList(1)"
      >搜索</el-button
      >

      <el-button
        class="filter-item"
        type="primary"
        size="mini"
        @click="getList"
      >刷新</el-button
      >

      <div class="fr">
        <a
          v-if="listQuery.server_id != ''"
          :href="`/api/v1/common/admin/vpn/${id}/vpn_log/${listQuery.server_id}/download`"
          download
          class="filter-item"
        >
          <el-button type="warning" size="mini">VPN日志下载</el-button>
        </a>

        <!--<el-button class="filter-item" type="danger" size="mini" @click="removeMatch">重置所有密钥</el-button>-->
        <el-button
          class="filter-item"
          type="warning"
          size="mini"
          @click="showVpnServers"
        >VPN服务器管理</el-button
        >
      </div>
    </div>

    <!--表格 begin-->
    <el-table ref="multipleTable" :data="matchList" border>
      <el-table-column
        :index="indexMethod"
        align="center"
        width="50px"
        label="序号"
        type="index"
      />

      <el-table-column align="center" prop="user_name" label="账户名" />

      <el-table-column
        align="center"
        prop="vpn_server_name"
        label="VPN服务器"
      />

      <el-table-column align="center" prop="user_status" label="拨入状态">
        <template slot-scope="scope">
          {{ scope.row.user_status === 1 ? "在线" : "离线" }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="证书申请状态">
        <template slot-scope="scope">
          {{ scope.row.ca_apply_status === 1 ? "成功" : "失败" }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="virtual_address" label="虚拟地址" />

      <el-table-column align="center" prop="entry_time" label="接入时间" />

      <el-table-column label="密钥管理" align="center" width="200px">
        <template slot-scope="scope">
          <a
            :href="`/api/v1/common/admin/vpn/${id}/vpn_ca/${scope.row.user_id}/download`"
            download
          >
            <el-button size="mini" type="warning">下载 </el-button>
          </a>

          <!--<el-button size="mini" type="danger" @click="operation(scope.row)">重置密钥-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />

    <el-dialog
      :visible.sync="dialogTableVisible"
      title="VPN 服务器管理"
      width="1200px"
      @close="handleClose(...arguments, 'servers')"
    >
      <el-table v-loading="dialogTableLoading" :data="gridData" border>
        <el-table-column type="index" width="50" label="序号" align="center"/>
        <el-table-column
          property="vpn_server_name"
          label="VPN 服务器"
          align="center"
        />
        <el-table-column
          property="monitor_port"
          label="映射端口"
          align="center"
          width="120"
        />
        <el-table-column
          property="external_access"
          label="外部访问IP/域名"
          align="center"
        />
        <el-table-column label="网络信息" align="center" width="200">
          <template slot-scope="scope">
            <div
              v-for="(val, key) in scope.row.network"
              :key="key"
              style="text-align: left"
            >
              <span>{{ `${key}: ${val}` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="相关流表信息" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="showFlowTable(scope.row)"
            >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          property="status"
          label="状态"
          align="center"
          width="120"
        />
        <el-table-column label="重置管理" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click="handleReset(scope.row)"
            >重置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogFlowsVisible"
      title="相关流表信息"
      width="800px"
      @close="handleClose(...arguments, 'flows')"
    >
      <el-table v-loading="dialogFlowsLoading" :data="flowsData" border>
        <el-table-column type="index" width="50" label="序号" align="center"/>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getServer,
  getVpnUser,
  getVpnServers,
  resetVpnServer
} from '@/api/match/vpn'
import Pagination from '@/components/Pagination'

export default {
  name: 'IndexVue',
  components: { Pagination },
  data() {
    return {
      id: this.$route.query.id, // 竞赛id

      server: [], // 全部server
      total: 0,
      listQuery: {
        server_id: '', // server
        name_param: '', // 账户名
        per_page: this.$store.state.config.row,
        status_param: '', // 用户拨入状态
        page: 1
      },
      matchList: [],
      ids: [], // 选中的表格id
      log: '', // 日志下载路径
      dialogTableVisible: false,
      gridData: [],
      dialogTableLoading: false,
      dialogFlowsVisible: false,
      flowsData: [],
      dialogFlowsLoading: false
    }
  },
  created() {
    this.getServer()
    this.getList()
  },
  methods: {
    getServer() {
      getServer(this.id).then((res) => {
        this.server = res.data.data
      })
    },

    getList(page) {
      // 获取表格
      if (page === 1) this.listQuery.offset = page

      getVpnUser(this.id, this.listQuery).then((res) => {
        this.matchList = res.data.data
        this.total = res.data.total || this.total
        this.log = res.data.log_path
      })
    },

    operation(obj) {
      // 竞赛运维
    },
    indexMethod(index) {
      // 展示序号的方法
      return (this.listQuery.page - 1) * this.listQuery.per_page + index + 1
    },

    handleClose(type) {
      if (type === 'servers') {
        this.gridData = []
        this.dialogTableLoading = false
      } else if (type === 'servers') {
        this.flowsData = []
      }
    },

    showVpnServers() {
      this.dialogTableVisible = true
      this.handleGetVpnServers()
    },

    handleGetVpnServers(noLoading) {
      if (!noLoading) this.dialogTableLoading = true
      return getVpnServers(this.id).then(({ data }) => {
        if (data.success) {
          this.gridData = data.data
          if (!noLoading) this.dialogTableLoading = false
        }
      })
    },

    showFlowTable({ uuid }) {
      this.dialogFlowsVisible = true
      this.dialogFlowsLoading = true
      this.handleGetVpnServers(true).then(() => {
        this.flowsData = this.gridData.find((el) => {
          return el.uuid === uuid
        }).flows
        this.dialogFlowsLoading = false
      })
    },

    handleReset({ uuid }) {
      resetVpnServer(this.id, uuid).then(({ data }) => {
        if (data.success) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.handleGetVpnServers()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
