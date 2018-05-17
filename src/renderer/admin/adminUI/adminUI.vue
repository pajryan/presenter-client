<template>
    <div id="admin">
        <h3>Presenter Admin</h3>
        <ul class="nav nav-tabs">
          <li v-for="tab in tabs" class="nav-item"  :key="tab.id">
            <a href="#" class="nav-link" :class="{active:tab.isActive}" @click.stop.prevent="setActive(tab)">{{ tab.name }}</a>
          </li>
        </ul>
        <div class="tab-content">
          <div v-for="tab in tabs" :key="tab.id" class="tab-pane" :class="{active:tab.isActive}">
            <div :id="tab.childId">{{tab.childId}}</div>
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
    data () {
      return {
        tabs: [
          {name: 'update data', id: 0, isActive: true, childId: "adminUpdateData", uiToLoad: UpdateData},
          {name: 'edit presentation', id: 1, isActive: false, childId: "adminEditPresentation", uiToLoad: EditPresentation},
          {name: 'update application', id: 2, isActive: false, childId: "adminUpdateApplication", uiToLoad: UpdateApplication}
        ]
      }
    },

    mounted () {
      this.setActive(this.tabs[0]);
    },
    
    methods: {
      setActive (tab) {
        this.tabs.forEach( t => { t.isActive = false; });
        tab.isActive = true;
        //build the UI
        console.log('making this id active', tab.childId)
        new Vue({
          el: '#'+tab.childId,
          render: h => h(tab.uiToLoad)
        })
      }
    }
  }


  
</script>

<style scoped lang="less">
  @color: #008edc;
  h1 {
      color: @color;
  }
</style>