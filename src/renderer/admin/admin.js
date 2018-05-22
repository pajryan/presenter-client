'use strict';
import Vue from 'vue'
import AdminUI from './adminUI/AdminUI.vue'

const path = require('path');
const fs = require('fs');

const utils = require ('./../utils.js');
const msg = require ('./../messages.js');

export function build(){
  let _rootElem,    // root html element that the entire admin UI will be appended to
      _toc,         // like this admin obj, the toc obj.  Creating a reference here will allow toc functions to run from admin (and vice versa)
      _slideshow,   // like this admin obj, the slideshow obj.  Creating a reference here will allow slideshow functions to run from admin (and vice versa
      _state;       // global state object
    
  let autoUpdater,
      appConfigPath,
      appDataPath,
      dataToUpdate = [];

      
  function admin(){
    let p = document.createElement('p'); p.innerHTML = "admin";
    _rootElem.appendChild(p);

     //build the admin UI
    new Vue({
      el: '#admin',
      render: h => h(AdminUI, {
        props: {adminObj: admin} //this.adminObj
      })
    })
  }
  


  /*
    DATA UPDATE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  admin.checkForDataUpdates = function(callback) {
    return utils.checkIfOnline((isOnline) => {
      if(!isOnline){
        callback({isOnline:false, dataAvailable:null, message: msg.msg('no-internet-connection')})
        return;
      }

      return utils.checkIfHaveDataConnection(_state.dataUpdateServiceURL, (hasDataConnection) => {
        if(!hasDataConnection){
          callback({isOnline:false, dataAvailable:null, message: msg.msg('no-data-service-conection')})
          return;
        }

        // get the date this was last updated
        appConfigPath = path.join(_state.appPath, _state.appConfigFileName);
        appDataPath = path.join(_state.appPath, _state.appDataStorePath);
        console.log("checking last update at ", appConfigPath);

        // get the config. If the config doesn't exist, we treat this as an initialization state!
        if(!fs.existsSync(appConfigPath)){
          admin.createDefaultAppItems();
        }

        let appConfig = JSON.parse(fs.readFileSync(appConfigPath)); //get the last data update from the config
        let lastAppDataUpdate = appConfig.lastDataUpdate;

    
        if(lastAppDataUpdate == null){  // this is a brand new user
          console.log("This user does not have a config file!  Creating one and will prompt to update data.");
          callback({isOnline:true, dataAvailable: true, message: msg.msg('first-time-fetching-data')});
          return;
        }

        // now get the data log from the data update service.  The data log is a large object that looks like { dataLog: [timestamp:<timeInMS>, file:<fileName>, timestamp:<timeInMS>, file:<fileName>, ....]}
        //   The <timestamp? is when the source data (<fileName>) was created.  So any timestamps greater than the last udpate time in the config is NEW
        utils.dataServiceCall(_state.dataUpdateServiceURL, '/dataLog', (data, err) => {
          if(err){
            console.error("error calling the data update service: ", err)
            callback({isOnline: true, dataAvailable: false, messsage:{text:'error: ' + JSON.stringify(err)}});
            return;
          }
          dataToUpdate = data.dataLog.filter(d => {return d.timeStamp >= lastAppDataUpdate});
          callback({isOnline:true, dataAvailable: dataToUpdate.length > 0});
        })
      });
    });
    
  }

  // create a default config file
  admin.createDefaultAppItems = function() {
    const defaultAppConfig = require('./adminUI/defaultAppConfig.json');
    fs.writeFileSync(appConfigPath, JSON.stringify(defaultAppConfig, null, '\t'), 'utf8');

    //write the _data file too
    if(!fs.existsSync(appDataPath)){
      fs.mkdirSync(appDataPath)
    }
  }


  admin.getUpdatedData = function(callback){
    console.log('fetching new data:', dataToUpdate);
    dataToUpdate.forEach((d,i) => {
      
    })
  }




  /*
    APPLICATION UPDATE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  admin.checkForApplicationUpdates = function(callback){
    // set the events
    autoUpdater.on('update-available', (info) => {
      callback('updateAvailable');
    })
    autoUpdater.on('update-not-available', (info) => {
      callback('updateNotAvailable', _state.appVersion);
    })
    autoUpdater.on('error', (err) => {
      callback('error', err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
      callback('downloadProgress', progressObj);
    })
    autoUpdater.on('update-downloaded', (info) => {
      console.log("update downloaded")
      callback('updateDownloaded');
    });

    // call for updates
    console.log("checking for app update. current version: ", _state.appVersion)
    autoUpdater.checkForUpdatesAndNotify();
  }



  /*
    GETTERS / SETTERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  // root element
  admin.rootElem = function(val){
    if (!arguments.length) { return _rootElem; }
    _rootElem = val;
    return admin;
  }

  // state and other parts of the app
  admin.state = function(val) {
    if (!arguments.length) { return _state; }
    _state = val;
    return admin;
  };
  admin.slideshow = function(val) {
    if (!arguments.length) { return _slideshow; }
    _slideshow = val;
    return admin;
  };
  admin.toc = function(val) {
    if (!arguments.length) { return _toc; }
    _toc = val;
    return admin;
  };
  // autoUpdater
  admin.autoUpdater = function(val) {
    if (!arguments.length) { return autoUpdater; }
    autoUpdater = val;
    return admin;
  }


  

  return admin;
  
}

