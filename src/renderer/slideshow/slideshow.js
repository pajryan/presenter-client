'use strict';
import Vue from 'vue'
// import Page from './page.js'

let Page = require("./page.js");

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
    prevPage = document.createElement("div"); prevPage.id="prevPage"; prevPage.className=doDebugView?"pageWrap pageWrapDebug":"pageWrap"
    currPage = document.createElement("div"); currPage.id="currPage"; currPage.className=doDebugView?"pageWrap pageWrapDebug":"pageWrap"
    nextPage = document.createElement("div"); nextPage.id="nextPage"; nextPage.className=doDebugView?"pageWrap pageWrapDebug":"pageWrap"
    slideshow.appendChild(prevPage);
    slideshow.appendChild(currPage);
    slideshow.appendChild(nextPage);
  }

  slideshow.adminClosed = function(){
    //runs when the admin panel is closed
  }

  slideshow.launchPresentation = function(sectionIndex=0, pageIndex=0) {
    section = _admin.getActivePresentation().presentation.sections[sectionIndex];
    console.log('current section', section)
    document.getElementById("slideshow").style.display="block";
    console.log("the element", currPage)
    new Page(section.pages[pageIndex], currPage);

  }

  slideshow.closePresentation = function() {
    document.getElementById("slideshow").style.display="none";
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

