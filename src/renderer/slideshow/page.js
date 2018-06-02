'use strict';

module.exports = class Page {
  // https://googlechrome.github.io/samples/classes-es6/
  constructor(pageData, parentElem) {
    console.log('building page', pageData)
    this.title = pageData.title;
    this.parentElem = parentElem;
    this.items = pageData.pageItems;
    this.build();
  }

  destroy(){
    this.parentElem.innerHTML = '';
  }

  build() {
    this.destroy();

    let title = document.createElement('p'); title.className = "pageTitle";
    title.innerHTML = this.title;
    this.parentElem.appendChild(title);

    let content = document.createElement('p'); content.className = "pageContent";
    this.parentElem.appendChild(content);

    this.items.forEach((itm, i) => {
      let block = document.createElement('div');
      block.className = "pageBlock";
      if(i>0){
        block.className += ' pageBlockMulti';
      }
      // block.style['flex-grow'] = itm.percentWidth;
      block.style['flex-basis'] = itm.percentWidth + '%';
      content.appendChild(block);
      block.innerHTML = "asdfasdf asdf asdf asdf asdf asdf asdf asdfasd fasdf asdf asdf asdf asdf asdfa sdf asdfasdfasdf asdf asdf asdf"



    });

  }
}