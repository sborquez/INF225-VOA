import React, { Component } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

const $ = require("./jquery-3.3.1.min");
const { ipcRenderer, remote } = require("electron");
const dialog = remote.dialog;

ReactDOM.render(<App />, document.getElementById("app"));
