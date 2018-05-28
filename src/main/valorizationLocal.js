const path = require('path');
const PythonCall = require('./utils/pythonProtocol');

const rendererDir = path.join(__dirname, '../renderer');

function valorizeFromCSV(callback, args) {
  let csv_path;
  let plot_obj;

  const call = new PythonCall("calculate.py", args);

  call.onStatus("loaded", () => {
    csv_path = args.filepath_data;
  })

  call.onStatus("plot generated", (plot_obj) => {
    plot_obj = JSON.parse(plot_json);
  })

  call.onEnd(() => {
    callback(plot_obj, csv_path);
  });

  call.start();
}

module.exports = valorizeFromCSV;