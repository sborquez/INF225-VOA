import React, { Component } from "react";
import Autosuggest from "react-autosuggest";

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

    const getSuggestions = value => {
      const text = value.trim().toLowerCase();
      return this.state.companies.filter(company => {
        const name = company.name.trim().toLowerCase();
        return name.includes(text);
      });
    };

    this.onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: getSuggestions(value)
      });
    };

    this.onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });
    };

    this.onChange = (event, { newValue }) => {
      this.setState({
        value: newValue
      });
    };

    this.onChange = (event, { newValue }) => {
      this.setState({
        value: newValue
      });
    };

    this.state = {
      companies: [],
      suggestions: [],
      value: ""
    };

    ipcRenderer.on("companies_ready", this.updateCompanies);
    ipcRenderer.send("companies", { force_update: false });
  }

  getSuggestionValue(value) {
    return value.name;
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "¿Qué empresa quiere revisar?",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={value => value.name}
        renderSuggestion={suggestion => <span>{suggestion.name}</span>}
        inputProps={inputProps}
      />
    );
  }
}

export default Companies;
