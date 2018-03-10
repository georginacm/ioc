const electron = require('electron')
const crypto = require('crypto');
const https = require('https');
const http = require('http');

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')
let appMenu = require("./scripts/menu")
let loginUtils= require("./scripts/login")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 850, height: 750})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

appMenu.renderMenu();


ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)  // imprime "ping"
  event.sender.send('asynchronous-reply', 'pong_async')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // imprime "ping"
  event.returnValue = 'pong_sync'
})

ipcMain.on('invokeAction', function(event, data){
  console.info("login data:" + data.name +"  " + data.password);
  loginUtils.login(event, data);
})
