<template>
  <div class="app-container competition_box">
    <div class="container_bg">
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" @click="handleAddResource">添加资源</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="tableData"
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%;"
      >
        <el-table-column label="适配操作系统">
          <template slot-scope="scope">
            <span>{{ handleOsType(scope.row.os_type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="file_name" label="文件名称" />
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(new Date(scope.row.updated_at)) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="修改人" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="fang_button_link dis_btn" @click="handleEdit(scope.row)">编辑</span>
            <span
              class="fang_button_link dis_btn"
              style="margin-left:20px;"
              @click="handleDelete(scope.row)"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>
      <section style="margin-top: 60px;text-align:center;" class="from_submit_btn">
        <el-button v-waves class="filter-item" type="primary" @click="handleBack">上一步</el-button>
        <el-button v-waves class="filter-item" type="primary" @click="handleDone">完成</el-button>
      </section>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="提示"
      width="625px"
      min-width
    >
      <el-form :model="formData" label-position="top" style="margin:0 auto">
        <el-form-item label="1、选择配置系统" required >
          <el-transfer
            ref="transfer"
            :filter-method="filterMethod"
            v-model="formData.os_type"
            :data="osDataOut"
            :props="{
              key: 'id'
            }"
            :titles="['未选择', '已选择']"
            filterable
            filter-placeholder="请输入操作系统名称"
          />
        </el-form-item>
        <el-form-item label="2、上传应用文件" required >
          <el-upload
            ref="upload"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :limit="1"
            :auto-upload="false"
            :multiple="false"
            :on-exceed="handleExceed"
            :file-list="fileList"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">{{ '只能上传 ' + extStr + ' 文件' }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAppInfo,
  applyOs,
  createSoftware,
  deleteSoftware,
  modifySoftware
} from '@/api/match/property'
import waves from '@/directive/waves'
import elDragDialog from '@/directive/el-dragDialog'
import { parseTime } from '@/utils/common'
export default {
  directives: { waves, elDragDialog },
  data() {
    const { id } = this.$route.query
    const exts = ['msi', 'rpm', 'deb', 'exe', 'dmg', 'gz', 'tgz', 'tar']
    return {
      id,
      listLoading: false,
      tableData: [],
      dialogVisible: false,
      osData: [],
      osDataOut: [],
      osDataIn: [],
      fileList: [],
      formData: {
        os_type: [],
        app_uuid: id,
        user: this.$store.getters.name
      },
      parseTime,
      exts,
      extStr: exts.join('、'),
      handleOsType: (type) => {
        const arr = type.map((el) => el.label)
        return arr.join(' ')
      },
      softwareId: ''
    }
  },

  created() {
    this.getapplyos().then(() => {
      this.handleGetAllResource()
    })
  },

  methods: {
    handleAddResource() {
      this.dialogVisible = true
    },

    handleGetAllResource() {
      getAppInfo(this.id).then((res) => {
        const { data } = res
        if (data.success) {
          const { software } = data
          this.tableData = software
          this.osDataIn.length = 0
          software.forEach((el) => {
            this.osDataIn = [...this.osDataIn, ...el.os_type]
          })
          this.osDataOut = this.osData
          this.osDataIn.forEach((el) => {
            this.osDataOut = this.osDataOut.filter((item) => {
              return el.id !== item.id
            })
          })
        }
      })
    },

    handleClose(done) {
      this.formData.os_type.length = 0
      this.$refs.transfer.clearQuery('left')
      this.$refs.transfer.clearQuery('right')
      this.fileList.length = 0
      this.softwareId = ''
      this.$refs.upload.clearFiles()
      if (done && typeof done === 'function') {
        done()
      } else {
        this.dialogVisible = false
      }
    },

    getapplyos() {
      return applyOs().then((res) => {
        const { data } = res
        if (data.success) {
          this.osData.length = 0
          for (const key in data.data) {
            this.osData.push({
              label: key,
              id: data.data[key]
            })
          }
        }
      })
    },

    filterMethod(query, item) {
      return item
    },

    handleRemove(file, fileList) {
      this.fileList = fileList
    },

    handleExceed(files, fileList) {
      this.$message({
        type: 'error',
        message: '只能上传一个文件'
      })
    },

    handleChange(file, fileList) {
      const { name } = file
      const ext = name.match(/[^.]+(?!.)/g)[0]
      if (!this.exts.includes(ext)) {
        this.$message({
          type: 'error',
          message: '只能上传 ' + this.extStr + ' 文件'
        })
        this.$refs.upload.clearFiles()
      } else {
        this.fileList = fileList
      }
    },

    handleSubmit() {
      if (!this.fileList.length) {
        this.$message({
          type: 'error',
          message: '请上传应用文件'
        })
        return
      } else if (!this.formData.os_type.length) {
        this.$message({
          type: 'error',
          message: '请选择适配系统'
        })
        return
      }
      const form = new FormData()
      const [{ raw, name }] = this.fileList
      if (raw) form.set('softwarename', raw, name)
      for (const key in this.formData) {
        form.set(key, this.formData[key])
      }
      if (this.softwareId) {
        modifySoftware(this.softwareId, form).then((res) => {
          const { data } = res
          if (data.success) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.handleClose()
            this.handleGetAllResource()
          }
        })
      } else {
        createSoftware(form).then((res) => {
          const { data } = res
          if (data.success) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.handleClose()
            this.handleGetAllResource()
          }
        })
      }
    },

    handleDelete({ uuid }) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSoftware(uuid).then((res) => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
            this.handleGetAllResource()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleEdit(row) {
      this.osDataOut = [...this.osDataOut, ...row.os_type]
      this.formData.os_type = row.os_type.map((el) => parseInt(el.id))
      this.fileList.push({
        name: row.file_name,
        url: row.path
      })
      this.dialogVisible = true
      this.softwareId = row.uuid
    },

    handleDone() {
      this.$router.push({
        path: '/image/tool/list'
      })
    },

    handleBack() {
      history.back()
    }
  }
}
</script>

<style lang="scss">
.colorFul .el-checkbox__label {
  color: #606266 !important;
}
.create_match {
  position: relative;
  width: 100%;
  min-width: 600px;
}

.create_match .el-form-item .imgBox {
  background: #a5a5a5;
  width: 200px;
  position: relative;
  line-height: 0;
}

.create_match .el-form-item .imgBox .svg-icon {
  width: 25px;
  height: 25px;
  position: absolute;
  right: -13px;
  top: -13px;
  cursor: pointer;
}

.create_match .te-switch-button {
  vertical-align: top;
}

.el-picker-panel__footer .el-button--text {
  display: none;
}

.upload_box {
  position: relative;
  margin-right: 10px;
  overflow: hidden;
  cursor: pointer;
}

.des_box p {
  margin: 5px 0 0 0;
  line-height: 20px;
}

.upload_box input {
  opacity: 0;
  width: 80px;
  height: 32px;
  position: absolute;
  cursor: pointer;
  top: -7px;
}
.maincon {
  width: 1030px;
  margin: 0px auto;
  margin-top: 50px;
  .el-input {
    width: 260px;
  }
  .el-transfer {
    .el-transfer__buttons {
      .el-button {
        display: block;
        margin-left: 0;
      }
    }
  }
}
</style>
<style>
.numberInput input::-webkit-outer-spin-button,
.numberInput input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>
