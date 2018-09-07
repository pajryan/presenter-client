'use strict';
import fontawesome from '@fortawesome/fontawesome'
import faFreeSolid from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faFreeSolid)

import Print from './print'
// import Page from './page.js'

let Page = require("./page.js");

export function build(){
  let _rootElem,
      _admin,
      _toc,
      _state;
  
  let isShown=false,
      section=null,
      pages = [],
      slideshowContainer,
      currentPageIndex = 0;

  let doDebugView = false;


  //t = current time,  b = start value,   c = change in value,  d = duration
  // https://gist.github.com/andjosh/6764939
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };

  function slideshow(){
    slideshowContainer = document.getElementById("slideshow");
    if(doDebugView){
      slideshowContainer.classList.add("debug");
    }
  }

  slideshow.adminClosed = function(){
    //runs when the admin panel is closed
  }

  slideshow.launchPresentation = function(sectionIndex=0, pageIndex=0) {
    let activePresentation = _admin.getActivePresentation().presentation;

    //make sure the passed sectionIndex and pageIndex are valid. if not, get out.
    if(sectionIndex+1 > activePresentation.sections.length){
      console.error('tried to open section ' + sectionIndex + ', which is outside the bounds of the available sections: ', activePresentation.sections)
      return;
    }
    if(pageIndex+1 > activePresentation.sections[sectionIndex].pages.length){
      console.error('tried to open page ' + pageIndex + ', which is outside the bounds of the available pages: ', activePresentation.sections[sectionIndex].pages)
      return;
    }

    this.clearPresentation();

    section = activePresentation.sections[sectionIndex];
    slideshowContainer.style.display="flex";  //show the slideshow container

    let printIconWrap = document.createElement('a'); printIconWrap.href='#'; printIconWrap.className = 'printIconWrap'; printIconWrap.title = 'Print';
    printIconWrap.addEventListener('click', e => {console.log('printing'); new Print(slideshow)})  
    let printIcon = document.createElement('i'); printIcon.innerHTML = 'print'; printIcon.className='fa fa-print printIcon';
    slideshowContainer.appendChild(printIconWrap);
    printIconWrap.appendChild(printIcon);
    
    fontawesome.dom.i2svg();  // this converts the <i> tag with the fontawsome class to the svg (remember to style an <svg>, not an <i>)

    section.pages.forEach((pageData, idx) => {
      let pageContainer = document.createElement("div"); pageContainer.classList.add("pageWrap");
      let pg = new Page(pageData, pageContainer, this, idx, _admin.getAppImagePath()); 
      slideshowContainer.appendChild(pageContainer);
      pages.push(pg);
    })

    // this is to force some right padding when in debug mode.  I can't set margin-right like I can with margin left.
    let deadSpace = document.createElement("div"); deadSpace.classList.add("deadspace");
    slideshowContainer.appendChild(deadSpace);
    isShown = true;

    // go the appropriate page
    this.goToPage(pageIndex, false)
  }

  slideshow.nextPage = function(animateScroll=true) {
    if(currentPageIndex+1 >= pages.length){
      return; //don't wrap, it's confusing
    }
    currentPageIndex++;
    this.goToPage(currentPageIndex, animateScroll);
  }

  slideshow.prevPage = function(animateScroll=true) {
    if(currentPageIndex-1 < 0 ){
      return; // don't wrap, it's confusing
    }
    currentPageIndex--;
    this.goToPage(currentPageIndex, animateScroll);
  }

  slideshow.toggleGridView = function(index=currentPageIndex){
    if(!isShown){return;}
    slideshowContainer.classList.toggle("debug");
    doDebugView = !doDebugView;
    this.goToPage(index, false);
  }

  slideshow.goToPage = function(index=0, animateScroll=true){
    let totalWidth = slideshowContainer.scrollWidth;
    let slideWidth = totalWidth / pages.length;
    
    if(doDebugView){
      slideWidth = totalWidth / (pages.length+1);  // this accounts for padding etc in the debug view. +1 to include the space on the sides
    }
    
    //store the current index
    currentPageIndex = index;

    if(!animateScroll){
      slideshowContainer.scrollLeft = slideWidth * index;

    }else{
      //animate the scrolling
      let start = slideshowContainer.scrollLeft,
                  change = (slideWidth * index) - start,
                  currentTime = 0,
                  increment = 20,
                  duration = 500;
      
      var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        slideshowContainer.scrollLeft = val;
        if(currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      };
      animateScroll();
    }
  }

  slideshow.clearPresentation = function(){
    // need to remove event listeners from the page navigation
    pages.forEach(p => {
      p.parentElem.querySelector('.upPageNav').removeEventListener('click', p.navEventUp);
      p.parentElem.querySelector('.leftPageNav').removeEventListener('click', p.navEventLeft);
      p.parentElem.querySelector('.rightPageNav').removeEventListener('click', p.navEventRight);
      p.parentElem.querySelector('.gridPageNav').removeEventListener('click', p.navEventGrid);
      p.destroy();
    });

    // clear content
    pages = [];
    section = null;
    slideshowContainer.innerHTML = '';
  }

  slideshow.closePresentation = function() {
    this.clearPresentation();
    isShown=false;
    slideshowContainer.style.display="none";
  }

  /* 
    GETTERS / SETTERS 
  */
  slideshow.rootElem = function(val){
    if (!arguments.length) { return _rootElem; }
    _rootElem = val;
    return slideshow;
  }

  slideshow.getCurrentSection = function(){
    return section;
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

  slideshow.shown = function(val) {
    if (!arguments.length) { return isShown; }
    isShown = val;
    return slideshow;
  }
  
  return slideshow;
  
}

