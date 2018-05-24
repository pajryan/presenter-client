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

    appConfigPath = path.join(_state.appPath, _state.appConfigFileName);
    appDataPath = path.join(_state.appPath, _state.appDataStorePath);

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
  admin.checkForDataUpdates = function(callback, dataAfterDate) {
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
        console.log("checking last update at ", appConfigPath);

        // get the config. If the config doesn't exist, we treat this as an initialization state!
        if(!fs.existsSync(appConfigPath)){
          admin.createDefaultAppItems();
        }

        let appConfig = JSON.parse(fs.readFileSync(appConfigPath)); //get the last data update from the config
        let lastAppDataUpdate = appConfig.lastDataUpdate;

        //if a date was passed, we're forcing a data update after the given date
        if(dataAfterDate){lastAppDataUpdate = dataAfterDate.getTime();}

        // now get the data log from the data update service.  The data log is a large object that looks like { dataLog: [timestamp:<timeInMS>, file:<fileName>, timestamp:<timeInMS>, file:<fileName>, ....]}
        //   The <timestamp? is when the source data (<fileName>) was created.  So any timestamps greater than the last udpate time in the config is NEW
        utils.dataServiceCall(_state.dataUpdateServiceURL, '/dataLog', (data, err) => {
          if(err){
            console.error("error calling the data update service: ", err)
            callback({isOnline: true, dataAvailable: false, messsage:{text:'error: ' + JSON.stringify(err)}});
            return;
          }
          dataToUpdate = data.dataLog.filter(d => {return d.timeStamp >= lastAppDataUpdate});
          if(lastAppDataUpdate==null){  //new user, or data has been deleted
            callback({isOnline:true, dataAvailable: true, message: msg.msg('first-time-fetching-data')});
          }else{  //just a normal update
            callback({isOnline:true, dataAvailable: dataToUpdate.length > 0});
          }
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


  admin.getUpdatedData = function(progressCallback, completeCallback){
    console.log('fetching new data:', dataToUpdate);
    // the following will work, but will need to setInterval or something gross to know when it's done. really need promises here
    dataToUpdate.forEach((d,i) => { //add some metadata to track
      d.index = i; d.attempted = false; d.complete = false; d.msg = '';
    });
    dataToUpdate.forEach((d,i) => {
      //fetch the file and copy to the local directory
      let req = '/requestFile/' + d.file;
      utils.dataServiceCall(_state.dataUpdateServiceURL, req, (data, error) => {
        
        if(error) {// file not found
          console.error('error fetching file from data service ', error)
          d.attempted = true;
          d.msg = error;
          admin.getUpdatedDataStatus(progressCallback, completeCallback);
        }else{
          fs.writeFile(path.join(appDataPath,d.file), JSON.stringify(data, null, '\t'), err => {
            if(err){
              console.error('error writing file ' + d.file, err)
              d.msg = err;
              d.attempted = true;
              admin.getUpdatedDataStatus(progressCallback, completeCallback);
            }else{
              d.attempted =true;
              d.complete = true;
              admin.getUpdatedDataStatus(progressCallback, completeCallback);
            }
          });
        }
      });
    });
  }

  admin.getUpdatedDataStatus = function (progressCallback, completeCallback){
    let attempted = dataToUpdate.filter(d => d.attempted);
    let attemptedAndComplete = attempted.filter(d => d.complete);
    let attemptedAndFailed = attempted.filter(d => !d.complete);
    let percentComplete = 100 * attemptedAndComplete.length / dataToUpdate.length;
    let percentFailed = 100 * attemptedAndFailed.length / dataToUpdate.length;
    let percentAttempted = 100 * attempted.length / dataToUpdate.length;
    progressCallback(percentComplete, percentFailed, dataToUpdate.length)

    if(percentAttempted === 100){
      let incomplete = dataToUpdate.filter(d => !d.complete);
      if(incomplete.length === 0){
        completeCallback();
        admin.updateConfig("lastDataUpdate", new Date().getTime());
      }else{
        completeCallback(incomplete)
      }
    }
  }

  admin.deleteData = function(callback){
    fs.readdir(appDataPath, (err, files) => {
      if (err){callback(err); return;}
      for (const file of files) {
        fs.unlink(path.join(appDataPath, file), err => {
          if (err){callback(err); return;}
        });
      }
      callback()
    });
    //update the config to null date
    admin.updateConfig("lastDataUpdate", null)
  }

  admin.updateConfig = function(key, value){
    let appConfig = JSON.parse(fs.readFileSync(appConfigPath)); 
    appConfig[key] = value;
    fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, '\t'))
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

