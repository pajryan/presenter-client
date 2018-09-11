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
        sections:[]
      }
    },
    mounted () {
      let activePresentation = this.adminObj.getActivePresentation();
      this.sections = activePresentation.presentation.sections.map((s, i) => {
        
        if(!s.thumbnail){ s.thumbnail = '/images/thumbnails/_default-logoDots.png'}   // default any missing thumbnails to the logo dots
        if(!s.title){ s.title = 'Section ' + (i+1)}           // default any missing title to the section number

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
  background: #fff linear-gradient(-45deg, rgba(189,220,232, 0.4), white);
}


</style>