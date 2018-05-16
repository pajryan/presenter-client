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




// allow messages from main to come here
const {ipcRenderer} = require('electron');
ipcRenderer.on('message', function(event, text) {
  console.log("got a message from main: ", text)
  var container = document.getElementById('messages');
  var message = document.createElement('div');
  message.innerHTML = text;
  container.appendChild(message);
})


// import Admin from './admin/admin.js'

const Admin = require("./admin/admin.js");
const Slideshow = require("./slideshow/slideshow.js");
const TOC = require("./toc/toc.js")

let b = document.body;



//build slideshow
let s = document.createElement('div'); s.id="slideshow"; b.appendChild(s);
var slideshow = Slideshow.build().rootElem(s);

//build table of contents
let t = document.createElement('div'); t.id="toc"; b.appendChild(t);
var toc = TOC.build().rootElem(t);

//build admin
let a = document.createElement('div'); a.id="admin"; b.appendChild(a);
var admin = Admin.build().rootElem(a);

// pass the pieces to each other
slideshow.admin(admin).toc(toc);
admin.slideshow(slideshow).toc(toc);
toc.admin(admin).slideshow(slideshow);

//run each
admin();
slideshow();
toc();




//this is temporary: it allows me to see the version number (and watch the app updates work from github).  But this should be moved inside admin

let m = document.createElement('div');
m.id = "messages";
b.appendChild(m)
