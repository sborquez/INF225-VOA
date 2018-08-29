import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

const { ipcRenderer, remote } = require("electron");
const dialog = remote.dialog;

class Params extends Component {
  constructor(props) {
    super(props);
    this.state = {
      r: 0.05,
      initial_price: 30,
      maturity_time: moment()
        .add(1, "years")
        .format("YYYY-MM-DD"),
      simulations: 1000,
      maturity_date: moment().add(1, "years"),
      option_type: "EU"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeR = this.handleChangeR.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeSim = this.handleChangeSim.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
  }

  handleChangeR(e) {
    const change = { r: e.target.value };
    this.setState(change);
    this.handleChange(change);
  }

  handleChangePrice(e) {
    this.setState({ initial_price: e.target.value });
    this.handleChange({ strike_price: e.target.value });
  }

  handleChangeTime(m) {
    if (!m.isBefore(moment())) {
      this.setState({
        maturity_time: m.format("YYYY-MM-DD"),
        maturity_date: m
      });
      this.handleChange({ maturity_time: m.format("YYYY-MM-DD") });
    }
  }

  handleChangeSim(e) {
    const change = { simulations: e.target.value };
    this.setState(change);
    this.handleChange(change);
  }

  handleChangeType(type) {
    this.setState({ option_type: type });
    this.handleChange({ option_type: type });
  }

  handleChange(change) {
    if (this.props.onNewParams) this.props.onNewParams(change);
  }

  render() {
    return (
      <React.Fragment>
        <div className="lt_area-overlap inp1 inp_box">
          <label>Tasa Libre de Riesgo</label>
          <input
            name="r"
            type="text"
            value={this.state.r}
            onChange={this.handleChangeR}
          />
        </div>
        <div className="lt_inp2 inp_box">
          <label>Precio de compra (USD)</label>
          <input
            name="strike_price"
            type="number"
            value={this.state.initial_price}
            onChange={this.handleChangePrice}
          />
        </div>
        <div className="lt_inp3 inp_box">
          <label>Tiempo de Madurez</label>
          <DatePicker
            name="maturity_time"
            selected={this.state.maturity_date}
            onChange={this.handleChangeTime}
          />
        </div>
        <div className="lt_inp4 inp_box">
          <label>No. de simulaciones</label>
          <input
            name="simulations"
            type="number"
            value={this.state.simulations}
            onChange={this.handleChangeSim}
          />
        </div>
        <div className="lt_inp5 inp_box">
          <label>Tipo</label>
          <div
            className={
              "lt_inp5_eu" +
              (this.state.option_type === "EU" ? " selected" : "")
            }
            onClick={() => this.handleChangeType("EU")}
          >
            EU
          </div>
          <div
            className={
              "lt_inp5_usa" +
              (this.state.option_type === "USA" ? " selected" : "")
            }
            onClick={() => this.handleChangeType("USA")}
          >
            USA
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Params;
