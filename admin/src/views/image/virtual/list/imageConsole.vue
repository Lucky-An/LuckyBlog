<template>
  <div class="app-container competition_box">
    <div class="container_bg remote_manage_wrapper">
      <div class="filter-container">
        <el-button
          v-waves
          class="filter-item pad_r_45"
          type="primary"
          @click="operationMethod('reboot')"
        >重启</el-button>
        <el-button
          v-waves
          class="filter-item pad_r_45"
          type="primary"
          @click="operationMethod('shutdown')"
        >关机</el-button>
      </div>

      <div v-if="url&&(url!=='null')" class="iframe-wrapper">
        <div v-if="showMask" class="getFocus" @click="getFocus" />
        <iframe id="iframe" :src="url" frameborder="0" style="width:100%;min-height:100%;" />
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'

import { startHost } from '@/api/match/property'
export default {
  name: 'ImageConsole',
  directives: { waves },

  data() {
    return {
      url: this.$route.query.url, // 链接的url
      instanceId: this.$route.query.instanceId,
      showMask: true
    }
  },

  mounted() {
    setTimeout(() => {
      this.getFocus()
    }, 1000)

    if (!this.url || this.url === 'null') {
      this.$message({
        type: 'error',
        message: '无法连接'
      })
      setTimeout(() => {
        window.opener = null
        window.open('', '_self')
        window.close()
      }, 5000)
    }
  },

  methods: {
    operationMethod(op) {
      if (op === 'shutdown') {
        this.$confirm(
          '关机操作将执行实例的销毁，是否将实例的本次修改结果保存?',
          '关机确认',
          {
            confirmButtonText: '保存',
            cancelButtonText: '放弃',
            type: 'warning'
          }
        )
          .then(() => {
            this.startHostMethod(op, true)
          })
          .catch(() => {
            this.startHostMethod(op)
          })
      } else {
        this.startHostMethod(op)
      }
    },

    startHostMethod(op, save) {
      startHost(this.instanceId, op, save).then(res => {
        const data = res.data
        if (data.success) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          if (op === 'shutdown') {
            this.$router.push('/image/virtual')
          }
        }
      })
    },

    getFocus() {
      this.showMask = false
      document.querySelector('#iframe').focus()
      document.querySelector('#iframe').onblur = () => {
        this.showMask = true
      }
    }
  }
}
</script>

<style lang="scss">
.remote_manage_wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .iframe-wrapper {
    width: 100%;
    height: 70vh;
    flex: 1;
    display: flex;
    position: relative;
  }
  .getFocus {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .file-info-wrapper {
    float: right;
    .file-info-box {
      margin-right: 20px;
    }
  }
  .el-button--primary:focus {
    background: #272e49 !important;
    border-color: #272e49 !important;
  }
}
</style>
