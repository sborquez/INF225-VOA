import React, { Component } from "react";

const { ipcRenderer } = require("electron");

class ActionComplete extends Component {
  constructor() {
    super();

    this.state = {
      companies: [],
      suggestions: [],
      search: "",
      placeholder: "",
      listFocused: false,
      currFocus: -1
    };

    this.getSuggestions = this.getSuggestions.bind(this);

    this.updateCompanies = (e, companies_str) => {
      const companies = JSON.parse(companies_str);
      this.setState({
        companies: companies,
        suggestions: this.getSuggestions(this.state.search)
      });
    };

    ipcRenderer.on("companies_ready", this.updateCompanies);
    ipcRenderer.send("companies", { force_update: false });
  }

  getSuggestions(search) {
    const text = search.trim().toLowerCase();
    const suggestions = this.state.companies.filter(company => {
      const name = company.name.trim().toLowerCase();
      const sym = company.symbol.trim().toLowerCase();
      return name.includes(text) || sym.includes(text);
    });
    return suggestions;
  }

  render() {
    const handleChange = event => {
      this.setState({
        search: event.target.value,
        suggestions: this.getSuggestions(event.target.value),
        listFocused: true,
        selected: null,
        currFocus: -1
      });
    };

    const select = company => {
      this.setState({
        search: "",
        placeholder: company.symbol + "-" + company.name,
        listFocused: false,
        currFocus: -1,
        selected: company
      });
      this.props.onUpdate(company);
    };

    const getCompanies = () => {
      return this.state.suggestions.map((company, i, arr) => (
        <div
          key={i}
          onClick={e => {
            select(company);
          }}
          className={i === this.state.currFocus ? "autocomplete-active" : null}
        >
          <span>{company.symbol + " - " + company.name}</span>
          <input type="hidden" value={company.symbol} />
        </div>
      ));
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
            search: ""
          });
          break;
        case 38: // up
          event.preventDefault();
          currFocus =
            currFocus > 0 ? this.state.currFocus - 1 : suggestions.length - 1;
          this.setState({
            currFocus: currFocus,
            search: ""
          });
          break;
        case 13: // enter
          if (currFocus > -1) {
            event.preventDefault();
            select(suggestions[currFocus]);
          }
          break;
        default:
          break;
      }
    };

    return (
      <React.Fragment>
        <div className="autocomplete">
          <input
            type="text"
            value={this.state.search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              this.state.placeholder.length > 0
                ? this.state.placeholder
                : "Buscar una acción..."
            }
          />
          <div id="autocomplete-list" className="autocomplete-items">
            {this.state.listFocused > 0 ? getCompanies() : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ActionComplete;
