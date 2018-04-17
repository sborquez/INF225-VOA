const ipc = require('electron').ipcRenderer;
const $ = require('./jquery-3.3.1.min');

const remote = require('electron').remote; 
const dialog = remote.dialog; 

function valorizeForm() {
  const formData = $('form').serializeArray();
  const args = {}

  for (let i = 0; i < formData.length; i++) {
    args[formData[i]["name"]] = formData[i]["value"];
  }

  ipc.send('valorize', args);
}

function openFile () {
 dialog.showOpenDialog({ filters: [
   { name: 'CSV', extensions: ['csv'] }
  ]}, function (fileNames) {

  if (fileNames === undefined) return;

  var fileName = fileNames[0];
  $('#input_data').val(fileName);
  $('#file_submit').html(fileName);
 }); 
}

function reloadCompanies()
{
  ipc.send('companies');
}

$('#main_submit').on("click", valorizeForm);
$("#file_submit").on("click", openFile);
$(document).ready(reloadCompanies);

function fillTable(symbols)
{
  const table = $('#companies_table tr');
  table.not(':first').remove();
  let html = '';
  for(let sym in symbols)
            html += '<tr><td>' + sym + 
                    '</td><td>' + symbols[sym] + '</td></tr>';
  table.first().after(html);
}

ipc.on('companies_ready', (event, symbols_json) => {
  const symbols = JSON.parse(symbols_json);
  fillTable(symbols);
})
