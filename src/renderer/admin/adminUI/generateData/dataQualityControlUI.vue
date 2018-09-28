<template>
    <div>
      <p>Data QA</p>
      <div>
        <p class="text-danger">{{dataSource}}</p>
      </div>
    </div>
</template>



<script>
  import Vue from 'vue'
  let qa = require('./dataQualityControlScripts')

  export default {
    props: ['dataSource'], 

    data () {
      return {
        msg: 'stuff'
      }
    },
    mounted () {
      window.addEventListener('resize', this.resize); // add an event listener in case you'll need to adjust on resize
    },
    methods: {

      beforeDestroy: function () {
        window.removeEventListener('resize', this.resize) 
      },
      resize(event) { 
        // deal with resizing here
       },

    }
  }


  
</script>

<style scoped lang="less">
</style>