const electron = require('electron');
const path = require('path');
const url = require('url');

/*
 * Código básico para una aplicación de electron  
 */

const rendererDir = path.join(__dirname, '../renderer');

const app = electron.app;       // aplicacion
const ipc = electron.ipcMain;

const BrowserWindow = electron.BrowserWindow;
let mainWindow                  // ventana principal

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(rendererDir, 'html/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})


/*
 * Funcionalidades de nuestra aplicación
 */

 /* valorize
  * Llama a un script de python ubicado en /common/calculate.py
  * Se encarga de descargar y evaluar las acciones de una empresa dada
  */
valorizeLocal = require('./valorizationLocal');
valorizeRemote = require('./valorizationRemote');

//TODO diferenciar casos CSV y YAHOO
ipc.on("valorize", (event, args) => {
  console.log("Antes");
  valorizeLocal(args["action_code"], args["action_name"]);
  console.log("Después");
});
