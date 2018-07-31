import React, { Component } from "react";

const { ipcRenderer } = require("electron");

class Companies extends Component {
  constructor() {
    super();

    this.updateCompanies = (event, companies_str) => {
      const companies = JSON.parse(companies_str);
      this.setState({
        companies: companies
      });
    };

    this.updateSuggestions = () => {
      const text = this.state.search.trim().toLowerCase();
      const suggestions = this.state.companies.filter(company => {
        const name = company.name.trim().toLowerCase();
        return name.includes(text);
      });
      this.setState({
        suggestions: suggestions
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
      search: event.target.value
    });
    this.updateSuggestions();
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
          <tr>
            <th>Symbol</th>
            <th>Name</th>
          </tr>
          {this.state.suggestions.map(company => {
            <tr>
              <td>company.symbol</td>
              <td>company.name</td>
            </tr>;
          })}
        </table>
      </div>
    );
  }
}

export default Companies;
