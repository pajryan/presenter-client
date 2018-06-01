'use strict';
import Vue from 'vue'
import tocUI from './tocUI.vue'

export function build(){
  let _rootElem,
      _admin,
      _slideshow,
      _state;
  

 
  function toc(){
    //build the admin UI
    new Vue({
      el: '#toc',
      render: h => h(tocUI, {
        props: {adminObj: _admin} 
      })
    })
  }

  toc.adminClosed = function(){
    //runs when the admin panel is closed
    // rebuild the toc ui
    toc();
    
  }



  /* 
    GETTERS / SETTERS 
  */
  toc.rootElem = function(val){
    if (!arguments.length) { return _rootElem; }
    _rootElem = val;
    return toc;
  }

  toc.state = function(val) {
    if (!arguments.length) { return _state; }
    _state = val;
    return toc;
  };

  // each element (slideshow, toc, admin have access to the other two)
  toc.slideshow = function(val) {
    if (!arguments.length) { return _slideshow; }
    _slideshow = val;
    return toc;
  };

  toc.admin = function(val) {
    if (!arguments.length) { return _admin; }
    _admin = val;
    return toc;
  };
  
  return toc;
  
}

