<script>
</script>
<template>
    <div>
      <table class="table table-sm" >
        <thead>
          <tr>
            <th @click="sortTableBy('title')">presentation title</th>
            <th @click="sortTableBy('version')">version</th>
            <th @click="sortTableBy('author')">author</th>
            <th @click="sortTableBy('creationDate')">last update</th>
          </tr>
        </thead>
        <tbody id="presentationTableBody">
          <tr v-for="presentation in presentations" :key="presentation.metadata.id" :class="activePresentationId==presentation.metadata.id?'table-success':''">
            <td :title="presentation.metadata.id">{{presentation.metadata.title}}</td>
            <td>{{presentation.metadata.version}}</td>
            <td>{{presentation.metadata.author}}</td>
            <td>{{formatDt(new Date(presentation.metadata.creationDate))}}</td>
            <td><button type="button" class="btn btn-primary btn-sm" @click="makeActive(presentation.metadata.id)" :disabled="activePresentationId==presentation.metadata.id">make active</button></td>
            <td><button type="button" class="btn btn-primary btn-sm" @click="duplicatePresentation(presentation.metadata.id)">duplicate</button></td>
            <td><button type="button" class="btn btn-primary btn-sm" @click="deletePresentation(presentation.metadata.id)" :disabled="activePresentationId==presentation.metadata.id">delete</button></td>
            <td><button type="button" class="btn btn-primary btn-sm" @click="publishPresentation(presentation.metadata.id)">publish</button></td>
          </tr>
        </tbody>
      </table>
      
      <div>
        default state: 
          list available presentations<br />

        presentation specific:
          publish a given presentation for other clients<br />
        
        global
          download published presentations<br />

        {{msg}}</div>
    </div>
</template>



<script>
  import Vue from 'vue'
  import * as d3 from 'd3';
  let formatDate = d3.timeFormat("%m/%d/%y %I:%M%p");


  export default {
    props: ['adminObj'], 
    data () {
      return {
        msg: 'manage presentations UI',
        presentations: [],
        activePresentationId:"",
        currentSortKey:""
      }
    },
    mounted () {
      this.getActivePresentation();
      this.getPresentations()
      console.log("availabel prsentations", this.presentations);
    },
    methods:{
      formatDt(dt){
        return formatDate(dt);
      },
      getPresentations(){
        this.presentations = this.adminObj.getPresentations();
      },
      getActivePresentation(){
        this.activePresentationId = this.adminObj.getActivePresentationId();
      },
      makeActive(id){
        this.adminObj.setActivePresentation(id);
        this.getActivePresentation();
      },
      duplicatePresentation(id){
        let newPresentation = this.adminObj.duplicatePresentation(id);
        //insert the new presentation immediately after the one copied
        let idx = this.presentations.findIndex(p => p.metadata.id == id);
        this.presentations.splice(idx+1,0,newPresentation);
        this.highlightBriefly(idx+1)
      },
      deletePresentation(id){
        this.adminObj.deletePresentation(id);
        this.presentations = this.presentations.filter(f => f.metadata.id!=id); //filter out of UI
      },
      publishPresentation(id){
        this.adminObj.publishPresentation(id, res => console.log('result in managePresentationsUI.vue', res));
      },
      highlightBriefly(idx){
        setTimeout( function(idx){ document.getElementById("presentationTableBody").childNodes[idx].className="table-info"} ,200,idx)
        setTimeout( function(idx){ document.getElementById("presentationTableBody").childNodes[idx].className=""} ,2200,idx)
      },
      sortTableBy(key) {
        this.presentations = this.presentations.sort((a,b) => {
          if(key==this.currentSortKey){
            this.currentSortKey="";
            return a.metadata[key]>b.metadata[key] ? -1 : 1;
          }else{
            this.currentSortKey = key;
            return a.metadata[key]>b.metadata[key] ? 1 : -1;
          }
        })
      }
    }
  }


  
</script>

<style  lang="less">
  th{
    cursor: pointer;
  }
</style>