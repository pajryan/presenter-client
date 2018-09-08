<template>
    <div>
      <p>here</p>
      <button id="sampleMessage" type="button" class="btn btn-primary" @click="checkForUpdate" >check for data updates</button>

      <div v-if="updateReady==1" class="updateContainer">
        <p  class="text-danger">{{msg}}</p>
      </div>

      
    </div>
</template>



<script>
  import Vue from 'vue'
  import * as d3 from 'd3';
import { setTimeout } from 'timers';

  let ResizeObserver = require('resize-observer-polyfill');

  let parseDate = d3.timeParse("%m/%d/%y");
  // require('animate.css')

   // using https://github.com/daneden/animate.css for animations

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
        document.getElementById('sampleMessage').classList.add('animated')
        document.getElementById('sampleMessage').classList.add('bounce')
        // document.getElementById('sampleMessage').classList.remove('animated')
        // document.getElementById('sampleMessage').classList.remove('bounce')
        
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