const ipc = require('electron').ipcRenderer;
const $ = require('../js/jquery-3.3.1.min');
const parser = require('csv-parse');

function tableFromCSV(filepath_csv)
{
  console.log(filepath_csv);
}

function plot(plot_obj)
{
  c3.generate(plot_obj);
}

ipc.on('csv loaded', (event, filepath) => {
  tableFromCSV(filepath);
});

ipc.on('plot generated', (event, plot_obj) => {
  plot(plot_obj);
});
