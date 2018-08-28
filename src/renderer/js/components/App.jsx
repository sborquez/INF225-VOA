import React, { Component } from "react";
import Companies from "./Companies";
import Results from "./Results";
import Params from "./Params";

import moment from "moment";

const { ipcRenderer, remote } = require("electron");

class App extends Component {
  constructor() {
    super();
    this.state = {
      r: 0.05,
      strike_price: 30,
      maturity_time: moment()
        .add(1, "years")
        .format("YYYY-MM-DD"),
      simulations: 1000,
      option_type: "EU",
      filepath_data: null,
      code: "",
      name: ""
    };

    this.handleNewParams = this.handleNewParams.bind(this);
    this.handleNewFile = this.handleNewFile.bind(this);
    this.valorize = this.valorize.bind(this);

    ipcRenderer.on("results", (event, results) => {
      this.setState({ waiting: false });
    });

    ipcRenderer.on("no results", (event, results) => {
      this.setState({ waiting: false });
    });
  }

  valorize() {
    const params = {
      r: this.state.r,
      strike_price: this.state.strike_price,
      maturity_time: this.state.maturity_time,
      simulations: this.state.simulations,
      option_type: this.state.option_type,
      filepath_data: this.state.filepath_data,
      code: this.state.code,
      name: this.state.name
    };
    if (!this.state.waiting) {
      if (this.state.filepath_data) {
        ipcRenderer.send("valorize local", params);
      } else {
        ipcRenderer.send("valorize remote", params);
      }
      this.setState({ waiting: true });
    }
  }

  handleNewParams(change) {
    const new_state = Object.assign({}, this.state, change);
    this.setState(new_state);
    console.log(change);
    console.log(new_state);
  }

  handleNewFile(filepath_data) {
    this.setState({
      filepath_data: filepath_data
    });
  }

  handleNewCompany(company) {
    this.setState({
      code: company.symbol,
      name: company.name
    });
  }

  render() {
    return (
      <div className="lt_grid-container">
        <div className="lt_data" id="companies">
          <Companies
            onUpdate={this.handleNewCompany}
            onFilename={this.handleNewFile}
          />
        </div>
        <div className="lt_button" id="valorize">
          <button type="button" onClick={this.valorize}>
            {this.state.waiting ? "Calculando" : " Valorizar "}
          </button>
        </div>
        <div className="lt_input">
          <Params onNewParams={this.handleNewParams} />
        </div>
        <div className="lt_results">
          <Results />
        </div>
      </div>
    );
  }
}

export default App;
