<template>
  <div>
    <div class="click_here">
      <!--如果没有一个条件是真的，那么下拉框是个空，所以直接隐藏按钮。-->
      <el-dropdown
        v-if="!(!token&&match.event_mode !== 1&&!mac)"
        trigger="click"
        @command="handleCommand"
      >
        <el-button
          class="click_btn"
          type="primary"
          size="mini"
          plain
        >
          <div class="fcenter">
            <span> <br>Click Here<br><br> </span>
            <i class="el-icon-arrow-down el-icon--right" />
          </div>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!--是否展示token，其他项如果有判断可自行添加。-->
          <el-dropdown-item v-if="token">Token查看</el-dropdown-item>

          <!--vpn密钥-->
          <el-dropdown-item
            v-if="match.event_mode === 1"
            command="key"
          >{{ $t("click_here.key") }}</el-dropdown-item>

          <a
            v-if="match.event_mode === 1"
            href="/media/vpn/vpn_app.zip"
            download
          >
            <el-dropdown-item>{{ $t("click_here.download") }}</el-dropdown-item>
          </a>
          <!--是否展示mac-->
          <el-dropdown-item
            v-if="mac"
            command="mac"
          >{{
            $t("click_here.maintenance")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--填写mac信息-->
    <el-dialog
      :visible.sync="isMac"
      :title="$t('inf.mac')"
      center
      :modal="bol"
      :close-on-click-modal="bol"
      :show-close="bol"
      @close="closed"
    >
      <el-form
        ref="macForm"
        :model="mac_addr"
      >
        <el-form-item
          v-for="(mac, index) in mac_addr.mac_addr"
          :key="index"
          :prop="'mac_addr.' + index + '.value'"
          :rules="[
            { required: true, message: $t('inf.mac_rules'), trigger: 'blur' },
            { validator: check, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="mac.value"
            placeholder="aa:bb:cc:dd:ee:ff"
            style="width: 80%; margin-right: 10px"
            size="small"
          />
          <el-button
            v-if="mac_addr.mac_addr.length < 3"
            type="primary"
            icon="el-icon-plus"
            circle
            size="mini"
            @click="addMac"
          />
          <el-button
            v-if="mac_addr.mac_addr.length > 1"
            type="danger"
            icon="el-icon-minus"
            circle
            size="mini"
            @click="remoceMac(index)"
          />
        </el-form-item>
      </el-form>

      <!--2 线下赛-->
      <div
        v-if="match.event_mode === 2"
        class="mac_des"
      >
        <p>1、请填写接入竞赛网络的物理网卡MAC地址</p>
        <p>2、虚拟机桥接接入，需要填写虚拟机网卡MAC地址，NAT接入则无需填写。</p>
        <p>3、比赛过程中在赛题页面可以随时编辑修改MAC地址。</p>
      </div>
      <!--1 线上赛-->
      <div
        v-if="match.event_mode === 1"
        class="mac_des"
      >
        <p>1、通过物理机或者虚拟机连接OpenVPN,并填入OpenVPN网卡的MAC地址。</p>
        <p>2、物理机连接OpenVPN，虚拟机接入只能使用NAT模式。</p>
        <p>3、比赛过程中在赛题页面可以随时编辑修改MAC地址。</p>
      </div>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitMAC"
        >
          <!--确定-->
          {{ $t("modal.confirm") }}
        </el-button>
        <el-button
          v-if="isMacNull"
          @click="closeMacDia"
        >
          <!--关闭-->
          {{ $t("modal.close") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { commonRequest } from '@/api/match'
import { mapGetters } from 'vuex'
import { checkFileAvailable } from '@/utils/download'
import { downloadFile } from '@/api/common'

export default {
  name: 'Index',
  props: {
    token: {
      type: Boolean,
      default: false
    },
    mac: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const that = this
    function check(rule, value, callback) {
      var reg = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/
      if (!reg.test(value)) {
        callback(new Error(that.$t('inf.mac_err')))
      } else {
        callback()
      }
    }

    return {
      url: {
        // 7种路由地址，对应不同的竞赛模式 竞赛类型 1攻防 2新攻防 3运维 4解题 5闯关 6rw 7理论
        1: 'att_def',
        2: 'jad',
        3: 'ops',
        4: 'jeopardy',
        5: 'layered',
        6: 'rw',
        7: 'theory',
        8: 'inf'
      },
      type: this.$route.query.type,
      id: this.$route.query.id,
      isMac: false, // 是否展示编辑mac信息
      isMacNull: false, // 没有填过mac则不展示关闭按钮
      mac_addr: {
        mac_addr: [{ value: '' }]
      },
      bol: false,
      check // 校验mac地址的方法
    }
  },
  computed: {
    ...mapGetters(['match'])
  },
  created() {
    if (this.mac) this.getMac()

    // this.$EventBus.$on("openMACDia", data => {
    //   this.openMACDia();
    // });
  },
  methods: {
    closeMacDia() {
      // const url = `/api/v1/common/web/evts/mac`;
      // const params = { event_id: this.id, evt: this.$route.query.hash };
      // // 公共方法，获取已经填写的mac地址
      // commonRequest(url, "get", params).then(res => {
      //   if (res.data.mac != null) {
      //     this.isMac = false;
      //   } else {
      //     this.$message({
      //       message: this.$t("api_message.not_mac"),
      //       type: "error"
      //     });
      //   }
      // });
      this.$refs.macForm.clearValidate()
      this.mac_addr.mac_addr = [{ value: '' }]
      this.isMac = false
    },
    openMACDia() {
      this.isMac = true
    },
    handleCommand(command) {
      if (command === 'mac') {
        this.isMac = true
        this.getMac()
      }
      if (command === 'key') {
        this.downloadKey()
      }
      if (command === 'vpn') {
        this.downloadVpn()
      }
    },
    closed() {
      this.$refs.macForm.clearValidate()
      this.mac_addr.mac_addr = [{ value: '' }]
    },
    // 获取mac地址
    getMac() {
      // const url = `/api/v1/${this.url[this.type]}/web/mac`
      const url = `/api/v1/common/web/evts/mac`
      const params = { event_id: this.id, evt: this.$route.query.hash }

      // 公共方法，获取已经填写的mac地址
      commonRequest(url, 'get', params).then(res => {
        const { data } = res
        if (data.success) {
          if (data.mac !== null && data.mac.length > 0) {
            this.isMacNull = true
            this.mac_addr.mac_addr = data.mac.map(item => {
              const obj = {}
              obj.value = item
              return obj
            })
          } else {
            if (this.match.process == 0) {
              this.isMacNull = false
              this.isMac = true
              this.mac_addr = {
                mac_addr: [{ value: '' }]
              }
            } else {
              this.isMacNull = true
            }
          }
        }
      })
    },
    // 增加mac
    addMac() {
      this.mac_addr.mac_addr.push({ value: '' })
    },
    // 删除mac
    remoceMac(i) {
      this.mac_addr.mac_addr.splice(i, 1)
    },
    // 提交mac地址
    submitMAC() {
      this.$refs['macForm'].validate(valid => {
        if (valid) {
          const arr = this.mac_addr.mac_addr
          for (let i = 0; i < arr.length; i++) {
            if (arr.filter(item => { return item.value === arr[i].value }).length > 1) {
              // mac地址不能重复
              this.$notify.error({
                customClass: 'error_notify',
                title: this.$t('public.error'),
                message: this.$t('inf.mac_repeat')
              })
              return
            }
          }

          // const url = `/api/v1/${this.url[this.type]}/web/mac`
          const url = `/api/v1/common/web/evts/mac`
          const params = { event_id: this.id, evt: this.$route.query.hash }
          const data = {}
          data.mac_addr = this.mac_addr.mac_addr.map(item => {
            return item.value
          })

          commonRequest(url, 'post', params, data).then(res => {
            const { data } = res
            if (data.is_close) {
              this.isMac = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 下载vpn密钥
    downloadKey() {
      downloadFile('/api/v1/common/web/evts/vpn_ca/download', {
        event_id: this.id
      }).then(res => {
        checkFileAvailable(res)
      })
    },
    // 下载vpn密钥
    downloadVpn() {
      downloadFile('/media/vpn/vpn_app.zip').then(res => {
        checkFileAvailable(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.click_here {
  position: fixed;
  bottom: 60px;
  right: 100px;
  z-index: 9999;

  .click_btn {
    background: url("~@/assets/match/big_list_btn.png");
    background-size: 100% 100%;
  }
}
.mac_des {
  color: #abaeba;
  p {
    margin: 10px 0;
  }
}
</style>
