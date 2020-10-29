<template>
  <div class="addTopic" id="homepage">
    <div class="clearfix mrg15B mrg20T">
      <div class=" fl">
        <el-button size="small" type="primary"  @click="showtopic">{{$t('selfHelp_competition.Question')}}</el-button>
        <el-button size="small" type="primary"  @click="addTopic"> {{$t('selfHelp_competition.add_topic')}}</el-button>
        <el-button size="small" type="danger"  @click="removeSub"> {{$t('selfHelp_competition.delete_topic')}}</el-button>
        <el-button size="small" type="primary"  @click="publicSub"> {{$t('selfHelp_competition.public_topic')}}</el-button>
        <el-button size="small" type="info"  @click="hideSUb"> {{$t('selfHelp_competition.hide_topic')}}</el-button>
      </div>
      <div class=" fr">
        <el-select style="width: 160px;" size="small" v-model="listQuery.type" :placeholder="$t('selfHelp_competition.topic_type')">
          <el-option :label="$t('selfHelp_competition.all_type')" value=""/>
          <el-option v-for="item,index in subType" :key="index" :label="item.cn_name" :value="item.id"/>
        </el-select>
        <el-select style="width: 160px;" size="small" v-model="listQuery.status" :placeholder="$t('selfHelp_competition.all_status')">
          <el-option :label="$t('selfHelp_competition.all_status')" value=""/>
          <el-option :value="1" :label="$t('selfHelp_competition.public')"/>
          <el-option :value="0" :label="$t('selfHelp_competition.hide')"/>
        </el-select>
        <div style="display:inline-block" class="mrg5L">
          <search @searchEvent="getSearchVal"></search>
        </div>
      </div>
    </div>
    <div class=" ordinary">
      <!--表格 begin-->
      <el-table
        ref="multipleTable"
        :key="tableKey"
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="checkTable">
        <el-table-column
          align="center"
          type="selection"/>
        <el-table-column
          align="center"
          prop="title"
          :label="$t('selfHelp_competition.topic_name')"/>
        <el-table-column
          align="center"
          prop="source"
          :label="$t('selfHelp_competition.source')">
          <template slot-scope="scope">
            <span>{{scope.row.source==1 ? $t('selfHelp_competition.add_topic') : $t('selfHelp_competition.Question')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="category_cn_name"
          :label="$t('selfHelp_competition.type')"/>
        <el-table-column
          align="center"
          prop="score"
          :label="$t('selfHelp_competition.score_now')"/>
        <el-table-column
          align="center"
          prop="event_mode"
          :label="$t('selfHelp_competition.scoring_method')">
          <template slot-scope="scope">
            <span>{{ scope.row.event_mode==1?$t('selfHelp_competition.cum_score'):$t('selfHelp_competition.dyn_score') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('selfHelp_competition.annex')">
          <template slot-scope="scope">
            <span
              v-if="scope.row.file.length>0"
              class="linkStyle"
              @click="showDownload(scope.row.file)">{{$t('selfHelp_competition.download')}}
            </span>
            <span v-else>{{$t('selfHelp_competition.no')}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--align="center"-->
          <!--label="环境">-->
          <!--<template slot-scope="scope">-->
            <!--&lt;!&ndash;<el-button   class="filter-item" size="mini" type="success" @click="editNoice">共享</el-button>&ndash;&gt;-->
            <!--<span>无</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          label="flag">
          <template slot-scope="scope">
            <span class="linkStyle" @click="showflag(scope.row.answer)">{{$t('selfHelp_competition.view')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="public"
          :label="$t('selfHelp_competition.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.public?$t('selfHelp_competition.public'):$t('selfHelp_competition.hide')}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--align="center"-->
          <!--label="讨论">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button   class="filter-item" size="mini" type="success" disabled>查看</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          :label="$t('selfHelp_competition.container')"
        width="240">
          <template slot-scope="scope">
            <div v-if="!scope.row.is_share">
              {{$t('selfHelp_competition.no')}}
            </div>
            <div v-else>
              <el-button v-if="!scope.row.dynamic_env_status"  class="  selfServer-btn-green" size="mini" type="success" @click="openSence(scope.row.parent_hash,scope.row.id)" :loading="loading.includes(scope.row.id)">{{$t('selfHelp_competition.open_container')}}</el-button>
              <span v-else>
              <el-button class="filter-item selfServer-btn-yellow" size="mini" type="warning" @click="resetSence(scope.row.parent_hash,scope.row.id)"  :loading="loading.includes(scope.row.id)">{{$t('selfHelp_competition.res_container')}}</el-button>
            <el-button   class="filter-item selfServer-btn-red mrg10L" size="mini" type="danger" @click="closeSence(scope.row.parent_hash,scope.row.id)"  :loading="loading.includes(scope.row.id)">{{$t('selfHelp_competition.del_container')}}</el-button>
            </span>
            </div>


          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('selfHelp_competition.operating')">
          <template slot-scope="scope">
            <el-button   class="  selfServer-btn-green" size="mini" type="success" @click="editTopic(scope.row.id)">{{$t('selfHelp_competition.edit')}}</el-button>
            <!--<el-button   class="  selfServer-btn-blue" size="mini" >测试</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页 begin-->
    <div class="grail_apge clearfix text-right pad30T" v-show="listTotal>0">
      <div class="page_info" v-if="$i18n.locale == 'CN'">显示第 {{(listPage-1)*listQuery.limit+1}} 到第
        {{listPage*listQuery.limit>listTotal?listTotal:listPage*listQuery.limit}} 条记录，总共
        {{listTotal}} 条记录
      </div>
      <div class="page_info" v-else>
        Showing {{(listPage-1)*listQuery.limit+1}} through
        {{listPage*listQuery.limit>listTotal?listTotal:listPage*listQuery.limit}} records for a total of
        {{listTotal}} records.
      </div>

      <pagination
              v-show="listTotal>listQuery.limit"
              :total="listTotal"
              :page.sync="listPage"
              :limit.sync="listQuery.limit"
              layout='prev, pager, next'
              @pagination="getList"/>
    </div>


    <!--选择下载文件  begin-->
    <el-dialog :visible.sync="choseDown" custom-class="ad_public_modal title-center" :title="$t('selfHelp_competition.down_annex')" width="900px" @close="closeDown">
      <a v-for="item in fileList" class="common_btn_sm" :href="item" download><span>{{item}}</span></a>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!--选择下载文件  end-->

    <!--查看flag  begin-->
    <el-dialog :visible.sync="diaFlag"  custom-class="ad_public_modal title-center" :title="$t('selfHelp_competition.viewFlag')" width="900px" @close="closeDown">
      <p v-for="item in flagList" class="text-center">{{ item }}</p>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!--查看flag  end-->
  </div>
</template>

<script>
import Pagination from '@/components/common_components/pagination'
import search from '../common/search'

export default {
  name: 'TopicManagement',
  components: {
    Pagination,
    search
  },
  data() {
    return {
      subType: [], // 题目类型
      subTag: [], // 习题集
      textarea: '',
      choseDown: false,
      diaFlag: false,
      fileList: [], // 文件列表
      flagList: [], // flagList
      downList: [],
      matchList: [], // 题目列表
      ids: [], // 选择的所有表格的项
      tableKey: 0,
      listTotal: 0, // 题目列表总条数
      listPage: 1, // 题目列表页码
      listQuery: {
        offset: 0,
        limit: 10,
        event: this.$route.query.id,
        search: '',
        status: '',
        order: 'asc',
        type: ''
      },
      timer:{},
      num:{},//轮询次数
      loading:[],
    }
  },
  created() {
    this.getList()
    this.getType()
  },
  beforeDestroy(){
    for(let key in this.timer){
      clearInterval(this.timer[key]);
    }
  },
  methods: {
    openSence(hash,id,num) { // 开启容器
      this.loading.push(id);
      this.num[id]=0;//将题目id存储进去，用来判断该题目轮询了多少次
      clearInterval(this.timer[id])
      this.$http({
        method: 'post',
        url: '/api/env/' + hash,
        data: {task_hash: hash}
      }).then(res => {
        if(res.data.status==1){
          this.timer[id] = setInterval(() => {
            this.getSenceStatushash(hash,id,num);
          },1000)
        }
      })
    },
    closeLoading(id){//清除loading
      this.loading=this.loading.filter(item=>{
        return item!=id;
      })
    },
    getSenceStatushash(hash,id,num){//轮询
      this.num[id]++
      if(this.num[id]>50){//如果次数大于50将该题目对应id 的num清零，代表开启失败
        clearInterval(this.timer[id]);
        this.num[id]=0;
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message: '开启失败',
        });
        // this.$message.error('开启失败');
        this.getList(id)
      }
      this.$http({
        method: 'get',
        url: '/api/env/' + hash,
      }).then(res => {
        let {data} = res
        if (data.status == 2) {
          clearInterval(this.timer[id]);
          this.getList(id);
          this.$notify.success({
            title:this.$t('dialog_list.tips'),
            message:this.$t('api_message.operation_success'),
          });
          // this.$message.success('成功');
        }
      }).catch(error => {
        // 如果出现错误，接口会返回403，所以只好在catch里面操作
        if (error.response.status == 403) {
          this.closeLoading(id);
          clearInterval(this.timer[id]);
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message: error.response.data.message,
          });
          // this.$message.error(error.response.data.message);
        }
      })
    },
    closeSence(hash,id,num){
      this.loading.push(id);
      this.$http({
        method: 'delete',
        url: '/api/env/' + hash
      }).then(res => {
        if (res.data.status == 1) {
          //删除成功，初始化
          if(num){//这个num是用来判断进行的操作是重置还是删除。有值为重置，无值为删除。
            this.openSence(hash,id,num);
          }else{
            this.getList(id);
          }
        }else{
          this.$notify.error({
            customClass:'error_notify',
            title:this.$t('public.error'),
            message: res.data.message,
          });
          // this.$message.error(res.data.message);
        }
      })
    },
    resetSence(hash,id){//重置容器的方法，其实就是删除了容器在打开一个。
      this.loading.push(id);
      this.closeSence(hash,id,1);
    },
    getSearchVal(val){//搜索
      this.listQuery.search=val
      this.getList();
    },
    showtopic() { // 抽题
      this.$router.push({
        path: '/common/manage/operation/extractTopics',
        query:this.$route.query
      })
    },
    removeSub() { // 删除题目
      const params = {}
      params.ids = this.ids

      if(this.ids<=0){
        return
      }

      this.$confirm(this.$t('selfHelp_competition.delete_sure'), this.$t('dialog_list.tips'), {
        confirmButtonText: this.$t('modal.confirm'),
        cancelButtonText: this.$t('modal.cancel'),
        customClass:'public_confirm public_confirm_sm',
        type: 'warning'
      }).then(() => {

        this.$http.delete('/api/sponsor/event_tasks/batch_destroy',{data:params}).then(res => {
          if (res.data.success) {
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('api_message.operation_success'),
            });
            // this.$message.success('操作成功')
            this.getList()
          }
        })

      }).catch(res=>{})
    },
    publicSub() { // 公开题目
      const params = {}
      params.ids = this.ids
      params.public = 1
      this.$http.patch('/api/sponsor/event_tasks/batch_public',params).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title:this.$t('dialog_list.tips'),
            message:this.$t('api_message.operation_success'),
          });
          // this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    hideSUb() { // 隐藏题目
      const params = {}
      params.ids = this.ids
      params.public = 0
      this.$http.patch('/api/sponsor/event_tasks/batch_public',params).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title:this.$t('dialog_list.tips'),
            message:this.$t('api_message.operation_success'),
          });
          // this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    showflag(list) {
      this.diaFlag = true;
      this.flagList = list;
    },
    closeDown() { // 关闭下载弹框
      this.fileList = []
      this.downList = []
    },
    showDownload(fileList) {
      this.choseDown = true
      this.fileList = fileList
    },
    download() {
      this.downList.forEach(item => {
        window.location.href = item
      })
      this.choseDown = false
    },
    addTopic() { // 新建赛题
      this.$router.push({
        path: '/common/manage/operation/addTopic',
        query: { id: this.$route.query.id }
      })
    },
    editTopic(id) { // 编辑题目
      this.$router.push({
        path: '/common/manage/operation/editTopic',
        query: {
          id: this.$route.query.id,
          task_id: id
        }
      })
    },
    getType() {
      this.$http.get('/api/sponsor/task_category').then(res => {
        this.subType = res.data
      })
    },
    getList(id) {

      this.listQuery.offset = (this.listPage - 1) * this.listQuery.limit
      this.$http.get('/api/sponsor/event_tasks',{params:this.listQuery}).then(res => {
        if(id)this.closeLoading(id);
        const { data } = res
        this.matchList = data.rows
        this.listTotal = data.total
      })
    },
    checkTable(val) { // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
  .addTopic{
    .pagination-container {
      padding: 0;
    }
    .def_btn {
      match-confirmbtn-md()
      width: 80px;
      height: 27px;
      line-height: 28px;
      padding: 0
    }
    .linkStyle {
      color: lightblue;
      text-decoration: underline;
    }
    .page_info {
      color: #fff;
      float: left;
      line-height :30px;
    }
  }

</style>
