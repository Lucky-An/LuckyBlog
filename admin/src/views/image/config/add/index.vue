<template>
  <div class="app-container addConfig">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="ruleForm.name"/>
      </el-form-item>

      <!--<el-form-item-->
      <!--label="关联镜像"-->
      <!--class="red_start"-->
      <!--&gt;-->
      <!--<el-button-->
      <!--type="primary"-->
      <!--size="mini"-->
      <!--@click="ChoiceImage"-->
      <!--&gt;选择</el-button>-->
      <!--{{ ruleForm.image_names }}-->
      <!--</el-form-item>-->

      <el-form-item label="Compose file" required>
        <UploadFile :file.sync="ruleForm.compose_file" :file-type="['yml']" />
        （请上传yml格式文件,大小不超过10M）
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input :rows="8" v-model="ruleForm.remark" type="textarea"/>
      </el-form-item>

      <el-form-item>

        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button type="warning" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>

    <!-- 镜像选择dialog -->
    <el-dialog
      :visible.sync="selectMirror"
      title="镜像选择"
      width="60%"
      @close="closed"
    >
      <div class="filter-container">
        <el-input
          v-model.trim="listSelect.search"
          placeholder="请输入镜像名称"
          style="width: 200px;"
          size="mini"
        />
        <el-button
          type="primary"
          size="mini"
          @click="getMirrorList(1)"
        >搜索
        </el-button>
      </div>

      <!-- 镜像列表 -->
      <el-table
        ref="MirrorListTable"
        :data="allMirrorList"
        border
        row-key="uuid"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column
          type="index"
          width="55"
          label="序号"
          align="center"
        />

        <el-table-column
          label="镜像名称"
          prop="name"
          align="center"
        />

        <el-table-column
          label="镜像类型"
          prop="image_type"
          align="center"
        />

        <el-table-column
          prop="is_base_image"
          label="镜像来源"
          align="center"
        />
      </el-table>

      <!-- 镜像列表完 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listSelect.page"
        :limit.sync="listSelect.per_page"
        @pagination="getMirrorList"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="confirmSelect"
        >确 定</el-button>
        <el-button @click="selectMirror=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import UploadFile from '@/components/UploadFile'
import {
  httpGetAdminImages // 获取镜像接口
} from '@/api/itemBank/penetration'
import {
  addConfig, configInfo, editConfig
} from '@/api/image'

export default {
  components: {
    Pagination,
    UploadFile
  },
  data() {
    return {
      id: this.$route.query.id,
      ruleForm: {
        name: '',
        compose_file: '',
        // image_names: '',
        // image_uuids: '',
        remark: ''// 备注
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50个字符', trigger: 'blur' }
        ],
        remark: [
          { min: 2, max: 256, message: '长度在 2 到 256个字符', trigger: 'blur' }
        ]

      },
      selectMirror: false, // 镜像弹窗
      allMirrorList: [], // 全部镜像列表
      selectMirrorList: [], // 选中镜像列表
      // selectMirror: this.selectMirror,
      total: 0,
      listSelect: {
        search: '',
        per_page: 10, // 每页显示数量
        page: 1 // 页码
      },
      multipleSelection: []
    }
  },
  created() {
    if (this.id) {
      this.configInfo()
    }
  },
  methods: {
    // 回显
    configInfo() {
      configInfo(this.id).then(res => {
        const { data } = res.data
        for (const k in this.ruleForm) {
          this.ruleForm[k] = data[k]
        }
        const arr = data.image_uuids.split(',')
        this.selectMirrorList = arr.map(item => {
          return { uuid: item }
        })
      })
    },
    goBack() {
      history.back()
    },
    submitForm(formName) {
      if (!this.ruleForm.compose_file) {
        this.$message.error('请上传Compose file')
        return
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const fm = new FormData()
          for (const k in this.ruleForm) {
            fm.append(k, this.ruleForm[k])
          }
          if (this.id) {
            // 编辑
            editConfig(this.id, fm).then(res => {
              if (res.data.success) {
                this.$router.push('/image/config')
              }
            })
          } else {
            // 新增
            addConfig(fm).then(res => {
              if (res.data.success) {
                this.$router.push('/image/config')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 选择镜像弹出多选
    ChoiceImage() {
      this.selectMirror = true
      this.getMirrorList()
    },
    // 获取镜像列表
    getMirrorList(page) {
      if (page === 1) this.listSelect.page = 1
      httpGetAdminImages(this.listSelect).then(res => {
        this.allMirrorList = res.data.data
        this.total = res.data.total
      })
    },
    // 初始化
    closed() {
      this.listSelect = {
        search: '',
        per_page: 10, // 每页显示数量
        page: 1 // 页码
      }
    },
    // 弹窗中点击确认的事件
    confirmSelect() {
      this.ruleForm.image_names = ''
      this.ruleForm.image_uuids = ''
      this.selectMirrorList.forEach(item => {
        this.ruleForm.image_names += (item.name + ',')
        this.ruleForm.image_uuids += (item.uuid + ',')
      })
      this.selectMirror = false
    },
    handleSelectionChange(val) {
      this.selectMirrorList = val
    }
  }
}
</script>
<style lang="scss">
  .addConfig{
    width: 90%;
  }

  .img_table .el-table__header-wrapper {
    th:first-child {
      div.cell {
        display: none;
      }
    }
  }
</style>
