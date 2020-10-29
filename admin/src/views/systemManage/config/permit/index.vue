<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="200px" >
      <el-form-item label="产品名称">
        <el-input v-model.trim="form.product_name" disabled/>
      </el-form-item>
      <el-form-item label="产品型号">
        <el-input v-model.trim="form.product_model" disabled/>
      </el-form-item>
      <el-form-item label="授权类型">
        <el-input v-model.trim="form.authorized_type" disabled/>
      </el-form-item>
      <el-form-item label="许可时间">
        <el-input v-model.trim="form.permit_time" disabled/>
      </el-form-item>
      <el-form-item label="许可期限">
        <el-input v-model.trim="form.license_period" disabled/>
      </el-form-item>
      <el-form-item label="授权厂商">
        <el-input v-model.trim="form.product_company" disabled/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchAuthorize } from '@/api/dataCenter'

export default {
  data() {
    return {
      form: {
        product_name: '', // 产品名称：
        product_model: '', // 产品型号：
        authorized_type: '', // 授权类型：：
        permit_time: '', // 许可时间：：
        license_period: '', // 许可期限：：
        product_company: ''// 授权厂商：：
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchAuthorize().then(res => {
        for (const k in this.form) {
          this.form[k] = res.data[k]
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
