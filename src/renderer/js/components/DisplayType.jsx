import React, { Component } from "react";

class DisplayType extends Component {
  constructor(props) {
    super(props);
    this.state = { type: "in" };

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
            "lt_type_in type-box" +
            (this.state.type === "in" ? " selected" : "")
          }
          onClick={() => this.select("in")}
        >
          Input: Histórico
        </div>
        <div
          className={
            "lt_type_out type-box" +
            (this.state.type === "out" ? " selected" : "")
          }
          onClick={() => this.select("out")}
        >
          <label>Output: Valorización</label>
        </div>
      </React.Fragment>
    );
  }
}

export default DisplayType;
