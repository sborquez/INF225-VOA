const path = require('path');
const PythonCall = require('./utils/pythonProtocol');
const rendererDir = path.join(__dirname, '../renderer');

function valorizeFromCloud(win, args, download_path) {
  let csv_path;
  let plot_path;

  args.download_path = download_path;
  const call = new PythonCall('calculate.py', args);

  call.onStatus("loaded", (rel_csv_path) => {
    csv_path = path.join(__dirname, "./../../", rel_csv_path);
  });

  call.onStatus("plot generated", (plot_json) => {
    const plot_obj = JSON.parse(plot_json);

    win.webContents.send("plot generated", plot_obj);
    win.webContents.send("csv loaded", csv_path);
    win.show();
  })

  call.start();
}

module.exports = valorizeFromCloud;