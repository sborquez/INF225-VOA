const path = require('path');
const PythonCall = require('./utils/pythonProtocol');
const rendererDir = path.join(__dirname, '../renderer');

function valorizeFromCloud(event, win, args, download_path) {
  let csv_path;
  let plot_path;

  args.download_path = download_path;
  const call = new PythonCall('calculate.py', args);

  call.onStatus("loaded", (rel_csv_path) => {
    win.loadURL(path.join(rendererDir, 'html/results.html'));
    csv_path = path.join(__dirname, "./../../", rel_csv_path);
  });

  call.onStatus("plot generated", (rel_plot_path) => {
    plot_path = path.join(__dirname, "./../../", rel_plot_path);
    event.sender.send("plot generated", plot_path);
    event.sender.send("csv loaded", csv_path);
  })

  call.start();
}

module.exports = valorizeFromCloud;