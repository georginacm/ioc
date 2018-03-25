const electron = require('electron')
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const app = electron.app
// Mòdul que crea el browser amb el que treballarem
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const path = require('path')
const url = require('url')
let appMenu = require("./scripts/menu")
let loginUtils= require("./scripts/login")


let mainWindow
let EditWindow

  // Crea la finestra principal de l'aplicació i carrega el fitxer index.html
function createMainWindow () {
  mainWindow = new BrowserWindow({width: 850, height: 750})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // Event que es llença al  tancar la finestra principal de l'aplicació
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  createEditWindow();
}

function createEditWindow(){
  EditWindow = new BrowserWindow({parent: mainWindow, modal: true, show: false, autoHideMenuBar:true })
  EditWindow.setAlwaysOnTop(true);
  EditWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'templates/editEvent.html'),
    protocol: 'file:',
    slashes: true
  }))

  EditWindow.on('close', function (event) {
    console.log("close EditWindow");
    EditWindow.hide();
    event.preventDefault();
  })
}

//  Quan s'acaba de carregar tota la app d'Electron es crea la finestra principal
app.on('ready', createMainWindow)

// Surt de l'app d'Elecron quan totes les fienestres de l'aplicació es tanquen
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Si estem a l'app però no hi ha finestra principal, la creem
app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow()
  }
})

//renderitzem el menú que està definit a scripts/menu.js ( en fase transitòria encara)
appMenu.renderMenu();


//---Accions on es subscriuran els mètodes del costat client del render.js que carreguem amb el index.html --

// invoació del Login
ipcMain.on('invokeLoginAction', function(event, data){
  console.info("login data:" + data.name +"  " + data.password);
  loginUtils.login(event, data);
})

// invoació del Signup
ipcMain.on('invokeSignupAction', function(event, data){
  console.info("signup data:" + data.name +"  " + data.password + " admin: "+ data.admin);
  loginUtils.signup(event, data);
})

//invoació  del Logout
ipcMain.on('invokeLogoutAction', function(event, data){
  console.info("logout data:" + data.name );
  loginUtils.logout(event, data);
})


ipcMain.on('invokeEditEventAction', function(event, data){
  console.log("EditWindow"+ EditWindow)
  if (EditWindow === null) {
    createEditWindow()
  }
  EditWindow.show()
})

//invocació  del Create Event
ipcMain.on('invokeCreateEventAction', function(event, data){
  console.info("create event data:" + data.nom );
  loginUtils.create(event, data);
})

//invocació  del Delete Event
ipcMain.on('invokeDeleteEventAction', function(event, data){
  console.info("delete event data:" + data.id );
  loginUtils.delete(event, data);
})
