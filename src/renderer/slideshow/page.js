'use strict';

// import ResizeObserver from 'resize-observer-polyfill';
let ResizeObserver = require('resize-observer-polyfill');

module.exports = class Page {
  // https://googlechrome.github.io/samples/classes-es6/

  
  

  constructor(pageData, parentElem, slideshow, index) {
    console.log('building page', pageData)
    this.title = pageData.title;
    this.parentElem = parentElem;
    this.slideshow = slideshow;
    this.pageIndex = index;
    this.items = pageData.pageItems;

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
  }

  build() {
    this.destroy();

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

    let content = document.createElement('p'); content.classList.add("pageContent");
    this.parentElem.appendChild(content);

    this.items.forEach((itm, i) => {
      let block = document.createElement('div');
      block.classList.add("pageBlock");
      if(i>0){
        block.classList.add("pageBlockMulti");
      }
      block.style['flex-basis'] = itm.percentWidth + '%';
      content.appendChild(block);
      block.innerHTML = "asdfasdf asdf asdf asdf asdf asdf asdf asdfasd fasdf asdf asdf asdf asdf asdfa sdf asdfasdfasdf asdf asdf asdf"

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
}