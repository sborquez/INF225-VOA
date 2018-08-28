import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

const { ipcRenderer, remote } = require("electron");
const dialog = remote.dialog;

class Params extends Component {
  constructor() {
    super();
    this.state = {
      r: 0.05,
      initial_price: 30,
      maturity_time: moment(),
      simulations: 1000
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeR = this.handleChangeR.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeSim = this.handleChangeSim.bind(this);
  }

  handleChangeR(e) {
    this.setState({ r: e.target.value });
    this.handleChange();
  }

  handleChangePrice(e) {
    this.setState({ initial_price: e.target.value });
    this.handleChange();
  }

  handleChangeTime(e) {
    this.setState({ maturity_time: e.target.value });
    this.handleChange();
  }

  handleChangeSim(e) {
    this.setState({ simulations: e.target.value });
    this.handleChange();
  }

  handleChange() {
    if (this.props.onNewParams) {
      this.props.onNewParams(
        this.state.r,
        this.state.initial_price,
        this.state.maturity_time,
        this.state.simulations
      );
    }
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
            selected={this.state.maturity_time}
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
      </React.Fragment>
    );
  }
}

export default Params;
