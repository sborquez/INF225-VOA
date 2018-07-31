import React, { Component } from "react";

class Companies extends Component {
  constructor() {
    super();
    this.state = {
      companies: []
    };
  }

  render() {
    return (
      <select>
        {this.state.companies.map(company => {
          <option value={company.sym}>{company.name}</option>;
        })}
      </select>
    );
  }
}

export default Companies;
