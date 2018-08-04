const path = require("path");
const PythonCall = require("./utils/pythonProtocol");

const rendererDir = path.join(__dirname, "../renderer");

function valorizeLocal(callback, args) {
  let csv_path;
  const plot = {};

  const call = new PythonCall("calculate.py", args);

  call.onStatus("loaded", () => {
    csv_path = args.filepath_data;
  });

  call.onStatus("plot generated", result => {
    plot.TS = JSON.parse(result);
  });

  call.onResult(result => {
    plot.res = JSON.parse(result);
  });

  call.onEnd(() => {
    callback(plot, csv_path);
  });

  call.start();
}

export default valorizeLocal;
