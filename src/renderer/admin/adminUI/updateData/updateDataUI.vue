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
        <br />
        <p>{{numberOfFilesToUpdateMsg}}</p>
        <div class="progress">
          <div class="progress-bar" role="progressbar" :style="{width: updatePercentComplete + '%'}" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
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
        numberOfFilesToUpdateMsg: '',
        updatePercentComplete: 0,
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
        this.numberOfFilesToUpdate = 0;
        this.adminObj.getUpdatedData(this.fetchDataProgress, this.fetchDataResult);
      },
      fetchDataProgress(percentComplete, totalNumber){ // 0 to 100
        this.numberOfFilesToUpdateMsg = totalNumber + ' data files to update';
        this.updatePercentComplete = percentComplete;
        console.log('in the process of fetching data', percentComplete)
      },
      fetchDataResult(arrayOfErrors){
        if(arrayOfErrors){
          console.log('done fetching data', arrayOfErrors)
        }else{
          console.log('complete, no errors!')
        }
        
      }
    }
  }


  
</script>

<style scoped lang="less">
  .updateContainer{
    margin-top: 30px;
  }
</style>