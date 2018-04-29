const path = require('path');
const PythonShell = require("python-shell");

const rendererDir = path.join(__dirname, '../renderer');

function valorizeFromCloud(event, win, download_path, action_code, action_name, r_value, option_type, start, end)
{
  const options = {
    mode: "text",
    scriptPath: path.join(__dirname, "../common"),
    pythonOptions: ['-u'],
    args: ["--download_path=" + download_path, "--code=" + action_code, "--name="+action_name, "--r="+r_value, "--type="+option_type, "--start="+start, "--end="+end]    
  }
  var shell =  new PythonShell('calculate.py', options)


  shell.on('message', function (message) {
    console.log("[python]: " + message);
    
    const parsed = message.split("\t");
    let csv_path;

    if (parsed[0].localeCompare("STATUS") == 0) {
      if (parsed[1].localeCompare("loaded") == 0) {
        win.loadURL(path.join(rendererDir, 'html/results.html'));
        csv_path = path.join(__dirname, "./../../", parsed[2]);
      } else if (parsed[1].localeCompare("plot generated") == 0) {
        plot_path = path.join(__dirname, "./../../", parsed[2]);
        event.sender.send("plot generated", plot_path);
        event.sender.send("csv loaded", csv_path);
      } else {
        console.log(parsed[1]);
      }
    } else if (parsed[0].localeCompare("ERROR") == 0) {
      console.error(parsed[1]);
    }
  });

  shell.end(function (err,code,signal) {
    if (err) throw err;
    console.log('exit code was: ' + code);
    console.log('exit signal was: ' + signal);
    console.log('finished');
  });
}
module.exports = valorizeFromCloud;