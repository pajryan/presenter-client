'use strict'

const fs = require('fs');
const {remote} = require('electron');
const dialog = remote.dialog;

// this is triggered by ctrl+p (from inside index.js)
module.exports = class Print{
  constructor(slideshow){ 

    // goal here is to generate a PDF of the material
    // I think, in practice, all the material won't be rendered, so need to just print what is rendered (or render, then print)
    // Maybe the best thing to do is only allow this to run when a slideshow (one module) is loaded, and print just that module?

    // need to decide where to put this?
    let filename = 'Tablet Section - ' + slideshow.getCurrentSection().title;
    let dt = new Date();
    let dtStr = '' + dt.getFullYear() + (dt.getMonth()+1 < 10 ? '0' + (dt.getMonth()+1) : (dt.getMonth()+1)) + (dt.getDate() < 10 ? '0' + (dt.getDate()) : dt.getDate());
    filename += ' - ' + dtStr;
    filename += '.pdf'

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
      if (error) {
        dialog.showErrorBox('error generating PDF', JSON.stringify(error))
      }
      let saveOptions =  {
        title: 'Save PDF',  // doesn't seem to work?
        defaultPath: filename, 
        filters: [{ extensions: ['pdf'] }]
      }
      dialog.showSaveDialog(saveOptions, function(userFileName){ 
        console.log('saving file to ', userFileName)
        fs.writeFile(userFileName, data, (error) => {
          if (error) {
            dialog.showErrorBox('error saving PDF', JSON.stringify(error))
          }
        }) 
      });
    })
   
  }

}