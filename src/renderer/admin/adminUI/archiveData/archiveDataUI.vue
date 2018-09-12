<template>
    <div>
      <p>Use this section to create archives of data and to revert to archived data</p>
      <ol>
        <li>Create archive: zip up all the data with a date/timestamp on the filename</li>
        <li>View arvhives: list of available archives</li>
        <li>Retrieve archive: download, unzip and install data</li>
      </ol>

      <hr />

      <button type="button" class="btn btn-primary btn-sm" @click="createArchive()" :disabled="isRunningArchive" >Create Archive</button>

      <br /><br />    
      <table>
        <thead>
         
        </thead>

        <tbody>
          <tr v-for="archive in existingArchives" :key="archive.index">
          </tr>
        </tbody>
      </table>

      

    </div> 
      
</template>




<script>
  import Vue from 'vue'

  export default {
    props: ['adminObj'], 

    data () {
      return {
        isRunningArchive: false,
        existingArchives: []
        
      }
    },
    mounted () {
      
    },

    methods: {
      createArchive(){
        this.adminObj.archiveLocalData();
      }
     
    }
  }


  
</script>

<style scoped lang="less">

  
</style>