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
