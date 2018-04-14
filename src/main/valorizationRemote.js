const path = require('path');
const PythonShell = require("python-shell");


/* valorizeFromCloud debera definir los argumentos necesarios
 * para llamar al script de python para descargar y cargar desde una BD.
 * Luego, envia y recibe los mensajes de estado (STATUS) del script
 * para ir mostrando el avance al usuario
 */

function valorizeFromCloud(action_code, action_name)
{
  const options = {
    mode: "text",
    scriptPath: path.join(__dirname, "../common"),
    pythonOptions: ['-u'],
    args: [action_code, action_name]
  }
  var shell =  new PythonShell('calculate.py', options)


  shell.on('message', function (message) {
    // Esto ocurre cuando se hace un print() en python
    /* Se recibio un mensaje str 'message' desde python 
     * TODO
     * debera tener un formato predefinido por nosotros 
     */ 
    console.log("Recibido desde python: " + message);
  });

  shell.end(function (err,code,signal) {
    // Esto ocurre al finalizar el script de python
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
  });
}
module.exports = valorizeFromCloud;