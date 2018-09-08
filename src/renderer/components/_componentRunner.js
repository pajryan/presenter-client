'use strict';
import Vue from 'vue'

let componentMap = require('../components/_componentMap');  // this draws in ALL components

export function build(itm, uiElem){
  // get the right component
  let component = componentMap(itm.type.component)

  console.log('Building Component', itm)

  let componentVue = new Vue({
    el: uiElem,
    render: h => h(component, {
      props: {itm: itm, uiElem: uiElem}
      // props: {adminObj: admin} //this.adminObj
    })
  })

}