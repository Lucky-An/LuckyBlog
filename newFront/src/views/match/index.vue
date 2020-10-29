<template>
  <div class="container">
    <myHeader />
    <router-view />
  </div>
</template>

<script>
import myHeader from './header'
export default {
  name: 'Match',
  components: {
    myHeader
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}
</style>
