const path = require('path');
const PythonCall = require('./utils/pythonProtocol');

const rendererDir = path.join(__dirname, '../renderer');

function valorizeFromCSV(event, win, csv_path, action_code, action_name, r_value, option_type) {
  const args = {
    csv: csv_path,
    code: action_code,
    name: action_name,
    r: r_value,
    type: option_type
  }

  const call = new PythonCall("calculate.py", args);

  call.onStatus("loaded", () => {
    win.loadURL(path.join(rendererDir, 'html/results.html'));
  })

  call.onStatus("plot generated", (plot_obj) => {
    event.sender.send("plot generated", plot_obj);
    event.sender.send("csv loaded", csv_path);
  })

  call.start();
}

module.exports = valorizeFromCSV;