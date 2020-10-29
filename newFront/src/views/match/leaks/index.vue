<template>
  <div class="leaks">
    <iframe
      :src="`${protocol}//${hostname}:8082?user_id=${user.id}`"
      frameborder="0"
      style="width: 100%; height: calc(100vh - 100px)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  data() {
    return {
      protocol: location.protocol,
      hostname: location.hostname
    }
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped>
.leaks {
  padding-top: 10px;
}
</style>
