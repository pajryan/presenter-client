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

require("./styles/main.less");  //note that this main.less file includes bootstrap
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


// allow messages from main to come here
const {ipcRenderer} = require('electron');
//get the passed app version
ipcRenderer.on('appVersionManagement', function(event, obj) {
  _state.appUpdateManagement = obj;
  //have items passed from main.js.  Kick off building the app
  appInit();
});


ipcRenderer.on('message', function(event, text) {
  console.log("got a message from main: ", text)
  var container = document.getElementById('messages');
  var message = document.createElement('div');
  message.innerHTML = text;
  container.appendChild(message);
})






// do some initialization of the components of the app

  function appInit(){


  const Admin = require("./admin/admin.js");
  const Slideshow = require("./slideshow/slideshow.js");
  const TOC = require("./toc/toc.js")

  let b = document.getElementById("app");



  //build slideshow
  let s = document.createElement('div'); s.id="slideshow"; b.appendChild(s);
  var slideshow = Slideshow.build().rootElem(s).state(_state);

  //build table of contents
  let t = document.createElement('div'); t.id="toc"; b.appendChild(t);
  var toc = TOC.build().rootElem(t).state(_state);

  //build admin
  let a = document.createElement('div'); a.id="admin"; a.className="admin"; b.appendChild(a);
  var admin = Admin.build().rootElem(a).state(_state);

  // pass the pieces to each other
  slideshow.admin(admin).toc(toc);
  admin.slideshow(slideshow).toc(toc);
  toc.admin(admin).slideshow(slideshow);

  //run each .
  admin();
  slideshow();
  toc();




  //this is temporary: it allows me to see the version number (and watch the app updates work from github).  But this should be moved inside admin

  let m = document.createElement('div');
  m.id = "messages";
  b.appendChild(m)
}