<template>
    <div>
      <p>Use this section to generate new data files to be used in the presentation</p>
      <ol>
        <li>generate the data locally</li>
        <li>review the tablet to confirm everything looks good</li>
        <li>push the data to the server</li>
        <li>alert the users (email) that new data is available</li>
      </ol>

      <ol style="color: red">
        <li>ALL DATA MUST HAVE AN END DATE! (so we can reproduce data; a compliance requirement)</li>
        <li>Link to the file itself</li>
        <li>Need to decide where to write these files. Currenly writing directly to the data dirctory (so pictures are update immediately). But maybe they need to get somewhere else?  On the other hand, maybe archiving takes care of this?</li>
        <li>Would be nice to click from a data file to the pictures that use it...</li>
        <li>Separately - should have a QC deck built in here that 1) has custom QC charts.  2) has all the 'live' pictures</li>
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
  import queryRunnerFileWriter from './queryRunnerFileWriter.js'

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
      /*
        Important Note: 
          Because some data might be quite large, I'm NOT going to return results here (just metadata)
          Instead, will STREAM the result of the query straight to a file.  This makes things a little harder to debug, but will ultimately be required due to the data

          Hang on... problem: if the files are too big to write - how will I be able to read them to generate a picture ..? 
          Maybe I should deal with file size HERE rather than in the various components that consume files...

          OK - going with this for now: will return results here as a json object and write to a file.
          It's simpler, and forces me to deal with file-size (memory) issues when I create the file (thereby not having to deal with it when I consume the files)
      */
      queryAndWriteOneDataSource (dataSource, callback = this.runResult) {
        dataSource.isRunning=true;
        dataSource.attempted=true;
        dataSource.successMsg = null;
        dataSource.errorMsg = null;
        console.log('running dataSource with', dataSource)
        let qr = new queryRunnerFileWriter(dataSource, this.adminObj.state(), callback)
      },

      // probably don't want to actually return all the results... could be huge
      runResult (result, dataSource){ // result is an object of {success:true, results:..., filesWritten:...} or {success:false, err: error}
        dataSource.isRunning = false;

        // we get here even if we've had an error. So check that the error message hasn't already been populated
        if(result.success && dataSource.errorMsg == null){
          dataSource.succeeded = true;
          dataSource.successMsg = 'received ' + result.result.length + ' record set(s), with a total of ' + result.result.reduce((p,c) => p + c)+ ' records. Wrote ' + result.filesWritten + ' file(s)';
        }else if(result.error != null){
          dataSource.errorMsg = 'error: ' + result.error
        }

      },


      queryAndWriteAllDataSources (currQuery = this.runAllQueriesCount) {
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