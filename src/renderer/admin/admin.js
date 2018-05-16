'use strict';

export function build(){
  let _rootElem,
      _toc,
      _slideshow;

  
  function admin(){
    let p = document.createElement('p'); p.innerHTML = "admin";
    _rootElem.appendChild(p)
  }


  admin.rootElem = function(val){
    if (!arguments.length) { return _rootElem; }
    _rootElem = val;
    return admin;
  }

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

