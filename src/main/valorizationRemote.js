const path = require("path");
const PythonCall = require("./utils/pythonProtocol");
const rendererDir = path.join(__dirname, "../renderer");

function valorizeRemote(callback, args, download_path) {
  let csv_path;
  const plot = {};

  args.download_path = download_path;
  const call = new PythonCall("calculate.py", args);

  call.onStatus("loaded", rel_csv_path => {
    csv_path = path.join(__dirname, "./../../", rel_csv_path);
  });

  call.onStatus("plot generated", plot_json => {
    plot.TS = JSON.parse(plot_json);
  });

  call.onResult(result => {
    plot.res = JSON.parse(result);
  });

  call.onEnd(() => {
    callback(plot, csv_path);
  });

  call.start();
}

export default valorizeRemote;
