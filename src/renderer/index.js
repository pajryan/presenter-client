// Initial home page.
//  An html page has automatically been created that simply contains <div id="app"></div>.  Everything builds from there


// this page serves a few purposes
//  1. table of contents
//  2. slideshow
//  3. admin
//    3a. update application (via github and autoUpdate)
//    3b. udpate data
//    3c. edit slideshow
//        flow, images, text (mmd)
const {ipcRenderer, remote} = require('electron');
// const main = remote.require('/src/main/index.js');
// const main = remote.require(__dirname + '/../main/index.js');
const print = require('../renderer/slideshow/print');
const fs = require('fs');
const path = require('path');
let autoUpdater = remote.getGlobal("autoUpdaterPlus");


// right click'ness
const remoteDistinct = require('electron').remote
const Menu = remoteDistinct.Menu
const MenuItem = remoteDistinct.MenuItem;

let rightClickPosition = null

const menu = new Menu()
const menuItem = new MenuItem({
  label: 'Inspect Element',
  click: () => {
    remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
  }
})
menu.append(menuItem)

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  rightClickPosition = {x: e.x, y: e.y}
  menu.popup(remote.getCurrentWindow())
}, false)





require("./styles/main.less");  // note that this main.less file includes bootstrap
require("./styles/print.less"); // used when printing to PDF (also includes bootstrap)
require("./styles/admin.less");
require("bootstrap");



// going to store all state here.
let _state = {};

//if using bootstrap, need to generate this:
//  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
// I'm a little worried that this won't do what it's supposed to because it's being added after the page loads..?
var meta = document.createElement('meta');
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1, shrink-to-fit=no";
document.getElementsByTagName('head')[0].appendChild(meta);


//get the passed app version
ipcRenderer.on('appReady', function(event, args) {
  _state.appVersion = args.appVersion;
  _state.appPath = args.appPath;
  _state.appConfigFileName = args.appConfigFileName;
  
  _state.appDataStorePath = args.appDataStorePath;
  _state.appPresentationPath = args.appPresentationPath;
  _state.appImagePath = args.appImagePath;
  _state.appDefaultPresentationFileName = args.appDefaultPresentationFileName;
  _state.appPresentationConfigFileName = args.appPresentationConfigFileName;
  _state.isDevelopment = args.isDevelopment;
  _state.validAdminPassword = args.validAdminPassword;  // the correct password for various admin access
  

  // will collect some additional state in the admin() call (because they are part of the app config and will need to be initialized for a new user)
  _state.dataUpdateServiceURL = "";
  _state.userName = "";
  _state.userEmail = "";
  _state.apiKey = "";
  _state.adminPassword = '';  // the user-entered password
  _state.isAdmin = false;     //gets determined when 'save and test inputs' is clicked on the configuration tab

  appInit();  //have items passed from main.js.  Kick off building the app
});





// do some initialization of the components of the app
function appInit(){

  console.log("state is", _state)
  const Admin = require("./admin/admin.js");
  const Slideshow = require("./slideshow/slideshow.js");
  const TOC = require("./toc/toc.js")

  let b = document.getElementById("app");

  // build disclosure block
  let d = document.createElement('div'); d.id="disclosure"; b.appendChild(d);
  d.innerHTML = fs.readFileSync(path.resolve(__dirname, 'disclosures.html'), 'utf8'); // load the disclosure html
  let cl = document.createElement('a'); cl.href= '#'; cl.innerHTML = 'accept';  // add a close button (so user can hide disclosure)
  cl.addEventListener('click', e => {document.getElementById('disclosure').style.display='none'})
  d.appendChild(cl)
  // add the current date to the top of the disclosure. This is only shown in print view (just so we know when it was created)
  document.getElementById('printedOn').innerHTML = 'document generated on ' + new Date().getMonth() + '/' +  new Date().getDay() + '/' + new Date().getFullYear() + ' at ' + new Date().getHours() + ':' + new Date().getMinutes();
  if(_state.isDevelopment){
    // hide disclosure in dev mode so I don't have to dismiss it every time...
    console.log('AUTO HIDING DISCLOSURE in dev mode')
    d.style.display = 'none';
  }

  // build table of contents
  let t = document.createElement('div'); t.id="toc"; b.appendChild(t);
  var toc = TOC.build().rootElem(t).state(_state);

  // build admin
  let a = document.createElement('div'); a.id="admin"; a.className="admin"; b.appendChild(a);
  var admin = Admin.build().rootElem(a).state(_state);
  admin.autoUpdater(autoUpdater); // pass the autoUpdater so the admin can manage update functions

  // build slideshow (do this last so it stacks on top. this allows me to just show this, and it "hides" the toc and admin)
  let s = document.createElement('div'); s.id="slideshow"; b.appendChild(s);
  var slideshow = Slideshow.build().rootElem(s).state(_state);

  // pass the pieces to each other
  slideshow.admin(admin).toc(toc);
  admin.slideshow(slideshow).toc(toc);
  toc.admin(admin).slideshow(slideshow);

  // run each .
  admin();  //this will also check if we have a first time user. If so, will jump to admin config
  slideshow();
  toc();




  //capture shortcut keys to navigate
  // doing this at the renderer/index level because the events will only get added once (e.g. not multiple times in slideshow()) and are used for functions across toc, admin etc
  document.onkeydown = function(evt) {

    // ONLY do these when not in admin - otherwise when typing mmd in the admin section, can get sudden jumping around to presentations!
    if(admin.isShown()){return;};
    

    evt = evt || window.event;
    if (evt.keyCode == 27 || evt.keyCode == 38) {  // esc or up arrow
      slideshow.closePresentation();
      document.getElementById('disclosure').style.display = 'none';
    }
    if (evt.keyCode == 37) {  // left arrow
      slideshow.prevPage();
    }
    if (evt.keyCode == 39 || evt.keyCode == 32) {  // right arrow or space bar
      slideshow.nextPage();
    }
    if (evt.keyCode == 70) {  // f key (e.g. for full page toggle)
      slideshow.toggleGridView();
    }
    if(!slideshow.shown() && evt.keyCode >= 49 && evt.keyCode <= 58 ){  // the numbers 1 thru 9
      let sectionIndex = evt.keyCode-49;  // zero index
      slideshow.launchPresentation(sectionIndex);
    }
    if(evt.metaKey && evt.keyCode == 80 || evt.ctrlKey && evt.keyCode == 80){ //evt.metaKey is OSX's command, evt.ctrlKey might be for windows?
      if(!slideshow.shown()) {
        window.alert('You need to be in a section/page to print. View any section and try again.');
        return;
      }
      let newPDFFileName = new print(slideshow);
    }
  };


  // console.error("temporarily launching the slideshow (renderer/index.js - very bottom of the file)");
  // slideshow.launchPresentation(0, 1);


}