<template>
    <div>
      <button type="button" class="btn btn-primary" @click="checkForUpdate" :disabled="updateButtonDisabled">check for data updates</button>

      <div v-if="!isOnline" class="updateContainer">
        <p class="text-danger">{{msg}}</p>
      </div>

      <div v-if="isOnline" class="updateContainer">
        <p class="text-warning">{{msg}}</p>
      </div>

      <div v-if="updateReady === 1" class="updateContainer">
        <p class="text-success">New data is available, click the button below to continue.</p>
        <button type="button" class="btn btn-primary" @click="fetchData">get latest data</button>
      </div>

      <div v-if="updateReady === -1" class="updateContainer">
        <p class="text-success">Your data is up to date. Nothing more to do here!</p>
      </div>

    </div>
</template>



<script>
  import Vue from 'vue'


  export default {
    props: ['adminObj'], 

    data () {
      return {
        updateButtonDisabled: false,
        isOnline: true,
        updateReady: 0, // 0 = not sure yet, -1 is no update available, 1 = update available
        msg:''
      }
    },
    mounted () {
      // console.log('inside updateApplicationUI', this.adminObj);
    
    },
    methods: {
      checkForUpdate(){
        this.updateReady = 0;
        this.updateButtonDisabled = true;
        this.adminObj.checkForDataUpdates(this.checkForDataUpdatesResult);  // returns {isOnline:true/false, dataAvailable:true/false, message:<ifFalse>{text:.., severity:...</if>}
      },

      checkForDataUpdatesResult(arg) {
        this.updateButtonDisabled=false;
        this.isOnline = arg.isOnline;
        this.msg = arg.message?arg.message.text:'';
        if(!this.isOnline){   // we're not online (or can't connect to the service.  get out.)
          return;
        }

        if(arg.dataAvailable){
          this.updateReady = 1;   // need to fetch data
        }else{
          this.updateReady = -1;  // data is up to date
        }
      },

      fetchData(){
        this.adminObj.getUpdatedData(this.fetchDataResult);
      },

      fetchDataResult(args){
        console.log('done fetching data', args)
      }
    }
  }


  
</script>

<style scoped lang="less">
  .updateContainer{
    margin-top: 30px;
  }
</style>