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
      search: "",
      listFocused: false,
      currFocus: -1
    };

    ipcRenderer.on("companies_ready", this.updateCompanies);
    ipcRenderer.send("companies", { force_update: false });
  }

  render() {
    const handleChange = event => {
      this.setState({
        search: event.target.value,
        suggestions: this.getSuggestions(event.target.value),
        listFocused: true,
        currFocus: -1
      });
    };

    const select = value => {
      this.setState({ search: value, listFocused: false, currFocus: -1 });
    };

    const closeList = () => {
      this.setState({ search: "", listFocused: false, currFocus: -1 });
    };

    const getCompanies = () => {
      return this.state.suggestions.map((company, i, arr) => {
        return (
          <div
            key={i}
            onClick={e => {
              select(company.symbol);
            }}
            className={
              i === this.state.currFocus ? "autocomplete-active" : null
            }
          >
            <span>{company.symbol + " - " + company.name}</span>
            <input type="hidden" value={company.symbol} />
          </div>
        );
      });
    };

    const handleKeyDown = event => {
      let currFocus = this.state.currFocus;
      const suggestions = this.state.suggestions;
      switch (event.keyCode) {
        case 40: // down
          event.preventDefault();
          currFocus = (currFocus + 1) % suggestions.length;
          this.setState({
            currFocus: currFocus,
            search: currFocus === -1 ? "" : suggestions[currFocus].symbol
          });
          break;
        case 38: // up
          event.preventDefault();
          currFocus =
            currFocus > 0 ? this.state.currFocus - 1 : suggestions.length - 1;
          this.setState({
            currFocus: currFocus,
            search: currFocus === -1 ? "" : suggestions[currFocus].symbol
          });
          break;
        case 13: // enter
          if (currFocus > -1) {
            event.preventDefault();
            select(suggestions[currFocus].symbol);
          }
          break;
        default:
          break;
      }
    };

    return (
      <div className="autocomplete">
        <input
          type="text"
          value={this.state.search}
          list="companies-list"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div
          id="autocomplete-list"
          onBlur={closeList}
          className="autocomplete-items"
        >
          {this.state.listFocused > 0 ? getCompanies() : null}
        </div>
      </div>
    );
  }
}

export default Companies;
