<template>
    <div >
        {{ msg }}
    </div>
</template>



<script>
  import Vue from 'vue'




  export default {
    data () {
      return {
        msg: 'Data update UI'
      }
    }
  }


  
</script>

<style scoped lang="less">
  @color: #008edc;
  h1 {
      color: @color;
  }
</style>