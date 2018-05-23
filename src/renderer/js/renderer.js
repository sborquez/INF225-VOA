const ipc = require('electron').ipcRenderer;
const $ = require('./jquery-3.3.1.min');

const remote = require('electron').remote; 
const dialog = remote.dialog; 

/* Interactive Sidebar */

$(".valorizer-item").on("click", function () {
  const elem = $(this);

  const value_text = elem.find("span:nth-child(2)");
  const input = elem.find("input");

  value_text.toggle();
  input.toggle();
  if ( input.css('display') !== 'none' ) input.focus();
})

$(".valorizer-item").on("keydown", function (event) {
  const item = $(this);
  const value_text = item.find("span:nth-child(2)");
  const input = item.find("input");

  if (input.is(":focus") && event.keyCode == 13)
  {
    value_text.toggle();
    input.toggle();
  }
})

$(".valorizer-item input").on("focusout", function () {
  updateValue($(this).parent());
})

function updateValue(item)
{
  const value_text = item.find("span:nth-child(2)");
  const input = item.find("input");

  const parsedValue = checkValue(item)
  if (parsedValue !== undefined)
  {
    value_text.text(parsedValue);
  }
  else
  {
    input.val("");
    value_text.text("Sin definir");
  }
}

function checkValue(item)
{
  const value_text = item.find("span:nth-child(2)");
  const input = item.find("input");

  const item_type = item.data("item-type");

  const text = input.val();
  switch (item_type)
  {
    case "r":
      const r = parseFloat(text);
      if (!isNaN(r) && r >= 0 && r <= 1)
        return r
      break;
    default:
      return text;
  }
}

/* Utils */

function valorizeForm() {
  const formData = $('form').serializeArray();
  const args = {}

  for (let i = 0; i < formData.length; i++) {
    args[formData[i]["name"]] = formData[i]["value"];
  }
  return args;
}

function openFile () {
 dialog.showOpenDialog({ filters: [
   { name: 'CSV', extensions: ['csv'] }
  ]}, function (fileNames) {

  if (fileNames === undefined) return;

  var fileName = fileNames[0];
  $('#data_input').val(fileName);
  $('#file_submit').html(fileName);
 }); 
}

function reloadCompanies()
{
  ipc.send('companies', {force_update: false});
}

/* Buttons */

$('#local_submit').on("click", () => {
  ipc.send('valorize local', valorizeForm());
});

$('#remote_submit').on("click", () => {
  ipc.send('valorize remote', valorizeForm());
});

$("#file_submit").on("click", openFile);

$(document).ready(reloadCompanies);

/* Companies Table */

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
