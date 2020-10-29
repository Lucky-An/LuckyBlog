<template>
  <div class="app-container notice_box">
    <countDown />
    <notice :list="list" />
  </div>
</template>

<script>
import notice from '@/components/notice'
import countDown from '@/components/countDown'
import { getNotice } from '@/api/inf'

export default {
  name: 'NoticeList',
  components: { notice, countDown },
  data() {
    return {
      list: []// 公告列表
    }
  },
  created() {
    this.getNotice()
  },
  methods: {
    getNotice() {
      getNotice({ event_id: this.$route.query.id }).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
