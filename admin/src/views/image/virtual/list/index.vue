<template>
  <div class="app-container competition_box">
    <div class="container_bg">
      <!--表格搜索 begin-->
      <div class="filter-container">
        <!-- <el-select
          v-model="listQuery.is_base"
          placeholder="请选择镜像来源"
          clearable
          class="filter-item"
          size="mini"
        >
          <el-option
            v-for="item in matchStatus"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>-->
        <el-select
          v-model="listQuery.image_type"
          placeholder="请选择镜像类型"
          clearable
          class="filter-item"
          size="mini"
        >
          <el-option value="kvm" label="kvm" />
          <el-option value="docker" label="docker" />
        </el-select>
        <el-input
          v-model.trim="listQuery.search"
          placeholder="请输入镜像名称"
          style="width: 200px;"
          class="filter-item"
          size="mini"
          @keyup.enter.native="getList"
        />
        <el-button v-waves class="filter-item" type="primary" size="mini" @click="getList">搜索</el-button>
      </div>

      <!--赛事增删改查 begin-->
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="success" size="mini" @click="to_add">新增</el-button>
        <el-button v-waves class="filter-item" type="danger" size="mini" @click="removeMatch">删除</el-button>
        <!-- <el-button
          v-waves
          class="filter-item"
          type="primary"
          style="float:right"
          @click="toTagsManage"
          size="mini"
        >标签管理</el-button> -->
      </div>

      <!--表格 begin-->
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :key="tableKey"
        :data="matchList"
        fit
        highlight-current-row
        tooltip-effect="dark"
        border
        style="width: 100%"
        @selection-change="checkTable"
      >
        <el-table-column :selectable="checkboxT" align="center" type="selection" />

        <el-table-column align="center" prop="name" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ indexMethod(listQuery.page,listQuery.per_page,scope.$index) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="name" label="镜像名称" min-width="250" />

        <el-table-column align="center" width="80" prop="image_type" label="镜像类型" />

        <el-table-column align="center" width="110" prop="os_type" label="操作系统类型">
          <template slot-scope="scope">
            <span>{{ scope.row.os_type?scope.row.os_type:'-' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" prop="description" label="镜像描述">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="lookDescribe(scope.row.description)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" prop="description" label="仓库名称">
          <template slot-scope="scope">
            <el-button v-if="scope.row.image_type==='docker'" size="mini" type="primary" @click="lookName(scope.row.image_name)">查看</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="create_user" label="创建人" />

        <el-table-column align="center" width="120" prop="status" label="镜像状态" />

        <el-table-column align="center" min-width="160" label="编辑时间">
          <template slot-scope="scope">
            <span>{{ parseTime(new Date(scope.row.updated_at)) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.can_edit">
              <el-button
                v-if="scope.row.info_button"
                type="primary"
                size="mini"
                @click="editMatch(scope.row.uuid)"
              >编辑</el-button>
            </span>
            <span v-else>
              <el-button disabled type="primary" size="mini">编辑</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页 begin-->
      <pagination
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.per_page"
        @pagination="getList"
      />

      <el-dialog v-el-drag-dialog :visible.sync="infoVisible" title="镜像描述" width="30%">
        <span>{{ itemDescribe }}</span>
      </el-dialog>

      <el-dialog
        :visible.sync="isName"
        title="仓库名称"
      >
        <div class="filter-container">
          {{ image_name }}
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { imagesList, deleteImages } from '@/api/match/property'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { indexMethod } from '@/utils'
import elDragDialog from '@/directive/el-dragDialog'
import { parseTime } from '@/utils/common'

const matchStatus = [
  { key: 'yes', display_name: '纯净镜像' },
  { key: 'no', display_name: '自定义镜像' }
]

export default {
  name: 'List',

  components: { Pagination },

  directives: { waves, elDragDialog },

  data() {
    return {
      infoVisible: false,
      indexMethod,
      tableKey: 0,
      listLoading: false,
      matchStatus,
      systemType: [
        { key: 'linux', display_name: 'linux' },
        { key: 'windows', display_name: 'windows' }
        // { key: 'honeypot', display_name: '蜜罐平台' }
      ],
      listQuery: {
        per_page: this.$store.state.config.row,
        page: 1,
        search: '', // 镜像名字
        // os_type: "", // 系统类型
        // is_base: "", // 镜像来源
        image_type: '', // 镜像类型
        // level: "", // 标签
        // status: "", // 镜像状态
        // category: "", // 镜像类别
        // is_special: "", // 是否为特殊镜像
        // exclude_os_type: "", // 不需要操作系统类型
        total: 0
      },

      image_name: '', // 仓库名称
      isName: false, // 是否展示仓库名称

      itemDescribe: '测试描述',
      matchList: [],
      ids: [] // 选中的表格id
    }
  },

  created() {
    this.getList()
  },

  methods: {
    parseTime,
    checkboxT(row) {
      return row.can_edit
    },

    lookDescribe(desc) {
      // 查看设备描述
      this.itemDescribe = desc
      this.infoVisible = true
    },

    // 查看仓库名称
    lookName(name) {
      this.image_name = name
      this.isName = true
    },

    to_add() {
      this.$router.push({
        path: '/image/virtual/create'
      })
    },

    removeMatch() {
      // 删除赛事
      const data = {
        image_ids: this.ids
      }
      if (this.ids.length <= 0) {
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteImages(data).then((res) => {
            if (res.data.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    getList(op, page) {
      // 获取表格
      const params =
        op === 'start'
          ? Object.assign(this.listQuery, { page })
          : this.listQuery

      imagesList(params).then((res) => {
        const data = res.data
        if (data.success) {
          this.matchList = data.data
          this.listQuery.total = data.total
        }
      })
    },

    checkTable(val) {
      // 选择表格
      this.ids = val.map((item) => {
        return item.uuid
      })
    },

    editMatch(id) {
      // 编辑赛事
      this.$router.push({
        path: '/image/virtual/edit',
        query: { id: id }
      })
    }

    // toTagsManage() {
    //   this.$router.push({
    //     path: "/image/virtual/tags-manage",
    //   });
    // },
  }
}
</script>
