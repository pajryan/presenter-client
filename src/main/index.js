'use strict'

import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

const pj = require('../../package.json')
const appVersion = pj.version;


// console.log(JSON.stringify(pj))

let isDevelopment = process.env.NODE_ENV !== 'production'



// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  console.log("app version " + pj.version)

  const window = new BrowserWindow()

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    // window.focus()
    setImmediate(() => {
      // window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})







// start the autoUpdate mechanism
function sendStatusToWindow(text) {
  mainWindow.webContents.send('message', text);
}



autoUpdater.on('checking-for-update', () => {
  console.log("checking for update?")
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  console.log("GOT ERROR")
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});



// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  
  //once loaded, send the appVersion and the appUpdater to the UI so it can be managed from there
  mainWindow.webContents.on('did-finish-load', function() {
    //pass the version to the window
    mainWindow.webContents.send('appVersionManagement', {appVersion:appVersion, autoUpdater:autoUpdater});

    //pass the autoUpdater to the window so it can be triggered via admin controls
    sendStatusToWindow("Current application version: " + appVersion)
    mainWindow.show();
    // autoUpdater.checkForUpdatesAndNotify();
    
  })
})
