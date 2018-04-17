const ipc = require('electron').ipcMain;
const path = require('path');
const PythonShell = require("python-shell");

function getCompaniesSymbols(event)
{
  const options = {
    mode: "text",
    scriptPath: path.join(__dirname, "../../common"),
    pythonOptions: ['-u'],
    args: []
  }
  var shell =  new PythonShell('companies.py', options)


  shell.on('message', function (message) {
    const parsed = message.split("\t");

    if (parsed[0].localeCompare("RESULT") == 0) {
      event.sender.send("companies_ready", parsed[1]);
    } else if (parsed[0].localeCompare("STATUS") == 0) {
      console.log(parsed[1]);
    } else if (parsed[0].localeCompare("ERROR") == 0) {
      console.error(parsed[1]);
    }
  });

  shell.end(function (err, code, signal) {
    if (err) throw err;
  });
}
module.exports = getCompaniesSymbols;