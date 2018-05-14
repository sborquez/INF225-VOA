const electron = require('electron');
const path = require('path');
const url = require('url');

/*
 *  electron initialization
 */

const rendererDir = path.join(__dirname, '../renderer');

const app = electron.app;
const ipc = electron.ipcMain;

const BrowserWindow = electron.BrowserWindow;
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 715,
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
 *  global data
 */

 let companies = null;

/*
 *  application functionality
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
  args.end = new Date();
  const diff = Math.abs(new Date(args.maturity_time).getTime() - args.end.getTime());
  args.start = new Date(args.end - diff);
  args.maturity_time = diff / (1000 * 3600 * 24 * 365);

  args.start = Math.round(new Date(args.start).getTime() / 1000);
  args.end = Math.round(new Date(args.end).getTime() / 1000);
  
  console.log("calling remote valorize script");
  console.log("arguments","./", args);
  
  // TODO change download path
  valorizeRemote(event, mainWindow, args, "./");
});

ipc.on("companies", (event, args) => {
  if (companies === null || args.force_update) {
    getCompaniesSymbols((response) => {
      companies = response;
      event.sender.send("companies_ready", companies);
    });
  }
  else
  {
    event.sender.send("companies_ready", companies);
  }
})
