import React, { Component } from "react";

class DisplayType extends Component {
  constructor(props) {
    super(props);
    this.state = { type: "ts" };

    this.select = this.select.bind(this);
  }

  select(type) {
    this.setState({ type: type });
    this.props.onNewType(type);
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={
            "lt_type_ts type-box" +
            (this.state.type === "ts" ? " selected" : "")
          }
          onClick={() => this.select("ts")}
        >
          Time Series (Input)
        </div>
        <div
          className={
            "lt_type_eu type-box" +
            (this.state.type === "eu" ? " selected" : "")
          }
          onClick={() => this.select("eu")}
        >
          <label>O. Europea (Output)</label>
        </div>
        <div
          className={
            "lt_type_usa type-box" +
            (this.state.type === "usa" ? " selected" : "")
          }
          onClick={() => this.select("usa")}
        >
          <label>O. Americana (Output)</label>
        </div>
      </React.Fragment>
    );
  }
}

export default DisplayType;
