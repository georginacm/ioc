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
let service= require("./scripts/restClient")


let mainWindow
let EditWindow
let ShowEventWindow

  // Crea la finestra principal de l'aplicació i carrega el fitxer index.html
function createMainWindow () {
  mainWindow = new BrowserWindow({width: 900, height: 800})
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
  createShowEventWindow();
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
};

function createShowEventWindow(){
  ShowEventWindow = new BrowserWindow({parent: mainWindow, modal: true, show: false, autoHideMenuBar:true })
  ShowEventWindow.setAlwaysOnTop(true);
  ShowEventWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'templates/event.html'),
    protocol: 'file:',
    slashes: true
  }))

  ShowEventWindow.on('close', function (event) {
    console.log("close ShowEventWindow");
    ShowEventWindow.hide();
    event.preventDefault();
  })
};

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
  service.login(event, data);
})

// invoació del Signup
ipcMain.on('invokeSignupAction', function(event, data){
  console.info("signup data:" + data.name +"  " + data.password + " admin: "+ data.admin);
  service.signup(event, data);
})

//invoació  del Logout
ipcMain.on('invokeLogoutAction', function(event, data){
  console.info("logout data:" + data.name );
  service.logout(event, data);
})


ipcMain.on('invokeEditEventAction', function(event, data){
  console.log("EditWindow data:"+ data)
  try{
    if (EditWindow === null) {
      createEditWindow()
    }
    var resultat=null;
    if(data.id!=null){
      resultat=  service.getEventbyId(event,data.id);
      console.log("resultat main:" + JSON.stringify(resultat));
    }
    EditWindow.webContents.send('store-data', resultat);
    EditWindow.show();
  }catch(error){
    console.error(error);
  }
})

//invocació  del Create Event
ipcMain.on('invokeCreateEventAction', function(event, data){
  console.info("create event data:" + data.nom );
  console.info("create event data id:" + data.id );
  if(data.id){
    service.update(event, data);
  }else{
    service.create(event, data);
  }
})

//invocació  del Delete Event
ipcMain.on('invokeDeleteEventAction', function(event, data){
  console.info("delete event data:" + data.id );
  service.delete(event, data);
})

//invocació  del GetByFilter Event
ipcMain.on('invokeGetEventsAction', function(event, data){
  console.info("invokeGetEventsAction" );
  console.info(JSON.stringify(data));
  service.getByFilter(event, data, false);
})

//invocació del GetEvents que ens servirà per omplir la taula amb l'opció d'edició d'events
ipcMain.on('invokeGetEventsToEditAction', function(event, data){
  console.info("invokeGetEventsToEditAction" );
  service.getByFilter(event, data, true);
})

//invocació del ShowEvent que ens servirà per visualitzar un únic event
ipcMain.on('invokeShowEventAction', function(event, data){
  console.info("invokeShowEventAction" );
  try{
    if (ShowEventWindow === null) {
      createShowEventWindow()
    }
    var resultat=null;
    if(data.id!=null){
      resultat=  service.getEventbyId(event,data.id);
      console.log("resultat show main:" + JSON.stringify(resultat));
    }
    ShowEventWindow.webContents.send('store-data', resultat);
    ShowEventWindow.show();
  }catch(error){
    console.error(error);
  }
})
