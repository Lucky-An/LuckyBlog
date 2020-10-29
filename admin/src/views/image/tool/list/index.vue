<template>
  <div class="app-container competition_box">
    <div class="container_bg">
      <!--表格搜索 begin-->
      <div class="filter-container">
        <el-input v-model.trim="listQuery.app_name" placeholder="请输入应用名称" />
        <el-select v-model="listQuery.app_type" placeholder="请选择应用分类" clearable class="filter-item">
          <el-option
            v-for="item in systemType"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-select v-model="listQuery.app_os" placeholder="请选择适配系统" clearable class="filter-item">
          <el-option
            v-for="item in applyos"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"

          @click="getList"
        >搜索</el-button>
      </div>

      <!--添加新应用 begin-->
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" @click="to_add">添加新应用</el-button>
        <!-- <el-button
          v-waves
          class="filter-item"
          type="primary"
          style="float:right"
          @click="toTagsManage"
        >标签管理</el-button>
        </div>-->
        <!--表格 begin-->
        <el-table
          v-loading="listLoading"
          ref="multipleTable"
          :key="tableKey"
          :data="matchList"
          fit
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%;"
        >
          <el-table-column align="center" prop="name" label width="160">
            <template slot-scope="scope">
              <img
                :src="
                  scope.row.icon ? scope.row.icon : require('@/assets/img/applybg.png')
                "
                class="logoimg"
              >
              <!-- <img
                :src="
                  require('@/assets/img/applybg.png')
                "
                class="logoimg"
              >-->
            </template>
          </el-table-column>
          <el-table-column align="left" prop="name" label="应用信息">
            <template slot-scope="scope">
              <h5>{{ scope.row.name }}</h5>
              <p class="lin2 inline-line">
                <span>版本：</span>
                {{ scope.row. version }}
              </p>
              <p class="lin2">
                <span>更新日期：</span>
                {{ parseTime(new Date(scope.row.updated_at)) }}
              </p>
              <p class="lin2">
                <span>适配系统：</span>
                <span v-for="(item, index) in scope.row.os" :key="index" class="ossty">
                  {{ item }}
                  <span v-if="Number(index + 1) != scope.row.os.length">、</span>
                </span>
              </p>
              <p class="lin2">
                <span>描述：</span>
                {{ scope.row.desc }}
              </p>
              <div class="lin2">
                <!-- <span v-for="(item, index) in scope.row.type" :key="index">{{ item }}</span> -->
                <span>用途分类：</span>
                <span>{{ scope.row.type.join('、') }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <span class="fang_button_link dis_btn" @click="toResource(scope.row)">资源</span>
              <span
                class="fang_button_link dis_btn"
                style="margin-left:20px"
                @click="amend(scope.row)"
              >编辑</span>
              <span
                class="fang_button_link dis_btn"
                style="margin-left:20px"
                @click="delapply(scope.row)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页 begin-->
        <pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.per_page"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { applyList, applyOs, applyDelete } from '@/api/match/property'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-dragDialog'
import { parseTime } from '@/utils/common'

export default {
  name: 'List',
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      id: this.$route.id, // 竞赛id
      tableKey: 0,
      total: 0,
      listLoading: false,
      page: 1,
      systemType: [
        { key: '1', display_name: '数据分析' },
        { key: '2', display_name: '应用框架' },
        { key: '3', display_name: '应用中间件' },
        { key: '4', display_name: '应用服务' },
        { key: '5', display_name: '数据库' },
        { key: '6', display_name: 'devops工具' },
        { key: '7', display_name: '消息服务' },
        { key: '8', display_name: '安全工具' },
        { key: '9', display_name: '网络工具' }
      ],
      applyos: [], // 系统类型集合
      listQuery: {
        app_name: '', // 应用名称
        app_type: '', // 应用分类
        app_os: '', // 系统分类
        per_page: this.$store.state.config.row,
        page: 1
      },
      matchList: [],
      loading: false,
      parseTime
    }
  },
  created() {
    this.getList()
    this.getapplyos()
  },
  mounted() {},
  methods: {
    deleteStorage(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // .then(() => {
      //   deleteReplayStorage(row.id, this.hash).then(res => {
      //     if (res.data.success) {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       })
      //       this.getList()
      //     }
      //   })
      // })
      // .catch(() => {})
    },
    to_add() {
      this.$router.push({
        path: '/image/tool/create'
      })
    },
    amend(ele) {
      this.$router.push({
        path: '/image/tool/edit',
        query: {
          id: ele.uuid
        }
      })
    },
    // 应用列表
    getList() {
      applyList(this.listQuery).then((res) => {
        if (res.data.success) {
          this.matchList = res.data.app
          this.total = res.data.total
        }
      })
    },
    // 适配系统下拉
    getapplyos() {
      applyOs().then((res) => {
        if (res.data.success) {
          for (var i in res.data.data) {
            this.applyos.push({
              value: res.data.data[i],
              name: i
            })
          }
        }
      })
    },
    // 应用删除
    delapply(ele) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          applyDelete(ele.uuid).then((res) => {
            if (res.data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
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
    // toTagsManage() {
    //   this.$router.push({
    //     path: '/image/virtual/tags-manage'
    //   })
    // },
    toResource({ uuid: id }) {
      this.$router.push({
        path: '/image/tool/editnext',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dis_btn {
  color: #075ca0 !important;
}
.color1 {
  color: yellow;
}
.color2 {
  color: #67c23a;
}
.color3 {
  color: #f56c6c;
}
.logoimg {
  width: 150px;
  height: 150px;
}
.titletext {
  // width: 150px;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  cursor: default;
  height: 34px;
  line-height: 34px;
  text-align: left;
}
/deep/.tablemain {
  overflow: hidden;
  margin-bottom: 10px;
  max-height: 92px;

  .el-button {
    float: left;
    margin-bottom: 10px;
    margin-left: 0px;
    margin-right: 10px;
  }
}
.lin2 {
  text-align: left;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.inline-line {
  float: left;
  margin-right: 20px;
}
.el-input {
  width: 220px;
}
.filter-container .filter-item {
  margin-bottom: 0px;
}
.el-table {
  margin-top: 10px;
  margin-top: 10px;
}
h5 {
  text-align: left;
}
</style>
