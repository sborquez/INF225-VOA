const path = require('path');
const PythonShell = require("python-shell");

const rendererDir = path.join(__dirname, '../renderer');

/* valorizeFromCSV debera definir los argumentos necesarios
 * para llamar al script de python cargando un csv.
 * Luego, envia y recibe los mensajes de estado (STATUS) del script
 * para ir mostrando el avance al usuario
 */
function valorizeFromCSV(event, win, csv_path, action_code, action_name, r_value, option_type)
{
  // Se definen las opciones para el script
  const options = {
    mode: "text",
    scriptPath: path.join(__dirname, "../common"),
    pythonOptions: ['-u'],
    args: ["--csv=" + csv_path, "--code=" + action_code, "--name="+action_name, "--r="+r_value, "--type="+option_type]
  }

  var shell =  new PythonShell('calculate.py', options)

  let plot_path;

  shell.on('message', function (message) {
    // Esto ocurre cuando se hace un print() en python
    /* Se recibio un mensaje str 'message' desde python 
     * TODO
     * debera tener un formato predefinido por nosotros 
     */
    const parsed = message.split("\t");

    if (parsed[0].localeCompare("STATUS") == 0) {
      if (parsed[1].localeCompare("Cargado") == 0) {
        win.loadURL(path.join(rendererDir, 'html/results.html'));
      } else if (parsed[1].localeCompare("Grafico generado") == 0) {
        plot_path = path.join(__dirname, "./../../", parsed[2])
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
    // Esto ocurre al finalizar el script de python
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
  });
}
module.exports = valorizeFromCSV;

