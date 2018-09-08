<template>
    <div>
      <p>Sample Component</p>
      <button type="button" class="btn btn-primary" @click="showStuff" >show stuff</button>

      <div v-if="showingStuff">
        <p id="sampleMessage" class="text-danger">{{msg}}</p>
      </div>

      
    </div>
</template>



<script>
  import Vue from 'vue'

   // using https://github.com/daneden/animate.css for animations

  export default {
    props: ['itm', 'uiElem'], 

    data () {
      return {
        showingStuff: false,
        msg: 'stuff'
       
      }
    },
    mounted () {
      window.addEventListener('resize', this.resize); // add an event listener in case you'll need to adjust on resize
    },
    methods: {
      showStuff(){
        this.showingStuff = true;
        document.getElementById('#sampleMessage').className='animated bounceOutLeft';
      },



      beforeDestroy: function () {
        // REMOVE all event listeners!
        window.removeEventListener('resize', this.resize) 
      },
      resize(event) { 
        // deal with resizing here
       },

    }
  }


  
</script>

<style scoped lang="less">
</style>