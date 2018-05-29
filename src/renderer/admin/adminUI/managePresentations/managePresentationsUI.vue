<script>
</script>
<template>
    <div>
      <table class="table table-sm" >
        <thead>
          <tr>
            <th colspan="8">Presentations</th>
          </tr>
          <tr>
            <th @click="sortTableBy('title')">title</th>
            <th @click="sortTableBy('version')">version</th>
            <th @click="sortTableBy('author')">author</th>
            <th @click="sortTableBy('creationDate')">last update</th>
            <th colspan="4"></th>
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
            <td><button type="button" class="btn btn-primary btn-sm" @click="archivePresentation(presentation.metadata.id)" :disabled="activePresentationId==presentation.metadata.id">archive</button></td>
            <td><button type="button" class="btn btn-primary btn-sm" @click="publishPresentation(presentation.metadata.id)">publish</button></td>
          </tr>
        </tbody>

        <!-- newly created presentations -->
        <tfoot id="newlyDownloadedPresentations" v-if="newlyPublishedPresentations.length>0">
          <tr style="border-bottom:2px solid #ccc;"><th colspan="8" style="height:60px; vertical-align: bottom;">Newly downloaded presentations:</th></tr>
          <tr><td colspan="8" style="height:10px;"></td></tr>
          <tr v-for="presentation in newlyPublishedPresentations" :key="presentation.metadata.id" class="bg-warning">
            <td :title="presentation.metadata.id">{{presentation.metadata.title}}</td>
            <td>{{presentation.metadata.version}}</td>
            <td>{{presentation.metadata.author}}</td>
            <td>{{formatDt(new Date(presentation.metadata.creationDate))}}</td>
            <td colspan="4"><button type="button" class="btn btn-primary btn-sm" @click="importDownloadedPresentation(presentation.metadata.id)">import</button></td>
          </tr>
        </tfoot>
      </table>


      <div>
        <button type="button" class="btn btn-primary btn-sm" @click="downloadPresentations()">download published presentations</button>
      </div>
      


      <!-- achived presentations -->
      <p style="text-align:right; margin-top: 30px;"><a href="#" @click.stop.prevent="showArchived=!showArchived">show/hide archived presentations</a></p>
      <p v-if="showArchived && archivedPresentations.length==0" style="text-align:center">You have no archived presentations</p>
      <table class="table table-sm" v-if="showArchived && archivedPresentations.length>0">
        <thead>
          <tr>
            <th colspan="8"><i>Archived Presentations</i></th>
          </tr>
          <tr>
            <th @click="sortArchiveTableBy('title', 'alph')">title</th>
            <th @click="sortArchiveTableBy('version', 'num')">version</th>
            <th @click="sortArchiveTableBy('author', 'alph')">author</th>
            <th @click="sortArchiveTableBy('creationDate', 'num')">last update</th>
            <th colspan="2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="presentation in archivedPresentations" :key="presentation.metadata.id">
            <td :title="presentation.metadata.id">{{presentation.metadata.title}}</td>
            <td>{{presentation.metadata.version}}</td>
            <td>{{presentation.metadata.author}}</td>
            <td>{{formatDt(new Date(presentation.metadata.creationDate))}}</td>
            <td><button type="button" class="btn btn-primary btn-sm" @click="unarchivePresentation(presentation.metadata.id)">un-archive</button></td>
            <td><button type="button" class="btn btn-primary btn-sm" @click="deletePresentation(presentation.metadata.id)">delete forever</button></td>
          </tr>
        </tbody>
      </table>
    


      <div>
        
        TODO<br />
          download published presentations<br />

      </div>
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
        presentations: [],
        showArchived: false,
        archivedPresentations: [],
        activePresentationId:"",
        currentSortKey:"",
        newlyPublishedPresentations: []
      }
    },
    mounted () {
      this.getPresentations();
    },
    methods:{
      formatDt(dt){
        return formatDate(dt);
      },
      getPresentations(){
        // Note that this is ALSO called when the tabs are clicked on the admin interface
        this.presentations = this.adminObj.getPresentations();
        this.archivedPresentations = this.adminObj.getArchivedPresentations()
        this.getActivePresentation();
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
        this.highlightBriefly(idx+1);
        this.getPresentations();  //refresh the list
      },
      archivePresentation(id){
        this.adminObj.archivePresentation(id);
        this.getPresentations();  //refresh the list
      },
      unarchivePresentation(id){
        this.adminObj.unarchivePresentation(id);
        this.getPresentations();  //refresh the list
      },
      deletePresentation(id){
        this.adminObj.deletePresentation("deleted_"+id);
        this.getPresentations();  //refresh the list
      },
      publishPresentation(id){
        this.adminObj.publishPresentation(id, res => console.log('result in managePresentationsUI.vue', res));
      },
      highlightBriefly(idx){
        setTimeout( function(idx){ document.getElementById("presentationTableBody").childNodes[idx].className="table-info"} ,200,idx)
        setTimeout( function(idx){ document.getElementById("presentationTableBody").childNodes[idx].className=""} ,2200,idx)
      },
      downloadPresentations(){
        this.adminObj.downloadPresentations(this.downloadPresentationsResult);
      },
      downloadPresentationsResult(res){
        this.newlyPublishedPresentations = res.data.presentations;
      },
      sortTableBy(key) {
        this.presentations = this.presentations.sort((a,b) => {
          if(key==this.currentSortKey){
            if(type=='alph'){
              return a.metadata[key]>b.metadata[key] ? -1 : 1;
            }else{
              return a.metadata[key]-b.metadata[key]
            }
          }else{
            if(type=='alph'){
              return a.metadata[key]>b.metadata[key] ? 1 : -1;
            }else{
              return b.metadata[key]-a.metadata[key]
            }
          }
        });
        if(key == this.currentSortKey){
          this.currentSortKey = "";
        }else{
          this.currentSortKey = key;
        }
      },
      sortArchiveTableBy(key, type) {
        this.archivedPresentations = this.archivedPresentations.sort((a,b) => {
          if(key==this.currentSortKey){
            if(type=='alph'){
              return a.metadata[key]>b.metadata[key] ? -1 : 1;
            }else{
              return a.metadata[key]-b.metadata[key]
            }
          }else{
            if(type=='alph'){
              return a.metadata[key]>b.metadata[key] ? 1 : -1;
            }else{
              return b.metadata[key]-a.metadata[key]
            }
          }
        });
        if(key == this.currentSortKey){
          this.currentSortKey = "";
        }else{
          this.currentSortKey = key;
        }
      }
    }
  }


  
</script>

<style  lang="less">
  th{
    cursor: pointer;
  }

 
</style>