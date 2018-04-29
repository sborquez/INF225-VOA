"use strict";

const path = require('path');
const PythonShell = require("python-shell");

const options = {
  mode: "text",
  scriptPath: path.join(__dirname, "../../common"),
  pythonOptions: ['-u']
}

const messageType = {
  "status": 0,
  "result": 1,
  "error": 2
};

function logpython(message) {
  console.log("[python]: " + message)
}

function logpythonerror(message) {
  console.log("[error]: " + message)
}

function parseMessage(message) {
  const splitted = message.split("\t");
  const type = splitted[0].toLowerCase();

  if (!(type in messageType)) {
    return null;
  }

  const argument = (splitted[2] === "None") ? null : splitted[2];

  const parsed = {
    type: messageType[type],
    message: splitted[1],
    argument: argument
  }
  return parsed;
}

function callbackMessage(message, argument, callback_list, warn=false) {
  if (!(message in callback_list)) {
    if (warn)
      console.warn("message not handled");
    return;
  } else {
    const callback = callback_list[message];
    callback(argument);
  }
}

function parseArguments(arguments_obj)
{
  const args = new Array();
  for (let arg_name in arguments_obj)
    args.push("--" + arg_name + "=" + arguments_obj[arg_name]);
  return args;
}

class PythonCall {
  constructor(scriptname, args={}) {
    this.scriptname = scriptname;
    this.__shell = null;
    this.__started = false;
    this.__options = Object.assign({}, options);
    this.__options.args = parseArguments(args)

    this.__result_callbacks = {};
    this.__status_callbacks = {};
    this.__error_callbacks = {};
  }

  start() {
    if (!this.__started) {
      this.__shell = new PythonShell(this.scriptname, this.__options)

      const shell = this.__shell;
      this.__started = true;

      shell.on("message", (msg) => {
        this.__handleMessage(msg);
      });

      shell.end((err, code, signal) => {
        if (err) throw err;
        console.log('python exit code was: ' + code);
        console.log('python exit signal was: ' + signal);
        console.log('python script finished');
      });
    }
  }

  __handleMessage(msg) {
    const parsed = parseMessage(msg);
    if (parsed == null) {
      console.warn("received non-conventional python message: " + msg);
      return
    }

    if (parsed.type == messageType.status) {
      logpython(msg);
      callbackMessage(parsed.message, parsed.argument, this.__status_callbacks);
    } else if (parsed.type == messageType.result) {
      logpython(msg);
      callbackMessage(parsed.message, parsed.argument, this.__result_callbacks);
    } else if (parsed.type == messageType.error) {
      logpythonerror(msg);
      callbackMessage(parsed.message, parsed.argument, this.__error_callbacks);
    }
  }

  onResult(msg, callback) {
    this.__result_callbacks[msg] = callback;
  }

  onStatus(msg, callback) {
    this.__status_callbacks[msg] = callback;
  }
}

module.exports = PythonCall;