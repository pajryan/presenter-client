<template>
    <div id="admin" :style="shown?'height:100%':''"> 
      <div id="adminCollapsed" v-show="!shown" class="navbar fixed-bottom " style="text-align:right">
        <a href="#" @click.stop.prevent="toggleShown()" style="width:100%"><font-awesome-icon :icon="icon" /></a>
      </div>

      <div id="adminShown" v-show="shown">
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm">
              <h3>Presenter Admin</h3>
            </div>
            <div class="col-sm">
              <button type="button" class="close" aria-label="Close" @click.stop.prevent="toggleShown()"><span aria-hidden="true">&times;</span></button>
            </div>
          </div>
        </div>
        
        <ul class="nav nav-tabs">
          <li v-for="tab in tabs" class="nav-item"  :key="tab.index">
            <a href="#" class="nav-link" :class="{active:tab.isActive}" @click.stop.prevent="setActive(tab)">{{ tab.name }}</a>
          </li>
        </ul>
        <div class="tab-content">       
          <div v-for="tab in tabs" :key="tab.index" class="tab-pane" :class="{active:tab.isActive}">
            <div :id="tab.childId">{{tab.childId}}</div>
          </div>
        </div>
      </div>
    </div>
</template>




<script>
  import Vue from 'vue'
  import UpdateData from './updateData/updateDataUI.vue'
  import EditPresentation from './editPresentation/editPresentationUI.vue'
  import ManagePresentations from './managePresentations/managePresentationsUI.vue'
  import UpdateApplication from './updateApplication/updateApplicationUI.vue'
  import ConfigureApplication from './configuration/configurationUI.vue'

  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faCog from '@fortawesome/fontawesome-free-solid/faCog'


  export default {
    props: ['adminObj'], 
    computed: { icon () { return faCog} },
    components: { FontAwesomeIcon },
    data () {
      return {
        shown: false,
        tabIndex: 0,
        tabs: [
          {name: 'update data', index: 0, isActive: true, hasBeenLoaded:false, childId: "adminUpdateData", uiToLoad: UpdateData},
          {name: 'manage presentations', index: 1, isActive: false, hasBeenLoaded:false, childId: "adminManagePresentation", uiToLoad: ManagePresentations},
          {name: 'edit presentation', index: 2, isActive: false, hasBeenLoaded:false, childId: "adminEditPresentation", uiToLoad: EditPresentation},
          {name: 'update application', index: 3, isActive: false, hasBeenLoaded:false, childId: "adminUpdateApplication", uiToLoad: UpdateApplication},
          {name: 'configuration', index: 4, isActive: false, hasBeenLoaded:false, childId: "adminConfiguration", uiToLoad: ConfigureApplication}
        ],
        vues:[]
      }
    },
    mounted () {
      if(this.adminObj.firstTimeUser()){
        this.tabIndex = 4;
        this.shown = true;
        this.setActive(this.tabs[this.tabIndex]);  
      }
      // this is for debugging purposes so I don't have to open admin every time (when I'm working on it.)
      // if(this.shown){
      //   this.setActive(this.tabs[this.tabIndex]);  
      // }
    },

    methods: {
      toggleShown () {
        this.shown = !this.shown;
        if(this.shown){
          this.setActive(this.tabs[this.tabIndex]);
        }
      },
      setActive (tab) {
        this.tabs.forEach( t => { t.isActive = false; });
        tab.isActive = true;
        this.tabIndex = tab.index;  //store so when the user returns to admin, they're where they left off

        //build the tabs on-demand so we dont use resources that are never used.
        if(!tab.hasBeenLoaded){
          tab.hasBeenLoaded = true;
          this.vues[tab.index] = new Vue({
            el: '#'+tab.childId,
            render: h => h(tab.uiToLoad, { props: {adminObj: this.adminObj } })
          })
        }else{
          // call the child tab's getPresentations function to refresh the list of presentations.  This matters e.g. when a new presentation has been created in "edit presentation", then the user comes back to "manage presentation". We want the new presentation to appear
          if(this.vues[tab.index].$children[0].getPresentations){
            this.vues[tab.index].$children[0].getPresentations()
          }
        }
      }
    }
  }


  
</script>

<style scoped lang="less">
  .fa-cog{
    height: 25px;
    width: 25px;
  }
  .fa-cog path{
    fill: #666;
  }
</style>