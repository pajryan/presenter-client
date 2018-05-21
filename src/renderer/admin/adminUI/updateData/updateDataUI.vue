<template>
    <div>
      <button type="button" class="btn btn-primary" @click="checkForUpdate" :disabled="updateButtonDisabled">check for data updates</button><!--:disabled="updateButtonDisabled"-->
        {{ msg }}
    </div>
</template>



<script>
  import Vue from 'vue'


  export default {
    props: ['adminObj'], 

    data () {
      return {
        updateButtonDisabled: false,
        msg: 'Data update UI'
      }
    },
    mounted () {
      // console.log('inside updateApplicationUI', this.adminObj);
    
    },
    methods: {
      checkForUpdate(){
        this.updateButtonDisabled = true;
        let updateAvailable = this.adminObj.checkForDataUpdates();
        // console.log("going to writ to path", this.adminObj.state().appPath)
        
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