'use strict';

// import ResizeObserver from 'resize-observer-polyfill';
let ResizeObserver = require('resize-observer-polyfill');
let path = require('path');
let marked = require('marked');

module.exports = class Page {
  // https://googlechrome.github.io/samples/classes-es6/

  
  

  constructor(pageData, parentElem, slideshow, index, imagePath) {
    this.title = pageData.title;
    this.parentElem = parentElem;
    this.slideshow = slideshow;
    this.pageIndex = index;
    this.imagePath = imagePath;
    this.items = pageData.pageItems;

    this.mmdBoxes = [];

    // add a listener for resize on this page element
    this.resizeObserver = new ResizeObserver(entries => {
      this.resize(entries);
    });
    this.resizeObserver.observe(parentElem)

    this.build();
  }

  destroy(){
    // not destroying the page from here. Doing it in slideshow.js so we can remove event listeners etc from EVERY page. (destroying one page doesn't really make sense?)
    // this.parentElem.innerHTML = '';
  }

  resize(){
    //deal with resize: https://alligator.io/js/resize-observer/
    console.log('got a resize event')
    this.manageTextFontSize();
  }

  build() {
    let nav = document.createElement('div'); nav.classList.add('pageNav'); 
    this.parentElem.appendChild(nav);

    let upPage = document.createElement('span'); upPage.classList.add('upPageNav'); upPage.innerHTML = '✕';
    nav.appendChild(upPage);
    upPage.addEventListener('click', this.navEventUp.bind(null, this), false)
    
    let gridPage = document.createElement('span'); gridPage.classList.add('gridPageNav'); gridPage.innerHTML = '⚏';
    nav.appendChild(gridPage);
    gridPage.addEventListener('click', this.navEventGrid.bind(null, this), false)

    let title = document.createElement('p'); title.classList.add("pageTitle");
    title.innerHTML = this.title;
    nav.appendChild(title);

    let leftPage = document.createElement('span'); leftPage.classList.add('leftPageNav');  leftPage.innerHTML = '←';
    nav.appendChild(leftPage);
    leftPage.addEventListener('click', this.navEventLeft.bind(null, this), false)

    let rightPage = document.createElement('span'); rightPage.classList.add('rightPageNav'); rightPage.innerHTML = '→';
    nav.appendChild(rightPage);
    rightPage.addEventListener('click', this.navEventRight.bind(null, this), false)

    let content = document.createElement('div'); content.classList.add("pageContent");
    this.parentElem.appendChild(content);

    this.items.forEach((itm, i) => {
      let block = document.createElement('div');
      block.classList.add("pageBlock");
      if(i>0){
        block.classList.add("pageBlockMulti");
      }
      block.style['flex-basis'] = itm.percentWidth + '%';
      content.appendChild(block);

      if(itm.type.mmdText){
        this.buildText(itm, block);
      }else if(itm.type.image){
        this.buildImage(itm, block);
      }else if(itm.type.component){
        this.buildComponent(itm, block);
      }else{
        console.error("could not resolve what type of element to build: ", itm.type);
      }

    });
  }

  navEventUp(page, event) {
    page.slideshow.closePresentation();
  }

  navEventLeft(page, event) {
    page.slideshow.prevPage();
  }

  navEventRight(page, event) {
    page.slideshow.nextPage();
  }

  navEventGrid(page, event) {
    page.slideshow.toggleGridView(page.pageIndex);
  }

  buildText(itm, uiElem){
    //get the mmd, convert to html and display
    uiElem.classList.add('textBlock');
    let mmdWrap = document.createElement('div');
    mmdWrap.classList.add('textBlockWrap');
    mmdWrap.innerHTML = marked(itm.type.mmdText);
    uiElem.appendChild(mmdWrap);
    this.mmdBoxes.push(mmdWrap);  // will get looked at (fonts adjusted) on resize, which triggers on load
  }

  buildImage(itm, uiElem){
    //get the image, display it in a resize-friendly way
    uiElem.classList.add('imageBlock');
    let img = document.createElement('img');
    img.src = 'file://' + path.join(this.imagePath, itm.type.image);
    uiElem.appendChild(img)
    console.log('adding an image', itm)
    
  }

  buildComponent(itm, uiElem){
    //load custom component
    let comp = require('../components/historyOfIdeas')
    new comp(itm, uiElem)

    uiElem.classList.add('componentBlock');
    console.log('adding a component', itm)
    
  }

  manageTextFontSize(){
    this.mmdBoxes.forEach(elem => {
      let elemSize = elem.getBoundingClientRect();
      let parentSize = elem.parentNode.getBoundingClientRect();
      //shrink font
      while(elemSize.height > parentSize.height){
        let fontSize = parseFloat(window.getComputedStyle(elem, null).getPropertyValue('font-size'));
        fontSize --;
        elem.style.fontSize = (fontSize) + 'px';
        elem.style.lineHeight = (fontSize+1) + 'px';
        elemSize = elem.getBoundingClientRect();
        // console.log('-------------CHANGING FONT DOWN-------------------')
        // console.log('new elem font size', fontSize)
        // console.log('new elem size', elemSize)
      }
      
      //grow font
      while(elemSize.height < parentSize.height-50){
        let fontSize = parseFloat(window.getComputedStyle(elem, null).getPropertyValue('font-size'));
        fontSize ++;
        if(fontSize > 17) { break;}
        elem.style.fontSize = (fontSize) + 'px';
        elem.style.lineHeight = (fontSize+1) + 'px';
        elemSize = elem.getBoundingClientRect();
        // console.log('-------------CHANGING FONT UP-------------------')
        // console.log('new elem font size', fontSize)
        // console.log('new elem size', elemSize)
      }
     
    });
  }
  

}