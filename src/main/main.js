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
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Valorización de Opciones",
    resizable: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(rendererDir, 'html/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //mainWindow.webContents.openDevTools()

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
getCompaniesSymbols = require('./companies/companies');

//TODO diferenciar casos CSV y YAHOO
ipc.on("valorize local", (event, args) => {
  console.log("Llamando a script");
  console.log("Argumentos",args["filepath_data"], args["action_code"], args["action_name"], args["r_value"], args["option_type"]);
  valorizeLocal(event, mainWindow, args["filepath_data"], args["action_code"], args["action_name"], args["r_value"], args["option_type"]);
});

ipc.on("valorize remote", (event, args) => {
<<<<<<< HEAD
  let start = new Date(args["start"]).getTime();
  let end = new Date(args["end"]).getTime();
  
  console.log("Llamando a script");
  console.log("Argumentos","./", args["action_code"], args["action_name"], args["r_value"], args["option_type"], start, end);  
=======
  console.log("Llamando a script");
  let start = new Date(args["start"]).getTime() / 1000;
  let end = new Date(args["end"]).getTime() / 1000;
  // console.log(start);
>>>>>>> c93c9b6d9b5961cbfe4986fe7b2198ff425b887d
  // TODO cambiar path de descarga
  valorizeRemote("./", args["action_code"], args["action_name"], args["r_value"], args["option_type"], start, end);
});

ipc.on("companies", (event, args) => {
  getCompaniesSymbols(event);
})