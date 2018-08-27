import React, { Component } from "react";
import OptionType from "./OptionType";
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
      option_type: "EU",
      filepath_data: null,
      code: "",
      name: ""
    };

    this.handleNewParams = this.handleNewParams.bind(this);
    this.handleNewFile = this.handleNewFile.bind(this);
    this.handleNewType = this.handleNewType.bind(this);
    this.valorize = this.valorize.bind(this);
  }

  valorize() {
    const params = Object.assign({}, this.state);
    if (this.state.filepath_data) {
      ipcRenderer.send("valorize local", params);
    } else {
      ipcRenderer.send("valorize remote", params);
    }
  }

  handleNewParams(r, initial_price, maturity_time, simulations) {
    this.setState({
      r: r,
      strike_price: initial_price,
      maturity_time: maturity_time,
      simulations: simulations
    });
  }

  handleNewType(type) {
    this.setState({
      option_type: type
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
        <Params onNewParams={this.handleNewParams} />
        <div className="lt_results">
          <Results />
        </div>
        <div className="lt_type">
          <OptionType onUpdate={this.handleNewType} />
        </div>
        <div className="lt_button">
          <div id="valorize">
            <button type="button" onClick={this.valorize}>
              Valorizar
            </button>
          </div>
        </div>
        <div className="lt_data highlight" id="companies">
          <Companies
            onUpdate={this.handleNewCompany}
            onFilename={this.handleNewFile}
          />
        </div>
      </div>
    );
  }
}

export default App;
