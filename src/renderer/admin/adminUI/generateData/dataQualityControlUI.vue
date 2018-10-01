<template>
    <div>
      <p>Data QA: </p>
      <ul>
        <li v-for="(qaMessage, i) in qaMessages" :key="i">
          {{qaMessage.filename}}:  {{qaMessage.label}}: {{qaMessage.value}}
        </li>
      </ul>
    </div>
</template>



<script>
  import Vue from 'vue'
  import fs from 'fs'
  import path from 'path'
  let qa = require('./dataQualityControlScripts')

  export default {
    props: ['dataSource', 'adminObj'], 

    data () {
      return {
        resultHandling: [],
        qaMessages: []
      }
    },
    mounted () {
      // goal here is to run the various QA queries and report back results
      //  all it needs is a datasource. It grabs the flat files (assumes they exist), and runs the qa
      this.resultHandling = this.dataSource.resultHandling;
      this.resultHandling.forEach(rh => {
        this.runOneQA(rh);
      })


      window.addEventListener('resize', this.resize); // add an event listener in case you'll need to adjust on resize
    },
    methods: {
      runOneQA: function(resultHandle){
        // get the file associated with this result
        let data = JSON.parse(fs.readFileSync(path.join(this.adminObj.getAppDataPath(), resultHandle.filename)))
        console.log('data for qa', data)

        // run each script against the data
        resultHandle.qa.scripts.forEach(s => {
          let qaResult = new qa(data, s)   // always come back inthe form {label:<label>, value:<value>}
          qaResult.filename = resultHandle.filename
          this.qaMessages.push(qaResult)
        })

        

      },

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