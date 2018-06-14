<template>
    
    <div>
      <p>{{msg}}</p>
    </div>
</template>



<script>
  import Vue from 'vue'


  export default {
    props: ['adminObj'], 

    data () {
      return {
        msg: 'manage text UI',           // only used/updated when the app update is checked, but comes back up to date (updateNotAvailable)
      }
    },
    mounted () {
      // console.log('inside updateApplicationUI', this.adminObj);
    },
    methods: {
      checkForUpdate(){
      }
    }
  }


  

  
</script>

<style scoped lang="less">

</style>