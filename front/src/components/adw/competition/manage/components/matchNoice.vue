<template>
  <div class="notice_manage" id="homepage">
    <div class="clearfix mrg15B mrg20T">
      <div class="fl">
        <el-select  size="small" v-model="noiceType" class="mrg10R" :placeholder="$t('selfHelp_competition.match_notic')" @change="handleType">
          <el-option :value="1" :label="$t('selfHelp_competition.match_notic')"/>
          <el-option :value="2" :label="$t('selfHelp_competition.topic_tips')"/>
        </el-select>
        <el-select class="mrg10R" size="small" v-show="noiceType===2" v-model="task_id"  :placeholder="$t('selfHelp_competition.chose_time')">
          <el-option
            v-for="(item) in topicList"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="fl">
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="showDlg"> {{$t('selfHelp_competition.add_noticy')}}</el-button>
        <el-button size="small" type="danger" icon="el-icon-circle-close"  @click="romoveNoice"> {{$t('selfHelp_competition.delete_notic')}}</el-button>
        <el-button size="small" type="primary" icon="el-icon-upload" @click="topNoice(1)"> {{$t('selfHelp_competition.topping')}}</el-button>
        <el-button size="small" type="info" icon="el-icon-upload" @click="topNoice(0)">  {{$t('selfHelp_competition.unpin')}}</el-button>
      </div>
      <div class="fr">
        <search @searchEvent="getSearchVal"></search>
      </div>
    </div>
    <div class="ordinary">
      <!--表格 begin-->
      <el-table
        :key="tableKey"
        :data="matchList"
        border
        style="width: 100%"
        @selection-change="checkTable">
        <el-table-column
          align="center"
          type="selection"/>

        <el-table-column
          v-if="noiceType===2"
          align="center"
          prop="event_task"
          width="300px"
          :label="$t('selfHelp_competition.topic_name')"/>
        <el-table-column
          align="center"
          prop="notice"
          :label="$t('selfHelp_competition.topic_tips')"/>

        <el-table-column
          align="center"
          prop="jointype"
          width="150px"
          :label="$t('selfHelp_competition.is_top')">
          <template slot-scope="scope">
            <span>{{ scope.row.is_topped==0?$t('selfHelp_competition.no'):$t('selfHelp_competition.yes') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_time"
          :label="$t('selfHelp_competition.release_time')"
          width="250px"/>
        <el-table-column
          align="center"
          width="350px"
          :label="$t('selfHelp_competition.operating')">
          <template slot-scope="scope">
            <el-button
              class="filter-item selfServer-btn-green"
              icon="el-icon-edit-outline"
              @click="editNoice(scope.row)">{{$t('selfHelp_competition.edit')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页 begin-->
    <div class="grail_apge clearfix text-right pad30T" v-show="total>0">
      <div class="page_info" v-if="$i18n.locale == 'CN'">显示第 {{(page-1)*listQuery.limit+1}} 到第
        {{page*listQuery.limit>total?total:page*listQuery.limit}} 条记录，总共
        {{total}} 条记录
      </div>
      <div class="page_info" v-else>
        Showing {{(page-1)*listQuery.limit+1}} through
        {{page*listQuery.limit>total?total:page*listQuery.limit}} records for a total of
        {{total}} records.
      </div>

      <pagination
              v-show="total>listQuery.limit"
              :total="total"
              :page.sync="page"
              :limit.sync="listQuery.limit"
              layout='prev, pager, next'
              @pagination="getList"/>
    </div>


    <el-dialog :visible.sync="addDlg"
               width="900px"
               custom-class="ad_public_modal title-center"
               :title="diaTitle" @close="closeDiglog">
      <el-input
        :rows="4"
        v-model="addQuery.notice"
        type="textarea"
        :placeholder="$t('selfHelp_competition.enter_cont')"/>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDlg = false">{{$t('modal.cancel')}}</el-button>
        <el-button type="primary" @click="submitNotice">{{$t('modal.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/common_components/pagination'
import search from '../common/search'

export default {
  name: 'MatchNotice',
  components: {
    Pagination,
    search
  },
  data() {
    return {
      addQuery: {
        event_id: parseInt(this.$route.query.id),
        notice: ''
      },
      event_task: [], // 题目列表
      task_id: '', // 题目id
      diaTitle: this.$t('selfHelp_competition.add_noticy'), // 弹窗题目
      noticeId: false, // 公告id
      addDlg: false,
      ids: [],
      matchList: [],
      topicList: [],
      topic: '',
      noiceType: 1, // 公告类型
      tableKey: 0,
      total: 1,
      page: 1,
      listQuery: {
        offset: 0,
        limit: 10,
        search: '',
        order: 'asc',
        event: this.$route.query.id
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getSearchVal(val){
      this.listQuery.search=val
      this.getList();
    },
    topNoice(init) { // 置顶、取消置顶
      const data = {
        ids: this.ids,
        is_topped: init
      }
      if(this.ids.length<=0){
        return
      }

      if (this.noiceType === 1) {
        this.$http.patch('/api/sponsor//event_notices/batch_top',data).then(res => {
          if(res.data.success){
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('api_message.operation_success'),
            });
            // this.$message.success('操作成功')
            this.getList()
            this.ids = []
          }

        })
      } else {
        this.$http.patch('/api/sponsor/event_task_notices/batch_top',data).then(res => {
          if(res.data.success){
            this.$notify.success({
              title:this.$t('dialog_list.tips'),
              message:this.$t('api_message.operation_success'),
            });
            // this.$message.success('操作成功')
            this.getList()
            this.ids = []
          }
        })
      }
    },
    romoveNoice() { // 删除
      const data = { ids: this.ids }
      if(this.ids<=0){
        return
      }

      this.$confirm(this.$t('selfHelp_competition.delete_sure'), this.$t('dialog_list.tips'), {
        confirmButtonText: this.$t('modal.confirm'),
        cancelButtonText: this.$t('modal.cancel'),
        customClass:'public_confirm public_confirm_sm',
        type: 'warning'
      }).then(() => {


        if (this.noiceType === 1) {
          this.$http.delete('/api/sponsor/event_notices/batch_destroy',{data}).then(res => {
            if (res.data.success) {
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message:this.$t('api_message.operation_success'),
              });
              // this.$message.success('删除成功')
              this.getList()
              this.ids = []
            }
          })
        } else {
          this.$http.delete('/api/sponsor/event_task_notices/batch_destroy',{data}).then(res => {
            if (res.data.success) {
              this.$notify.success({
                title:this.$t('dialog_list.tips'),
                message:this.$t('api_message.operation_success'),
              });
              // this.$message.success('删除成功')
              this.getList()
              this.ids = []
            }
          })
        }

      }).catch(res=>{})
    },
    handleType() { // 切换公告、提示
      this.ids = []
      this.page = 1
      this.getList()
    },
    submitNotice() { // 发布、编辑 公告
      if (this.noticeId) {
        this.noiceType === 1 ? this.updateNoice() : this.updateTIP()
      } else {
        this.noiceType === 1 ? this.addNoice() : this.addTIP()
      }
    },
    updateNoice() { // 提交公告编辑
      this.$http.patch('/api/sponsor/event_notices/'+this.noticeId, this.addQuery).then(res => {
        if (res.data.success) {
          this.getList()
          this.addDlg = false
          this.noticeId = ''
        }
      })
    },
    updateTIP() { // 提交提示编辑
      this.$http.patch('/api/sponsor/event_task_notices/'+this.noticeId, this.addQuery).then(res => {
        if (res.data.success) {
          this.getList()
          this.addDlg = false
          this.noticeId = ''
        }
      })
    },
    addTIP() { // 提交新增提示
      const data = this.addQuery
      data.task_id = this.task_id
      this.$http.post('/api/sponsor/event_task_notices',data).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title:this.$t('dialog_list.tips'),
            message:this.$t('api_message.operation_success'),
          });
          // this.$message.success('新增成功')
          this.getList()
          this.addDlg = false
        }
      })
    },
    addNoice() { // 提交新增公告
      this.$http.post('/api/sponsor/event_notices',this.addQuery).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title:this.$t('dialog_list.tips'),
            message:this.$t('api_message.operation_success'),
          });
          // this.$message.success('新增成功')
          this.getList()
          this.addDlg = false
        }
      })
    },
    showDlg() {
      if (this.noiceType === 2 && !this.task_id) {
        this.$notify.error({
          customClass:'error_notify',
          title:this.$t('public.error'),
          message: this.$t('selfHelp_competition.chose_time')
        });

        // this.$message({
        //   message: '请选择题目',
        //   type: 'warning'
        // });
        return
      }
      this.diaTitle = this.$t('selfHelp_competition.add_noticy');
      this.addDlg = true
    },
    getList() {
      if (this.noiceType === 1) {
        this.getNoiceList()
      } else {
        this.getTopicList()
        this.getTipList()
      }
    },
    editNoice(row) { // 编辑公告
      this.noticeId = row.id
      if (this.noiceType === 1) {
        this.addQuery.notice = row.notice
        this.addQuery.event_id = row.event_id
      } else {
        this.addQuery.notice = row.notice
        this.addQuery.event_id = row.event_id
      }
      this.addDlg = true
    },
    getTopicList() { // 获取题目列表
      const params = {}
      params.event = this.$route.query.id
      this.$http.get('/api/sponsor/event_tasks',{params}).then(res => {
        this.topicList = res.data.rows
      })
    },
    getNoiceList() { // 获取公告列表
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      this.$http.get('/api/sponsor/event_notices',{params:this.listQuery}).then(res => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },
    getTipList() { // 获取提示列表
      this.listQuery.offset = (this.page - 1) * this.listQuery.limit
      const data = this.listQuery
      data.task_id = ''
      this.$http.get('/api/sponsor/event_task_notices',{params:data}).then(res => {
        this.matchList = res.data.rows
        this.total = res.data.total
      })
    },
    checkTable(val) { // 选择表格
      this.ids = val.map(item => {
        return item.id
      })
    },
    closeDiglog() {
      this.textarea = ''
      this.noticeId = ''
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .notice_manage{
    .def_btn {
      match-confirmbtn-md()
      width: 80px;
      height: 27px;
      line-height: 28px;
      padding: 0;
    }

    .page_info {
      color: #fff;
      float: left;
      line-height :30px;
    }
  }


</style>
