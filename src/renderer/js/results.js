const ipc = require('electron').ipcRenderer;
const $ = require('../js/jquery-3.3.1.min');
const parser = require('csv-parse');

function tableFromCSV(filepath_csv)
{
  console.log(filepath_csv);
}

function showPlot(filepath)
{
  const img = $('<img id="plot"></img>')
    .attr("src", filepath);

  $('body').append(img);
}

ipc.on('csv loaded', (event, filepath) => {
  tableFromCSV(filepath);
});

ipc.on('plot generated', (event, filepath) => {
  showPlot(filepath);
});