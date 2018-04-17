const ipc = require('electron').ipcRenderer;
const $ = require('./jquery-3.3.1.min');

$('#main_submit').on("click", () => {
  const formData = $('form').serializeArray();
  const args = {}

  for (let i = 0; i < formData.length; i++) {
    args[formData[i]["name"]] = formData[i]["value"];
  }

  ipc.send('valorize', args);
});

function reloadCompanies()
{
  ipc.send('companies');
}

$(document).ready(reloadCompanies);

ipc.on('companies_ready', (event, symbols_json) => {
  const symbols = JSON.parse(symbols_json);
  console.log(symbols);

  const table = $('#companies_table tr');
  table.not(':first').remove();
  let html = '';
  for(let sym in symbols)
            html += '<tr><td>' + sym + 
                    '</td><td>' + symbols[sym] + '</td></tr>';
  table.first().after(html);
})
