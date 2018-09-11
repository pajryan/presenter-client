'use strict';

/*
  A note about this file
  The following code is called from slideshow/page.js. It could logically have simply been run from there, eliminating this file altogether.

  However page.js uses google's `module.exports = class<>` pattern
  That is incompatible with import statements (e.g. `import Vue from 'vue'`)
  One could instead use require (e.g. `require('vue')`) but Vue is picky and require doesn't work

  One solution is to change webpack to a vue alias (the common solution).  But webpack in electron is a bit of different beast, and wasn't obvious how to get that to work.

  So rather than make infrastructure changes, page.js simply calls this file, which is constructed with the `export function<>` pattern. 
  This is compatible with import statements and all is well.


  Will also use this to fetch data needed for the component
*/


import Vue from 'vue'

const path = require('path');
const fs = require('fs')

let componentMap = require('../components/_componentMap');  // this draws in ALL components

export function build(itm, uiElem, _state){
  // get the right component
  let component = componentMap(itm.type.component)
  

  console.log('Building Component', itm, _state)

  let data = [];
  if(itm.type.data){
    let appDataPath = path.join(_state.appPath, _state.appDataStorePath);
    let dataFiles = itm.type.data.split(',')  // assuming they're comma separated for now
    dataFiles.forEach((filename, i) => {
      console.log('loading data', filename)
      try{
        data.push( JSON.parse(fs.readFileSync(path.join(appDataPath, filename))) )
      }catch(err){
        data.push({error: err, filename: filename})
        console.error('unable to fetch data file ' + filename, err)
      }
      


    })
  }



  let componentVue = new Vue({
    el: uiElem,
    render: h => h(component, {
      props: {itm: itm, uiElem: uiElem, data: data}
      // props: {adminObj: admin} //this.adminObj
    })
  })

}



