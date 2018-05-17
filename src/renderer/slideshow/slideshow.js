'use strict';

export function build(){
  let _rootElem,
      _admin,
      _toc,
      _state;
  
  function slideshow(){
    // let p = document.createElement('p'); p.innerHTML = "slidehow";
    // _rootElem.appendChild(p)
  }

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

