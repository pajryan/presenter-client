<template>
    <div id="toc" style="height:100%" v-if="sectionsLoaded">
        <coverflow 
        :coverList="sections" 
        :index="0" 
        bgColor="transparent"
        :coverFlat="false"
        @change="coverflowChange"
        @selected="coverSelected"
        ></coverflow>
    </div>
</template>



<script>
  import Vue from 'vue';
  import coverflow from './coverflow/coverflow.vue'

  export default {
    props: ['adminObj'], 

    data () {
      return {
        sectionsLoaded: false,  //don't build the component until the sections are populated
        sectionsFake: [],
        sections:[
          // {cover: 'http://ogu51f989.bkt.clouddn.com/react.png', title: 'one'},{cover: 'http://ogu51f989.bkt.clouddn.com/angular.png', title: 'two'}, {cover: 'http://ogu51f989.bkt.clouddn.com/vue.png', title: 'three'}, {cover: 'http://ogu51f989.bkt.clouddn.com/webpack.png', title: 'four'}, {cover: 'http://ogu51f989.bkt.clouddn.com/yarn.png', title: 'five'}, {cover: 'http://ogu51f989.bkt.clouddn.com/webpack.png', title: 'four'}, {cover: 'http://ogu51f989.bkt.clouddn.com/vue.png', title: 'three'}, {cover: 'http://ogu51f989.bkt.clouddn.com/angular.png', title: 'two'}, {cover: 'http://ogu51f989.bkt.clouddn.com/react.png', title: 'one'}
        ]
      }
    },
    mounted () {
      let activePresentation = this.adminObj.getActivePresentation();
      this.sections = activePresentation.presentation.sections.map(s => {
        return { cover: require ('./../assets' + s.thumbnail), title: s.title }
      });
      this.sectionsLoaded = true;
    },
    beforeDestroy: function () {
    },
    methods: {
      coverSelected: function(idx){
        //launch the slideshow directly
        this.adminObj.slideshow().launchPresentation(idx);
      },
      coverflowChange: function(idx){
        // console.log('got change event', a)
      }
    },
    components: {
      coverflow
    }
  }


  
</script>

<style scoped lang="less">

.coverflow{
  border: 2px solid red;
}


</style>