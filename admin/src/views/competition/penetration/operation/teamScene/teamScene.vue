<template>
  <div class="teamScene_container">
    <el-table ref="TableScene" :data="tableData" border highlight-current-row>
      <el-table-column type="index" label="序号" width="50" align="center"/>
      <el-table-column
        property="name"
        show-overflow-tooltip
        label="选手名称"
        align="center"
      />
      <el-table-column
        property="network_num"
        show-overflow-tooltip
        label="网络"
        align="center"
      />
      <el-table-column show-overflow-tooltip label="虚拟机" align="center">
        <template slot-scope="scope">
          <div
            style="color: #0000ee; text-decoration: underline"
            @click="handlevirtual(scope.row, '虚拟机')"
          >
            <a>{{ scope.row.instance_num }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="虚拟设备" align="center">
        <template slot-scope="scope">
          <!-- <div
            style="cursor: pointer; color: #0000ee; text-decoration: underline"
            @click="handlevirtual(scope.row, '虚拟设备')"
          > -->
          {{ scope.row.virtual_num }}
          <!-- </div> -->
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="实体设备" align="center">
        <template slot-scope="scope">
          <div
            style="cursor: pointer; color: #0000ee; text-decoration: underline"
            @click="handlevirtual(scope.row, '实体设备')"
          >
            {{ scope.row.entity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        property="status"
        show-overflow-tooltip
        label="部署状态"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleRedeploy(scope.row)"
          >重新部署
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--分页 begin-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="params.page"
      :limit.sync="params.per_page"
      @pagination="getList"
    />

    <!-- 弹窗开始 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="80%"
    >
      <div style="margin-bottom: 30px">选手:{{ name }}</div>
      <!-- 虚拟机开始 -->
      <el-table
        v-if="instance.length"
        ref="instanceTable"
        :data="instance"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" width="50" label="序号"/>
        <el-table-column property="task_name" align="center" label="题目名称"/>
        <el-table-column
          property="instance_name"
          label="实例名称"
          align="center"
        />
        <el-table-column
          property="ip_vlan[0][0]"
          label="题目IP"
          align="center"
        />
        <el-table-column
          property="ip_vlan[0][1]"
          label="题目vlan"
          align="center"
        />
        <el-table-column label="题目环境状态" align="center">
          <template slot-scope="scope">
            {{
              scope.row.power_state === 4
                ? "运行中"
                : scope.row.power_state === 5
                  ? "停止"
                  : "异常"
            }}
          </template>
        </el-table-column>
        <el-table-column label="Flag查看" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="lookOverFlag(scope.row.task_uuid)"
            >查看
            </el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="远程监控" align="center">
          <template slot-scope="scope">
            <a
              v-if="scope.row.access_url"
              :href="scope.row.access_url"
              target="_blank"
            >
              <el-button type="primary" size="mini">登录</el-button>
            </a>
            <a v-else>
              <el-button
                type="primary"
                size="mini"
                @click="messageError"
              >登录
              </el-button
              >
            </a>
          </template>
        </el-table-column>
        <el-table-column label="实例控制" align="center" width="220">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="
                lnstanceControl(scope.row.instance_uuid, scope.row.task_uuid, 0)
              "
            >开机
            </el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="
                lnstanceControl(scope.row.instance_uuid, scope.row.task_uuid, 1)
              "
            >关机
            </el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="
                lnstanceControl(scope.row.instance_uuid, scope.row.task_uuid, 2)
              "
            >重置
            </el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="测试操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="mini"
              @click="pushFlag(scope.row)"
            >pushflag
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 虚拟机结束 -->
      <!-- 虚拟设备开始 -->
      <el-table
        v-if="routerList.length"
        ref="routersTable"
        :data="routerList"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="50"/>
        <el-table-column
          property="router_name"
          label="设备名称"
          align="center"
        />
        <el-table-column
          property="instance_name"
          label="实例名称"
          align="center"
        />
        <el-table-column label="题目环境状态" align="center">
          <template slot-scope="scope">
            {{
              scope.row.power_state === 4
                ? "运行中"
                : scope.row.power_state === 5
                  ? "停止"
                  : "异常"
            }}
          </template>
        </el-table-column>
        <el-table-column label="远程管理" align="center">
          <template slot-scope="scope">
            <a
              v-if="scope.row.access_url"
              :href="scope.row.access_url"
              target="_blank"
            >
              <el-button type="primary" size="mini">登录</el-button>
            </a>
            <a v-else>
              <el-button
                type="primary"
                size="mini"
                @click="messageError"
              >登录
              </el-button
              >
            </a>
          </template>
        </el-table-column>
        <el-table-column label="实例控制" align="center" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="virtualInstanceControl(scope.row.instance_uuid, 0)"
            >开启
            </el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="virtualInstanceControl(scope.row.instance_uuid, 2)"
            >重置
            </el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="virtualInstanceControl(scope.row.instance_uuid, 1)"
            >关闭
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 虚拟设备结束 -->
      <!-- 实例设备开始 -->
      <el-table
        v-if="physical.length"
        ref="physicalTable"
        :data="physical"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50" align="center"/>
        <el-table-column
          label="题目名称"
          prop="challenge_title"
          align="center"
        />
        <el-table-column label="设备序号" prop="number" align="center"/>
        <el-table-column label="VLAN" prop="vlan" align="center"/>
        <el-table-column label="IP" prop="ip" align="center"/>
        <el-table-column label="MAC" prop="mac" align="center"/>
      </el-table>
      <!-- 实例设备结束 -->
      <!-- <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span> -->
    </el-dialog>
    <!-- 弹窗结束 -->
    <el-dialog
      :visible.sync="viewFlag"
      :before-close="handleFlagClose"
      title="查看题目Flag"
      width="30%"
    >
      <!-- <div>
        题目名称:{{viewFlagData.title}}
      </div> -->
      <div
        v-for="(item, index) in flagList.static"
        :key="index"
        style="margin-left: 30px"
      >
        <span>静态Flag{{ index + 1 }}:</span
        ><span style="margin-left: 50px">{{ item }}</span>
      </div>
      <br>
      <div
        v-for="(item, index) in flagList.dynamic"
        :key="index + 1"
        style="margin-left: 30px"
      >
        <span>动态Flag{{ index + 1 }}:</span
        ><span style="margin-left: 50px">{{ item }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          size="mini"
          @click="handleFlagClose"
        >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  httpGetSceneMonitor,
  httpPostSceneMonitor,
  httpGetInstanceMonitor,
  httpGetVirtualMonitor,
  httpGetEntityMonitor,
  httpGetCatFlag, // 虚拟机管理——查看flag
  httpPostInstanceMonitor, // 虚拟机管理_实例控制
  httpPostVirtualMonitor, // 虚拟设备管理_实例控制
  httpPostPushSingleFlag // push flag
} from '@/api/match/penetration'
import Pagination from '@/components/Pagination'

export default {
  name: 'TeamScene',
  components: { Pagination },
  data() {
    return {
      query: {
        // 请求各种列表携带的参数
        event_id: this.$route.query.id,
        team_id: '',
        user_id: ''
      },
      params: {
        event_id: this.$route.query.id,
        page: 1,
        per_page: this.$store.state.config.row
      },
      total: 0,
      tableData: [],
      dialogVisible: false, //! 弹窗状态
      name: '', //! 队伍名
      title: '',
      instance: [], // 虚拟机列表数据
      routerList: [], // 虚拟设备router列表数据
      firewall: [], // 虚拟设备firewall列表数据
      physical: [], // 实体设备列表数据
      flagList: [], // 查看flag时的列表
      viewFlag: false,
      pushFlagData: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      httpGetSceneMonitor(this.params).then((res) => {
        this.tableData = res.data.rows
        this.total = res.data.total
      })
    },
    messageError() {
      this.$message.error('题目环境异常或正在启动中，无法登录，请稍后再试')
    },
    handleFlagClose() {
      this.flagList = []
      this.viewFlag = false
    },
    pushFlag(row) {
      httpPostPushSingleFlag(
        { event_id: this.$route.query.id },
        {
          user_id: this.pushFlagData.user_id,
          team_id: this.pushFlagData.team_id,
          challenge_id: row.task_uuid
        }
      ).then((res) => {
        if (res.data.success) {
          this.$message.success(res.data.message_zh)
        }
      })
    },
    //! 虚拟机管理      实例控制
    lnstanceControl(uuid, task_uuid, action) {
      httpPostInstanceMonitor(
        {
          event_id: this.$route.query.id
        },
        { uuid, task_uuid, action }
      ).then((res) => {
        if (res.data.success) {
          this.$message.success('操作成功')
          httpGetInstanceMonitor(this.query).then((res) => {
            this.instance = res.data.instance
          })
        }
      })
    },
    //! 虚拟设备管理      实例控制
    virtualInstanceControl(uuid, action) {
      httpPostVirtualMonitor(
        {
          event_id: this.$route.query.id
        },
        { uuid, action }
      ).then((res) => {
      })
    },
    // ! 查看flag方法
    lookOverFlag(task_uuid) {
      httpGetCatFlag({
        event_id: this.$route.query.id,
        task_uuid: task_uuid,
        player_id: this.pushFlagData.team_id
      }).then((res) => {
        this.flagList = res.data
        this.viewFlag = true
      })
    },
    //! 重新部署
    handleRedeploy(row) {
      const query = { event_id: this.$route.query.id }
      const myData = {
        team_id: row.team_id,
        user_id: row.user_id
      }
      httpPostSceneMonitor(query, myData).then(({ data }) => {
        if (data.success) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
      })
    },
    // ! 点击虚拟机、虚拟设备、实体设备数字触发事件
    handlevirtual(row, sign) {
      this.pushFlagData = { team_id: row.team_id, user_id: row.user_id }
      this.dialogVisible = true
      this.name = row.name
      this.query = {
        event_id: this.$route.query.id,
        team_id: row.team_id,
        user_id: row.user_id
      }
      // httpGetInstanceMonitor,
      // httpGetVirtualMonitor,
      // httpGetEntityMonitor,
      if (sign === '虚拟机') {
        this.title = '虚拟机管理'
        httpGetInstanceMonitor(this.query).then((res) => {
          this.instance = res.data.instance
        })
      } else if (sign === '虚拟设备') {
        this.title = '虚拟设备管理'
        httpGetVirtualMonitor(this.query).then((res) => {
          this.routerList = res.data.router
          this.firewall = res.data.firewall
        })
      } else {
        // 实体设备
        this.title = '实体设备管理'
        httpGetEntityMonitor(this.query).then(({ data }) => {
          if (data.success) {
            this.physical = data.data
          }
        })
      }
    },
    //! 弹窗关闭事件
    handleClose() {
      this.instance = []
      this.routerList = []
      this.firewall = []
      this.physical = []
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scope>
  .teamScene_container {
    margin: 30px 0;

    /deep/ .el-table {
      left: 50%;
      transform: translate(-50%, 0);
    }
  }

  .el-dialog__footer {
    text-align: center;
  }
</style>
