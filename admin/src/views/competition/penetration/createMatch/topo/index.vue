<template>
  <div class="topo_container">
    <div class="topo_box">
      <dragTopo
        v-if="showDrag"
        ref="dragTopo"
        :show_bar="true"
        :scene_type="scene_type"
        :container="container"
        :bar_list="bar_list"
        @handleNet="handleNet"
        @handleTask="handleTask"
        @handleDrag="handleDrag"
        @handleRemove="handleRemove"
      />
    </div>
    <div class="btn_box topicStep_box">
      <el-button type="primary" @click="backStep">上一步</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>

    <el-dialog
      :visible.sync="isCurrent"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="选择题目"
      width="670px"
      @close="closeNode"
    >
      <div class="filter-container">
        <el-select
          v-model="listQuery.label"
          class="filter-item"
          size="mini"
          placeholder="请选择题目标签"
          clearable
        >
          <el-option
            v-for="(item, ind) in subType"
            :key="ind"
            :label="item.cn_name"
            :value="item.id"
          />
        </el-select>

        <el-select
          v-model="listQuery.server_type"
          class="filter-item"
          size="mini"
          placeholder="请选择题目属性"
          clearable
        >
          <el-option :value="1" label="跳板机"/>
          <el-option :value="0" label="非跳板机"/>
        </el-select>

        <el-input
          v-model="listQuery.title"
          placeholder="请输入题目名称"
          style="width: 150px"
          size="mini"
          class="filter-item"
        />
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          @click="getTask($event, 1)"
        >搜索
        </el-button>
      </div>

      <el-table
        ref="multipleTable"
        :data="taskList"
        border
        @selection-change="checkTable"
      >
        <el-table-column align="center" type="selection"/>
        <el-table-column
          :index="(listQuery.offset - 1) * listQuery.limit + 1"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column align="center" prop="title" label="题目名称"/>
        <el-table-column
          align="center"
          prop="challenge_type_name"
          label="题目类型"
        />
        <el-table-column align="center" prop="label_name" label="题目标签"/>
        <el-table-column align="center" prop="server_type" label="题目属性">
          <template slot-scope="scope">
            <span>{{ scope.row.server_type ? "跳板机" : "非跳板机" }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="isUse" label="是否使用"/>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.offset"
        :limit.sync="listQuery.limit"
        @pagination="getTask"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNode">确 定</el-button>
        <el-button @click="isCurrent = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isTask" title="题目信息">
      <el-form :model="currentNode" label-width="150px">
        <el-form-item label="题目名称">
          <el-input v-model="currentNode.name" disabled/>
        </el-form-item>
        <el-form-item label="网络地址"> DHCP</el-form-item>
        <el-form-item label="子网掩码">
          <el-input v-model="currentNode.mask" disabled/>
        </el-form-item>
        <el-form-item label="网关">
          <el-input v-model="currentNode.gateway" disabled/>
        </el-form-item>
        <!--<el-form-item label="地址获取">-->
        <!--DHCP-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isTask = false">确 定</el-button>
        <el-button @click="isTask = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isNet" title="网络信息">
      <el-form
        ref="ruleForm"
        :model="currentNet"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="网络名称" prop="name">
          <el-input v-model="currentNet.name"/>
        </el-form-item>
        <el-form-item label="设备类型"> 网络</el-form-item>
        <el-form-item label="起始IP" prop="first_ip">
          <el-input v-model="currentNet.first_ip" disabled/>
        </el-form-item>
        <el-form-item label="截止IP" prop="last_ip">
          <el-input v-model="currentNet.last_ip" disabled/>
        </el-form-item>
        <el-form-item label="子网掩码">
          <el-input v-model="currentNet.mask" disabled/>
        </el-form-item>
        <el-form-item label="网关" prop="gateway">
          <el-input v-model="currentNet.gateway" disabled @input="changeGateway"/>
        </el-form-item>
        <el-form-item label="地址获取"> DHCP</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNet">确 定</el-button>
        <el-button @click="isNet = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dragTopo from '@/components/dragTopo'
import {
  getTopo,
  editTopo,
  getTask,
  getTeamEntity
} from '@/api/match/penetration.js'
import { fetchTags } from '@/api/itemBank/common.js'
import { checkSameNetMask, ip2int } from '@/utils/common'
import Pagination from '@/components/Pagination'

export default {
  name: 'Index',
  components: {
    dragTopo,
    Pagination
  },
  data() {
    const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

    const first_ip = (rule, value, callback) => {
      if (!value) {
        callback(new Error('起始IP不能为空'))
      } else {
        for (const k in this.container) {
          const oldf = this.container[k].network[0].first_ip
          const oldl = this.container[k].network[0].last_ip
          if (k !== this.currentNet.key) {
            const isHas =
                ip2int(value) >= ip2int(oldf) && ip2int(value) <= ip2int(oldl)
            if (isHas) {
              callback(new Error(`输入的ip地址区间已被占用`))
              return
            }
          }
        }

        if (!ipReg.test(value)) {
          callback(new Error('IP地址不正确'))
        } else if (ip2int(value) > ip2int(this.currentNet.last_ip)) {
          callback(new Error('起始IP需要小于截止IP'))
        } else {
          callback()
          this.$refs.ruleForm.validateField('last_ip')
          this.currentNet.first_ip = value
        }
      }
    }

    const last_ip = (rule, value, callback) => {
      if (!value) {
        callback(new Error('截止IP不能为空'))
      } else {
        for (const k in this.container) {
          const oldf = this.container[k].network[0].first_ip
          const oldl = this.container[k].network[0].last_ip
          if (k !== this.currentNet.key) {
            const isHas =
                ip2int(value) >= ip2int(oldf) && ip2int(value) <= ip2int(oldl)
            if (isHas) {
              callback(new Error(`输入的IP地址区间已被占用`))
              return
            }
          }
        }

        if (!ipReg.test(value)) {
          callback(new Error('IP地址不正确'))
        } else if (
          !checkSameNetMask(
            this.currentNet.first_ip,
            value,
            this.currentNet.mask
          )
        ) {
          callback(new Error('起始IP网段与截止IP网段不一致。'))
        } else if (ip2int(this.currentNet.first_ip) > ip2int(value)) {
          callback(new Error('起始IP需要小于截止IP'))
        } else {
          callback()
          this.currentNet.last_ip = value
        }
      }
    }

    const gateway = (rule, value, callback) => {
      if (!value) {
        callback(new Error('网关不能为空'))
      } else {
        if (!ipReg.test(value)) {
          callback(new Error('网关不正确'))
        } else if (
          !checkSameNetMask(
            this.currentNet.first_ip,
            value,
            this.currentNet.mask
          )
        ) {
          callback(new Error('网关与IP不在同一个网段内'))
        } else {
          callback()
          this.currentNode.gateway = value
        }
      }
    }

    return {
      params: {
        event_id: this.$route.query.id
      },
      scene_type: 3,
      container: {
        dmz: {
          // 外网
          entity: [],
          network: [
            {
              mask: '255.255.0.0',
              name: '外网（DMZ）',
              gateway: '10.10.20.1',
              last_ip: '10.10.20.100',
              first_ip: '10.10.20.10'
            }
          ],
          instance: [],
          showBorder: false // 拖拽进入展示边框
        },
        internal_network: {
          // 内网
          entity: [],
          network: [
            {
              mask: '255.255.255.0',
              name: '内网（服务器区）',
              gateway: '192.168.10.1',
              last_ip: '192.168.10.200',
              first_ip: '192.168.10.10'
            }
          ],
          instance: [],
          showBorder: false // 拖拽进入展示边框
        },
        core_network: {
          // 核心内网
          entity: [],
          network: [
            {
              mask: '255.255.255.0',
              name: '核心内网（核心数据）',
              gateway: '192.168.99.1',
              last_ip: '192.168.99.200',
              first_ip: '192.168.99.10'
            }
          ],
          instance: [],
          showBorder: false // 拖拽进入展示边框
        },
        office_network: {
          // 办公网
          entity: [],
          network: [
            {
              mask: '255.255.255.0',
              name: '办公网',
              gateway: '172.30.4.1',
              last_ip: '172.30.4.100',
              first_ip: '172.30.4.10'
            }
          ],
          instance: [],
          showBorder: false // 拖拽进入展示边框
        }
      },
      bar_list: {
        // 左侧拖拽栏列表
        bar: [
          {
            name: '虚拟设备',
            list: [
              {
                name: '虚拟机',
                type: 'instance'
              }
            ]
          },
          {
            name: '实体设备',
            list: [
              {
                name: '终端',
                type: 'entity'
              }
            ]
          }
        ],
        img: {
          instance: require('@/assets/dragTopo/answered.png'),
          entity: require('@/assets/dragTopo/entity.png')
        }
      }, // 左侧操作栏数据
      challenge_type: '', // 拖拽的题目的类型
      showDrag: false, // 是否展示左侧拖拽栏

      isCurrent: false, // 拖拽节点成功,展示选题弹框
      listQuery: {
        server_type: '', // 0：非跳板机    1：跳板机
        label: '', // 标签
        title: '', // 名称
        offset: 1,
        limit: 10
      },
      total: 0,
      subType: [], // 题目标签
      taskList: [], // 题目列表

      isTask: false, // 展示题目信息弹框
      currentNode: {}, // 当前点击的节点

      isNet: false, // 是否展示网络弹框
      currentNet: {
        name: '',
        first_ip: ''
      }, // 当前点击的网络
      rules: {
        name: [
          { required: true, message: '请输入网络名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        first_ip: [{ required: true, validator: first_ip, trigger: 'blur' }],
        last_ip: [{ required: true, validator: last_ip, trigger: 'blur' }],
        gateway: [{ required: true, validator: gateway, trigger: 'blur' }]
      },

      isTaskInfo: false, // 题目题版信息
      task_store_uuid: '',
      currentContainer: ''
    }
  },
  created() {
    this.getTopo()
  },
  methods: {
    // 保存网络信息
    saveNet() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.container[this.currentNet.key].network[0] = this.currentNet
          this.isNet = false
        } else {
          return false
        }
      })
    },
    // 关闭节点信息弹窗,初始化数据
    closeNode() {
      this.listQuery = {
        server_type: '', // 0：非跳板机    1：跳板机
        label: '', // 标签
        title: '', // 名称
        offset: 1,
        limit: 10
      }
      this.task_store_uuid = '' // 选择题目的uuid
      this.name = '' // 选择的题目名称
      this.currentContainer = ''
    },
    // 拖拽完成的回调
    handleDrag(e, val, type) {
      if (val.instance.length + val.entity.length >= 6) {
        this.$message.error('最多只能选择六道题目')
        return
      }

      this.currentContainer = e.target
      this.challenge_type = type

      this.getTags()
      this.getTask()
      this.isCurrent = true
    },
    // 确定可以新增节点
    sureAddNode() {
      const data = {
        name: this.name,
        task_store_uuid: this.task_store_uuid,
        type: this.challenge_type
      }

      const type = this.currentContainer.getAttribute('type')
      this.container[type][this.challenge_type].push(data)
      this.isCurrent = false
    },
    // 节点信息创建完毕，判断是否可以新增节点。
    addNode() {
      if (!this.task_store_uuid) {
        this.$message({
          type: 'error',
          message: '请选择题目'
        })
        return
      }
      if (this.challenge_type === 'entity') {
        // 如果拖拽的是实体设备，请求查询队伍已开启的设备数量
        getTeamEntity(this.params, {
          task_store_uuid: this.task_store_uuid
        }).then((res) => {
          if (res.data.success) {
            this.sureAddNode()
          }
        })
      } else {
        this.sureAddNode()
      }
    },
    // 获取标签
    getTags() {
      fetchTags({ type: 4 }).then((res) => {
        this.subType = res.data
      })
    },
    // 获取题目
    getTask(obj, page) {
      this.isCurrent = true
      this.listQuery.is_entity = this.challenge_type === 'entity' ? 1 : 2
      // 搜索时重置到第一页。
      if (page) this.listQuery.offset = page
      getTask(this.listQuery).then((res) => {
        res.data.rows.map((item) => {
          item.isUse = '未使用'

          // 判断是否包含已选的题目，是的话，使用状态改为已使用。
          for (const k in this.container) {
            if (
              this.container[k].instance.some((task) => {
                return task.task_store_uuid === item.hash
              })
            ) {
              item.isUse = '已使用'
            }
            if (
              this.container[k].entity.some((task) => {
                return task.task_store_uuid === item.hash
              })
            ) {
              item.isUse = '已使用'
            }
          }
          return item
        })
        this.total = res.data.total
        this.taskList = res.data.rows
      })
    },
    // 展示题目信息
    handleTask(node, container) {
      // 如果是编辑模式，展示题目填写框，
      this.isTask = true
      this.currentNode = Object.assign({}, container)
      this.currentNode.name = node.name
    },
    // 拖拽删除回调事件
    handleRemove(type, index, challenge_type) {
      this.container[type][challenge_type].splice(index, 1)
    },
    // 初次进入页面，加载拓扑信息
    getTopo() {
      getTopo(this.params).then((res) => {
        this.scene_type = res.data.scene_type
        // this.scene_type = 3
        const { topo_data } = res.data
        this.container =
            JSON.stringify(topo_data) !== '{}' ? topo_data : this.container
        this.showDrag = true
      })
    },
    // 点击网络盒子，展示网络信息
    handleNet(net, k) {
      this.isNet = true
      // this.$refs.ruleForm.clearValidate();
      this.currentNet = Object.assign({}, net)
      this.currentNet.key = k
    },
    // 填写网关按钮失去焦点时触发的方法，自动填写first和last ip
    changeGateway(val) {
      const f = val.split('.')
      f[f.length - 1] = 10
      const l = val.split('.')
      l[l.length - 1] = 200
      this.currentNet.first_ip = f.join('.')
      this.currentNet.last_ip = l.join('.')
    },
    nextStep() {
      this.$emit('nextStep')
    },
    submit() {
      editTopo(this.params, this.container).then((res) => {
        if (res.data.success) {
          this.$message.success('保存成功')
        }
      })
    },
    backStep() {
      this.$emit('backStep')
    },
    //  表格只能选择一项
    checkTable(val) {
      if (val[0]) {
        if (val[0].isUse === '已使用') {
          this.$refs.multipleTable.clearSelection()
          this.$message.error('该题目已被使用，请选择其他题目')
          return
        }

        this.name = val[0].title
        this.task_store_uuid = val[0].hash
      }
      // 选择表格
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val[1])
        val.shift()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .topicStep_box {
    display: flex;

    justify-content: center;
    align-items: center;
  }

  .topo_container {
    width: 100%;
    height: calc(100% - 250px);
    display: flex;
    flex-direction: column;
  }

  .topo_box {
    flex: 1;
  }
</style>
<style lang="scss">
  .topo_container {
    /*隐藏表格的多选按钮*/
    .el-table__header-wrapper {
      th:first-child {
        div.cell {
          display: none;
        }
      }
    }
  }
</style>
