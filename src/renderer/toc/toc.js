'use strict';

export function build(){
  let _rootElem,
      _admin,
      _slideshow
  
  function toc(){
    let p = document.createElement('p'); p.innerHTML = "TOC";
    _rootElem.appendChild(p)
  }


  toc.rootElem = function(val){
    if (!arguments.length) { return _rootElem; }
    _rootElem = val;
    return toc;
  }

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

