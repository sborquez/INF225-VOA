const electron = require('electron');
const path = require('path');
const url = require('url');

/*
 * electron initialization
 */

const rendererDir = path.join(__dirname, '../renderer');

const app = electron.app;
const ipc = electron.ipcMain;

const BrowserWindow = electron.BrowserWindow;
let mainWindow

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
 * application functionality
*/

valorizeLocal = require('./valorizationLocal');
valorizeRemote = require('./valorizationRemote');
getCompaniesSymbols = require('./companies/companies');

ipc.on("valorize local", (event, args) => {
  console.log("calling local valorize script");
  console.log("arguments",args["filepath_data"], args["action_code"], args["action_name"], args["r_value"], args["option_type"]);
  valorizeLocal(event, mainWindow, args["filepath_data"], args["action_code"], args["action_name"], args["r_value"], args["option_type"]);
});

ipc.on("valorize remote", (event, args) => {
  let start = new Date(args["start"]).getTime() / 1000;
  let end = new Date(args["end"]).getTime() / 1000;
  
  console.log("calling remote valorize script");
  console.log("arguments","./", args["action_code"], args["action_name"], args["r_value"], args["option_type"], start, end);  
  
  // TODO change download path
  valorizeRemote(event, mainWindow, "./", args["action_code"], args["action_name"], args["r_value"], args["option_type"], start, end);
});

ipc.on("companies", (event, args) => {
  getCompaniesSymbols(event);
})