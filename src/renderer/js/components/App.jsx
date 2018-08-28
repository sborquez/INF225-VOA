import React, { Component } from "react";
import Companies from "./Companies";
import Results from "./Results";
import Params from "./Params";

const { ipcRenderer, remote } = require("electron");

class App extends Component {
  constructor() {
    super();
    this.state = {
      r: 0.05,
      strike_price: 30,
      maturity_time: "2019-01-01",
      simulations: 1000,
      display_type: "ts",
      filepath_data: null,
      code: "",
      name: ""
    };

    this.handleNewParams = this.handleNewParams.bind(this);
    this.handleNewFile = this.handleNewFile.bind(this);
    this.handleNewType = this.handleNewType.bind(this);
    this.valorize = this.valorize.bind(this);
    this.valorizeOption = this.valorizeOption.bind(this);

    ipcRenderer.on("results", (event, results) => {
      this.setState({ waiting: false });
    });

    ipcRenderer.on("no results", (event, results) => {
      this.setState({ waiting: false });
    });
  }

  valorize() {
    this.valorizeOption("eu");
  }

  valorizeOption(option_type) {
    const params = {
      r: this.state.r,
      strike_price: this.state.strike_price,
      maturity_time: this.state.maturity_time,
      simulations: this.state.simulations,
      option_type: option_type,
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

  handleNewParams(r, strike_price, maturity_time, simulations) {
    this.setState({
      r: r,
      strike_price: initial_price,
      maturity_time: maturity_time,
      simulations: simulations
    });
  }

  handleNewType(type) {
    this.setState({
      display_type: type
    });
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
            {this.state.waiting ? <div className="loader" /> : "Valorizar"}
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
