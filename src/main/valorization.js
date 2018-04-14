const path = require('path');
const PythonShell = require("python-shell");

function valorize(action_code, action_name)
{
  const options = {
    mode: "text",
    scriptPath: path.join(__dirname, "../common"),
    pythonOptions: ['-u'],
    args: [action_code, action_name]
  }
  
  PythonShell.run("calculate.py", options, (err, results) => {
    if (err) throw err;

    results.forEach(result => {
      console.log(result);
    });
  });
}

module.exports = valorize;
