<template>
  <span class="select_add">
    <el-cascader
      :options="options2"
      @active-item-change="handleItemChange"
      @change="handleChange"
      v-model="selectedOptions"
      :placeholder="$t('login.country')"
      :props="props2"
    ></el-cascader>
  </span>
</template>

<script>
  import { getStorage, setStorage } from '@/utils/storage'

  export default {
    name: 'select_address',
    props:[],
    data(){
      return{
        options2: [],
        props2: {
          label:localStorage.lang=='EN'?'label_en':'label',
          value: 'value',
          children: 'cities'
        },
        selectedOptions: [],
        checkedStateNumber:0,
        queryList:{
          language:localStorage.lang=='EN'?'en':'zh'
        },
      }
    },
    created(){
      let params=this.queryList;
      this.$http.get('/api/personal/countrys',{params})
        .then((res)=>{
          this.options2 = res.data.rows;
          this.options2.forEach((item,index)=>{
            this.$set(this.options2[index], 'cities', [])
          })
        })
        .catch((err)=>{

        })
    },
    methods: {
      handleChange(value) {
        this.$emit('changed',this.selectedOptions)
      },
      handleItemChange(val){

        if(val.length==1){
          let params=this.queryList;
          this.$http.get('/api/personal/states?country_id='+val[0],{params})
            .then((res2)=>{
              if(val[0]==13128&&localStorage.lang!='EN'){
                res2.data.rows.forEach((item,i)=>{
                  this.$set(item, 'cities', [])
                })
              }
              for(let i = 0; i < this.options2.length; i++) {
                if(this.options2[i].value === val[0]) {
                  this.checkedStateNumber = i;
                  this.$set(this.options2[i], 'cities', res2.data.rows) // right
                  break;
                }
              }
            })
            .catch((err)=>{

            })
        }else if(val.length==2){
          let params=this.queryList;
          this.$http.get('/api/personal/citys?state_id='+val[1])
            .then((res)=>{
              let city = this.options2[this.checkedStateNumber].cities;
              for(let i = 0; i < city.length; i++) {
                if(city[i].value === val[1]) {
                  this.$set(city[i], 'cities', res.data.rows) // right
                  break;
                }
              }
            })
            .catch((err)=>{

            })
        }
      },
    },
    mounted () {

    }
  }
</script>

<style>
  .select_add .el-cascader *{
    color:white!important;
  }

</style>
