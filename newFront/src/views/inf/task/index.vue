<template>
  <div class="task_box">
    <ClickHere />

    <PlayerInfo />

    <div v-if="match.process !== 1">
      <!-- 蒙板 -->
      <div v-show="!hide" class="mask" />
      <!-- 场景描述-->
      <div class="description_box">
        <div class="description">
          <div class="title">
            <!--场景描述-->
            {{ $t("inf.sence_description") }}
          </div>
          <div :class="{ content_hide: hide }" v-html="content" />
          <div class="open" @click="hide = !hide">
            {{ hide ? $t("inf.open") : $t("inf.close") }}
          </div>
        </div>
      </div>
      <!--拓扑组件-->
      <topo
        v-if="topoShow"
        class="topo"
        :scene_type="scene_type"
        :container="container"
        :bar_list="bar_list"
        @handleTask="handleTask"
      />
    </div>
    <!-- 没有题目时显示图片 -->
    <div v-else style="text-align: center">
      <img src="@/assets/jad/context_gif.gif" alt>
    </div>

    <!--题目信息-->
    <el-dialog
      :visible.sync="isFlag"
      :title="$t('inf.Topic_information')"
      center
      @close="closed"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
        <!--题目名称-->
        <el-form-item :label="$t('inf.Topic_name')" prop="name">
          {{ node.name }}
        </el-form-item>
        <!--题目链接-->
        <el-form-item v-show="node.link" :label="$t('inf.Topic_link')">
          {{ node.link }}
        </el-form-item>
        <!--题目附件-->
        <el-form-item v-show="file" :label="$t('question.attDescription')">
          <a :href="file" download>
            <el-button type="primary" size="mini">{{
              $t("question.attachment")
            }}</el-button>
          </a>
        </el-form-item>
        <!-- IP -->
        <el-form-item v-show="node.ip" label="IP">
          {{ node.ip }}
        </el-form-item>
        <!--是提交flag 还是 上传报告-->
        <el-form-item v-if="isReport" label="FLAG" prop="flag">
          <el-input v-model="form.flag" />
        </el-form-item>

        <!--上传报告-->
        <el-form-item v-else :label="$t('inf.upload_report')">
          <UploadFile
            :file.sync="report"
            :file-type="['pdf', 'doc', 'docx']"
            :file-size="20 * 1024 * 1024"
          />
          仅可上传pdf、doc、docx，大小限制为20MB。
        </el-form-item>
      </el-form>
      <div
        v-for="(not, index) in tips"
        :key="not.notice + index"
        class="new-hint-b"
      >
        <img src="@/assets/match/contest_tips.png" alt="">
        <span>{{ not.notice }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">{{
          $t("question.submit")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import topo from './topo'
import UploadFile from '@/components/UploadFile'
import PlayerInfo from '@/components/PlayerInfo'
import ClickHere from '@/components/ClickHere'
import {
  getTask,
  subFlag,
  subReport,
  getTaskTip,
  getTaskFile
} from '@/api/inf'

export default {
  name: 'NoticeList',
  components: { topo, UploadFile, PlayerInfo, ClickHere },

  data() {
    return {
      topo: [], // 公告列表
      hide: true,
      id: this.$route.query.id,
      hash: this.$route.query.hash,
      content: '',
      scene_type: 3, // 场景有几层
      container: {
        dmz: {},
        internal_network: {},
        core_network: {},
        office_network: {}
      }, // 题目数据
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
                name: '设备',
                type: 'entity'
              }
            ]
          }
        ],
        img: {
          instance: require('@/assets/match/answered.png'),
          entity: require('@/assets/match/entity.png')
        }
      }, // 左侧操作栏数据

      node: {}, // 点击的题目信息
      tips: [],
      file: '', // 文件地址
      isFlag: false,
      isReport: false,
      form: {
        flag: '' // 填写的flag
      },
      report: '', //
      rules: {
        flag: [
          {
            required: true,
            message: this.$t('inf.fell_flag'),
            trigger: 'blur'
          },
          {
            min: 1,
            max: 100,
            message: this.$t('inf.lang_err100'),
            trigger: 'blur'
          }
        ]
      },
      topoShow: false
    }
  },
  computed: {
    ...mapGetters(['config', 'match'])
  },
  created() {
    this.getTask()
  },
  methods: {
    // 关闭弹框初始化数据
    closed() {
      this.form.flag = ''
      this.report = ''
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.clearValidate()
      }
    },
    // 子组件点击了题目，展示题目信息
    handleTask(node, container, k) {
      this.node = node
      // 获取题目提示
      const params = {
        event_id: this.id,
        task_id: node.task_uuid
      }
      getTaskTip(params).then((res) => {
        this.tips = res.data
      })

      getTaskFile(params).then((res) => {
        this.file = res.data.attachment
        this.isReport = res.data.entity_type
        this.isFlag = true
      })
    },
    // 提交flag 或报告
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // 是提交报告还是提交flag
          if (this.isReport) {
            this.form.challenge_hash = this.node.task_uuid
            this.form.event_hash = this.hash
            subFlag(this.form).then((res) => {
              if (res.data.success) {
                // this.$notify.error({
                //   customClass: "error_notify",
                //   title: this.$t("public.error"),
                //   message: this.$t("api_message." + res.data.message),
                // });
                this.$notify.success({
                  title: this.$t('dialog_list.tips'),
                  message: this.$t('api_message.submit_success')
                })
              }
            })
          } else {
            // 如果没有上传报告，请上传报告
            if (!this.report) {
              this.$notify.error({
                customClass: 'error_notify',
                title: this.$t('public.error'),
                message: this.$t('inf.upload_report_please')
              })
              return
            }
            const params = {
              event_id: this.id,
              challenge_id: this.node.task_uuid
            }
            const fm = new FormData()
            fm.append('file', this.report)
            subReport(params, fm).then((res) => {
              if (res.data.success) {
                // this.$notify.error({
                //   customClass: "error_notify",
                //   title: this.$t("public.error"),
                //   message: this.$t("api_message." + res.data.message),
                // });
                this.$notify.success({
                  title: this.$t('dialog_list.tips'),
                  message: this.$t('api_message.submit_success')
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取题目信息
    getTask() {
      getTask({ event_id: this.id }).then((res) => {
        const { data } = res
        this.content = data.scene_description_html
        this.scene_type = data.scene_type
        if (data.scene_data) {
          for (const key in this.container) {
            this.container[key] = data.scene_data[key]
          }
          this.topoShow = true
        }
      })
    },
    // 获取mac地址
    getMac() {
      getMac({ event_id: this.id }).then((res) => {
        const { data } = res
        if (data.mac.length > 0) {
          this.mac_addr.mac_addr = data.mac_addr.map((item) => {
            const obj = {}
            obj.value = item
            return obj
          })
        } else {
          this.isMac = true
          this.mac_addr = {
            mac_addr: [{ value: '' }]
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.task_box {
  margin: 15px auto 0;
  position: relative;
  min-width: 1340px;
  width: 80%;
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(1, 1, 1, 0.7);
    z-index: 995;
  }
  .description_box {
    width: 100%;
    margin: 0 auto;
    position: absolute;
    top: 70px;
    z-index: 996;
  }
  .description {
    border: 1px solid #3073fc;
    color: #fff;
    padding: 10px;
    margin-bottom: 15px;

    .title {
      font-size: 18px;
      color: #3073fc;
      margin-bottom: 15px;
    }

    .content_hide {
      height: 36px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .open {
      margin-top: 15px;
      cursor: pointer;
      text-align: right;
      color: #3073fc;
    }
  }

  .topo {
    margin-top: 160px;
  }

  .new-hint-b {
    margin-top: 10px;
    display: flex;
    align-items: center;
    color: #fff;
  }

  .new-hint-b span:before {
    border: solid transparent;
    border-right-color: #15cf98;
    content: " ";
    position: absolute;
    border-width: 8px;
    top: 5px;
    left: -16px;
  }

  .new-hint-b span {
    position: relative;
    margin: 6px 20px;
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #15cf98;
  }
}
</style>
