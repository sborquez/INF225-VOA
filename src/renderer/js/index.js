import React, { Component } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import Companies from "./components/Companies";

const $ = require("./jquery-3.3.1.min");
const { ipcRenderer, remote } = require("electron");
const dialog = remote.dialog;

ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<Companies />, document.getElementById("companies"));

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
  ipcRenderer.send("valorize local", valorizeForm());
});

$("#remote_submit").on("click", () => {
  ipcRenderer.send("valorize remote", valorizeForm());
});

$("#file_submit").on("click", openFile);

function fillTable(companies) {
  const table = $("#companies_table tr");
  table.not(":first").remove();
  console.log(companies);
  let html = "";
  for (let company of companies) {
    html +=
      "<tr><td>" + company.symbol + "</td><td>" + company.name + "</td></tr>";
  }
  table.first().after(html);
}

ipcRenderer.on("companies_ready", (event, symbols_json) => {
  const symbols = JSON.parse(symbols_json);
  fillTable(symbols);
});
