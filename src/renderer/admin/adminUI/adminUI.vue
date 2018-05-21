<template>
    <div id="admin"> 
      <div id="adminCollapsed" v-show="!shown">
        <a href="#" @click.stop.prevent="toggleShown()">admin</a>
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
  import UpdateApplication from './updateApplication/updateApplicationUI.vue'


  export default {
    props: ['adminObj'], 

    data () {
      return {
        shown: true,
        tabIndex: 0,
        tabs: [
          {name: 'update data', index: 0, isActive: true, hasBeenLoaded:false, childId: "adminUpdateData", uiToLoad: UpdateData},
          {name: 'edit presentation', index: 1, isActive: false, hasBeenLoaded:false, childId: "adminEditPresentation", uiToLoad: EditPresentation},
          {name: 'update application', index: 2, isActive: false, hasBeenLoaded:false, childId: "adminUpdateApplication", uiToLoad: UpdateApplication}
        ]
      }
    },

    mounted () {
      if(this.shown){
        // this is for debugging purposes so I don't have to open admin every time (when I'm working on it.)
        this.setActive(this.tabs[this.tabIndex]);  
      }
      //can access the admin object here.
      // console.log("slideshow's root element:", this.adminObj.slideshow().rootElem())
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
          new Vue({
            el: '#'+tab.childId,
            render: h => h(tab.uiToLoad,{ props: {adminObj: this.adminObj} })
          })
        }
        
      }
    }
  }


  
</script>

<style scoped lang="less">

</style>