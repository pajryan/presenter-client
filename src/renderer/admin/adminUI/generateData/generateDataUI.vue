<template>
    <div>
      <p>Use this section to generate new data files to be used in the presentation</p>
      <ol>
        <li>generate the data locally</li>
        <li>review the tablet to confirm everything looks good</li>
        <li>push the data to the server</li>
        <li>alert the users (email) that new data is available</li>
      </ol>

      <hr />

      <div id="globalVariableHolder">
        <h4>Global Variables</h4>
        <div v-for="globalInput in globalInputs" class=""  :key="globalInput.index">
          <label>{{ globalInput.label }}</label>
          <input :value="globalInput.defaultValue" />
        </div>
      </div>


      <div id="dataSourceHolder">
        <h4>
          Data Sources
          &nbsp;&nbsp;
          <button type="button" class="btn btn-primary btn-sm" @click="queryAndWriteAllDataSources()" :disabled="isRunningAllQueries" >run everything</button>
        </h4>
        
        <div v-for="dataSource in dataSources" class="dataSource"  :key="dataSource.index">
          <button type="button" class="btn btn-primary btn-sm" @click="queryAndWriteOneDataSource(dataSource)" :disabled="dataSource.isRunning">run</button>
          <label>{{ dataSource.name }}</label>
          <!-- messages -->
          <label :hidden="dataSource.successMsg==null"  class="alert alert-success">{{ dataSource.successMsg }}</label>
          <label :hidden="dataSource.errorMsg==null"  class="alert alert-danger">{{ dataSource.errorMsg }}</label>
          <!-- parameters -->
          <div v-for="parameter in dataSource.sqlParameters" class="dataSourceParameter"  :key="parameter.index">
            <label>{{ parameter.label }}</label>
            <input v-model="parameter.value" />
          </div>
          
        </div>
      </div>

    </div> 
      
</template>




<script>
  import Vue from 'vue'
  import dataSourceConfig from './dataSourceConfig.json'
  import queryRunner from './queryRunner.js'

  export default {
    props: ['adminObj'], 

    data () {
      return {
        shown: false,
        globalInputs: dataSourceConfig.globalInputs,
        dataSources: dataSourceConfig.dataSources,
        runAllQueriesCount: 0,
        isRunningAllQueries: false
      }
    },
    mounted () {
      // this.dataSources
      this.dataSources.forEach(d => {
        // use Vue.set to add new keys (https://vuejs.org/2016/02/06/common-gotchas/)
        Vue.set(d, 'isRunning', false)
        Vue.set(d, 'attempted', false)
        Vue.set(d, 'succeeded', false)

        Vue.set(d, 'successMsg', null)
        Vue.set(d, 'errorMsg', null)
      })
    },

    methods: {
      queryAndWriteOneDataSource (dataSource, callback = this.runResult) {
        dataSource.isRunning=true;
        dataSource.attempted=true;
        dataSource.successMsg = null;
        dataSource.errorMsg = null;
        console.log('-------------')
        console.log('running dataSource with', dataSource)
        let qr = new queryRunner(dataSource, callback)
      },

      // probably don't want to actually return all the results... could be huge
      runResult (result, dataSource){ // result is an object of {success:true, results:...} or {success:false, err: error}
        dataSource.isRunning = false;

        console.log('got result back', result)

        // we get here even if we've had an error. So check that the error message hasn't already been populated
        if(result.success && dataSource.errorMsg == null){
          dataSource.succeeded = true;
          dataSource.successMsg = 'received ' + result.result.length + ' record set(s), with a total of ' + result.result.reduce((p,c) => p + c)+ ' records'
        }else if(result.error != null){
          dataSource.errorMsg = 'error: ' + result.error
        }

        console.log('got to call back with ', result, dataSource)
      },


      queryAndWriteAllDataSources (currQuery = this.runAllQueriesCount) {
        console.log('******running query #', this.runAllQueriesCount)
        this.isRunningAllQueries = true;
        this.queryAndWriteOneDataSource(this.dataSources[currQuery], (result, dataSource) => {
          this.runResult(result, dataSource);
          if(this.runAllQueriesCount < this.dataSources.length){
            this.queryAndWriteAllDataSources(this.runAllQueriesCount++);
          }else{
            this.runAllQueriesCount = 0;
            this.isRunningAllQueries = false;
          }
        })
      }


      
    }
  }


  
</script>

<style scoped lang="less">
  #globalVariableHolder{
    margin-bottom: 40px;
  }

  .dataSource{
    padding: 4px 10px 4px 20px;
    border-bottom: 1px solid #ccc;
  }

  .dataSource label{
    font-weight: bold;
    padding-left: 15px;
    padding-top: 6px;
    padding-right: 10px;
  }

  .dataSource .alert{
    margin-bottom: 0 !important;
  }

  .dataSourceParameter label{
    margin-left: 43px;
    font-weight: normal;
    width: 250px;

  }
  
</style>