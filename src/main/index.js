'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'


const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
global.autoUpdaterPlus = autoUpdater; // set globally so I can get it in the admin processes


const pj = require('../../package.json')
const appVersion = pj.version;

const appPath = app.getPath('userData'); // This is where ALL data will be stored (user data as well as data driving pictures)
const appDataStorePath = "/_data";
const appPresentationPath = "/_presentations";
const appImagePath = "/_images";
const appDefaultPresentationFileName = "_defaultPresentation.json";
const appPresentationConfigFileName = "_presentationConfig.json";
const appConfigFileName = "_appConfig.json";

const validAdminPassword = "tabletAdm!n";

let isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
const menuTemplate = getMenuTemplate();

function createMainWindow() {
  const window = new BrowserWindow({webPreferences:{webSecurity: false}})
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
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})


// create main BrowserWindow when electron is ready
app.on('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
  
  mainWindow = createMainWindow();
  
  //once loaded, send the appVersion and the appUpdater to the UI so it can be managed from there
  mainWindow.webContents.on('did-finish-load', function() {
    //pass the version to the window
    mainWindow.webContents.send('appReady', 
      { // pass some things from main to the renderer.  Be sure to set this in _state variable in renderer/index.js 
        appVersion: appVersion, 
        appPath: appPath,
        appConfigFileName: appConfigFileName,
        appDataStorePath: appDataStorePath,
        appPresentationPath: appPresentationPath,
        appImagePath: appImagePath,
        appDefaultPresentationFileName: appDefaultPresentationFileName,
        appPresentationConfigFileName: appPresentationConfigFileName,
        isDevelopment: isDevelopment,
        validAdminPassword: validAdminPassword
      }
    );

    mainWindow.show();
    
  })
})





function getMenuTemplate(){

  const template = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
   
    // Window menu
    template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
  
  return template;

}