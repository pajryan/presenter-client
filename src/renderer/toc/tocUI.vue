<template>
    <div id="coverflowWidget" style="height:100%">
      {{msg}}
      <!-- ORIGINAL, PX-based version
        <coverflow 
      :coverList="coverOpts.coverList" 
        :width="windowWidth" 
        :height="200"
        :coverWidth="150" 
        :index="0" 
        :coverShadow="true" 
        ></coverflow> -->

        <coverflow 
      :coverList="coverOpts.coverList" 
        :width="800" 
        
        :coverWidth="150" 
        :index="4" 
        :coverShadow="false" 
        bgColor="#333"
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
        msg:"here",
        windowWidth: 0,
        coverOpts: {
          coverList: [
            {cover: 'http://ogu51f989.bkt.clouddn.com/react.png', title: 'one'},
            {cover: 'http://ogu51f989.bkt.clouddn.com/angular.png', title: 'two'},
            {cover: 'http://ogu51f989.bkt.clouddn.com/vue.png', title: 'three'},
            {cover: 'http://ogu51f989.bkt.clouddn.com/webpack.png', title: 'four'},

            {cover: 'http://ogu51f989.bkt.clouddn.com/yarn.png', title: 'five'},

            {cover: 'http://ogu51f989.bkt.clouddn.com/webpack.png', title: 'four'},
            {cover: 'http://ogu51f989.bkt.clouddn.com/vue.png', title: 'three'},
            {cover: 'http://ogu51f989.bkt.clouddn.com/angular.png', title: 'two'},
            {cover: 'http://ogu51f989.bkt.clouddn.com/react.png', title: 'one'}

          ]
        }
      }
    },
    mounted () {
      // console.log('inside updateApplicationUI', this.adminObj);
    },
    beforeDestroy: function () {
    },
    methods: {
      coverSelected: function(idx){
        console.log('user selected', idx)
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