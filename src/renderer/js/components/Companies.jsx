import React, { Component } from "react";

const { ipcRenderer } = require("electron");

class Companies extends Component {
  constructor() {
    super();

    this.getSuggestions = search => {
      const text = search.trim().toLowerCase();
      const suggestions = this.state.companies.filter(company => {
        const name = company.name.trim().toLowerCase();
        const sym = company.symbol.trim().toLowerCase();
        return name.includes(text) || sym.includes(text);
      });
      return suggestions;
    };

    this.updateCompanies = (event, companies_str) => {
      const companies = JSON.parse(companies_str);
      this.setState({
        companies: companies
      });
      this.setState({
        suggestions: this.getSuggestions(this.state.search)
      });
    };

    this.state = {
      companies: [],
      suggestions: [],
      search: ""
    };

    this.handleChange = this.handleChange.bind(this);

    ipcRenderer.on("companies_ready", this.updateCompanies);
    ipcRenderer.send("companies", { force_update: false });
  }

  handleChange(event) {
    this.setState({
      search: event.target.value,
      suggestions: this.getSuggestions(event.target.value)
    });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.search}
          onChange={this.handleChange}
        />
        <table id="companies_table">
          <tbody>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
            </tr>
            {this.state.suggestions.map(company => {
              return (
                <tr>
                  <td>{company.symbol}</td>
                  <td>{company.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Companies;
