'use strict'

let ResizeObserver = require('resize-observer-polyfill');

module.exports = class HistoryOfIdeas{
  constructor(itm, uiElem){ // the itm as described in the config, and the parent uiElement

    uiElem.innerHTML = JSON.stringify(itm)
    // add a listener for resize on this page element
    this.resizeObserver = new ResizeObserver(entries => {
      this.resize(entries);
    });
    this.resizeObserver.observe(uiElem)
  }

  destroy(){
    // not destroying the page from here. Doing it in slideshow.js so we can remove event listeners etc from EVERY page. (destroying one page doesn't really make sense?)
    // this.parentElem.innerHTML = '';
  }

  resize(){
    //deal with resize: https://alligator.io/js/resize-observer/
    console.log('got a resize event')
  }
}