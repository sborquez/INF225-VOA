import React, { Component } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

const $ = require("./jquery-3.3.1.min");
const { ipcRenderer } = require("electron");

ReactDOM.render(<App />, document.getElementById("root"));

function valorizeForm() {
  const formData = $("form").serializeArray();
  const args = {};

  for (let i = 0; i < formData.length; i++) {
    args[formData[i]["name"]] = formData[i]["value"];
  }
  return args;
}

function openFile() {
  dialog.showOpenDialog(
    {
      filters: [{ name: "CSV", extensions: ["csv"] }]
    },
    function(fileNames) {
      if (fileNames === undefined) return;

      var fileName = fileNames[0];
      $("#data_input").val(fileName);
      $("#file_submit").html(fileName);
    }
  );
}

function reloadCompanies() {
  ipcRenderer.send("companies", { force_update: false });
}

$("#local_submit").on("click", () => {
  ipc.send("valorize local", valorizeForm());
});

$("#remote_submit").on("click", () => {
  ipc.send("valorize remote", valorizeForm());
});

$("#file_submit").on("click", openFile);
$(document).ready(reloadCompanies);

function fillTable(symbols) {
  const table = $("#companies_table tr");
  table.not(":first").remove();
  let html = "";
  for (let sym in symbols)
    html += "<tr><td>" + sym + "</td><td>" + symbols[sym] + "</td></tr>";
  table.first().after(html);
}

ipcRenderer.on("companies_ready", (event, symbols_json) => {
  const symbols = JSON.parse(symbols_json);
  fillTable(symbols);
});
