const ipc = require('electron').ipcMain;
const path = require('path');
const PythonCall = require('../utils/pythonProtocol');

function getCompaniesSymbols(event)
{
  const call = new PythonCall('companies.py');

  call.onResult((companies_list) => {
    event.sender.send("companies_ready", companies_list);
  })

  call.start();
}
module.exports = getCompaniesSymbols;