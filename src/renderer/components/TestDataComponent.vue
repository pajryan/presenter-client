<template>
    <div>
      <p>This number is updated from the data tab in admin</p>
      <p  class="text-danger">{{d.passedValue}}</p>
    </div>
</template>



<script>
  import Vue from 'vue'
  // const fileData = require('file://Users/patrickryan/Library/Application%20Support/Electron/_data/DoubleNumber.json')

   // using http://animejs.com/documentation/ for animations

  export default {
    props: ['itm', 'uiElem', 'data'], 

    data () {
      return {
        showingStuff: false,
        d: this.data[0][0]
      }
    },
    mounted () {
      window.addEventListener('resize', this.resize); // add an event listener in case you'll need to adjust on resize
      console.log('in the component',this.itm)
      
      // if this is expecting data, make sure we got it.  this.data is an array of data objects (from files)
      //  if there was an error reading in the file, data[n] will be {error: <errorMsg>, filename: <filename>}
      this.data.forEach(d => {
        if(d.error){
          console.error('do something about this!', error)
        }else{
          console.log('inside component with data', this.data)
        }
      })
    },
    methods: {
      showStuff(){
        this.showingStuff = true;

        anime({
          targets: document.getElementById('sampleButton'),
          translateX: 500
        });
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