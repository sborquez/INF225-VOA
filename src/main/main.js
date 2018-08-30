const electron = require("electron");
const path = require("path");
const url = require("url");

import valorizeLocal from "./valorizationLocal";
import valorizeRemote from "./valorizationRemote";

import getCompaniesSymbols from "./companies/companies";

/*
 *  electron initialization
 */

const rendererDir = path.join(__dirname, "../renderer");

const app = electron.app;
const ipc = electron.ipcMain;

const BrowserWindow = electron.BrowserWindow;
let mainWindow;
let resultWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    title: "Valorización de Opciones",
    resizable: false
  });
  mainWindow.setMenu(null);

  mainWindow.loadURL(
    url.format({
      pathname: path.join(rendererDir, "html/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

/*
 *  global data
 */

let companies = null;

/*
 *  application functionality
 */

function getDateParams(maturity_time) {
  const res = {};

  res.end = new Date();
  const diff = Math.abs(new Date(maturity_time).getTime() - res.end.getTime());
  res.start = new Date(res.end - diff);

  res.maturity_time = diff / (1000 * 3600 * 24 * 365);
  res.start = Math.round(new Date(res.start).getTime() / 1000);
  res.end = Math.round(new Date(res.end).getTime() / 1000);
  return res;
}

function showResults(plots, csv) {
  if (plots) {
    mainWindow.webContents.send("results", {
      res: plots.res,
      TS: plots.TS,
      csv: csv
    });
  } else {
    mainWindow.webContents.send("no results");
  }
}

ipc.on("valorize local", (event, args) => {
  Object.assign(args, getDateParams(args.maturity_time));

  console.log("calling local valorize script");
  console.log("arguments", args);
  valorizeLocal(showResults, args);
});

ipc.on("valorize remote", (event, args) => {
  Object.assign(args, getDateParams(args.maturity_time));

  console.log("calling remote valorize script");
  console.log("arguments", "./results/", args);

  // TODO change download path
  valorizeRemote(showResults, args, "./results/");
});

ipc.on("companies", (event, args) => {
  if (companies === null || args.force_update) {
    getCompaniesSymbols(response => {
      companies = response;
      event.sender.send("companies_ready", companies);
    });
  } else {
    event.sender.send("companies_ready", companies);
  }
});
