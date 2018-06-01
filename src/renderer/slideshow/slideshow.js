'use strict';
import Vue from 'vue'
import pageUI from './page.vue'

export function build(){
  let _rootElem,
      _admin,
      _toc,
      _state;
  
  let section=null,
      prevPage, currPage, nextPage;

  let doDebugView = true;

  function slideshow(){
    let slideshow = document.getElementById("slideshow");

    //build containers for previous, current and next page
    let prevPage = document.createElement("div"); prevPage.id="prevPage"; prevPage.className=doDebugView?"pageWrap pageWrapDebug":"pageWrap"
    let currPage = document.createElement("div"); currPage.id="currPage"; currPage.className=doDebugView?"pageWrap pageWrapDebug":"pageWrap"
    let nextPage = document.createElement("div"); nextPage.id="nextPage"; nextPage.className=doDebugView?"pageWrap pageWrapDebug":"pageWrap"
    slideshow.appendChild(prevPage);
    slideshow.appendChild(currPage);
    slideshow.appendChild(nextPage);
  }

  slideshow.adminClosed = function(){
    //runs when the admin panel is closed
  }

  slideshow.launchPresentation = function(sectionIndex, pageIndex=0) {
    section = _admin.getActivePresentation().presentation.sections[sectionIndex];
    console.log('current section', section)
    document.getElementById("slideshow").style.display="block";

  }

  /* 
    GETTERS / SETTERS 
  */
  slideshow.rootElem = function(val){
    if (!arguments.length) { return _rootElem; }
    _rootElem = val;
    return slideshow;
  }

  slideshow.state = function(val) {
    if (!arguments.length) { return _state; }
    _state = val;
    return slideshow;
  };

  slideshow.admin = function(val) {
    if (!arguments.length) { return _admin; }
    _admin = val;
    return slideshow;
  };

  slideshow.toc = function(val) {
    if (!arguments.length) { return _toc; }
    _toc = val;
    return slideshow;
  };
  
  return slideshow;
  
}

