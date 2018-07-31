const PythonCall = require("../utils/pythonProtocol");

function getCompaniesSymbols(callback) {
  const call = new PythonCall("companies.py");

  call.onResult(companies_list => {
    callback(companies_list);
  });

  call.start();
}

export default getCompaniesSymbols;
