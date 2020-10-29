<template>
  <div class="app-container competition_box">
    <div class="container_bg">
      <div class="filter-container">
        <el-button
          class="filter-item"
          type="success"
          size="mini"
          @click="add"
        >新增</el-button>
        <el-button
          class="filter-item"
          type="danger"
          size="mini"
          @click="removeMatch"
        >删除</el-button>
      </div>

      <!--表格 begin-->
      <el-table
        :data="list"
        border
        @selection-change="checkTable"
      >
        <el-table-column
          align="center"
          type="selection"
        />
        <el-table-column
          align="center"
          prop="name"
          label="序号"
          width="50"
        >
          <template slot-scope="scope">
            <span>{{ indexMethod(listQuery.offset,listQuery.limit,scope.$index) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="name"
          label="设备组名称"
        />
        <el-table-column
          align="center"
          prop="count"
          label="设备数量"
        />
        <el-table-column
          align="center"
          prop="content"
          label="设备组描述"
        />

        <el-table-column
          label="设备信息"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="showEntity(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="create_time"
          label="添加时间"
        />

        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="editMatch(scope.row.uuid)"
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
      :visible.sync="isGroup"
      title="设备MAC管理"
      width="740px"
      @close="close"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="number">
          <el-input
            v-model.number.trim="form.number"
            placeholder="请输入设备序号"
          />
        </el-form-item>
        <el-form-item prop="ip">
          <el-input
            v-model.trim="form.ip"
            placeholder="请输入设备ip地址"
          />
        </el-form-item>
        <el-form-item prop="mac">
          <el-input
            v-model.trim="form.mac"
            placeholder="请输入设备MAC地址"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addEntity"
          >新增</el-button>
        </el-form-item>
      </el-form>

      <!--表格 begin-->
      <el-table
        :data="entityList"
        border
        @selection-change="checkTable"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="50"
        />

        <el-table-column
          align="center"
          prop="number"
          label="设备序号"
        />
        <el-table-column
          align="center"
          prop="ip"
          label="设备ip地址"
        />
        <el-table-column
          align="center"
          prop="mac"
          label="设备组MAC地址"
        />

        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="editEntity(scope.row)"
            >
              编辑
            </el-button>

            <el-button
              type="danger"
              size="mini"
              @click="removeEntity(scope.row.uuid)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="isEntity"
      title="实体设备编辑"
      width="740px"
      @close="close"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          label="设备序号"
          prop="number"
        >
          <el-input
            v-model.number.trim="form.number"
            disabled
            placeholder="请输入设备序号"
          />
        </el-form-item>
        <el-form-item prop="ip">
          <el-input
            v-model.trim="form.ip"
            placeholder="请输入设备ip地址"
          />
        </el-form-item>
        <el-form-item prop="mac">
          <el-input
            v-model.trim="form.mac"
            placeholder="请输入设备MAC地址"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="primary"
          @click="addEntity"
        >保存</el-button>
        <el-button @click="isEntity=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEntityGroup,
  removeEntityGroup,
  getEntityInfo,
  addEntity,
  editEntity,
  removeEntity
} from '@/api/image.js'
import Pagination from '@/components/Pagination'
import { indexMethod } from '@/utils'

export default {
  name: 'List',

  components: { Pagination },

  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('设备序号不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > 10000 || value < 1) {
            callback(new Error('设备序号范围在1-10000之间'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      indexMethod,
      total: 0,
      listQuery: {
        limit: this.$store.state.config.row,
        offset: 1
      },

      isGroup: false,
      entityId: '',
      list: [], // 组列表
      ids: [],

      isEntity: false,
      entityList: [], // 实体设备列表
      // 实体设备详情的参数
      entityQuery: {
        group_uuid: ''
      },
      form: {
        // 新增实体设备详情
        number: '',
        mac: '',
        ip: '',
        group_uuid: ''
      },
      rules: {
        mac: [{ required: true, message: '请输入MAC', trigger: 'blur' }],
        number: [{ validator: checkAge, trigger: 'blur' }],
        ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }]
      } // 选中的表格id
    }
  },

  created() {
    this.getList()
  },

  methods: {
    add() {
      this.$router.push({
        path: '/image/entity/add'
      })
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
        const data = { uuid_list: this.ids }
        removeEntityGroup(data).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      })
    },

    getList(page) {
      if (page === 1) this.listQuery.offset = page
      getEntityGroup(this.listQuery).then(res => {
        const data = res.data
        if (data.success) {
          this.list = data.data
          this.total = data.count
        }
      })
    },
    close() {
      this.form.number = ''
      this.form.mac = ''
      this.form.ip = ''
      this.getList()
    },
    // 展示设备信息
    showEntity(row) {
      this.entityQuery.group_uuid = row.uuid
      this.form.group_uuid = row.uuid
      this.getEntityInfo()
    },
    // 获取实体设备mac列表
    getEntityInfo() {
      getEntityInfo(this.entityQuery).then(res => {
        this.entityList = res.data.data
        this.isGroup = true
      })
    },
    // 新增 编辑 实体设备
    addEntity() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.uuid) {
            editEntity(this.form.uuid, this.form).then(res => {
              if (res.data.success) {
                this.isEntity = false
                this.getEntityInfo()
              }
            })
          } else {
            addEntity(this.form).then(res => {
              if (res.data.success) {
                this.getEntityInfo()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 编辑实体设备信息回显
    editEntity(row) {
      this.form.ip = row.ip
      this.form.mac = row.mac
      this.form.number = row.number
      this.form.uuid = row.uuid
      this.isEntity = true
    },
    // 删除实体设备
    removeEntity(uuid) {
      removeEntity({ group_uuid: this.entityQuery.group_uuid, uuid }).then(
        res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getEntityInfo()
          }
        }
      )
    },
    checkTable(val) {
      // 选择表格
      this.ids = val.map(item => {
        return item.uuid
      })
    },

    editMatch(id) {
      // 编辑赛事
      this.$router.push({
        path: '/image/entity/edit',
        query: { id: id }
      })
    }
  }
}
</script>
