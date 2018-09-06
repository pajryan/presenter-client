'use strict'

const fs = require('fs');
const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow;

// const electron = require('electron');
// const BrowserWindow = electron.remote.BrowserWindow;

const {dialog} = remote;

// this is triggered by ctrl+p (from inside index.js)
module.exports = class Print{
  constructor(slideshow){ // slideshow

    // goal here is to generate a PDF of the material
    // I think, in practice, all the material won't be rendered, so need to just print what is rendered (or render, then print)
    // Maybe the best thing to do is only allow this to run when a slideshow (one module) is loaded, and print just that module?

    let filename = 'Tablet - section ' + slideshow.getCurrentSection().title + '.pdf'

    // NOTE. There's a separate stylesheet (print.less that is used for this output)
    let window = remote.getCurrentWindow();
    //  see https://electronjs.org/docs/api/web-contents?query=%60#web-contentsprinttopdf
    let printOptions = {
      marginsType: 0,
      printBackground: true,
      printSelectionOnly: false,
      landscape: true // this doesn't seem to work. But forcing landscape in the CSS (@media print)
    }
    window.webContents.printToPDF(printOptions, (error, data) => {
      if (error) throw error
      fs.writeFile(filename, data, (error) => {
        if (error) throw error
        console.log('Write PDF successfully.')
      })
    })

   
  }

}