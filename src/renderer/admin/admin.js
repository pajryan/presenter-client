'use strict';
import Vue from 'vue'
import AdminUI from './adminUI/AdminUI.vue'


export function build(){
  let _rootElem,
      _toc,
      _slideshow,
      _state;

  
  function admin(){
    let p = document.createElement('p'); p.innerHTML = "admin";
    _rootElem.appendChild(p);


    //build the admin UI
    new Vue({
      el: '#admin',
      render: h => h(AdminUI)
    })

  }


  admin.rootElem = function(val){
    if (!arguments.length) { return _rootElem; }
    _rootElem = val;
    return admin;
  }

  admin.state = function(val) {
    if (!arguments.length) { return _state; }
    _state = val;
    return admin;
  };

  admin.slideshow = function(val) {
    if (!arguments.length) { return _slideshow; }
    _slideshow = val;
    return admin;
  };

  admin.toc = function(val) {
    if (!arguments.length) { return _toc; }
    _toc = val;
    return admin;
  };

  return admin;
  
}

