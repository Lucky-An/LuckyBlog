<template>
  <div class="choice_wrapper">
    <!-- 镜像选择dialog -->
    <el-dialog :visible.sync="isImage" title="镜像选择" center @close="closed">
      <div class="filter-container">
        <el-input
          v-model="listSelect.search"
          placeholder="请输入镜像名称"
          style="width: 200px"
          size="mini"
        />
        <el-button
          type="primary"
          size="mini"
          @click="getMirrorList(1)"
        >搜索</el-button
        >
      </div>

      <!-- 镜像列表 -->
      <el-table
        ref="MirrorListTable"
        :data="allMirrorList"
        border
        class="img_table"
        @selection-change="changeSelectedMirrorList"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          :index="indexMethod"
          type="index"
          width="55"
          label="序号"
          align="center"
        />

        <el-table-column label="镜像名称" prop="name" align="center" />

        <el-table-column
          v-if="type === 'kvm'"
          label="操作系统类型"
          prop="os_type"
          align="center"
        />

        <el-table-column prop="description" label="镜像描述" align="center" />
      </el-table>

      <!-- 镜像列表完 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listSelect.page"
        :limit.sync="listSelect.per_page"
        @pagination="getMirrorList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="isImage = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  httpGetAdminImages // 获取镜像接口
} from '@/api/itemBank/penetration'
import Pagination from '@/components/Pagination'

export default {
  name: 'Index',
  components: {
    Pagination
  },
  props: {
    selectMirror: {
      required: true,
      type: Boolean
    },
    image_name: {
      type: String,
      default: ''
    },
    image_uuid: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'kvm'
    }
  },
  data() {
    return {
      allMirrorList: [], // 全部镜像列表
      selectMirrorList: [], // 选中镜像列表
      // isImage: this.selectMirror,
      total: 0,
      listSelect: {
        image_type: this.type,
        search: '',
        status: 'active',
        per_page: 10, // 每页显示数量
        page: 1 // 页码
      }
    }
  },

  computed: {
    isImage: {
      get() {
        this.getMirrorList()
        return this.selectMirror
      },
      set(val) {
        this.$emit('update:selectMirror', val)
      }
    }
  },
  created() {},
  methods: {
    indexMethod(index) {
      // 展示序号的方法
      return (this.listSelect.page - 1) * this.listSelect.per_page + index + 1
    },
    closed() {
      this.listSelect = {
        image_type: this.type,
        search: '',
        per_page: 10, // 每页显示数量
        page: 1 // 页码
      }
    },
    // 获取镜像列表
    getMirrorList(page) {
      if (page === 1) this.listSelect.page = 1
      httpGetAdminImages(this.listSelect).then((res) => {
        this.allMirrorList = res.data.data
        this.total = res.data.total
        this.$nextTick(() => {
          let row = ''
          this.allMirrorList.filter((item, index) => {
            if (item.uuid == this.image_uuid) {
              row = index
            }
          })
          if (this.image_uuid != '' && this.$refs.MirrorListTable) {
            this.$refs.MirrorListTable.toggleRowSelection(
              this.allMirrorList[row],
              true
            )
          }
        })
      })
    },
    // 弹窗中点击确认的事件
    confirmSelect() {
      this.search = ''
      this.os_type = ''
      if (this.selectMirrorList.length) {
        this.$emit('update:image_name', this.selectMirrorList[0].name)
        this.$emit('update:image_uuid', this.selectMirrorList[0].uuid)
      } else {
        this.$emit('update:image_name', '')
        this.$emit('update:image_uuid', '')
      }
      this.isImage = false
    },
    changeSelectedMirrorList(val) {
      if (val.length > 1) {
        this.$refs.MirrorListTable.clearSelection()
        this.$refs.MirrorListTable.toggleRowSelection(val[1])
        val.shift()
      }
      this.selectMirrorList = val
    }
  }
}
</script>

<style scoped>
</style>
<style lang="scss">
.img_table .el-table__header-wrapper {
  th:first-child {
    div.cell {
      display: none;
    }
  }
}
.choice_wrapper {
  .el-dialog__title {
    float: left;
  }
}
</style>
