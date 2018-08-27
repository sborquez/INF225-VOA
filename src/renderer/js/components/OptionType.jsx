import React, { Component } from "react";

class OptionType extends Component {
  constructor() {
    super();
    this.state = { type: "EU" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log(e.target.value);
    this.setState({ type: e.target.value });
    this.props.onUpdate(e.target.value);
  }

  render() {
    return (
      <React.Fragment>
        <label>Tipo: </label>
        <span>
          <input
            type="radio"
            name="option_type"
            value="EU"
            defaultChecked
            onChange={this.handleChange}
          />
          Europea
        </span>
        <span>
          <input
            type="radio"
            name="option_type"
            value="USA"
            onChange={this.handleChange}
          />
          Americana
        </span>
      </React.Fragment>
    );
  }
}

export default OptionType;
