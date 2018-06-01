<template>
    <div class="page" style="height:50%; width:50%; margin:auto;" >
        {{msg}}
    </div>
</template>



<script>
  import Vue from 'vue';

  export default {
    props: ['adminObj'], 

    data () {
      return {
        msg: "a page"
      }
    },
    mounted () {
      console.log("loading page")
    },
    beforeDestroy: function () {
    },
    methods: {
      coverflowChange: function(idx){
      }
    },
    components: {
      // coverflow
    }
  }


  
</script>

<style scoped lang="less">
  .page{
    background: #ffffcc;
  }


</style>