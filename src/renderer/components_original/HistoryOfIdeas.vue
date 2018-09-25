<template>
    <div>
      <p>herasdfasde</p>
      <button id="sampleMessage" type="button" class="btn btn-primary" @click="checkForUpdate" >check for data updates</button>

      <div v-if="updateReady==1" class="updateContainer">
        <p  class="text-danger">{{msg}}</p>
      </div>

      
    </div>
</template>



<script>
  import Vue from 'vue'
  import * as d3 from 'd3';
  import anime from 'animejs';

  let parseDate = d3.timeParse("%m/%d/%y");

  

   // using http://animejs.com/documentation/ for animations

  export default {
    props: ['adminObj', 'itm', 'uiElem'], 

    data () {
      return {
        updateReady: 0,
        msg: 'superhero'
       
      }
    },
    mounted () {
      console.log('inside HistoryOfIdeas.vue', this.uiElem);
      window.addEventListener('resize', this.resize);

    },
    methods: {
      checkForUpdate(){
        this.updateReady = 1;
        console.log('testing animation', document.getElementById('sampleMessage'))

        anime({
          targets: document.getElementById('sampleMessage'),
          translateX: 50,
          rotate: 90,
          scale: '2',
          duration: 0
        });

        
      },

      beforeDestroy: function () {
        window.removeEventListener('resize', this.resize)
      },

      resize(event) { 
        console.log('Got resize event inside HistoryOFIDEAS')
       },

    }
  }


  
</script>

<style scoped lang="less">
</style>