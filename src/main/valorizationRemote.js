const path = require('path');
const PythonCall = require('./utils/pythonProtocol');
const rendererDir = path.join(__dirname, '../renderer');

function valorizeFromCloud(callback, args, download_path) {
  let csv_path;
  let plot_obj;

  args.download_path = download_path;
  const call = new PythonCall('calculate.py', args);

  call.onStatus("loaded", (rel_csv_path) => {
    csv_path = path.join(__dirname, "./../../", rel_csv_path);
  });

  call.onStatus("plot generated", (plot_json) => {
    plot_obj = JSON.parse(plot_json);
  });

  call.onEnd(() => {
    callback(plot_obj, csv_path);
  });

  call.start();
}

module.exports = valorizeFromCloud;