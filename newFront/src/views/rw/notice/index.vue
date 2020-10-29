<template>
  <div class="notice_box">
    <notice :list="list" />
  </div>
</template>

<script>
import notice from '@/components/notice'
import { getNotice } from '@/api/rw'

export default {
  name: 'NoticeList',
  components: { notice },
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
      getNotice({ evt: this.$route.query.hash }).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .notice_box{
    padding: 0 200px;
  }
</style>
